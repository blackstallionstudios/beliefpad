import { useEffect, useState } from "react";
import { toast } from "sonner";
import { exportAllJSON, clearSavedForms } from "./jsonUtils";

interface SavedFormMetadata {
  key: string;
  title: string;
  subject: string;
  date: string;
}

interface SavedFormsProps {
  onLoad: (storageKey: string) => void;
  onClose: () => void;
}

export function SavedForms({ onLoad, onClose }: SavedFormsProps) {
  const [savedForms, setSavedForms] = useState<SavedFormMetadata[]>([]);
  const [isConfirmationEnabled, setIsConfirmationEnabled] = useState(true);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const loadForms = () => {
    const forms = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("session-form-")) {
        try {
          const jsonString = localStorage.getItem(key);
          if (jsonString) {
            const data = JSON.parse(jsonString);

            const title = data.title || "untitled form";
            const subject = data.subject || "no subject";

            let formattedDate = "invalid date";
            const match = key.match(/session-form-(.+)-(\d{4}-\d{2}-\d{2}T.+)$/);

            if (match && match[2]) {
              const date = new Date(match[2]);
              if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
              }
            }

            forms.push({ key, title, subject, date: formattedDate });
          }
        } catch (e) {
          console.error(`Failed to parse localStorage item: ${key}`, e);
        }
      }
    }
    setSavedForms(forms);
  };

  useEffect(() => {
    loadForms();
  }, []);

  const performDeletion = (key: string) => {
    localStorage.removeItem(key);
    setSavedForms(prevForms => prevForms.filter(form => form.key !== key));
    setFormToDelete(null);
    toast.success("form deleted successfully");
  };

  const handleDelete = (key: string) => {
    if (isConfirmationEnabled) {
      setFormToDelete(key);
    } else {
      performDeletion(key);
    }
  };

  const handleClearAll = () => {
    clearSavedForms(() => {
      setSavedForms([]);
      setIsClearing(false);
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '600px', width: '90vw' }}>
        <div className="modal-header">
          <h2 className="modal-title">saved forms</h2>
          <div className="inline">
            <button
              onClick={() => setIsConfirmationEnabled(!isConfirmationEnabled)}
              className={`btn btn-sm ${isConfirmationEnabled ? 'btn-destructive' : 'btn-success'}`}
            >
              {isConfirmationEnabled ? 'disable confirmation' : 'enable confirmation'}
            </button>
            <button onClick={onClose} className="modal-close">
              ×
            </button>
          </div>
        </div>

        <div className="inline-end" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <button
            onClick={exportAllJSON}
            className="btn btn-sm"
          >
            export all
          </button>
          <button
            onClick={() => setIsClearing(true)}
            className="btn btn-sm btn-destructive"
          >
            clear all
          </button>
        </div>

        {isClearing && (
          <div className="confirmation" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <span className="confirmation-text">clear all forms?</span>
            <div className="confirmation-actions">
              <button onClick={handleClearAll} className="btn btn-sm btn-destructive">
                yes
              </button>
              <button onClick={() => setIsClearing(false)} className="btn btn-sm">
                no
              </button>
            </div>
          </div>
        )}

        {savedForms.length === 0 ? (
          <p className="text-muted">no forms saved in local storage</p>
        ) : (
          <div className="list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {savedForms.map((form) => (
              <div key={form.key} className="list-item">
                <div className="list-item-content">
                  <div className="list-item-title">{form.title}</div>
                  <div className="list-item-meta">
                    subject: {form.subject}
                  </div>
                  <div className="list-item-meta">
                    {form.date}
                  </div>
                </div>
                {formToDelete === form.key ? (
                  <div className="confirmation-actions">
                    <span className="confirmation-text text-xs">sure?</span>
                    <button
                      onClick={() => performDeletion(form.key)}
                      className="btn btn-sm btn-destructive"
                    >
                      yes
                    </button>
                    <button
                      onClick={() => setFormToDelete(null)}
                      className="btn btn-sm"
                    >
                      no
                    </button>
                  </div>
                ) : (
                  <div className="list-item-actions">
                    <button
                      onClick={() => onLoad(form.key)}
                      className="btn btn-sm btn-primary"
                    >
                      load
                    </button>
                    <button
                      onClick={() => handleDelete(form.key)}
                      className="btn btn-sm btn-destructive"
                    >
                      delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}