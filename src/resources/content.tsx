import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Logo, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Erick Santiago",
  lastName: "Mahecha Tafur",
  name: `Erick Mahecha`,
  role: "Digital Marketing & Automation Specialist",
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
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Driving Growth Through Intelligent Automation</>,
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
      I'm Erick, a Digital Marketing Specialist passionate about
      using AI-driven automation to create seamless customer
      <br /> experiences and accelerate growth.
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
        {/* Sección 1 */}
        <strong>The Foundation — Customer-Centered Thinking</strong>
        <br />
        My professional foundation was built in customer support at Concentrix, where I handled high-risk cases involving security, fraud, and technical incidents for Mercado Pago users.
        <br /><br />
        Working directly with frustrated users taught me how to listen deeply, think critically under pressure, and resolve problems with precision and empathy.
        <br /><br />
        This experience shaped my customer-first mindset and sharpened my ability to identify friction points in digital experiences.
        <br /><br />

        {/* Sección 2 */}
        <strong>The Pivot — From Support to Strategy</strong>
        <br />
        Over time, I realized that many recurring issues weren’t people problems — they were process problems.
        <br /><br />
        That insight led me into marketing, where I discovered the power of automation, data, and scalable systems.
        <br /><br />
        I transitioned into digital marketing roles, focusing on lead generation, content strategy, and CRM workflows, always with one question in mind: How can this be done smarter, faster, and with less manual effort?
        <br /><br />

        {/* Sección 3 */}
        <strong>The Acceleration — Automation, AI & Real Business Impact</strong>
        <br />
        Most recently, I led the design and implementation of an AI-powered chatbot integrated with Bitrix24, built to automate lead qualification and improve response times in a real commercial environment.
        <br /><br />
        Today, I focus on refining and expanding this skill set — building AI-driven workflows, experimenting with automation logic, and developing scalable growth systems that connect marketing, data, and customer experience.
        <br /><br />
        By combining marketing strategy, automation logic, and emerging AI tools — including Python-based workflows — I focus on building systems that don’t just look good, but actually perform.
      </>
    ),
  },
work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Artesa Panadería",
        timeframe: "Jan 2025 - Dec 2025",
        role: "Marketing & Customer Experience Analyst",
        description: (
          <>
            At Artesa, I worked at the intersection of marketing, automation, and customer experience, helping the business scale lead management without increasing operational overhead.
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
            Recognized as a Top Performer (2023) for service quality, accuracy, and customer satisfaction.
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
            <strong>AI & Tech:</strong> Generative AI Tools, Python (automation-focused use cases)
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
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Projects",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
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
