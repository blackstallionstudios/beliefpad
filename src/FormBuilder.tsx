import { useState, useRef, useEffect } from "react";
import { SavedForms } from "./SavedForms";
import { generatePDF } from "./pdfGenerator";
import { toast } from "sonner";
import { generateJSON } from "./jsonGenerator";
import { loadJSON } from "./jsonLoader";
import { defaultTemplate, getFullSubheading } from "./template";
import { exportAllJSON, clearSavedForms } from "./jsonUtils";
import { EmailModal } from "./EmailModal";
import { generateEmailContent } from "./emailGenerator";
import { useUnsavedChanges } from "./App";
import { logger, trackUserAction, trackError } from "./lib/logger";

const template = defaultTemplate;

export interface FormSection {
 id: string;
 subheading: string;
 content: string;
}

export interface ConnectedEmotionsSection {
 id: string;
 selectedHeading: string;
 content: string;
}

export function FormBuilder() {
  logger.info("FB", "FormBuilder component initializing");
  
  const [clientName, setClientName] = useState("");
  const [details, setDetails] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [subject, setSubject] = useState("");
  const [sourceOfBelief, setSourceOfBelief] = useState("");
  const [sections, setSections] = useState<FormSection[]>([]);
  const [selectedSubheading, setSelectedSubheading] = useState("");
  const [showSavedForms, setShowSavedForms] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isClearingForm, setIsClearingForm] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentStorageKey, setCurrentStorageKey] = useState<string | null>(null);
  
  // Connected Emotions state
  const [connectedEmotionsSections, setConnectedEmotionsSections] = useState<ConnectedEmotionsSection[]>([]);
  const [selectedConnectedEmotionsHeading, setSelectedConnectedEmotionsHeading] = useState("");
  const [activeConnectedEmotionsSection, setActiveConnectedEmotionsSection] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());
  const connectedEmotionsTextareaRefs = useRef<Map<string, HTMLTextAreaElement>>(new Map());

  const { setHasUnsavedChanges } = useUnsavedChanges();

  useEffect(() => {
    logger.info("FB", "FormBuilder component mounted");
    logger.info("FB", `Initial state - sections: ${sections.length}, connectedEmotionsSections: ${connectedEmotionsSections.length}`);
  }, []);

  // Track changes to mark form as having unsaved changes
  useEffect(() => {
    logger.info("FB", "Form data changed, marking as unsaved");
    setHasUnsavedChanges(true);
  }, [clientName, details, sessionType, subject, sourceOfBelief, sections, connectedEmotionsSections, setHasUnsavedChanges]);
 
 // Helper function to get default content for a section
const getDefaultContent = (subheading: string): string => {
  if (subheading === "Defragmentation of the Subconcious Gap") {
    return "Closing the unwanted space in the subconscious mind";
  }
  return "";
};

const resizeTextarea = (sectionId: string) => {
  const textarea = textareaRefs.current.get(sectionId);
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
};

const resizeConnectedEmotionsTextarea = (subsectionId: string) => {
  const textarea = connectedEmotionsTextareaRefs.current.get(subsectionId);
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
};

 // addSection function
const addSection = () => {
  logger.info("FB", `addSection called with selectedSubheading: ${selectedSubheading}`);
  
  if (!selectedSubheading) {
    logger.warn("FB", "addSection failed - no subheading selected");
    toast.error("please select a subheading");
    return;
  }

  const newSection: FormSection = {
    id: Date.now().toString(),
    subheading: selectedSubheading,
    content: getDefaultContent(selectedSubheading), // Use default content
  };

  logger.info("FB", `Adding new section: ${newSection.subheading} with id: ${newSection.id}`);
  trackUserAction("section_added", "FB", { sectionType: selectedSubheading, sectionId: newSection.id });
  setSections([...sections, newSection]);
  setSelectedSubheading("");
};

// Connected Emotions functions
const addConnectedEmotionsSection = () => {
  logger.info("FB", `addConnectedEmotionsSection called with selectedHeading: ${selectedConnectedEmotionsHeading}`);
  
  if (!selectedConnectedEmotionsHeading) {
    logger.warn("FB", "addConnectedEmotionsSection failed - no heading selected");
    toast.error("please select a heading");
    return;
  }

  const newConnectedEmotionsSection: ConnectedEmotionsSection = {
    id: Date.now().toString(),
    selectedHeading: selectedConnectedEmotionsHeading,
    content: "",
  };

  logger.info("FB", `Adding new connected emotions section: ${newConnectedEmotionsSection.selectedHeading} with id: ${newConnectedEmotionsSection.id}`);
  trackUserAction("connected_emotions_section_added", "FB", { 
    headingType: selectedConnectedEmotionsHeading, 
    sectionId: newConnectedEmotionsSection.id 
  });
  setConnectedEmotionsSections([...connectedEmotionsSections, newConnectedEmotionsSection]);
  setSelectedConnectedEmotionsHeading("");
};

const updateConnectedEmotionsContent = (connectedEmotionsSectionId: string, content: string) => {
  setConnectedEmotionsSections(connectedEmotionsSections.map(section =>
    section.id === connectedEmotionsSectionId
      ? { ...section, content }
      : section
  ));
};

const handlePasteToConnectedEmotionsSection = async (connectedEmotionsSectionId: string) => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      updateConnectedEmotionsContent(connectedEmotionsSectionId, text);
      setTimeout(() => resizeConnectedEmotionsTextarea(connectedEmotionsSectionId), 0);
    }
  } catch (err) {
    console.error('Failed to read clipboard:', err);
    toast.error('failed to paste from clipboard');
  }
};

const duplicateConnectedEmotionsSection = (connectedEmotionsSectionId: string) => {
  const sectionToDuplicate = connectedEmotionsSections.find(section => section.id === connectedEmotionsSectionId);
  if (!sectionToDuplicate) return;

  const duplicatedSection: ConnectedEmotionsSection = {
    ...sectionToDuplicate,
    id: Date.now().toString(),
    content: "",
  };

  const index = connectedEmotionsSections.findIndex(section => section.id === connectedEmotionsSectionId);
  const newSections = [
    ...connectedEmotionsSections.slice(0, index + 1),
    duplicatedSection,
    ...connectedEmotionsSections.slice(index + 1),
  ];
  setConnectedEmotionsSections(newSections);
};

const removeConnectedEmotionsSection = (id: string) => {
  setConnectedEmotionsSections(connectedEmotionsSections.filter(section => section.id !== id));
};

// Auto-resize textarea handler for connected emotions
const handleConnectedEmotionsTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>, connectedEmotionsSectionId: string) => {
  const textarea = e.target;
  const content = textarea.value;
  
  updateConnectedEmotionsContent(connectedEmotionsSectionId, content);
  
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

 // addSectionWithHeading function
const addSectionWithHeading = (heading: string) => {
  const newSection: FormSection = {
    id: Date.now().toString(),
    subheading: heading,
    content: getDefaultContent(heading), // Use default content
  };
  setSections((prev) => [...prev, newSection]);
};

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!e.ctrlKey) return;

    const isOption = e.altKey;
    const isShift = e.shiftKey;
    const isCommand = e.metaKey;

    const keyMap: Record<string, string[]> = {
      n: ["NP", "NP 2", "NP 3"],
      l: ["LB", "LB 2", "LB 3"],
      b: ["FCB", "FCB 2", "FCB 3"],
      i: ["FCI", "FCI 2", "FCI 3"],
    };

    const key = e.key.toLowerCase();
    if (keyMap[key]) {
      let heading = keyMap[key][0];
     
      if (isShift && !isOption && !isCommand) heading = keyMap[key][1];
      if (isShift && isOption && !isCommand) heading = keyMap[key][2];
      if (isShift && isCommand && !isOption) heading = keyMap[key][2];

      addSectionWithHeading(heading);
      e.preventDefault();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);

 const updateSectionContent = (id: string, content: string) => {
   setSections(sections.map(section =>
     section.id === id ? { ...section, content } : section
   ));
 };

 const handlePasteToSection = async (sectionId: string) => {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      updateSectionContent(sectionId, text);
      // Use setTimeout to ensure the DOM updates with new content first
      setTimeout(() => resizeTextarea(sectionId), 0);
    }
  } catch (err) {
    console.error('Failed to read clipboard:', err);
    toast.error('failed to paste from clipboard');
  }
};

 const removeSection = (id: string) => {
   setSections(sections.filter(section => section.id !== id));
 };

 const exportToPDF = async () => {
   if (!clientName.trim()) {
     toast.error("please enter a client name");
     return;
   }

   if (sections.length === 0 && connectedEmotionsSections.length === 0) {
     toast.error("please add at least one section");
     return;
   }

   const sectionsWithContent = sections.filter(section => section.content.trim());
   const connectedEmotionsWithContent = connectedEmotionsSections.filter(section => 
     section.content.trim()
   );
   
   if (sectionsWithContent.length === 0 && connectedEmotionsWithContent.length === 0) {
     toast.error("please add content to at least one section");
     return;
   }

   try {
     await generatePDF(clientName, subject, details, sessionType, sourceOfBelief, sectionsWithContent, connectedEmotionsWithContent);
     toast.success("pdf exported successfully");
     // Mark as saved after successful export
     setHasUnsavedChanges(false);
   } catch (error) {
     console.error('PDF export error:', error);
     toast.error("failed to export pdf");
   }
 };

 const handleLoadForm = (storageKey: string) => {
   loadJSON(
     storageKey,
     setClientName,
     setSubject,
     setDetails,
     setSessionType,
     setSourceOfBelief,
     setSections,
     setConnectedEmotionsSections
   );
   setCurrentStorageKey(storageKey);
   setShowSavedForms(false);
   setHasUnsavedChanges(false);
 };

 const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
   const file = event.target.files?.[0];
   if (!file) return;

   const reader = new FileReader();
   reader.onload = (e) => {
     try {
       const jsonString = e.target?.result as string;
       const sessionData = JSON.parse(jsonString);

       if (sessionData && sessionData.title && (sessionData.sections || sessionData.connectedEmotionsSections)) {
         setClientName(sessionData.title);
         setSubject(sessionData.subject || "");
         setDetails(sessionData.details || "");
         setSessionType(sessionData.sessionType || "");
         setSourceOfBelief(sessionData.sourceOfBelief || "");
         setSections(sessionData.sections || []);
         setConnectedEmotionsSections(sessionData.connectedEmotionsSections || []);
         setCurrentStorageKey(null); // Clear current storage key for imported forms
         toast.success("form imported successfully");
         // Mark as saved since we just imported a form
         setHasUnsavedChanges(false);
       } else {
         toast.error("invalid json format");
       }
     } catch (error) {
       toast.error("failed to parse json file");
       console.error("Error parsing imported JSON:", error);
     }
   };
   reader.readAsText(file);
   if (fileInputRef.current) {
     fileInputRef.current.value = "";
   }
 };

 const handleClearAll = () => {
   clearSavedForms(() => {
     setSections([]);
     setConnectedEmotionsSections([]);
     setClientName("");
     setSubject("");
     setDetails("");
     setSessionType("");
     setSourceOfBelief("");
     setCurrentStorageKey(null);
     setIsClearing(false);
     setHasUnsavedChanges(false);
   });
 };

 const handleClearForm = () => {
   setClientName("");
   setSubject("");
   setDetails("");
   setSessionType("");
   setSourceOfBelief("");
   setSections([]);
   setConnectedEmotionsSections([]);
   setCurrentStorageKey(null);
   setIsClearingForm(false);
   toast.info("form cleared");
   setHasUnsavedChanges(false);
 };

 // Auto-resize textarea handler
 const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>, sectionId: string) => {
   const textarea = e.target;
   const content = textarea.value;
   
   // Update content
   updateSectionContent(sectionId, content);
   
   // Auto-resize
   textarea.style.height = 'auto';
   textarea.style.height = `${textarea.scrollHeight}px`;
 };

 // Helper function to generate storage key
 const generateStorageKey = () => {
   const timestamp = new Date().toISOString();
   const safeClientName = clientName.trim().replace(/\s+/g, '-');
   return `session-form-${safeClientName}-${timestamp}`;
 };

 const handleSave = () => {
   if (!clientName.trim()) {
     toast.error("please enter a client name to save");
     return;
   }

   let storageKey = currentStorageKey;
   let isUpdate = false;

   // If we have a current storage key, check if it exists in localStorage
   if (currentStorageKey && localStorage.getItem(currentStorageKey)) {
     // Update existing form
     storageKey = currentStorageKey;
     isUpdate = true;
   } else {
     // Create new form
     storageKey = generateStorageKey();
     setCurrentStorageKey(storageKey);
   }

   generateJSON(clientName, subject, details, sessionType, sourceOfBelief, sections, connectedEmotionsSections, storageKey);
   
   if (isUpdate) {
     toast.success("form updated");
   } else {
     toast.success("form saved");
   }
   
   setHasUnsavedChanges(false);
 };

 if (!template) {
   return (
     <div style={{
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center',
       padding: '2rem'
     }}>
       <div style={{
         width: '20px',
         height: '20px',
         border: '2px solid var(--color-border)',
         borderTop: '2px solid var(--color-accent)',
         borderRadius: '50%',
         animation: 'spin 1s linear infinite'
       }}></div>
     </div>
   );
 }

 function duplicateSection(id: string): void {
  const sectionToDuplicate = sections.find(section => section.id === id);
  if (!sectionToDuplicate) return;

  const duplicatedSection: FormSection = {
    ...sectionToDuplicate,
    id: Date.now().toString(),
    content: getDefaultContent(sectionToDuplicate.subheading), // Use default content instead of empty
  };

  const index = sections.findIndex(section => section.id === id);
  const newSections = [
    ...sections.slice(0, index + 1),
    duplicatedSection,
    ...sections.slice(index + 1),
  ];
  setSections(newSections);
}

 

 return (
   <>
     <div className="stack">
       {/* Client Name */}
       <div className="card">
         <div className="field">
           <label className="field-label">belief code session for</label>
           <input
             type="text"
             value={clientName}
             onChange={(e) => setClientName(e.target.value)}
             placeholder="enter client name..."
             className="input"
           />
         </div>
       </div>

       {/* Source of Belief, Subject, Details and Session Type */}
       <div className="card">
         <div className="stack-md">
           

           <div className="field">
             <label className="field-label">subject of belief</label>
             <input
               type="text"
               value={subject}
               onChange={(e) => setSubject(e.target.value)}
               placeholder="enter the subject of the belief targeted by the session..."
               className="input"
             />
           </div>

           <div className="field">
             <label className="field-label">details</label>
             <textarea
               value={details}
               onChange={(e) => setDetails(e.target.value)}
               placeholder="add notes..."
               className="textarea"
               rows={3}
             />
           </div>
           
           <div className="field">
             <label className="field-label">source of belief</label>
             <select
               value={sourceOfBelief}
               onChange={(e) => setSourceOfBelief(e.target.value)}
               className="select"
             >
               <option value="">select source of belief...</option>
               <option value="suggested">suggested</option>
               <option value="inherited from mother">inherited from mother</option>
               <option value="inherited from father">inherited from father</option>
               <option value="from self">from self</option>
             </select>
           </div>

           <div className="field">
             <label className="field-label">session type</label>
             <select
               value={sessionType}
               onChange={(e) => setSessionType(e.target.value)}
               className="select"
             >
               <option value="">select session type...</option>
               <option value="Simple">simple</option>
               <option value="Parallel: 2 beliefs in 1">parallel: 2in1</option>
               <option value="Parallel: 3 beliefs in 1">parallel: 3in1</option>
               <option value="Tangled">tangled</option>
               <option value="Split">split</option>
               <option value="Partial">partial</option>
             </select>
           </div>
         </div>
       </div>

       {/* Add Section */}
       <div className="card sticky-header" style={{ top: '0' }}>
         <div className="field">
           <label className="field-label">add new section</label>
           <div className="inline">
             <select
               value={selectedSubheading}
               onChange={(e) => setSelectedSubheading(e.target.value)}
               className="select"
               style={{ flex: 1 }}
             >
               <option value="">select a subheading...</option>
               {template.subheadings.map((heading) => (
                 <option key={heading} value={heading}>
                   {getFullSubheading(heading)}
                 </option>
               ))}
             </select>
             <button onClick={addSection} className="btn btn-primary">
               add
             </button>
           </div>
         </div>
       </div>

       {/* Form Sections */}
       <div className="list">
         {sections.map((section) => (
           <div key={section.id} className="section-horizontal">
             <div className="section-title">
               {getFullSubheading(section.subheading)}
             </div>
             <div className="section-input">
               <textarea
                 ref={(el) => {
                   if (el) {
                     textareaRefs.current.set(section.id, el);
                   } else {
                     textareaRefs.current.delete(section.id);
                   }
                 }}
                 value={section.content}
                 onChange={(e) => handleTextareaInput(e, section.id)}
                 placeholder={`enter statement for ${getFullSubheading(section.subheading)}...`}
                 className="input"
                 style={{ 
                   width: '100%', 
                   minHeight: '2.25rem',
                   maxHeight: '200px',
                   resize: 'none',
                   overflow: 'hidden'
                 }}
                 rows={1}
                 onFocus={() => setActiveSection(section.id)}
                 onBlur={() => setActiveSection(null)}
               />
             </div>
             <div className="section-actions-horizontal">
               <button
                 onClick={() => handlePasteToSection(section.id)}
                 className="btn btn-sm btn-success"
                 type="button"
                 title="paste from clipboard"
               >
                 ✓
               </button>
               <button
                 onClick={() => duplicateSection(section.id)}
                 className="btn btn-sm"
                 type="button"
                 title="duplicate section"
               >
                 ⧉
               </button>
               <button
                 onClick={() => removeSection(section.id)}
                 className="btn btn-sm btn-destructive"
                 title="remove section"
               >
                 ×
               </button>
             </div>
           </div>
         ))}
       </div>

       {/* Connected Emotions Section */}
       <div className="connected-emotions-container">
         <div className="connected-emotions-header">
           Connected Emotions
         </div>
         
         <div className="card sticky-header" style={{ top: '0' }}>
           <div className="field">
             <label className="field-label">add connected emotions section</label>
             <div className="inline">
               <select
                 value={selectedConnectedEmotionsHeading}
                 onChange={(e) => setSelectedConnectedEmotionsHeading(e.target.value)}
                 className="select"
                 style={{ flex: 1 }}
               >
                 <option value="">select a heading...</option>
                 {template.connectedEmotionsSubheadings.map((heading: string) => (
                   <option key={heading} value={heading}>
                     {getFullSubheading(heading)}
                   </option>
                 ))}
               </select>
               <button onClick={addConnectedEmotionsSection} className="btn btn-primary">
                 add section
               </button>
             </div>
           </div>
         </div>

         {/* Connected Emotions Sections */}
         <div className="list">
           {connectedEmotionsSections.map((section) => (
             <div key={section.id} className="connected-emotions-content">
               <div className="section-horizontal">
                 <div className="section-title">
                   {getFullSubheading(section.selectedHeading)}
                 </div>
                 <div className="section-input">
                   <textarea
                     ref={(el) => {
                       if (el) {
                         connectedEmotionsTextareaRefs.current.set(section.id, el);
                       } else {
                         connectedEmotionsTextareaRefs.current.delete(section.id);
                       }
                     }}
                     value={section.content}
                     onChange={(e) => handleConnectedEmotionsTextareaInput(e, section.id)}
                     placeholder={`enter statement for ${getFullSubheading(section.selectedHeading)}...`}
                     className="input"
                     style={{ 
                       width: '100%', 
                       minHeight: '2.25rem',
                       maxHeight: '200px',
                       resize: 'none',
                       overflow: 'hidden'
                     }}
                     rows={1}
                     onFocus={() => setActiveConnectedEmotionsSection(section.id)}
                     onBlur={() => setActiveConnectedEmotionsSection(null)}
                   />
                 </div>
                 <div className="section-actions-horizontal">
                   <button
                     onClick={() => handlePasteToConnectedEmotionsSection(section.id)}
                     className="btn btn-sm btn-success"
                     type="button"
                     title="paste from clipboard"
                   >
                     ✓
                   </button>
                   <button
                     onClick={() => duplicateConnectedEmotionsSection(section.id)}
                     className="btn btn-sm"
                     type="button"
                     title="duplicate section"
                   >
                     ⧉
                   </button>
                   <button
                     onClick={() => removeConnectedEmotionsSection(section.id)}
                     className="btn btn-sm btn-destructive"
                     title="remove section"
                   >
                     ×
                   </button>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
       
       {/* Actions */}
       {(sections.length > 0 || connectedEmotionsSections.length > 0) && (
         <div className="inline-end">
           <button 
             onClick={() => {
               const sessionData = {
                 clientName,
                 subject,
                 details,
                 sessionType,
                 sourceOfBelief,
                 sections,
                 connectedEmotionsSections
               };
               
               // Encode session data as base64 and pass it as URL parameter
               const jsonString = JSON.stringify(sessionData);
               const base64Data = btoa(jsonString);
               const viewUrl = `${window.location.origin}/session-view.html?data=${base64Data}`;
               
               // Open in new tab
               window.open(viewUrl, '_blank');
             }}
             className="btn"
             style={{ 
               backgroundColor: '#6366f1', 
               color: 'white',
               border: '1px solid #6366f1'
             }}
             title="Open session in read-only view"
           >
            view session
           </button>
           
           <button onClick={exportToPDF} className="btn btn-primary">
             export to pdf
           </button>
          
           <button
             onClick={handleSave}
             className="btn btn-success"
           >
             {currentStorageKey && localStorage.getItem(currentStorageKey) ? 'update' : 'save'}
           </button>

           <button
             onClick={() => {
               if (!clientName.trim()) {
                 toast.error("please enter a client name to save");
                 return;
               }

               const timestamp = new Date().toISOString();
               const safeClientName = clientName.trim().replace(/\s+/g, '-');
               const fileName = `session-form-${safeClientName}-${timestamp}.json`;

               const jsonData = generateJSON(clientName, subject, details, sessionType, sourceOfBelief, sections, connectedEmotionsSections);

               const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
               const url = URL.createObjectURL(blob);
               const link = document.createElement("a");
               link.href = url;
               link.download = fileName;
               link.click();
               URL.revokeObjectURL(url);

               toast.success("json saved locally");
               setHasUnsavedChanges(false);
             }}
             className="btn"
           >
             save locally
           </button>

           <button
             onClick={() => {
              const { subject: emailSubject, body: emailBody } = generateEmailContent(
                clientName,
                subject,
                details,
                sessionType,
                sourceOfBelief,
                sections,
                connectedEmotionsSections
              );
            
              const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
              window.location.href = mailtoLink;
              setHasUnsavedChanges(false);
            }}
             className="btn"
           >
             open as email
           </button>
         </div>
       )}

       {/* Form Management */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div>
           {isClearingForm && (
             <div className="confirmation">
               <span className="confirmation-text">clear the current form?</span>
               <div className="confirmation-actions">
                 <button onClick={handleClearForm} className="btn btn-sm btn-destructive">
                   yes
                 </button>
                 <button onClick={() => setIsClearingForm(false)} className="btn btn-sm">
                   no
                 </button>
               </div>
             </div>
           )}
         </div>
         <div className="inline">
           <button
             type="button"
             className="btn"
             onClick={() => setIsClearingForm(true)}
           >
             clear form
           </button>
           <button
             type="button"
             className="btn"
             onClick={() => setShowSavedForms(true)}
           >
             view saved forms
           </button>
           <input
             type="file"
             ref={fileInputRef}
             onChange={handleImportJSON}
             accept=".json"
             style={{ display: "none" }}
           />
           <button
             type="button"
             className="btn"
             onClick={() => fileInputRef.current?.click()}
           >
             import from file
           </button>
         </div>
       </div>
     </div>

     {showSavedForms && (
       <SavedForms
         onLoad={handleLoadForm}
         onClose={() => setShowSavedForms(false)}
       />
     )}

     <EmailModal
       isOpen={showEmailModal}
       onClose={() => setShowEmailModal(false)}
       clientName={clientName}
       subject={subject}
       details={details}
       sessionType={sessionType}
       sections={sections}
     />
   </>
 );
}