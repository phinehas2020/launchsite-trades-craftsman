const fs = require('fs');
const path = require('path');

const indexReplacements = [
    [/Equipping youth for mission and service/g, 'The Gospel of a Whole Life for the Whole World'],
    [/Doing <span class="hero_heading-slant">right<\/span> by those who trust us isn’t a strategy — it’s the <span class="hero_heading-slant">only<\/span> way we know how to serve\./g, 'Seeking to live out the whole life of the Gospel through vibrant <span class="hero_heading-slant">worship</span>, service, and <span class="hero_heading-slant">global<\/span> outreach.'],
    [/BUILT TOGETHER/g, 'A SHARED LIFE'],
    [/At Heritage Youth Missions, we build lasting partnerships with churches, schools, and communities\. We equip young people for service through mission trips, discipleship programs, and hands-on ministry\./g, 'As the youth ministry of Heritage Ministries United, Heritage Youth Missions equips young people for service through vibrant praise, biblical teaching, and global outreach. Join us every Tuesday at 7:30 p.m. in the Fellowship Hall.'],
    [/<h4 class="grid_block-heading text-regular">The long game<\/h4>/g, '<h4 class="grid_block-heading text-regular">Vibrant Worship & Praise</h4>'],
    [/We invest in the long-term transformation of young people\. Patience and consistency are our edge\. By building relationships over years, we create lasting impact in lives and communities\./g, 'We exalt Jesus and share His Word as a community. Seeking to know God more and follow His will in our daily lives, praise and worship are at the core of our youth mission.'],
    [/<h4 class="grid_block-heading text-regular">Deliberate Growth<\/h4>/g, '<h4 class="grid_block-heading text-regular">A Rich History</h4>'],
    [/We lead one to two mission trips per year\. For us, success is about doing things right – bringing steadiness and clarity to every trip and partnership\./g, 'Founded in June 1973 in Manhattan\'s Lower East Side and later relocating to Waco, Texas, our agrarian roots shaped our commitment to a holistic, shared-life model.'],
    [/<h4 class="grid_block-heading text-regular">Off the Beaten Path<\/h4>/g, '<h4 class="grid_block-heading text-regular">Communal Living & Service</h4>'],
    [/We serve communities often overlooked – places where need is great and resources are few\. We go where the harvest is ready, building relationships that last\./g, 'We highly emphasize the \'Body of Christ\' where believers live out their faith together. Sharing \'all things in common\', our youth support one another in a holistic spiritual journey.'],
    [/<h4 class="grid_block-heading text-regular">Skin in the Game<\/h4>/g, '<h4 class="grid_block-heading text-regular">Global Outreach</h4>'],
    [/We believe the best partnerships are built on shared commitment\. That’s why we serve alongside our partners\. We’re all working toward the same goals\./g, 'Our ministry is viewed as a global effort where members discover and use their gifts. From Texas to South Africa and India, our youth carry the gospel to the whole world.'],
    [/<h4 class="grid_block-heading text-regular">Avoid the Herd<\/h4>/g, '<h4 class="grid_block-heading text-regular">Sustainable Growth</h4>'],
    [/When others turn away from hard places, we lean in\. When fear takes over, we step forward\. The greatest need is often where few are willing to go\./g, 'Our focus on crafts, farming, and community gatherings keeps us rooted. Sustainable practices and a commitment to providing for the most vulnerable give our youth purpose.'],
    [/HOW WE DIFFER/g, 'CORE BELIEFS'],
    [/These 3 principles show how we serve and why our partners stick with us — a clear perspective that guides every decision we make\./g, 'The theological foundations that guide how we serve, live, and reach the whole world.'],
    [/Faith with Vision/g, 'The Holy Trinity'],
    [/We think big by staying focused – nimble, intentional and creative\./g, 'We believe in God the Father, Jesus Christ the Son, and the Holy Spirit as our ultimate guide.'],
    [/Radical Transparency/g, 'The Inspired Word'],
    [/We share openly with our partners and supporters, ensuring alignment and trust from the very beginning\./g, 'The Scriptures are the authoritative Word of God, inspiring our actions and global mission.'],
    [/Long-Term Alignment/g, 'Salvation by Faith'],
    [/We serve alongside our partners and focus on relationships that stand the test of time\./g, 'Found through faith in the death and resurrection of Jesus Christ, salvation transforms our lives.'],
    [/What sets Heritage Youth Missions apart isn&#x27;t just our <a href="\/what-we-do">capabilities<\/a>\. It&#x27;s how we show up and how we treat the people we serve\. We bring a rare mix of humanity and clarity to every trip and partnership – always keeping our youth, partners and communities in view\.<br\/><br\/>Our roots taught us to keep our heads down, solve problems fast, and avoid the theater that often surrounds ministry\. We don’t posture — we serve\. Every handshake, every hard conversation, every smart risk we take is part of building something that lasts\./g, 'What sets Heritage Youth Missions apart is our unwavering connection to Heritage Ministries United. As the youth arm of our parent church, we bring a rare mix of humanity, vibrant praise, and biblical teaching to every mission trip and community partnership.<br/><br/>The journey from the inner city to an agrarian community taught us the value of shared life. We don’t just preach the Gospel; we live the \'whole life\' of the Gospel through communal support, service, and a commitment to empowering young believers.'],
    [/ALL-IN OWNERSHIP/g, 'GLOBAL PRESENCE'],
    [/We practice All-in Commitment\. That means we take full accountability for every trip and partnership we touch — no shortcuts, no excuses, just total commitment from start to finish\./g, 'We practice a global faith. That means we take the Gospel from our core locations in Texas, Idaho, and Wisconsin to nations around the world.'],
    [/At Heritage Youth Missions, commitment is a mindset\. We plan like organizers, lead like mentors, and act like long-term partners\. That means we anticipate needs, sweat the details early, and align teams quickly – all to protect relationships and avoid surprises\./g, 'At Heritage Youth Missions, taking the Gospel of a Whole Life to the Whole World is our mindset. We plan, lead, and act as extensions of the communities we build in Waco, Deary, and beyond.'],
    [/Because we coordinate trips, discipleship, and community partnerships under one roof, we’re able to move faster, communicate better, and stay focused on what matters most\. We don&#x27;t pass the buck — we stay in it\. From the first planning meeting to the final debrief \(and beyond\), All-In Commitment is what ensures our trips are smarter, smoother, and built to last\./g, 'Because we coordinate our efforts with Heritage Ministries United, we’re able to draw upon decades of spiritual guidance, agrarian values, and international connections. This shared strength ensures our youth missions are deeply rooted in faith.'],
    [/HOW WE GOT HERE/g, 'OUR JOURNEY']
];

const wwdReplacements = [
    [/Strategic &amp; Aligned Growth/g, 'Vibrant Community Worship'],
    [/We approach our projects with an owner’s mindset\. We invest our own capital and allocate resources with care\. By aligning our success with our partners’, we make decisions that create long term value for everyone involved\./g, 'We approach our missions with a community mindset. Rooted in our Tuesday Youth Meetings and Sunday services, our faith drives every action as we praise and worship.'],
    [/Finding Smart Opportunities/g, 'Discovering Global Needs'],
    [/We focus on communities that are often overlooked — places where youth need hope, discipleship, and hands-on service\. We go where the need is greatest, building relationships and sharing the gospel in practical, lasting ways\./g, 'With fellowships in North America and overseas, we focus on communities that need the \'whole life\' message. Our youth go where the need is greatest to build lasting relationships.'],
    [/Partnerships That Last/g, 'A Legacy of Trust'],
    [/Every project starts with collaboration\. We believe clear expectations, honest communication, and aligned goals set the stage for success\. That’s why so many of our partners choose to work with us again and again\./g, 'Since 1973, our parent church has built a legacy of collaboration. We believe sharing all things in common sets the stage for success and lasting ministry.'],
    [/Integrated Formation from Day One/g, 'Holistic Biblical Teaching'],
    [/From the first meeting to the final debrief, our team brings deep biblical insight and real-world experience\. With teaching, mentoring, and hands-on service working as one, we help youth grow in faith earlier—unlocking potential, reducing barriers, and building character at every step\./g, 'With teachings from resources like \'Portrait of a Community\', our team brings deep biblical insight. By mentoring and hands-on service, we help youth live out their faith entirely.'],
    [/Design Grounded in Reality/g, 'Service Rooted in Reality'],
    [/We don’t just design what looks good—we design what works by starting with the end in mind\. Close collaboration between architects, engineers, and builders ensures every idea is constructible, cost-conscious, and aligned with the project’s goals\. The result: better, more confident decision making that keeps the project on track\./g, 'We don’t just learn what looks good—we learn what works by starting with service in mind. Close collaboration between our elders, youth leaders, and congregation ensures every mission is spiritually and practically sound.'],
    [/Trust Built on Transparency/g, 'Faith Built on Truth'],
    [/No guesswork\. No hidden agendas\. We lead with clarity—from trip planning to follow-up—so our teams stay aligned, confident, and accountable\. Our commitment to honesty and radical transparency reduces uncertainty and builds trust that lasts long after the trip is complete\./g, 'We lead with biblical clarity. Our commitment to the authority of the Word and the truth of the Gospel reduces uncertainty and builds faith that lasts long after the youth meeting is over.'],
    [/The Fundamentals/g, 'The Shared Life'],
    [/We focus on what matters most: safe, well-run programs and responsive support you can trust trip after trip\. Our approach is simple but disciplined — proactive communication, clear expectations, reliable logistics, and respect for every partner and community we serve\./g, 'We focus on what matters most: communal living and selfless support. Our approach is rooted in the early church model—sharing all things, communicating clearly, and respecting every individual we encounter.'],
    [/A Human Approach to Partnership/g, 'A Brotherly Approach to Ministry'],
    [/We make host communities feel seen and heard in the everyday moments that matter\. That starts with learning names, listening closely, and treating even the smallest needs with care\. We follow up and follow through\./g, 'We make the communities we serve feel the love of Christ in everyday moments. That starts with our agrarian focus on the Homestead, teaching our youth how to serve with their hands.'],
    [/A Servant&#x27;s Mindset/g, 'A Christ-like Mindset'],
    [/We serve each partnership like it&#x27;s our own\. That means anticipating our partners&#x27; needs and putting creativity and effort ahead of excuses\. We sweat the small details at every level, from logistics to long-term relationship building\./g, 'We serve because Christ first served us. That means putting the needs of the hurting ahead of our own. We empower youth to discover their gifts and use them for the global church.']
];


// Read and rewrite index.html
let indexContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
for (const [regex, replacement] of indexReplacements) {
    indexContent = indexContent.replace(regex, replacement);
}
fs.writeFileSync(path.join(__dirname, 'index.html'), indexContent, 'utf8');


// Read and rewrite what-we-do/index.html
let wwdContent = fs.readFileSync(path.join(__dirname, 'what-we-do/index.html'), 'utf8');
for (const [regex, replacement] of wwdReplacements) {
    wwdContent = wwdContent.replace(regex, replacement);
}
fs.writeFileSync(path.join(__dirname, 'what-we-do/index.html'), wwdContent, 'utf8');

console.log("Applied Heritage Ministries United text updates.");
