import { FormSection } from "./FormBuilder";
import { toast } from "sonner";

/**
 * Loads data from localStorage into the form.
 * @param storageKey The key in localStorage where the JSON is stored.
 * @param setFormTitle A function to set the form title state.
 * @param setSubject A function to set the subject state.
 * @param setDetails A function to set the details state.
 * @param setSessionType A function to set the session type state.
 * @param setSourceOfBelief A function to set the source of belief state.
 * @param setSections A function to set the form sections state.
 */
export function loadJSON(
    storageKey: string,
    setFormTitle: (title: string) => void,
    setSubject: (subject: string) => void,
    setDetails: (details: string) => void,
    setSessionType: (sessionType: string) => void,
    setSourceOfBelief: (sourceOfBelief: string) => void,
    setSections: (sections: FormSection[]) => void
) {
    try {
        const jsonString = localStorage.getItem(storageKey);
        if (!jsonString) {
            toast.error(`No saved form found with key: ${storageKey}`);
            console.error(`No data found in localStorage for key: ${storageKey}`);
            return;
        }

        const sessionData = JSON.parse(jsonString);

        if (sessionData) {
            setFormTitle(sessionData.title);
            setSubject(sessionData.subject || "");
            setDetails(sessionData.details);
            setSessionType(sessionData.sessionType);
            setSourceOfBelief(sessionData.sourceOfBelief || "");
            setSections(sessionData.sections);
            toast.success(`Form for "${sessionData.title}" loaded successfully!`);
        } else {
            toast.error(`Invalid JSON data found for key: ${storageKey}`);
            console.error(`Invalid JSON data for key: ${storageKey}`);
        }
    } catch (error) {
        console.error("Failed to load form from localStorage:", error);
        toast.error("Failed to load form from localStorage.");
    }
}