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
    "Anger": "Anger",
    "Fear": "Fear",
    "Sadness": "Sadness",
    "Joy": "Joy",
    "Surprise": "Surprise",
    "Disgust": "Disgust",
    "Shame": "Shame",
    "Guilt": "Guilt",
    "Anxiety": "Anxiety",
    "Depression": "Depression",
    "Excitement": "Excitement",
    "Contentment": "Contentment",
    "Frustration": "Frustration",
    "Gratitude": "Gratitude",
    "Hope": "Hope",
    "Despair": "Despair",
    "Love": "Love",
    "Hate": "Hate",
    "Confusion": "Confusion",
    "Clarity": "Clarity"
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
        "Anger",
        "Fear", 
        "Sadness",
        "Joy",
        "Surprise",
        "Disgust",
        "Shame",
        "Guilt",
        "Anxiety",
        "Depression",
        "Excitement",
        "Contentment",
        "Frustration",
        "Gratitude",
        "Hope",
        "Despair",
        "Love",
        "Hate",
        "Confusion",
        "Clarity"
    ]
};
