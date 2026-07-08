export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  relatedIds: string[];
}

export const faqData: FAQItem[] = [
  {
    id: "current",
    question: "What does Erick do currently?",
    answer:
      "Erick is a **Growth Marketing & AI Automation Specialist**. He builds full-stack marketing systems that unify brand identity, paid media, SEO automation, AI creative pipelines, and custom software. He recently built and launched the complete marketing infrastructure for **Quick Metal Shop**.",
    relatedIds: ["notable-project", "chatbot-exp", "contact"],
  },
  {
    id: "notable-project",
    question: "What is his most notable project?",
    answer:
      "Erick's most notable project is the **QMS ArquiExpo App** — a custom-built, vertically-oriented interactive touchscreen web application showcasing 285 architectural panel variants. He designed, developed, and deployed it on Netlify in **under 48 hours** for ArquiExpo 2026, resolving iOS Safari rendering quirks to ensure flawless vertical touchscreen performance.",
    relatedIds: ["ai-tools", "chatbot-exp", "contact"],
  },
  {
    id: "ai-tools",
    question: "What AI tools does he use?",
    answer:
      "Erick operates a high-velocity, AI-augmented creative and marketing stack:\n\n• **AI Video Production**: Higgsfield (Kling 3.0, Seedance 2.0), Google Veo 3\n• **AI Spokespersons**: Nano Banana Pro, TikTok Symphony\n• **SEO Automation**: Soro AI, Holo AI\n• **AI Orchestration & Logic**: Claude, Gemini 3.1 Pro, ChatGPT\n• **Operational Tools**: Zapier, Kommo CRM, Bitrix24",
    relatedIds: ["chatbot-exp", "notable-project", "contact"],
  },
  {
    id: "chatbot-exp",
    question: "Does he have experience building chatbots?",
    answer:
      "Yes! Erick has built commercial lead qualification and commercial chatbots:\n\n• **Cuatrimotos ATV Riders**: Designed and deployed a WhatsApp Business API chatbot powered by **Gemini 3.1 Pro** and integrated with Kommo CRM, handling 200+ inbound leads daily with initial touchpoint segmenting.\n• **Artesa Panadería**: Developed a custom commercial chatbot integrated with **Bitrix24 CRM**, handling **85% of inbound conversations autonomously**.",
    relatedIds: ["notable-project", "ai-tools", "contact"],
  },
  {
    id: "contact",
    question: "How can I get in touch?",
    answer:
      "You can reach out to Erick directly through these channels:\n\n• **Email**: santiagomahecha2328@gmail.com\n• **LinkedIn**: [linkedin.com/in/erick-mahecha](https://www.linkedin.com/in/erick-mahecha/)\n• **GitHub**: [github.com/Erickgooo](https://github.com/Erickgooo)\n• **Meeting**: Schedule a 30-minute call via [Erick's Calendly](https://calendly.com/santiagomahecha2328/30min)",
    relatedIds: ["current", "location", "chatbot-exp"],
  },
  {
    id: "location",
    question: "Where is he based?",
    answer: "Erick is based in **Medellín, Colombia** (America/Bogota timezone).",
    relatedIds: ["current", "contact"],
  },
];

export const initialGreeting = "Hi, I'm Erick Chatbot! Ask me anything about Erick's background.";
export const backButtonLabel = "Back to questions";
export const chatbotTitle = "Erick Chatbot";
