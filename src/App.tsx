import { useState, useEffect, createContext, useContext } from "react";
import { Toaster } from "sonner";
import { FormBuilder } from "./FormBuilder";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./ThemeContext";
import { Settings } from "./Settings";
import { Tutorial, useTutorial } from "./Tutorial";
import { logger, trackUserAction } from "./lib/logger";

// Context to track unsaved changes across components
const UnsavedChangesContext = createContext<{
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}>({
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {}
});

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);

export default function App() {
  logger.info("AP", "App component initializing");
  
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Tutorial state
  const { showTutorial, hasSeenTutorial, openTutorial, closeTutorial } = useTutorial();

  useEffect(() => {
    logger.info("AP", "App component mounted");
    logger.info("AP", `Initial state - showDisclaimer: ${showDisclaimer}, hasUnsavedChanges: ${hasUnsavedChanges}, showSettings: ${showSettings}`);
  }, []);

  useEffect(() => {
    logger.info("AP", `hasUnsavedChanges changed to: ${hasUnsavedChanges}`);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    logger.info("AP", `showSettings changed to: ${showSettings}`);
  }, [showSettings]);

  useEffect(() => {
    logger.info("AP", `showDisclaimer changed to: ${showDisclaimer}`);
  }, [showDisclaimer]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        logger.warn("AP", "Preventing page unload due to unsaved changes");
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };

    logger.info("AP", "Setting up beforeunload event listener");
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      logger.info("AP", "Cleaning up beforeunload event listener");
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return (
    <ThemeProvider>
      <UnsavedChangesContext.Provider value={{ hasUnsavedChanges, setHasUnsavedChanges }}>
        <div className="min-h-screen bg-white flex flex-col" style={{ position: 'relative' }}>
          <header className="header">
            <h1 className="header-title">beliefpad</h1>
            <div className="header-actions">
              {hasSeenTutorial && (
                              <button
                onClick={() => {
                  trackUserAction("tutorial_opened", "AP");
                  openTutorial();
                }}
                className="btn btn-sm"
                title="Show Tutorial"
              >
                ?
              </button>
              )}
              <button
                onClick={() => {
                  trackUserAction("settings_opened", "AP");
                  setShowSettings(true);
                }}
                className="btn btn-sm"
                title="Settings"
              >
                &#9881;
              </button>
            </div>
          </header>
          <main className="flex-1" style={{ width: '100%' }}>
            <Content />
          </main>

          {/* Floating Feedback Button */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfTDqT7fIbduGnyHS4cngkAKNSwWYukwFQJce3SRs8dqDee8g/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="feedback-button"
            title="Send Feedback"
            style={{
              position: 'fixed',
              right: '20px',
              bottom: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            &#x1F5E8;
          </a>

          {showDisclaimer && (
            <footer className="disclaimer-footer">
              <div className="disclaimer-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <p className="disclaimer-text" style={{ flex: 1, margin: 0 }}>
                    <strong>Disclaimer:</strong> This application is an independent, third-party tool created for transcription and note-taking purposes. It is not affiliated with, endorsed by, sponsored by, or connected to Discover Healing or any of their proprietary methods, trademarks, or services. All trademarks, service marks, and trade names referenced in this application are the property of their respective owners. This application is provided as a general transcription tool and does not constitute professional advice or training in any healing modality.
                    The developer of this application is not associated with Discover Healing and does not represent or warrant any connection to their organization or methodologies.
                  </p>
                  <button 
                    onClick={() => {
                      trackUserAction("disclaimer_closed", "AP");
                      setShowDisclaimer(false);
                    }}
                    className="disclaimer-close-button"
                    aria-label="Close disclaimer"
                    style={{
                      flexShrink: 0,
                      alignSelf: 'flex-start',
                      marginTop: '2px'
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            </footer>
          )}
          
          <Settings 
            isOpen={showSettings} 
            onClose={() => {
              trackUserAction("settings_closed", "AP");
              setShowSettings(false);
            }} 
          />
          
          {/* Tutorial portal - render at root level with high z-index */}
          {showTutorial && (
            <Tutorial
              isOpen={showTutorial}
              onClose={closeTutorial}
            />
          )}

          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-family)',
                fontSize: '12px',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-card-bg)',
                color: 'var(--color-text)',
              }
            }}
          />
          <Analytics />
          <SpeedInsights />
        </div>
      </UnsavedChangesContext.Provider>
    </ThemeProvider>
  );
}

function Content() {
  logger.info("AP", "Content component rendering");
  
  return (
    <div className="stack">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'normal', 
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-family)'
        }}>
          beliefpad
        </h2>
        <p className="text-muted" style={{ fontSize: '14px' }}>
          easily type professional belief code sessions and export
        </p>
      </div>
      <FormBuilder />
    </div>
  );
}