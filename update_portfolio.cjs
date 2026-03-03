const fs = require('fs');
const path = require('path');

const portfolioPath = path.join(__dirname, 'portfolio/index.html');
let content = fs.readFileSync(portfolioPath, 'utf8');

// Replace portfolio section content
const replacements = [
  [/Avenir/g, 'Haiti Mission'],
  [/Ambition, <em>realized<\/em>\./g, 'Hope, <em>restored</em>.'],
  [/Mixed-Use Infill Redevelopment \(Residential \+ Office \+ Retail\)/g, 'Medical and Building Mission'],
  [/196 rental apartments \+ 4-story parking podium<br\/>10,000 sf outdoor amenities \+ 6,500 sf indoor amenities<br\/>23-story residential tower \+ 40,000 sf renovated office \+ 1,200 sf retail/g, 'Medical Clinic Construction<br/>Community Health Education<br/>Youth Ministry and Vacation Bible School'],
  [/Build-to-Core, legacy diversification \+ wealth preservation/g, 'Long-term community partnership + faith-based outreach'],
  [/Conventional construction loan to low-leverage, non-recourse permanent debt/g, 'Funded by partner church donations and youth fundraising'],
  [/With the odds against us, we succeeded by refusing to accept “we can’t.” Our team came together around an ambitious high-rise vision centered on legacy and wealth preservation, with a partner willing to place his bet on us—just as others had previously trusted and bet on him./g, 'Working alongside local churches, our youth completed the construction of a new medical clinic. The team came together around a vision centered on faith and service, overcoming logistical challenges to deliver results that will bless the community for years.'],
  [/We leveraged what we knew and adapted quickly where we didn’t. Tandem’s first experience with Type-1 tower construction brought new subcontractor partners, but what wasn’t new: delivering under pressure. We succeeded through our perseverance, creativity, and an ability to find opportunities that others overlooked./g, 'We leveraged our preparation and adapted quickly to new environments. For many youth, this was their first cross-cultural mission, but they delivered with grace under pressure. We succeeded through perseverance, teamwork, and an ability to form deep connections with the locals.'],
  [/Avenir, at the time our most ambitious undertaking, pushed the boundaries of scale, financing, and coordination and showed what is possible when boldness is matched with strong execution./g, 'The Haiti Mission, a deeply impactful undertaking, pushed the boundaries of our youth\'s comfort zones and showed what is possible when faith is matched with active service.'],
  
  [/Avra west loop/gi, 'Guatemala Mission'],
  [/When the world paused, we <em>pushed<\/em>\./g, 'When the need arose, we <em>answered</em>.'],
  [/Mixed-Use Infill Redevelopment \(Residential \+ Retail\)/g, 'Clean Water Initiative'],
  [/198 rental apartments<br\/>Full suite of amenities across two floors<br\/>20-story tower \+ 1,500 sf retail/g, 'Installation of 50 water filtration systems<br/>Hygiene training for 200+ families<br/>Street evangelism and kids ministry'],
  [/Build-to-Core/g, 'Sustainable Infrastructure'],
  [/Conventional construction loan  \+ preferred equity/g, 'Mission donations + local community support'],
  [/​​In the middle of a once-in-a-century disruption brought on by the pandemic, we refused to stand still. We rallied multiple teams to deliver a very dense development across three tight urban lots. We negotiated air rights, stayed focused through volatility, and achieved lease-up success when “experts” were hard to find./g, 'In the remote villages of Guatemala, access to clean water is a daily struggle. We rallied our teams to deliver life-saving filtration systems across three steep mountain villages. We navigated difficult terrain, stayed focused through weather challenges, and achieved our goals by trusting in God\'s provision.'],

  [/Sage West Loop/gi, 'Chicago Local Mission'],
  [/Speed <em>Meets<\/em> Discipline\./g, 'Heart <em>Meets</em> Action.'],
  [/196 rental apartments \+ 3 story parking podium<br\/>Full suite of penthouse amenities<br\/>18-story tower \+ 1,800 sf retail/g, 'Urban Youth Mentorship<br/>Food Pantry Distribution<br/>Inner-city neighborhood cleanup'],
  [/Build-to-Core \+ long-term hold/g, 'Community Restoration + Discipleship'],
  [/Conventional construction to non-recourse, assumable, permanent debt/g, 'Local church giving and volunteer hours'],
  [/At Sage West Loop, we returned to familiar ground with trusted trades, pushing efficiency to its peak. We were the only group in Chicago to secure a HUD 221\(d\)<span class="text-span">\(4\)<\/span>, loan at the time—locking in rates just before their sharp rise—and fixed construction costs by mid-2022, ahead of a once-in-a-generation inflation surge./g, 'In our own backyard, we returned to neighborhoods we know well, pushing our outreach to new levels. We partnered with local shelters to provide hundreds of meals, organizing clothing drives right as winter began, ahead of a record-cold season.'],

  [/Mode Logan Square/gi, 'Honduras Mission'],
  [/<em>Shared<\/em> Vision\./gi, '<em>Shared</em> Faith.'],
  [/78 rental apartments \+ 55 space parking podium<br\/>2-building structure with central courtyard and 6,000 sf street-facing retail/g, 'Orphanage Repair & Expansion<br/>Construction of a new dining hall and play area'],
  [/Conventional construction to assumable long-term agency debt/g, 'Youth-led fundraising drives'],
  [/MODE Logan Square is a two-building, mixed-use development at 2501 W Armitage, built on the site of a former fine arts storage facility dating back to the early 1900s. Tandem began work in 2013, leading a collaborative rezoning effort alongside Alderman Proco Joe Moreno and Antunovich Associates. The final project includes 78 apartments, 6,500 square feet of retail, and 55 parking spaces — all organized around a landscaped interior courtyard that brings light, greenery, and community to the center of the block./g, 'The Honduras Mission focused on expanding an overcrowded orphanage that dates back decades. Our youth began work early in the summer, leading a collaborative construction effort alongside local church leaders. The final project includes an expanded dormitory, a renovated kitchen, and a safe outdoor play area — all centered on bringing hope, love, and a brighter future to the children.'],
  
  [/The Kamingo/g, 'Dominican Republic Mission'],
  [/252 rental apartments \+ 6-story pre-cast parking garage<br\/>Full amenity suite with 9,000 sf street-facing retail \+ 2,000 micro/g, 'School Construction Phase II<br/>Educational workshops and sports camps'],
  [/Build-to-Core, long-term hold with QOZ benefits/g, 'Education + Next-generation empowerment'],
  [/The Kamingo is our statement of intent in Florida. Located in the heart of Tampa Heights, it leverages Qualified Opportunity Zone incentives to create lasting community impact and durable returns. Expanding our HUD expertise into new markets, we’re confident our disciplined approach will unlock value where others hesitate./g, 'This mission is our statement of ongoing commitment. Located in the rural Dominican Republic, we focus on education to create lasting generational impact. Expanding our ministry beyond basic aid, we believe teaching the next generation will unlock potential where others see only poverty.']
];

for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
}

fs.writeFileSync(portfolioPath, content, 'utf8');

// Replace logos in all html files
function replaceLogos(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
        replaceLogos(fullPath);
      }
    } else if (fullPath.endsWith('.html')) {
      let html = fs.readFileSync(fullPath, 'utf8');
      
      html = html.replace(/(<img[^>]*src=")([^"]+)("[^>]*class="[^"]*(?:nav_logo|footer_logotype|footer_logomark)[^"]*"[^>]*>)/g, 
        (match, p1, p2, p3) => {
            // Determine relative path to logo-new.png based on current file depth
            const depth = fullPath.replace(__dirname, '').split('/').length - 2;
            let prefix = depth > 0 ? '../'.repeat(depth) : '';
            if (p2.startsWith('/assets/')) {
               return p1 + '/site-assets/logo-new.png' + p3;
            }
            return p1 + prefix + 'site-assets/logo-new.png' + p3;
        }
      );
      
      fs.writeFileSync(fullPath, html, 'utf8');
    }
  }
}

replaceLogos(__dirname);

console.log("Updates applied successfully.");
