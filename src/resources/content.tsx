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
  headline: <>Designing AI Systems That Turn Marketing Into a Scalable Growth Engine</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">LeadBot AI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/leadbot-ai",
  },
  subline: (
    <>
      I'm Erick — I design AI-powered workflows and marketing systems that reduce manual work, qualify leads automatically, and drive measurable growth.
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
        My foundation is in high-stakes customer support at Concentrix, where I managed security, fraud, and technical incidents for Mercado Pago users. That experience built something most marketers lack: a deep understanding of where systems break down and how users behave under pressure.
        <br /><br />
        That operational lens pushed me into digital marketing — not to run ads, but to redesign how businesses attract, qualify, and convert customers. I became obsessed with the question: what can be automated, and what's the cost of not automating it?
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
            Driving digital growth strategy for a metal fabrication company, combining paid media, SEO, and AI-powered content systems to increase lead volume and improve online visibility in a competitive B2B market.
          </>
        ),
        achievements: [
          <>
            Manage and optimize the company website, ensuring strong UX, performance, and SEO best practices.
          </>,
          <>
            Plan and execute SEM campaigns (Google Ads) focused on lead generation and ROI optimization.
          </>,
          <>
            Leverage AI tools to create high-converting content, automate workflows, and accelerate marketing execution.
          </>,
          <>
            Monitor and analyze performance using Google Analytics and other tracking platforms to drive continuous improvement.
          </>,
          <>
            Design and optimize customer journeys through A/B testing and conversion rate optimization (CRO).
          </>,
          <>
            Oversee multi-platform presence (social media, website, e-commerce) ensuring brand consistency and growth.
          </>,
          <>
            Implement SEO strategies to increase organic traffic and search visibility.
          </>,
          <>
            Conduct market research and identify growth opportunities supported by data and AI insights.
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
            Designed and deployed an AI-powered chatbot integrated with Bitrix24 CRM to automate lead qualification and initial customer interactions.
          </>,
          <>
            Translated business needs into automated workflows that reduced response times and improved lead routing efficiency.
          </>,
          <>
            Built digital assets and visual content using Canva, Affinity, and generative AI to support paid campaigns and organic growth initiatives.
          </>,
          <>
            Led product photography and visual optimization for delivery platforms, improving product presentation and click-through performance.
          </>,
          <>
            Acted as a bridge between marketing, sales, and customer experience to ensure automation aligned with real operational needs.
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
            AI Chatbot Design & Deployment • Lead Qualification Automation • CRM Workflow Design • Process Optimization & Automation Logic • API Integrations • Prompt Engineering & AI-Assisted Workflows
          </>
        ),
        images: [],
      },
      {
        title: "Marketing & Growth",
        description: (
          <>
            Digital Marketing Strategy • Lead Generation & Funnel Optimization • Content Strategy & Execution • Paid Traffic Support & Asset Creation • Customer Experience Optimization
          </>
        ),
        images: [],
      },
      {
        title: "Platforms & Tools",
        description: (
          <>
            <strong>CRMs:</strong> Bitrix24, Kommo<br />
            <strong>Web & Deployment:</strong> Vercel, WordPress<br />
            <strong>Design & Media:</strong> Canva, Affinity, DaVinci Resolve, CapCut<br />
            <strong>Voice & Audio:</strong> ElevenLabs<br />
            <strong>AI & Tech:</strong> Generative AI Tools, Python (automation-focused use cases)
          </>
        ),
        images: [],
      },
      {
        title: "AI Video & Creative Production",
        description: (
          <>
            I produce high-impact visual content using frontier AI generation
            models alongside traditional production tools — enabling
            studio-quality output at a fraction of the conventional time and cost.
            <br /><br />
            <strong>AI Video Generation:</strong> Higgsfield, Kling 3.0, Google Veo 3<br />
            <strong>AI Creative Tools:</strong> TikTok Symphony Creative Studio,
            Generative AI image tools<br />
            <strong>Production:</strong> DaVinci Resolve, CapCut, ElevenLabs<br />
            <strong>Use cases:</strong> Paid ad creatives, short-form video,
            AI-generated brand content, social media performance assets
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
  description: "A curated selection of visual assets created for digital advertising and social media performance.",
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
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
