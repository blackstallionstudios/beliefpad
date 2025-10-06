import { FormSection, ConnectedEmotionsSection } from "./FormBuilder";
import { getFullSubheading } from "./template";
import { logger } from "./lib/logger";

export function generateEmailContent(
  clientName: string,
  subject: string,
  details: string,
  sessionType: string,
  sourceOfBelief: string,
  sections: FormSection[],
  connectedEmotionsSections?: ConnectedEmotionsSection[]
): { subject: string; body: string } {
  logger.info("EG", "generateEmailContent called");
  logger.info("EG", `Parameters - clientName: ${clientName}, subject: ${subject}, sections: ${sections.length}, connectedEmotionsSections: ${connectedEmotionsSections?.length || 0}`);
  
  const emailSubject = `Belief Code Session for ${clientName}`;
  
  // Header explanation text (same as PDF)
  const headerText = [
    'Belief systems are composed, on average, of about nine negative statements that together form a subconscious program. These programs operate automatically, without conscious thought, much like a train running the same track repeatedly. They shape how we respond to life and experiences, often without us realizing it.',
    
    'In a Belief Code session, the belief system is symbolized by a tree. The branches of the tree represent the Negative Programs, or NP. These are the conscious, repetitive thoughts we often hear in our minds—things like "I\'m not good enough," "I\'m so absent-minded," or "I\'m a bad person." Each belief system contains between one and four NPs.',
    
    'The trunk of the tree represents the Limiting Beliefs, or LB. These are usually less conscious than the NPs but still somewhat familiar. These beliefs, which typically number between one and three, act as the structural support for the rest of the belief system.',
    
    'The roots of the tree represent the Faulty Core Beliefs, or FCB. These beliefs usually formed before the age of seven, when we lacked the cognitive ability to filter what we were told or what we observed. Because of this, these experiences often became deeply embedded in our subconscious. FCBs are typically less familiar and usually, there is only one per belief system.',
    
    'Beneath the roots, the soil represents the Faulty Core Identity, or FCI. These are deep subconscious beliefs also formed before the age of seven. They often feel entirely unfamiliar or even untrue to your current self, but they may still exert influence. If present, there is only one FCI per belief.',
    
    'When a number is placed next to one of these abbreviations—for example, NP2, LB3, or FCB1—it refers to which belief system that particular statement comes from. So NP2 would mean a Negative Program from the second belief system, and LB3 would indicate a Limiting Belief from the third belief system, and so on. This helps keep track of multiple belief systems when working through them in a session.',
    
    'Belief systems can originate in a variety of ways. They may be inherited from a biological parent and passed down energetically at the moment of conception, much like a physical trait. Beliefs can also be learned or suggested through what we observe or are told, especially by those who hold influence over us, such as parents, teachers, or caregivers. Sometimes, beliefs are formed from our own interpretations of life experiences, particularly during emotional or impactful moments.',
    
    'Removing a belief system creates space in the subconscious mind. This space must be integrated or filled to restore balance and peace. At the end of a session, we either install positive statements aligned with your highest good or use a short guided meditation to "defragment" the subconscious—gently closing the gaps where negative beliefs once resided. This helps ensure that your system feels settled and harmonized after the work is complete.'
  ];

  const bodyLines: string[] = [];
  
  // Header explanation - join paragraphs with a double line break
  bodyLines.push(...headerText);
  bodyLines.push('');
  
  // Session date
  const date = new Date().toLocaleDateString();
  bodyLines.push(`Session Date: ${date}`);
  
  // Subject if provided
  if (subject && subject.trim()) {
    bodyLines.push('Subject:');
    bodyLines.push(subject);
    bodyLines.push('');
  }
  
  // Details if provided
  if (details && details.trim()) {
    bodyLines.push('Details:');
    bodyLines.push(details);
  }
  
  // Session type if provided
  if (sessionType && sessionType.trim()) {
    bodyLines.push(`Session Type: ${sessionType}`);
  }
   
  // Source of belief if provided
  if (sourceOfBelief && sourceOfBelief.trim()) {
    bodyLines.push(`Source of Belief: ${sourceOfBelief}`);
  }
  
  // Filter sections to only include those with content
  const sectionsWithContent = sections.filter(section => 
    section.content && section.content.trim()
  );
  
  // Filter connected emotions sections to only include those with content
  const connectedEmotionsWithContent = connectedEmotionsSections?.filter(section => 
    section.content && section.content.trim()
  ) || [];
  
  // Only add separator and sections if there are sections with content
  if (sectionsWithContent.length > 0 || connectedEmotionsWithContent.length > 0) {
    bodyLines.push('────────────────────────────────────────────────────────────────────────────────────────');
    bodyLines.push('');
    
    // Add Connected Emotions sections FIRST
    if (connectedEmotionsWithContent.length > 0) {
      bodyLines.push('');
      bodyLines.push('CONNECTED EMOTIONS:');
      bodyLines.push('');
      
      connectedEmotionsWithContent.forEach((section) => {
        if (section.content && section.content.trim()) {
          const fullHeading = getFullSubheading(section.selectedHeading);
          const heading = fullHeading.toUpperCase();
          bodyLines.push(`${heading}: ${section.content}`);
        }
      });
    }

    // Divider between groups if both are present
    if (connectedEmotionsWithContent.length > 0 && sectionsWithContent.length > 0) {
      bodyLines.push('');
      bodyLines.push('────────────────────────────────────────────────────────────────────────────────────────');
      bodyLines.push('');
    }

    // Add regular sections with content AFTER connected emotions
    sectionsWithContent.forEach((section) => {
      const fullHeading = getFullSubheading(section.subheading);
      const heading = fullHeading.toUpperCase();
      
      bodyLines.push(`${heading}: ${section.content}`);
    });
  }
  
  const result = {
    subject: emailSubject,
    body: bodyLines.join('\n\n')
  };
  
  logger.info("EG", `Generated email content - subject: ${result.subject}, body length: ${result.body.length} characters`);
  return result;
}