import { useState, useEffect, createContext, useContext } from "react";
import { Toaster } from "sonner";
import { FormBuilder } from "./FormBuilder";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./ThemeContext";
import { Settings } from "./Settings";
import { Tutorial, useTutorial } from "./Tutorial";

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
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Tutorial state
  const { showTutorial, hasSeenTutorial, openTutorial, closeTutorial } = useTutorial();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
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
                  onClick={openTutorial}
                  className="btn btn-sm"
                  title="Show Tutorial"
                >
                  ?
                </button>
              )}
              <button
                onClick={() => setShowSettings(true)}
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
          {showDisclaimer && (
            <footer className="disclaimer-footer">
              <div className="disclaimer-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <p className="disclaimer-text" style={{ flex: 1, margin: 0 }}>
                    <strong>Disclaimer:</strong> This application is an independent, third-party tool created for transcription and note-taking purposes. It is not affiliated with, endorsed by, sponsored by, or connected to Discover Healing or any of their proprietary methods, trademarks, or services. All trademarks, service marks, and trade names referenced in this application are the property of their respective owners. This application is provided as a general transcription tool and does not constitute professional advice or training in any healing modality.
                    The developer of this application is not associated with Discover Healing and does not represent or warrant any connection to their organization or methodologies.
                  </p>
                  <button 
                    onClick={() => setShowDisclaimer(false)}
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
            onClose={() => setShowSettings(false)} 
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