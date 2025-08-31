import { FormSection, ConnectedEmotionsSection } from "./FormBuilder";
import { jsPDF } from 'jspdf';
import Raleway from './Raleway-Light.ttf';
import RalewayBold from './Raleway-Bold.ttf';
import { toast } from "sonner";
import { getFullSubheading } from "./template";
console.log("PG: Imports successful. Continuing...")

export async function generatePDF(
  clientName: string, 
  subject: string, 
  details: string, 
  sessionType: string, 
  sourceOfBelief: string,
  sections: FormSection[],
  connectedEmotionsSections?: ConnectedEmotionsSection[]
) {
  try {
    console.log("PG: Starting PDF generation...");
    const pdf = new jsPDF();

    console.log("PG: PDF instance created successfully. Continuing...");
    // Add the fonts
    pdf.addFont(Raleway, 'Raleway', 'normal');
    pdf.addFont(RalewayBold, 'Raleway', 'bold');

    // Set the fonts before adding text
    pdf.setFont('Raleway', 'normal');
    pdf.setFont('Raleway', 'bold');
    console.log("PG: Fonts added successfully. Continuing...");

    let yPosition = 20;
    const lineHeight = 7;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;

    // Add title
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFontSize(18);
    pdf.setFont('Raleway', 'bold');
    pdf.text(`Belief Code Session for ${clientName}`, margin, yPosition);
    yPosition += lineHeight * 1.5;
    pdf.setFont('Raleway', 'bold');
    pdf.setFontSize(12);
    // Ensure we have a valid client name
    if (!clientName || clientName.trim() === "") {
      clientName = "Not provided";
      console.warn("PG: Client name is empty. Using 'Not provided'.");
      toast.error("Client name is blank.");
    }
    console.log("PG: Client name rendered successfully. Continuing...");

    // Generic header text
    // This text is used to explain the belief system and its components
    const headerText = [
      'Belief systems are composed, on average, of about nine negative statements that together form a subconscious program. These programs operate automatically, without conscious thought, much like a train running the same track repeatedly. They shape how we respond to life and experiences, often without us realizing it.',
      'In a Belief Code session, the belief system is symbolized by a tree. The branches of the tree represent the Negative Programs, or NP. These are the conscious, repetitive thoughts we often hear in our minds—things like "I\'m not good enough," "I\'m so absent-minded," or "I\'m a bad person." Each belief system contains between one and four NPs.',
      'The trunk of the tree represents the Limiting Beliefs, or LB. These are usually less conscious than the NPs but still somewhat familiar. These beliefs, which typically number between one and three, act as the structural support for the rest of the belief system.',
      'The roots of the tree represent the Faulty Core Beliefs, or FCB. These beliefs usually formed before the age of seven, when we lacked the cognitive ability to filter what we were told or what we observed. Because of this, these experiences often became deeply embedded in our subconscious. FCBs are typically less familiar and usually, there is only one per belief system.',
      'Beneath the roots, the soil represents the Faulty Core Identity, or FCI. These are deep subconscious beliefs also formed before the age of seven. They often feel entirely unfamiliar or even untrue to your current self, but they may still exert influence. If present, there is only one FCI per belief.',
      'When a number is placed next to one of these abbreviations—for example, NP2, LB3, or FCB1—it refers to which belief system that particular statement comes from. So NP2 would mean a Negative Program from the second belief system, and LB3 would indicate a Limiting Belief from the third belief system, and so on. This helps keep track of multiple belief systems when working through them in a session.',
      'Belief systems can originate in a variety of ways. They may be inherited from a biological parent and passed down energetically at the moment of conception, much like a physical trait. Beliefs can also be learned or suggested through what we observe or are told, especially by those who hold influence over us, such as parents, teachers, or caregivers. Sometimes, beliefs are formed from our own interpretations of life experiences, particularly during emotional or impactful moments.',
      'Removing a belief system creates space in the subconscious mind. This space must be integrated or filled to restore balance and peace. At the end of a session, we either install positive statements aligned with your highest good or use a short guided meditation to "defragment" the subconscious—gently closing the gaps where negative beliefs once resided. This helps ensure that your system feels settled and harmonized after the work is complete.',
    ];

    // Render headerText as wrapped paragraphs
    pdf.setFontSize(10);
    pdf.setFont('Raleway', 'normal');
    headerText.forEach((paragraph) => {
      if (paragraph === '---') {
        pdf.setFont('Raleway', 'normal');
        pdf.text('---', margin, yPosition);
        pdf.setFont('Raleway', 'normal');
        yPosition += lineHeight;
        return;
      }
      const wrapped = pdf.splitTextToSize(paragraph, pdf.internal.pageSize.width - 2 * margin);
      wrapped.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight; // Extra space between paragraphs
    });
    console.log("PG: Header text rendered successfully. Continuing...");

    // Add date
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFontSize(12);
    pdf.setFont('Raleway', 'normal');
    const date = new Date().toLocaleDateString();
    pdf.text(`Session Date: ${date}`, margin, yPosition);
    yPosition += lineHeight * 1.5;
    console.log("PG: Date rendered successfully. Continuing...");

       // Add subject if provided
    if (subject && subject.trim()) {
      pdf.setFontSize(12);
      pdf.setFont('Raleway', 'normal');
      pdf.text('Subject:', margin, yPosition);
      yPosition += lineHeight;

      pdf.setFont('Raleway', 'normal');
      const splitSubject = pdf.splitTextToSize(subject, pdf.internal.pageSize.width - 2 * margin);
      splitSubject.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight;
    }
    console.log("PG: Subject rendered successfully. Continuing...");

    // Add details if provided
    if (details && details.trim()) {
      pdf.setFontSize(12);
      pdf.setFont('Raleway', 'normal');
      pdf.text('Details:', margin, yPosition);
      yPosition += lineHeight;

      pdf.setFont('Raleway', 'normal');
      const splitDetails = pdf.splitTextToSize(details, pdf.internal.pageSize.width - 2 * margin);
      splitDetails.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight;
    }
    console.log("PG: Details rendered successfully. Continuing...");
    
    // Add source of belief if provided
     if (sourceOfBelief && sourceOfBelief.trim()) {
      pdf.setFontSize(12);
      pdf.setFont('Raleway', 'bold');
      pdf.text(`Source of Belief: ${sourceOfBelief}`, margin, yPosition);
      yPosition += lineHeight * 1.5;
    }
    console.log("PG: Source of belief rendered successfully. Continuing...");

    // Add session type if provided
    if (sessionType && sessionType.trim()) {
      pdf.setFontSize(12);
      pdf.setFont('Raleway', 'bold');
      pdf.text(`Session Type: ${sessionType}`, margin, yPosition);
      yPosition += lineHeight * 1.5;
    }
    console.log("PG: Session type rendered successfully. Continuing...");

    // If no sections, add a placeholder
    if ((!sections || sections.length === 0) && (!connectedEmotionsSections || connectedEmotionsSections.length === 0)) {
      sections = [{
        subheading: 'No Sections',
        content: 'No content available.',
        id: "",
      }];
      console.warn("PG: No sections provided. Using placeholder section.");
      toast("No sections provided. Using placeholder.");
    }

    // Add double-spaced separator line
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pdf.internal.pageSize.width - margin, yPosition);
    yPosition += lineHeight * 2;

    console.log("PG: Separator rendered successfully. Continuing...");

    // Add regular sections
    pdf.setFontSize(12);
    if (sections && sections.length > 0) {
      sections.forEach((section, index) => {
        // Check for new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        // Section heading and content side by side in Raleway
        pdf.setFont('Raleway', 'bold');
        const fullHeading = getFullSubheading(section.subheading);
        const heading = fullHeading.toUpperCase();
        const headingWidth = pdf.getTextWidth(heading);
        pdf.text(heading, margin, yPosition);

        pdf.setFont('Raleway', 'normal');
        const contentX = margin + headingWidth + 8; // 8 units space between heading and content
        const splitContentSide = pdf.splitTextToSize(section.content, pdf.internal.pageSize.width - contentX - margin);

        // Print first line of content beside heading, rest below (indented)
        if (splitContentSide.length > 0) {
          pdf.text(splitContentSide[0], contentX, yPosition);
          for (let i = 1; i < splitContentSide.length; i++) {
            yPosition += lineHeight;
            pdf.text(splitContentSide[i], contentX, yPosition);
          }
        }
        yPosition += lineHeight * 1.5;
      });
    }

    // Add Connected Emotions sections
    if (connectedEmotionsSections && connectedEmotionsSections.length > 0) {
      // Add Connected Emotions header
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('Raleway', 'bold');
      pdf.text('CONNECTED EMOTIONS', margin, yPosition);
      yPosition += lineHeight * 1.5;
      
      pdf.setFontSize(12);
      
      connectedEmotionsSections.forEach((section) => {
        if (section.content && section.content.trim()) {
          // Check for new page
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 20;
          }

          // Section heading and content side by side in Raleway
          pdf.setFont('Raleway', 'bold');
          const fullHeading = getFullSubheading(section.selectedHeading);
          const heading = fullHeading.toUpperCase();
          const headingWidth = pdf.getTextWidth(heading);
          pdf.text(heading, margin, yPosition);

          pdf.setFont('Raleway', 'normal');
          const contentX = margin + headingWidth + 8; // 8 units space between heading and content
          const splitContentSide = pdf.splitTextToSize(section.content, pdf.internal.pageSize.width - contentX - margin);

          // Print first line of content beside heading, rest below (indented)
          if (splitContentSide.length > 0) {
            pdf.text(splitContentSide[0], contentX, yPosition);
            for (let i = 1; i < splitContentSide.length; i++) {
              yPosition += lineHeight;
              pdf.text(splitContentSide[i], contentX, yPosition);
            }
          }
          yPosition += lineHeight * 1.5;
        }
      });
    }

    console.log("PG: Sections rendered successfully. Continuing...");
    // Footer
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Save the PDF
    pdf.save(`Belief Code for ${clientName} - ${subject}.pdf`);
    console.log("PG: PDF generation finished. Save function called.");
  } catch (error) {
    console.error("PG: Error generating PDF:", error);
  }
}