import { toast } from "sonner";
import JSZip from "jszip"; // Import the JSZip library

/**
 * Checks the available localStorage space before saving.
 * Triggers a toast warning if storage is nearly full.
 * @returns {boolean} Returns true if there is enough space, false otherwise.
 */
export const checkStorageCapacity = () => {
    try {
        const testKey = "__test_key__";
        localStorage.setItem(testKey, "test");
        localStorage.removeItem(testKey);

        const totalUsedBytes = JSON.stringify(localStorage).length;
        const totalCapacityBytes = 5 * 1024 * 1024; // Common limit is 5MB
        const usedPercentage = (totalUsedBytes / totalCapacityBytes) * 100;

        if (usedPercentage > 80) {
            toast.warning(`Warning: Your local storage is ${usedPercentage.toFixed(2)}% full. Please export or clear some forms.`);
            console.warn(`Local storage is ${usedPercentage.toFixed(2)}% full. Consider exporting or clearing some forms.`);
            // Optionally, you can also return false here to indicate low capacity
            // but currently we just log the warning and return true.
            // This allows the save operation to proceed if desired.
            // If you want to prevent saving when storage is nearly full, uncomment the next line:
            // return false;
        } else {
            console.log(`Local storage is ${usedPercentage.toFixed(2)}% full. You have enough space to save.`);
            // If you want to allow saving when storage is not full,
            // you can return true here, which is the default behavior.
            return true;
        }
        return true;
    } catch (e) {
        // If an error occurs, localStorage is likely full or unavailable.
        toast.error("Failed to save form: Local storage is full or not available. Please export or clear some forms.");
        console.error("Local storage capacity check failed:", e);
        return false;
    }
};

/**
 * Exports all saved forms as a single ZIP file containing separate JSON files.
 * Forms are identified by the 'session-form-' prefix.
 */
export const exportAllJSON = async () => {
    console.log("Starting export of all saved forms to a zip file...");
    const zip = new JSZip(); // Create a new JSZip instance
    let formsAdded = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("session-form-")) {
            const jsonString = localStorage.getItem(key);
            if (jsonString) {
                try {
                    // Extract a meaningful filename from the key
                    const filename = `${key.replace("session-form-", "")}.json`;
                    zip.file(filename, jsonString); // Add each form as a separate file to the zip
                    formsAdded++;
                } catch (e) {
                    console.error(`Failed to process JSON for key: ${key}`, e);
                }
            }
        }
    }

    if (formsAdded === 0) {
        toast.error("No forms to export.");
        return;
    }

    try {
        // Generate the zip file content
        const zipContent = await zip.generateAsync({ type: "blob" });

        // Create a download link for the zip file
        const downloadUrl = URL.createObjectURL(zipContent);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", downloadUrl);
        downloadAnchorNode.setAttribute("download", "all_saved_forms.zip");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        // Clean up the object URL
        URL.revokeObjectURL(downloadUrl);

        toast.success(`${formsAdded} forms exported successfully as a zip file!`);
        console.log(`${formsAdded} forms exported successfully.`);
    } catch (e) {
        toast.error("Failed to create or download the zip file.");
        console.error("Error creating zip file:", e);
    }
};

/**
 * Clears all saved forms from localStorage that match the 'session-form-' prefix.
 * @param onClear A callback function to run after clearing the forms.
 */
export const clearSavedForms = (onClear: () => void) => {
    console.log("Clearing all saved forms...");
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("session-form-")) {
            keysToRemove.push(key);
        }
    }

    if (keysToRemove.length === 0) {
        toast.info("No forms to clear.");
        return;
    }

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });

    toast.success(`${keysToRemove.length} forms cleared successfully!`);
    console.log(`${keysToRemove.length} forms cleared.`);
    onClear();
};