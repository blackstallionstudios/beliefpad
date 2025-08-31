// jsonGenerator.ts
import { ConnectedEmotionsSection } from "./FormBuilder";

export function generateJSON(
  clientName: string,
  subject: string,
  details: string,
  sessionType: string,
  sourceOfBelief: string,
  sections: { id: string; subheading: string; content: string }[],
  connectedEmotionsSections?: ConnectedEmotionsSection[],
  storageKey?: string // optional
) {
  const sessionData = {
    title: clientName,
    subject,
    details,
    sessionType,
    sourceOfBelief,
    sections,
    connectedEmotionsSections: connectedEmotionsSections || [],
    timestamp: new Date().toISOString(),
  };

  // Save to localStorage only if a storageKey is provided
  if (storageKey) {
    localStorage.setItem(storageKey, JSON.stringify(sessionData));
  }

  return sessionData; // always return JSON object
}