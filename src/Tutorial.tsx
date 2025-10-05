import { useState, useEffect } from 'react';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to BeliefPad!',
    content: (
      <div>
        <p>This app will help you transcribe Belief Code sessions to PDF or to email. To get started, let's go over some basics.</p>
        <div className="mt-4">
          <a 
            href="https://beliefpad.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              backgroundColor: '#000',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              textDecoration: 'none',
              border: '1px solid #000',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.borderColor = '#333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000';
              e.currentTarget.style.borderColor = '#000';
            }}
          >
            Open App in New Tab
          </a>
        </div>
      </div>
    ),
    buttonText: 'Continue'
  },
  {
    id: 'interface',
    title: 'App Interface Overview',
    content: (
      <div>
        <p>Firstly, let's go over the interface of this app. In the top right corner, you can find customization options (font and dark/light themes) by clicking on the gear icon. Whatever options you pick, they'll be saved.</p>
        <p className="mt-3">You can also find information about the app, such as version number and repository link, by clicking the info icon in the top right corner.</p>
        <p className="mt-3">In the main part of the page, you'll find input spaces for the following information: client name, source of belief, subject of session, details and session type. Below that, a dropdown allows you to choose and add sections - one for each statement.</p>
      </div>
    ),
    buttonText: 'OK, got it'
  },
  {
    id: 'statements',
    title: 'Adding Statements',
    content: (
      <div>
        <p>Now let's try adding some statements. From the drop-down, choose NP and click Add Section. A new section will appear, complete with "NP", a text box, and some buttons.</p>
        <p className="mt-3">These buttons allow you to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Paste copied statements into the section</li>
          <li>Duplicate the section - add another section immediately afterwards with the same title (i.e., "NP")</li>
          <li>Delete the section</li>
          <li>Add an opposite section below the section</li>
        </ul>
        <p className="mt-3">Try using these buttons to get used to them.</p>
        <p className="mt-3">Try reordering the sections by dragging and dropping them.  The action areas are located at either end of the section.</p>
        <p className="mt-3" style={{ fontWeight: '600', color: '#d97706' }}>NOTE: The first time you click the "paste" button, a pop-up will appear, asking for permission to access the clipboard. Click "allow".</p>
      </div>
    ),
    buttonText: 'OK, got it'
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    content: (
      <div>
        <p>Now, let's try using the keyboard shortcuts.</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>The TAB key can be used to duplicate a section.</li>
          <li>The CTRL key can be used to add a section: CTRL+N for NP, CTRL+L for LB, CTRL+B for FCB, CTRL+I for FCI.</li>
          <li>For the numbered sections, add 2 or 3 in the keyboard shortcut respectively.</li>
          </ul>
      </div>
    ),
    buttonText: 'OK, got it'
  },
  {
    id: 'saving',
    title: 'Saving and Loading Forms',
    content: (
      <div>
        <p>Now, let's take a look at the buttons at the bottom of the page. To start, let's add a few statements. Don't forget to add a client name!</p>
        <p className="mt-3">Once you're ready, try clicking the "Save" button. Now, reload the app. Click on "View Saved Forms": you should see the form you just saved appear. If you click "Load", the saved form will load into the app.</p>
      </div>
    ),
    buttonText: 'OK, got it'
  },
  {
    id: 'exporting',
    title: 'Exporting Your Work',
    content: (
      <div>
        <p>Once your saved form is loaded, let's try clicking the "Export to PDF" button. This will create a PDF with the information saved in the form and download it to your computer. Open the PDF and take a look!</p>
        <p className="mt-3">The "Open as email" button will open a formatted email with the contents of the form that you can send from your email address. Let's give it a try as well!</p>
      </div>
    ),
    buttonText: 'OK, got it'
  },
  {
    id: 'management',
    title: 'Managing Saved Sessions',
    content: (
      <div>
        <p>There are a certain number of sessions you can save via this method. Once you cannot save more forms, click on the "View Saved Forms" button again.</p>
        <p className="mt-3">Here you have a couple of options:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Manually delete saved forms via the "Delete" button</li>
          <li>Toggle the delete confirmation by clicking the button at the top of the pop-up</li>
          <li>Export all saved forms to your computer by clicking "Export all"</li>
          <li>Load a session from your computer into the app by clicking "Import from file"</li>
        </ul>
        <p className="mt-3">We recommend periodically cleaning out your saved sessions, especially in the case of sessions for clients, that you do not need to keep long-term.</p>
      </div>
    ),
    buttonText: 'OK, got it'
  },
  {
    id: 'local-saving',
    title: 'Local File Saving',
    content: (
      <div>
        <p>You can also save a single session to your computer by clicking "Save locally" at the bottom of the main page.</p>
        <div className="mt-4 p-4" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px' }}>
          <p style={{ fontWeight: '700', color: '#dc2626' }}>VERY IMPORTANT NOTE:</p>
          <p style={{ color: '#dc2626', marginTop: '4px' }}>UNLESS you've saved all of your sessions to your computer, DO NOT clear cookies or browser cache. The save/load mechanism will be reset and ALL of your saved sessions will be DELETED FOREVER.</p>
        </div>
      </div>
    ),
    buttonText: 'OK, got it'
  },
  {
    id: 'split-screen',
    title: 'Using Split Screen',
    content: (
      <div>
        <p className="mb-4">This app is intended to function alongside the official Body Code app created by Discover Healing, especially as a split-screen application. To learn how to do that, read these articles:</p>
        <div className="space-y-3">
          <div>
            <a 
              href="https://support.apple.com/en-ca/guide/mac-help/mchl4fbe2921/mac"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#6b7280',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                textDecoration: 'none',
                border: '1px solid #6b7280',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563';
                e.currentTarget.style.borderColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280';
                e.currentTarget.style.borderColor = '#6b7280';
              }}
            >
              Apple Support (macOS)
            </a>
          </div>
          <div>
            <a 
              href="https://www.microsoft.com/en-us/surface/do-more-with-surface/how-to-use-a-split-screen"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#000',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                textDecoration: 'none',
                border: '1px solid #000',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.borderColor = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000';
                e.currentTarget.style.borderColor = '#000';
              }}
            >
              Microsoft Support (Windows)
            </a>
          </div>
          <div>
            <a 
              href="https://support.google.com/chromebook/answer/177891?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#6b7280',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                textDecoration: 'none',
                border: '1px solid #6b7280',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563';
                e.currentTarget.style.borderColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280';
                e.currentTarget.style.borderColor = '#6b7280';
              }}
            >
              Google Support (ChromeOS)
            </a>
          </div>
        </div>
      </div>
    ),
    buttonText: "Let's gooooooo!"
  }
];

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Tutorial({ isOpen, onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStepData = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((s) => s + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div 
        style={{
          backgroundColor: '#fff',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflow: 'hidden',
          fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          border: '1px solid #e5e7eb',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Header */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#fff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 
              style={{ 
                fontSize: '18px', 
                fontWeight: '500',
                color: '#374151',
                margin: 0
              }}
            >
              {currentStepData.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                style={{ 
                  fontSize: '12px',
                  color: '#6b7280'
                }}
              >
                Step {currentStep + 1} of {TUTORIAL_STEPS.length}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {TUTORIAL_STEPS.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: index === currentStep 
                        ? '#000' 
                        : index < currentStep 
                          ? '#6b7280' 
                          : '#d1d5db'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#9ca3af',
              fontSize: '20px',
              lineHeight: 1,
              padding: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#6b7280';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', maxHeight: '60vh' }}>
          <div 
            style={{ 
              color: '#374151',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          >
            {currentStepData.content}
          </div>
        </div>

        {/* Footer */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                Previous
              </button>
            )}
            {!isLastStep && (
              <button
                onClick={handleSkip}
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#374151';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                Skip Tutorial
              </button>
            )}
          </div>
          
          <button
            onClick={handleNext}
            style={{
              padding: '8px 24px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#fff',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              backgroundColor: isLastStep ? '#000' : '#000'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isLastStep ? '#333' : '#333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000';
            }}
          >
            {currentStepData.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook to manage tutorial state
export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial before
    const tutorialSeen = localStorage.getItem('beliefpad-tutorial-seen');
    if (!tutorialSeen) {
      setShowTutorial(true);
    } else {
      setHasSeenTutorial(true);
    }
  }, []);

  const closeTutorial = () => {
    setShowTutorial(false);
    setHasSeenTutorial(true);
    localStorage.setItem('beliefpad-tutorial-seen', 'true');
  };

  const openTutorial = () => {
    setShowTutorial(true);
  };

  const resetTutorial = () => {
    localStorage.removeItem('beliefpad-tutorial-seen');
    setHasSeenTutorial(false);
    setShowTutorial(true);
  };

  return {
    showTutorial,
    hasSeenTutorial,
    openTutorial,
    closeTutorial,
    resetTutorial
  };
}