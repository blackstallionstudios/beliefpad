import { defaultTemplate, getFullSubheading } from "./template";

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

interface SessionViewProps {
  clientName: string;
  subject: string;
  details: string;
  sessionType: string;
  sourceOfBelief: string;
  sections: FormSection[];
  connectedEmotionsSections: ConnectedEmotionsSection[];
}

export function SessionView({
  clientName,
  subject,
  details,
  sessionType,
  sourceOfBelief,
  sections,
  connectedEmotionsSections,
}: SessionViewProps) {
  return (
    <div className="session-view">
      <style>{`
        .session-view {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        
        .session-view .header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e5e5;
        }
        
        .session-view .client-name {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .session-view .session-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .session-view .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .session-view .info-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }
        
        .session-view .info-value {
          font-size: 1rem;
          color: #333;
        }
        
        .session-view .section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          background: white;
        }
        
        .session-view .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .session-view .section-content {
          font-size: 1rem;
          line-height: 1.7;
          color: #34495e;
          white-space: pre-wrap;
        }
        
        .session-view .connected-emotions-header {
          font-size: 1.25rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 2rem 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #3498db;
        }
        
        .session-view .empty-content {
          color: #95a5a6;
          font-style: italic;
        }
        
        @media print {
          .session-view {
            padding: 0;
          }
          
          .session-view .section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="header">
        <div className="client-name">Belief Code Session for {clientName}</div>
      </div>

      <div className="session-info">
        <div className="info-item">
          <div className="info-label">Subject</div>
          <div className="info-value">{subject || "—"}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Session Type</div>
          <div className="info-value">{sessionType || "—"}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Source of Belief</div>
          <div className="info-value">{sourceOfBelief || "—"}</div>
        </div>
      </div>

      {details && (
        <div className="section">
          <div className="section-title">Details</div>
          <div className="section-content">{details}</div>
        </div>
      )}

      {connectedEmotionsSections.length > 0 && (
        <>
          <div className="connected-emotions-header">Connected Emotions</div>
          {connectedEmotionsSections.map((section) => (
            <div key={section.id} className="section">
              <div className="section-title">
                {getFullSubheading(section.selectedHeading)}
              </div>
              <div className="section-content">
                {section.content || <span className="empty-content">No content</span>}
              </div>
            </div>
          ))}
        </>
      )}

      {sections.length > 0 && (
        <>
          {connectedEmotionsSections.length > 0 && (
            <div style={{ borderTop: '1px solid #e5e5e5', margin: '1rem 0' }}></div>
          )}
          {sections.map((section) => (
            <div key={section.id} className="section">
              <div className="section-title">
                {getFullSubheading(section.subheading)}
              </div>
              <div className="section-content">
                {section.content || <span className="empty-content">No content</span>}
              </div>
            </div>
          ))}
        </>
      )}

      {sections.length === 0 && connectedEmotionsSections.length === 0 && (
        <div className="section">
          <div className="section-content empty-content">
            No sections have been added to this session.
          </div>
        </div>
      )}
    </div>
  );
}
