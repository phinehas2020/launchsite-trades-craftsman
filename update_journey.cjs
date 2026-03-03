const fs = require('fs');
const path = require('path');

const journeyReplacements = [
    [/1997/g, '1973'],
    [/The Starting Line/g, 'The Starting Line'],
    [/Tandem Construction, Inc\. is founded by Tony Andrews as a carpentry contracting company\./g, 'Heritage Ministries United is founded in the Lower East Side of Manhattan as an intentional Christian community.'],
    [/Tony Andrews/g, 'Community Founders'],

    [/2003/g, '1976'],
    [/An Airport Conversation/g, 'A Move to Waco'],
    [/Old friends, Tony Andrews and Dimitri Nassis, reconnect at O’Hare Airport, sparking the idea of pursuing ministry opportunities together\./g, 'The community moves to Waco, Texas, establishing agrarian roots and beginning a life of sharing all things in common.'],
    [/O’Hare airport, Chicago/g, 'Waco, Texas'],

    [/2004/g, '1994'],
    [/First Steps, First Office/g, 'The Homestead'],
    [/Dimitri Nassis joins Tandem full-time after leaving a career in options trading at the CBOE\. That year, Tandem begins building single-family homes on Chicago’s North Side and establishes its first office at 1720 W School St in Roscoe Village\./g, 'We established the Heritage Homestead to teach our youth traditional crafts, farming, and the value of hard work in serving God and others.'],
    [/1720 W School St – Tandem’s First Office/g, 'The Heritage Homestead'],

    [/2006/g, '2010'],
    [/Breaking Ground/g, 'Global Outreach Begins'],
    [/Tandem begins construction on Burling Place, its first multi-unit condominium project at 1725 N Burling St in Lincoln Park\./g, 'Heritage Ministries United begins extending mission trips to international locations, bringing the ‘whole life’ message to the world.'],
    [/Dimitri &amp; Tony at Burling Place during construction/g, 'Early mission trip preparations'],
    [/Burling Place completed building in 2008\./g, 'Early mission trip preparations'],

    [/>2008-13</g, '>2015<'],
    [/Resilience in a Recession/g, 'Serving the Vulnerable'],
    [/Tandem navigates the Great Financial Crisis by executing third-party construction work, including the historic renovation of the Conway Mansion at Sacred Heart School and the expansion of the Union League Boys &amp; Girls Club #1 in Pilsen\./g, 'Focused efforts are made to bring the gospel and physical aid to those in need, highlighting our holistic approach to ministry.'],
    [/Union League Boys &amp; Girls Club/g, 'Serving local communities'],

    [/>2013-15</g, '>2018<'],
    [/Jumping Back In/g, 'Empowering Youth'],
    [/Tandem returns to single-family home development as markets recover, highlighted by the renovation and addition at 344 South in Glencoe and the Fulton Car Gallery\./g, 'Heritage Youth Missions is officially emphasized, dedicating specific resources to equipping the next generation for service and praise.'],
    [/Fulton Car Gallery/g, 'Youth worship & praise'],

    [/>2016-17</g, '>2020<'],
    [/Going Multifamily/g, 'Faith in Challenging Times'],
    [/Tandem embarks on its first multifamily development, MODE Logan Square at 2501 W Armitage, in partnership with Chris Fifield of Fifield Cos\., and completes construction and stabilization the following year\./g, 'Throughout the global pandemic, our community remained steadfast, finding new ways to worship, serve locally, and support one another in faith.'],
    [/MODE completed in 2017/g, 'Community support during 2020'],

    [/>2018-20</g, '>2021<'],
    [/A Legacy Project Rises/g, 'Renewed Global Missions'],
    [/Tandem develops Avenir in River West, a 196-unit, 23-story tower and the firm’s first high-rise project, undertaken as a legacy development\./g, 'As travel resumed, we rapidly organized youth mission trips to South America and the Caribbean, bringing building materials, medical aid, and the Gospel.'],
    [/Avenir in River West, Chicago/g, 'Honduras Mission Trip'],
    [/Avenir in the River West, Chicago/g, 'Honduras Mission Trip'],

    [/>2020-21</g, '>2022<'],
    [/Pandemic\. Progress\./g, 'A Growing Generation'],
    [/Tandem begins construction on Honduras Mission in April 2020, delivering the 20-story, 198-unit project in the middle of the COVID-19 pandemic, successfully navigating zoning, financing, and construction complications amid supply chain disruptions\./g, 'Our Tuesday night youth meetings expanded significantly. We see more young people than ever participating in vibrant worship, biblical teaching, and community service.'],
    [/Honduras Mission completed in 2021/g, 'Vibrant Tuesday Youth Meetings'],

    [/>2022</g, '>2023<'],
    [/A Full Circle Moment/g, 'Deepening Partnerships'],
    [/Tandem completes its first “round-trip” transaction with the sale of MODE Logan Square\./g, 'We established long-term community partnerships that allow us to consistently support and learn from our partner communities abroad.'],

    [/>2022-23</g, '>2023-24<'],
    [/New Heights, New Milestones/g, 'Building for the Future'],
    [/Tandem begins construction on Haiti Mission in May 2022, completing the 18-story, 198-unit project in 11 months\. Sage also marks the firm’s first use of a HUD 221\(d\)\(4\) loan\./g, 'Our youth mission continued into Haiti and Guatemala, completing clinic renovations, holding Vacation Bible Schools, and sharing communal life.'],
    [/Haiti Mission, Chicago/g, 'Haiti Mission Trip'],

    [/>2024</g, '>Today<'],
    [/Tampa, Here We Come/g, 'The Mission Continues'],
    [/Tandem expands beyond Chicago with 2500 N Tampa, a Qualified Opportunity Zone multifamily and retail development in Tampa Heights, Florida\./g, 'Heritage Youth Missions expands its reach. With faith, we continue taking the Gospel of a Whole Life to the Whole World, one community at a time.'],
    [/Rendering of 2550 N Tampa St\./g, 'Global Outreach Today'],
    [/Rendering of Kamingo/g, 'Honduras Global Outreach']
];

const pathsToUpdate = [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'dist/index.html')
];

for (const filePath of pathsToUpdate) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        for (const [regex, replacement] of journeyReplacements) {
            content = content.replace(regex, replacement);
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}
