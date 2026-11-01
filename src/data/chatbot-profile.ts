import profile from "./professional-profile.json";

// Only public professional content enters the assistant context. Contact details stay out.
const publicProfile = profile.locales.en;
export const chatbotProfile = `
Name: ${profile.identity.displayName}.
Location: ${profile.identity.location}.
Role: ${publicProfile.professional_role}.
Summary: ${publicProfile.cv_summary}
Experience: ${JSON.stringify(publicProfile.experiences)}
Technical skills: ${JSON.stringify(publicProfile.technical_skills)}
Projects: ${JSON.stringify(publicProfile.projects)}
Education: ${JSON.stringify(publicProfile.studies)}
Languages: ${JSON.stringify(publicProfile.spoken_languages)}
Interest: ${publicProfile.availability_text}
Only describe the individual's stated contributions. Do not infer ownership of a product or AI engine.
The native Momentum app is planned, not released. Do not invent delivery dates or results.
Do not disclose client names or internal industrial workflows. Refer enquiries to the contact form.
Do not provide personal email addresses or phone numbers. Do not infer nationality, work permits or relocation commitments.
`.trim();

export const defaultQuestions = {
  es: [
    {
      label: "Experiencia",
      prompt: "Resume la experiencia profesional de Marti.",
    },
    { label: "Formacion", prompt: "Resume la formacion de Marti." },
    {
      label: "Disponibilidad",
      prompt: "Esta Marti disponible para colaborar o trabajar?",
    },
  ],
  en: [
    { label: "Experience", prompt: "Summarize Marti professional experience." },
    { label: "Education", prompt: "Summarize Marti education." },
    {
      label: "Availability",
      prompt: "Is Marti available for collaboration or work?",
    },
  ],
} as const;
