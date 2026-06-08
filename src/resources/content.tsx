import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Logo, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Erick Santiago",
  lastName: "Mahecha Tafur",
  name: `Erick Mahecha`,
  role: "Growth Marketing & AI Automation Specialist",
  avatar: "/images/avatar.jpg",
  email: "santiagomahecha2328@gmail.com",
  location: "America/Bogota", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["Spanish", "English"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/Erickgooo",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/erick-mahecha/",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/social-preview.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>I Build Marketing Infrastructure From Zero.</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">QMS ArquiExpo App</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/quick-metal-shop-arquiexpo",
  },
  subline: (
    <>
      I'm Erick — a growth marketer who architects full-stack marketing systems: brand identity, paid media, SEO automation, AI creative pipelines, and even the software when nothing exists yet. One person. Full-department output.
    </>
  ),
};

const about: About = {
path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://calendly.com/santiagomahecha2328/30min",
  },
intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        My foundation is in high-stakes customer support at Concentrix, where I managed security, fraud, and technical incidents for Mercado Pago users. That experience built something most marketers lack: a deep understanding of where systems break down and how users actually behave under pressure.
        <br /><br />
        That operational lens pushed me into digital marketing — not just to run campaigns, but to redesign how businesses attract, qualify, and convert customers. I became obsessed with one question: what can be automated, and what's the cost of not automating it?
        <br /><br />
        The answer became LeadBot AI — an AI-powered WhatsApp chatbot I designed and deployed for Artesa, automating 85% of customer conversations, qualifying B2B leads without human intervention, and operating 24/7 without additional headcount.
        <br /><br />
        Today I work at the intersection of marketing strategy, CRM systems, and AI tooling. I build workflows that don't just save time — they create compounding advantages: faster response times, cleaner data, and conversion systems that scale without scaling the team.
      </>
    ),
  },
work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Quick Metal Shop",
        timeframe: "Jan 2026 - Present",
        role: "Growth Marketing Specialist",
        description: (
          <>
            Joined as the company's first and sole marketing hire, with no brand identity, no analytics infrastructure, and no digital strategy in place. Built everything from scratch — and kept it running.
          </>
        ),
        achievements: [
          <>
            Created the company's Brand Manual in the first week, defining the full visual identity (color palette, typography, tone of voice) that became the operational standard across the entire organization — including the ArquiExpo 2026 trade show stand, recognized as one of the strongest presences at the event.
          </>,
          <>
            Deployed and configured Soro AI for automated SEO blog publishing across both the B2B site (Odoo CMS) and the B2C Shopify store, including custom code integration into each CMS — establishing a compounding organic search engine requiring zero ongoing manual effort.
          </>,
          <>
            Set up Google Analytics and Google Search Console from scratch, then linked Search Console directly to Soro AI to enable keyword-informed automated publishing.
          </>,
          <>
            Launched and managed the company's LinkedIn presence; deployed Holo AI to automate brand-aligned thought leadership content at scale.
          </>,
          <>
            Managed Instagram and Facebook content daily across B2B and B2C narratives.
          </>,
          <>
            Deployed the Meta Pixel across both storefronts and independently built, configured, and launched Meta Ads campaigns — from creative concept to audience targeting to budget management — across separate B2B and B2C campaign structures.
          </>,
          <>
            Built a Zapier-to-Odoo CRM automation to route B2B leads from Meta Instant Forms directly into the CRM in real time, eliminating manual data entry and closing a critical gap in the lead pipeline.
          </>,
          <>
            Operated a high-velocity AI-augmented creative production workflow using Higgsfield (Kling 3.0, Seedance 2.0), ElevenLabs, Claude, CapCut, and DaVinci Resolve.
          </>,
          <>
            Designed, developed, and deployed a custom full-stack interactive gallery web application in under 48 hours for ArquiExpo 2026 — built with Next.js, deployed on Netlify, optimized for a vertical touchscreen interface, and fully responsive across all devices including iOS Safari.
          </>,
        ],
        images: [],
      },
      {
        company: "Dakoma Roofing",
        timeframe: "May 2026",
        role: "Growth Marketing Consultant (Freelance)",
        description: (
          <>
            Subcontracted to modernize the digital presence and marketing infrastructure of a roofing and construction services company whose brand identity and content operation had not kept pace with the quality of service they delivered.
            <br />
            <strong>Stack:</strong> Soro AI · Higgsfield (Kling 3.0 · Nano Banana Pro) · Meta Business Suite
          </>
        ),
        achievements: [
          <>
            Executed a full rebranding initiative — delivering a Brand Manual that redefined the color palette, typography system, and logo usage guidelines, then operationalized it across the company's website, social media profiles, and advertising assets.
          </>,
          <>
            Integrated Soro AI to establish an autonomous SEO blog pipeline, enabling consistent keyword-targeted content publishing with zero ongoing manual effort.
          </>,
          <>
            Developed a suite of high-production video ad creatives using Higgsfield's Kling 3.0 for cinematic footage and Nano Banana Pro for AI avatar-driven spokesperson content — achieving output quality that matched the elevated brand standard at a one-person cost and timeline.
          </>,
        ],
        images: [],
      },
      {
        company: "Cuatrimotos ATV Riders",
        timeframe: "Feb 2026",
        role: "CRM & Automation Consultant (Freelance)",
        description: (
          <>
            Designed and deployed an end-to-end lead qualification system for a Bogotá-based ATV retailer managing 200+ inbound WhatsApp leads per day with no CRM infrastructure in place.
            <br />
            <strong>Stack:</strong> WhatsApp Business API · Kommo CRM · Meta Business Suite · Gemini 3.1 Pro
          </>
        ),
        achievements: [
          <>
            Built on Kommo CRM, the solution included a structured chatbot architecture with intent-based routing at first touchpoint — segmenting every incoming conversation into three paths (catalog browsing, FAQ, or high-intent purchase) before any human involvement.
          </>,
          <>
            Configured automated re-engagement and pipeline closure logic to eliminate ghost leads and keep the funnel clean.
          </>,
          <>
            Designed the full sales pipeline inside Kommo, mapping each stage to the team's actual commercial process identified during discovery sessions.
          </>,
          <>
            Post-handoff, the commercial team operates the system independently — no technical dependency. Every lead that enters via WhatsApp is automatically created, classified, and placed at the correct pipeline stage.
          </>,
          <>
            Sales advisors start their day with a prioritized queue of high-intent contacts, not 200 unsorted messages.
          </>,
        ],
        images: [],
      },
      {
        company: "Artesa Panadería",
        timeframe: "Jan 2025 - Dec 2025",
        role: "Marketing & Customer Experience Analyst",
        description: (
          <>
            Led the full design and implementation of an AI automation stack for Artesa's commercial operation — reducing manual workload, accelerating lead response times, and establishing a scalable customer service system without adding headcount.
          </>
        ),
        achievements: [
          <>
            Designed and deployed an AI-powered WhatsApp chatbot integrated with Bitrix24 CRM to automate lead qualification and initial customer interactions, handling 85% of conversations without human intervention.
          </>,
          <>
            Translated business requirements into automated workflows that reduced response times and improved lead routing efficiency.
          </>,
          <>
            Built digital assets and visual content using Canva, Affinity, and generative AI to support paid campaigns and organic growth initiatives.
          </>,
          <>
            Led product photography and visual optimization for delivery platforms, improving product presentation and click-through performance.
          </>,
          <>
            Acted as the bridge between marketing, sales, and customer experience to ensure automation aligned with real operational needs.
          </>,
        ],
        images: [],
      },
      {
        company: "Aseneg",
        timeframe: "July 2024 - Jan 2025",
        role: "Commercial and Marketing Intern",
        description: (
          <>
            In this role, I supported both commercial outreach and brand positioning efforts, focusing on generating demand and strengthening digital presence.
          </>
        ),
        achievements: [
          <>
            Executed outbound marketing initiatives by researching prospects, identifying opportunities, and supporting direct outreach strategies.
          </>,
          <>
            Created value-driven content for social media, increasing visibility and engagement across digital channels.
          </>,
          <>
            Managed content calendars, coordinated posting schedules, and maintained website updates to ensure brand consistency.
          </>,
          <>
            Supported early-stage funnel optimization by aligning messaging with commercial objectives.
          </>,
        ],
        images: [],
      },
      {
        company: "Concentrix",
        timeframe: "July 2022 - Oct 2024",
        role: "Customer Service Representative",
        description: (
          <>
            This role built the foundation of my customer-centric approach and problem-solving mindset.
          </>
        ),
        achievements: [
          <>
            Handled complex and sensitive cases involving security, fraud, and account transfers in a high-volume support environment.
          </>,
          <>
            Diagnosed technical issues and application bugs, escalating incidents to internal teams to ensure timely resolution.
          </>,
          <>
            Documented recurring product issues to support platform improvements and better user experiences.
          </>,
          <>
            Awarded Top Performer (2023) — ranked among the highest in service quality, case resolution accuracy, and customer satisfaction scores across the support team.
          </>,
     ],
        images: [],
      },
    ], 
  },  
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "Universidad Piloto de Colombia",
        description: <>Bachelor's Degree in Marketing.</>,
      },
      {
        name: "SENA",
        description: <>Technical Degree in Administrative Assistance.</>,
      },
    ],
  },
certifications: {
    display: true,
    title: "Certifications",
    items: [
      {
        name: "Generative AI for Digital Marketing Specialization",
        institution: "IBM",
        link: "https://www.coursera.org/account/accomplishments/specialization/F0ZEO3C8BQU7",
      },
      {
        name: "Google AI Essentials",
        institution: "Google",
        link: "https://www.coursera.org/account/accomplishments/specialization/QHHIU6T3KOR1",
      },
      {
        name: "AI For Marketing",
        institution: "Emory University",
        link: "https://www.coursera.org/account/accomplishments/specialization/PVAPT7SC6B4G",
      },
      {
        name: "Fundamentals of Digital Marketing and E-Commerce",
        institution: "Google",
        link: "https://www.coursera.org/account/accomplishments/verify/1NVKCLGDQ9LI",
      },
      {
        name: "IBM Data Science Professional Certificate (In Progress)",
        institution: "IBM",
        link: "https://www.coursera.org/professional-certificates/ibm-data-science",
      },
      {
        name: "Microsoft Excel Professional Certificate",
        institution: "Microsoft",
        link: "https://www.coursera.org/account/accomplishments/specialization/7ZDOGCXO2WBG",
      },
      {
        name: "Google Data-Driven Decision Making",
        institution: "Google",
        link: "https://www.coursera.org/account/accomplishments/specialization/KVIF2SS3WP5M",
      },
      {
        name: "Claude Code in Action",
        institution: "Anthropic",
        link: "https://www.coursera.org/account/accomplishments/verify/97FY4JDEMEMQ",
      },
      {
        name: "Real-World AI for Everyone",
        institution: "Anthropic",
        link: "https://www.coursera.org/account/accomplishments/specialization/4GQ8PGQ9ZT2K",
      },
      {
        name: "Vibe Coding for Developers",
        institution: "Edureka",
        link: "https://www.coursera.org/account/accomplishments/specialization/ONNNZYW84VR5",
      },
    ],
  },
technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Automation, AI & Systems",
        description: (
          <>
            AI Chatbot Design & Deployment · Lead Qualification Automation · CRM Workflow Design (Bitrix24, Kommo) · Process Optimization & Automation Logic · API Integrations · Zapier Automation · Prompt Engineering & AI-Assisted Workflows
          </>
        ),
        images: [],
      },
      {
        title: "Marketing & Growth",
        description: (
          <>
            Digital Marketing Strategy · Lead Generation & Funnel Optimization · Content Strategy & Execution · Meta Ads (B2B & B2C) · SEO Strategy & Implementation · Customer Experience Optimization · Brand Identity & Manual Development
          </>
        ),
        images: [],
      },
      {
        title: "Platforms & Tools",
        description: (
          <>
            <strong>Web & Deployment:</strong> Vercel, WordPress, Netlify, Odoo (CMS), Shopify<br />
            <strong>Analytics:</strong> Google Analytics, Google Search Console<br />
            <strong>Design & Media:</strong> Canva, Affinity, DaVinci Resolve, CapCut<br />
            <strong>Voice & Audio:</strong> ElevenLabs<br />
            <strong>AI & SEO Automation:</strong> Soro AI, Holo AI<br />
            <strong>AI & Tech:</strong> Generative AI Tools, Python (automation-focused)
          </>
        ),
        images: [],
      },
      {
        title: "AI Video & Creative Production",
        description: (
          <>
            I produce high-impact visual content using frontier AI generation models alongside traditional production tools — enabling studio-quality output at a fraction of the conventional time and cost.
            <br /><br />
            <strong>AI Video Generation:</strong> Higgsfield, Kling 3.0, Seedance 2.0, Google Veo 3<br />
            <strong>AI Creative Tools:</strong> TikTok Symphony Creative Studio, Nano Banana Pro, Generative AI image tools<br />
            <strong>Production:</strong> DaVinci Resolve, CapCut, ElevenLabs<br />
            <strong>Use cases:</strong> Paid ad creatives, short-form video, AI-generated brand content, social media performance assets
          </>
        ),
        images: [],
      },
      {
        title: "Development",
        description: (
          <>
            Next.js · CSS · JavaScript · Responsive UI Development · Cross-browser Debugging (iOS Safari)
          </>
        ),
        images: [],
      },
    ],
  },
 }; 

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Insights & Setup",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Projects",
  title: `Projects – ${person.name}`,
  description: `AI systems, automation workflows, and marketing infrastructure built by Erick Mahecha`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Visual Work",
  title: `Visual Work – ${person.name}`,
  description: "Cinematic video production used to require a crew, a budget, and days of shooting. These assets were built by one person, usually in hours. This section collects paid ad creatives, short-form video, and AI-generated content produced for real campaigns.",
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/dakoma1.png",
      alt: "Dakoma Roofing Rebranding 1",
      orientation: "square",
    },
    {
      src: "/images/gallery/dakoma2.png",
      alt: "Dakoma Roofing Rebranding 2",
      orientation: "square",
    },
    {
      src: "/images/gallery/dakoma3.png",
      alt: "Dakoma Roofing Rebranding 3",
      orientation: "square",
    },
    {
      src: "/images/gallery/dakoma4.png",
      alt: "Dakoma Roofing Rebranding 4",
      orientation: "square",
    },
    {
      src: "/images/gallery/dakoma5.png",
      alt: "Dakoma Roofing Rebranding 5",
      orientation: "square",
    },
    {
      src: "https://www.youtube.com/watch?v=qXv6XMOy1N4",
      alt: "PR Collection",
      orientation: "vertical",
    },
    {
      src: "https://www.youtube.com/watch?v=KSerIhwaknE",
      alt: "Custom Metal Signs",
      orientation: "vertical",
    },
    {
      src: "https://www.youtube.com/watch?v=c_oQBTyLB0M",
      alt: "Pieza Taino",
      orientation: "vertical",
    },
    {
      src: "https://www.youtube.com/watch?v=J1EtEBNQ2mE",
      alt: "Piezas Decorativas",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "https://www.youtube.com/watch?v=5hcoQ5J9occ",
      alt: "Artesa - Recorrido Tiendas",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "Artesa - Recorrido Tiendas",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "https://www.youtube.com/watch?v=c8CcTBk6sV4",
      alt: "Aseneg - Short Diciembre",
      orientation: "vertical",
    },
    {
      src: "https://www.youtube.com/watch?v=0EvVcg9uSk8",
      alt: "Aseneg - Burnout",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "Foto vertical 3",
      orientation: "vertical",
    },

    {
      src: "/images/gallery/vertical-5.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-6.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
