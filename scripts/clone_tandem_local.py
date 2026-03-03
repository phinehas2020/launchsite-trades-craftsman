#!/usr/bin/env python3
"""Clone selected Tandem routes and localize frontend assets for self-hosted use."""

from __future__ import annotations

import hashlib
import html as html_lib
import os
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

SOURCE_HOST = "www.thetandemco.com"
BASE_URL = f"https://{SOURCE_HOST}"
ROUTES = ["", "what-we-do", "portfolio", "team", "contact"]
ASSET_HOSTS = {
    "cdn.prod.website-files.com",
    "d3e54v103j8qbb.cloudfront.net",
    "challenges.cloudflare.com",
}
ASSET_ROOT = Path("site-assets")
TIMEOUT_SECONDS = 30
USER_AGENT = "Mozilla/5.0 (compatible; TandemLocalClone/1.0)"

URL_PATTERN = re.compile(r"https?://[^\s\"'<>]+|//[^\s\"'<>]+")
CSS_URL_PATTERN = re.compile(r"url\(\s*(?P<q>['\"]?)(?P<u>[^)'\"]+)(?P=q)\s*\)")
SRI_ATTR_PATTERN = re.compile(r'\s(?:integrity|crossorigin)="[^"]*"')

url_to_local: dict[str, Path] = {}
local_to_url: dict[Path, str] = {}
downloaded_css: set[Path] = set()


def fetch_url(url: str) -> tuple[bytes, str]:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        return response.read(), response.headers.get_content_type()


def local_path_for_url(url: str) -> Path:
    parsed = urlparse(url)
    raw_path = parsed.path or "/index"
    if raw_path.endswith("/"):
        raw_path = f"{raw_path}index"

    rel = Path(raw_path.lstrip("/"))
    if not rel.name:
        rel = rel / "index"

    if parsed.query:
        query_hash = hashlib.sha1(parsed.query.encode("utf-8")).hexdigest()[:12]
        rel = rel.with_name(f"{rel.stem}__q_{query_hash}{rel.suffix}")

    return ASSET_ROOT / parsed.netloc / rel


def normalize_url(url: str) -> str:
    cleaned = html_lib.unescape(url.strip())
    if cleaned.startswith("//"):
        return f"https:{cleaned}"
    return cleaned


def is_known_route_path(path: str) -> bool:
    normalized = path.rstrip("/")
    if normalized == "":
        normalized = "/"
    return normalized in {"/", "/what-we-do", "/portfolio", "/team", "/contact"}


def is_allowed_asset_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        return False

    if parsed.netloc in ASSET_HOSTS:
        return True

    if parsed.netloc == SOURCE_HOST:
        if is_known_route_path(parsed.path):
            return False
        suffix = Path(parsed.path).suffix.lower()
        return bool(suffix and suffix not in {".html", ".htm"})

    return False


def download_asset(url: str) -> Path | None:
    normalized = normalize_url(url)
    if not is_allowed_asset_url(normalized):
        return None

    if normalized in url_to_local:
        return url_to_local[normalized]

    try:
        content, content_type = fetch_url(normalized)
    except Exception as exc:  # noqa: BLE001
        print(f"[warn] failed to download {normalized}: {exc}")
        return None

    local_path = local_path_for_url(normalized)
    local_path.parent.mkdir(parents=True, exist_ok=True)
    local_path.write_bytes(content)

    url_to_local[normalized] = local_path
    local_to_url[local_path] = normalized

    if local_path.suffix.lower() == ".css" or content_type == "text/css":
        downloaded_css.add(local_path)

    return local_path


def extract_urls(text: str) -> set[str]:
    urls: set[str] = set()
    for raw in URL_PATTERN.findall(html_lib.unescape(text)):
        raw_candidate = raw.rstrip(");")
        for piece in raw_candidate.split(","):
            candidate = normalize_url(piece.rstrip("),;"))
            if candidate.startswith("http://") or candidate.startswith("https://"):
                urls.add(candidate)
    return urls


def rewrite_internal_link(url: str) -> str | None:
    parsed = urlparse(url)
    if parsed.netloc != SOURCE_HOST:
        return None

    path = parsed.path or "/"
    if not is_known_route_path(path):
        return None

    if path in {"", "/"}:
        rewritten = "/"
    else:
        rewritten = f"{path.rstrip('/')}/"

    if parsed.query:
        rewritten = f"{rewritten}?{parsed.query}"
    if parsed.fragment:
        rewritten = f"{rewritten}#{parsed.fragment}"
    return rewritten


def relative_path(from_dir: Path, to_path: Path) -> str:
    return Path(os.path.relpath(to_path, start=from_dir)).as_posix()


def apply_replacements(content: str, replacements: dict[str, str]) -> str:
    result = content
    for old, new in sorted(replacements.items(), key=lambda pair: len(pair[0]), reverse=True):
        result = result.replace(old, new)
    return result


def sanitize_html(content: str) -> str:
    """Strip SRI attributes that break locally mirrored assets."""
    return SRI_ATTR_PATTERN.sub("", content)


def process_css_file(css_path: Path) -> None:
    source_url = local_to_url.get(css_path)
    if source_url is None:
        return

    css_text = css_path.read_text(encoding="utf-8", errors="ignore")

    def replace_url(match: re.Match[str]) -> str:
        quote = match.group("q") or ""
        raw_value = (match.group("u") or "").strip()

        if raw_value.startswith(("data:", "blob:", "#")):
            return match.group(0)

        normalized = normalize_url(raw_value)
        resolved = urljoin(source_url, normalized)

        if not is_allowed_asset_url(resolved):
            return match.group(0)

        local_asset = download_asset(resolved)
        if local_asset is None:
            return match.group(0)

        rel = relative_path(css_path.parent, local_asset)
        return f"url({quote}{rel}{quote})"

    rewritten = CSS_URL_PATTERN.sub(replace_url, css_text)
    css_path.write_text(rewritten, encoding="utf-8")


def process_css_assets() -> None:
    processed: set[Path] = set()
    while True:
        pending = [path for path in downloaded_css if path not in processed]
        if not pending:
            break
        for css_file in pending:
            process_css_file(css_file)
            processed.add(css_file)


def route_output_path(route: str) -> Path:
    if route == "":
        return Path("index.html")
    return Path(route) / "index.html"


def clone_route(route: str) -> Path:
    path = "/" if route == "" else f"/{route}"
    url = f"{BASE_URL}{path}"
    content, _content_type = fetch_url(url)
    html_text = content.decode("utf-8", errors="ignore")

    output_path = route_output_path(route)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    replacements: dict[str, str] = {}
    urls = extract_urls(html_text)
    for candidate in urls:
        if is_allowed_asset_url(candidate):
            local_file = download_asset(candidate)
            if local_file is None:
                continue
            replacements[candidate] = relative_path(output_path.parent, local_file)
            continue

        internal = rewrite_internal_link(candidate)
        if internal is not None:
            replacements[candidate] = internal

    localized = apply_replacements(html_text, replacements)
    localized = sanitize_html(localized)
    output_path.write_text(localized, encoding="utf-8")
    return output_path


def main() -> None:
    written_pages: list[Path] = []
    for route in ROUTES:
        page_path = clone_route(route)
        written_pages.append(page_path)
        print(f"[ok] wrote {page_path}")

    process_css_assets()
    print(f"[ok] localized {len(written_pages)} pages")
    print(f"[ok] downloaded {len(url_to_local)} assets into {ASSET_ROOT}/")


if __name__ == "__main__":
    main()
