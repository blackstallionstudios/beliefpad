// jsonGenerator.ts
import { ConnectedEmotionsSection } from "./FormBuilder";
import { logger } from "./lib/logger";

export function generateJSON(
  clientName: string,
  subject: string,
  details: string,
  sessionType: string,
  sourceOfBelief: string,
  sections: { id: string; subheading: string; content: string }[],
  connectedEmotionsSections?: ConnectedEmotionsSection[],
  storageKey?: string, // optional
  inheritedFromValue?: string // Add this parameter
) {
  logger.info("JG", "generateJSON called");
  logger.info("JG", `Parameters - clientName: ${clientName}, subject: ${subject}, sections: ${sections.length}, connectedEmotionsSections: ${connectedEmotionsSections?.length || 0}`);

  const sessionData = {
    title: clientName,
    subject,
    details,
    sessionType,
    sourceOfBelief,
    inheritedFromValue: inheritedFromValue || "", // Store the inheritedFromValue
    sections,
    connectedEmotionsSections: connectedEmotionsSections || [],
    timestamp: new Date().toISOString(),
  };

  logger.info("JG", `Generated session data with timestamp: ${sessionData.timestamp}`);

  // Save to localStorage only if a storageKey is provided
  if (storageKey) {
    logger.info("JG", `Saving to localStorage with key: ${storageKey}`);
    localStorage.setItem(storageKey, JSON.stringify(sessionData));
    logger.info("JG", "Successfully saved to localStorage");
  } else {
    logger.info("JG", "No storageKey provided, skipping localStorage save");
  }

  return sessionData; // always return JSON object
}