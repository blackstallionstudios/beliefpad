import { useTheme, Theme, FontFamily } from './ThemeContext';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { theme, fontFamily, setTheme, setFontFamily } = useTheme();

  if (!isOpen) return null;

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleFontChange = (newFont: FontFamily) => {
    setFontFamily(newFont);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '400px', width: '90vw' }}>
        <div className="modal-header">
          <h2 className="modal-title">settings</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <div className="stack-md" style={{ padding: '1.5rem' }}>
          {/* Theme Selection */}
          <div className="field">
            <label className="field-label">appearance</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light'}
                  onChange={() => handleThemeChange('light')}
                />
                <span>light</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark'}
                  onChange={() => handleThemeChange('dark')}
                />
                <span>dark</span>
              </label>
            </div>
          </div>

          {/* Font Selection */}
          <div className="field">
            <label className="field-label">font family</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="font"
                  value="mono"
                  checked={fontFamily === 'mono'}
                  onChange={() => handleFontChange('mono')}
                />
                <span style={{ fontFamily: 'var(--font-mono)' }}>monospace</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="font"
                  value="sans"
                  checked={fontFamily === 'sans'}
                  onChange={() => handleFontChange('sans')}
                />
                <span style={{ fontFamily: 'var(--font-sans)' }}>sans-serif</span>
              </label>

              {/*<label className="radio-option">
                <input
                  type="radio"
                  name="font"
                  value="serif"
                  checked={fontFamily === 'serif'}
                  onChange={() => handleFontChange('serif')}
                />
                <span style={{ fontFamily: 'var(--font-serif)' }}>serif</span>
              </label>
              */}
            </div>
          </div>

          <div className="field">
            <p className="text-muted" style={{ fontSize: '12px', marginTop: '1rem' }}>
              your preferences are will automatically be saved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}