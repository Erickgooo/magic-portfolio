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
  image: "/images/og/social-preview.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building AI-Powered Systems That Scale Marketing and Customer Experience</>,
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
        My professional background is rooted in customer support at Concentrix, where I handled high-risk cases related to security, fraud, and technical incidents for Mercado Pago users. Working directly with users in critical situations strengthened my ability to listen carefully, think clearly under pressure, and resolve problems with precision and empathy. This experience shaped a strong customer-first mindset and sharpened my ability to identify friction points within digital systems and processes.
        <br /><br />
        Over time, I recognized that many recurring issues were not caused by people, but by inefficient processes. This realization led me into digital marketing, where I discovered the value of automation, data, and scalable systems. I transitioned into marketing-focused roles centered on lead generation, content strategy, and CRM workflows, consistently asking how processes could be executed smarter, faster, and with less manual effort.
        <br /><br />
        More recently, I designed and implemented an AI-powered chatbot integrated with Bitrix24 to automate lead qualification and improve response times in a real commercial environment. Today, I continue to refine this skill set by building AI-driven workflows, experimenting with automation logic, and developing scalable systems that connect marketing, data, and customer experience. By combining marketing strategy with automation and emerging AI tools—including Python-based workflows—I focus on creating solutions that are not only well-designed, but operationally effective and measurable.
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
      {
        name: "Microsoft Excel Professional Certificate",
        institution: "Microsoft",
        link: "https://www.coursera.org/account/accomplishments/specialization/7ZDOGCXO2WBG",
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
  title: "Insights & Setup",
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
