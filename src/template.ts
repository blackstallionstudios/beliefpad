// src/template.ts

// Mapping between abbreviated and full subheading names
export const subheadingMapping = {
    "NP": "Negative Program",
    "LB": "Limiting Belief", 
    "FCB": "Faulty Core Belief",
    "FCI": "Faulty Core Identity",
    "NP 2": "Negative Program 2",
    "LB 2": "Limiting Belief 2",
    "FCB 2": "Faulty Core Belief 2", 
    "FCI 2": "Faulty Core Identity 2",
    "NP 3": "Negative Program 3",
    "LB 3": "Limiting Belief 3",
    "FCB 3": "Faulty Core Belief 3",
    "FCI 3": "Faulty Core Identity 3",
    "PP": "Positive Program",
    "EB": "Empowering Belief",
    "ECB": "Empowering Core Belief",
    "ECI": "Empowering Core Identity",
    "Connected Emotions": "Connected Emotions",
    "Body Code Connections": "Body Code Connections",
    "Defragmentation of the Subconcious Gap":  "Defragmentation of the Subconcious Gap",
    "More": "More",
    // Connected Emotions specific subheadings
    "Prenatal HWE": "Prenatal Heart-Wall Emotion",
    "Preconception HWE": "Preconception Heart-Wall Emotion", 
    "Inherited HWE": "Inherited Heart-Wall Emotion",
    "Common HWE": "Common Heart-Wall Emotion",
    "Shared HWE": "Shared Heart-Wall Emotion",
    "Absorbed HWE": "Absorbed Heart-Wall Emotion",
    "Prenatal TE": "Prenatal Trapped Emotion",
    "Preconception TE": "Preconception Trapped Emotion",
    "Inherited TE": "Inherited Trapped Emotion",
    "Common TE": "Common Trapped Emotion",
    "Shared TE": "Shared Trapped Emotion",
    "Absorbed TE": "Absorbed Trapped Emotion",
    "Prenatal EC": "Prenatal Emotional Compound",
    "Preconception EC": "Preconception Emotional Compound",
    "Inherited EC": "Inherited Emotional Compound",
    "Common EC": "Common Emotional Compound",
    "Shared EC": "Shared Emotional Compound",
    "Absorbed EC": "Absorbed Emotional Compound",
    
};

// Helper function to get full name from abbreviated name
export const getFullSubheading = (abbreviated: string): string => {
    return subheadingMapping[abbreviated as keyof typeof subheadingMapping] || abbreviated;
};

// Helper function to get abbreviated name from full name
export const getAbbreviatedSubheading = (fullName: string): string => {
    const entry = Object.entries(subheadingMapping).find(([_, full]) => full === fullName);
    return entry ? entry[0] : fullName;
};

export const defaultTemplate = {
    subheadings: [
        "NP",
        "LB", 
        "FCB",
        "FCI",
        "NP 2",
        "LB 2",
        "FCB 2",
        "FCI 2", 
        "NP 3",
        "LB 3",
        "FCB 3",
        "FCI 3",
        "PP",
        "EB",
        "ECB",
        "ECI",
        "Connected Emotions",
        "Body Code Connections",
        "Defragmentation of the Subconcious Gap",
        "More"        
    ],
    
    // Connected Emotions specific subheadings (different from main section options)
    connectedEmotionsSubheadings: [
        "Prenatal HWE",
        "Preconception HWE", 
        "Inherited HWE",
        "Common HWE",
        "Shared HWE",
        "Absorbed HWE",
        "Prenatal TE",
        "Preconception TE",
        "Inherited TE",
        "Common TE",
        "Shared TE",
        "Absorbed TE",
        "Prenatal EC",
        "Preconception EC",
        "Inherited EC",
        "Common EC",
        "Shared EC",
        "Absorbed EC"
    ]
};