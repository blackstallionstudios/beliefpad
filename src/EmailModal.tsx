import { useState } from "react";
import { toast } from "sonner";
import { FormSection } from "./FormBuilder";
import * as Dialog from "@radix-ui/react-dialog";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  subject: string;
  details: string;
  sessionType: string;
  sections: FormSection[];
}

export function EmailModal({
  isOpen,
  onClose,
  clientName,
  subject,
  details,
  sessionType,
  sections,
}: EmailModalProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [pin, setPin] = useState("");
  const [isSending, setIsSending] = useState(false);

  const REQUIRED_PIN = process.env.REACT_APP_EMAIL_PIN || "1234"; // fallback PIN

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail.trim()) {
      toast.error("Please fill in recipient email");
      return;
    }

    //if (pin !== REQUIRED_PIN) {
    //  toast.error("Incorrect PIN. Access denied.");
    //  return;
    //}

    if (!clientName.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    const sectionsWithContent = sections.filter(section => section.content.trim());
    if (sectionsWithContent.length === 0) {
      toast.error("Please add content to at least one section");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          subject,
          details,
          sessionType,
          sections: sectionsWithContent,
          recipientEmail,
          senderEmail: "camself@hotmail.com",
          senderName: "Cameron's Transformational Healing",
          emailSubject,
          emailMessage,
          
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Session sent successfully!");
        onClose();
      } else {
        toast.error(`Failed to send session: ${result.message}`);
      }
    } catch (error) {
      console.error("Error sending session:", error);
      toast.error("Failed to send session. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Dialog.Content className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <Dialog.Title className="text-xl font-semibold">Send Session via Email</Dialog.Title>
            <Dialog.Description className="text-gray-500 mb-4">
              Enter the email details and PIN to send the session report.
            </Dialog.Description>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isSending}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN *
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={isSending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Belief Code Session Report"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Message
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Please find the attached Belief Code session report..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  disabled={isSending}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isSending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Send Session"}
                </button>
              </div>
            </form>

            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                disabled={isSending}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
