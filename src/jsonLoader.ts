import { FormSection, ConnectedEmotionsSection } from "./FormBuilder";
import { toast } from "sonner";
import { logger, trackError } from "./lib/logger";

/**
 * Loads data from localStorage into the form.
 * @param storageKey The key in localStorage where the JSON is stored.
 * @param setFormTitle A function to set the form title state.
 * @param setSubject A function to set the subject state.
 * @param setDetails A function to set the details state.
 * @param setSessionType A function to set the session type state.
 * @param setSourceOfBelief A function to set the source of belief state.
 * @param setSections A function to set the form sections state.
 * @param setConnectedEmotionsSections A function to set the connected emotions sections state.
 * @param setInheritedFromValue A function to set the inherited from value state.
 */
export function loadJSON(
    storageKey: string,
    setFormTitle: (title: string) => void,
    setSubject: (subject: string) => void,
    setDetails: (details: string) => void,
    setSessionType: (sessionType: string) => void,
    setSourceOfBelief: (sourceOfBelief: string) => void,
    setSections: (sections: FormSection[]) => void,
    setConnectedEmotionsSections: (sections: ConnectedEmotionsSection[]) => void,
    setInheritedFromValue: (inheritedFromValue: string) => void // Add this parameter
) {
    logger.info("JL", `loadJSON called with storageKey: ${storageKey}`);

    try {
        const jsonString = localStorage.getItem(storageKey);
        if (!jsonString) {
            logger.warn("JL", `No data found in localStorage for key: ${storageKey}`);
            toast.error(`No saved form found with key: ${storageKey}`);
            console.error(`No data found in localStorage for key: ${storageKey}`);
            return;
        }

        logger.info("JL", "Found JSON string in localStorage, attempting to parse");
        const sessionData = JSON.parse(jsonString);

        if (sessionData) {
            logger.info("JL", `Successfully parsed session data for: ${sessionData.title}`);
            logger.info("JL", `Session data contains - sections: ${sessionData.sections?.length || 0}, connectedEmotionsSections: ${sessionData.connectedEmotionsSections?.length || 0}`);

            setFormTitle(sessionData.title);
            setSubject(sessionData.subject || "");
            setDetails(sessionData.details);
            setSessionType(sessionData.sessionType);
            setSourceOfBelief(sessionData.sourceOfBelief || "");
            setInheritedFromValue(sessionData.inheritedFromValue || ""); // Load the inheritedFromValue
            setSections(sessionData.sections || []);
            setConnectedEmotionsSections(sessionData.connectedEmotionsSections || []);

            logger.info("JL", "All form state setters called successfully");
            toast.success(`Form for "${sessionData.title}" loaded successfully!`);
        } else {
            logger.warn("JL", `Invalid JSON data found for key: ${storageKey}`);
            toast.error(`Invalid JSON data found for key: ${storageKey}`);
            console.error(`Invalid JSON data for key: ${storageKey}`);
        }
    } catch (error) {
        logger.error("JL", `Failed to load form from localStorage: ${error}`);
        console.error("Failed to load form from localStorage:", error);
        toast.error("Failed to load form from localStorage.");
    }
}if (typeof window !== "undefined") {
    (window as any).loadJSON = loadJSON;
  }