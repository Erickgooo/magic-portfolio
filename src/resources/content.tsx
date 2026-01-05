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
    href: "/work/building-once-ui-a-customizable-design-system",
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
        Currently, I work as a Marketing & Customer Experience Analyst at Artesa, where I design and implement AI-driven solutions to solve operational bottlenecks.
        <br /><br />
        I’ve built and deployed an AI-powered chatbot integrated with Bitrix24, enabling 24/7 lead qualification, faster response times, and improved conversion flow.
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
        role: "Marketing and Customer Experience Analyst",
        achievements: [
          <>
            Automated Lead Prospecting by designing and implementing a chatbot,
            significantly improving process efficiency for the team.
          </>,
          <>
            Spearheaded the integration of AI tools into design workflows, enabling designers to
            iterate 50% faster.
          </>,
        ],
        images: [],
      },
      {
        company: "Aseneg",
        timeframe: "July 2024 - Jan 2025",
        role: "Commercial and Marketing Intern",
        achievements: [
          <>
            Grew digital community engagement by creating and managing high-value content for social media platforms.
          </>,
          <>
            Conducted market analysis to inform the development of commercial and marketing strategies.
          </>,
          <>
            Generated business opportunities through direct contact and telemarketing campaigns.
          </>
        ],
        images: [],
      },
      {
        company: "Concentrix",
        timeframe: "July 2022 - Oct 2024",
        role: "Customer Service Representative",
        achievements: [
          <>
            Top Performer Recognition (2023) for excellence in service quality and
            customer experience.
          </>,
          <>
            Led a cross-functional team to launch a new product line, contributing to a 15% increase
            in overall company revenue.
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
    title: "Technical skills",
    skills: [
      {
        title: "Automation & AI",
        description: (
          <>Building automated workflows using Make, Zapier, and AI Agents.</>
        ),
        tags: [
          {
            name: "Figma",
            icon: "figma",
          },
        ], 
        images: [],
      },
      {
        title: "CRM & Analytics",
        description: (
          <>Expert management of customer data and tracking via HubSpot and GA4.</>
        ),
        tags: [
          {
            name: "Next.js",
            icon: "nextjs",
          },
        ],
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
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
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
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
