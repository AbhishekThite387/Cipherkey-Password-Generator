import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import PasswordDisplay from './components/PasswordDisplay.jsx';
import PasswordOptions from './components/PasswordOptions.jsx';
import PasswordStrength from './components/PasswordStrength.jsx';
import PasswordPresets from './components/PasswordPresets.jsx';
import AdvancedOptions from './components/AdvancedOptions.jsx';
import PasswordHistory from './components/PasswordHistory.jsx';
import SecurityInfo from './components/SecurityInfo.jsx';
import Footer from './components/Footer.jsx';
import { generatePassword, PRESETS } from './utils/passwordGenerator.js';

const THEME_STORAGE_KEY = 'passwordGeneratorTheme';
const HISTORY_LIMIT = 5;

function App() {
  // Core character type options
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  // Advanced options
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [noConsecutive, setNoConsecutive] = useState(false);

  // Output and UI state
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState([]);
  const [activePreset, setActivePreset] = useState(null);
  const [validationMessage, setValidationMessage] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  });

  // Apply theme to the document root and persist the preference only
  // (never the generated passwords themselves).
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const currentOptions = {
    length,
    useUppercase,
    useLowercase,
    useNumbers,
    useSymbols,
    excludeSimilar,
    excludeAmbiguous,
    noConsecutive,
  };

  const handleGeneratePassword = useCallback(
    (overrideOptions) => {
      const options = overrideOptions || currentOptions;
      try {
        const newPassword = generatePassword(options);
        setPassword(newPassword);
        setValidationMessage(null);
        setHistory((prev) => [newPassword, ...prev].slice(0, HISTORY_LIMIT));
      } catch (error) {
        setValidationMessage(error.message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      length,
      useUppercase,
      useLowercase,
      useNumbers,
      useSymbols,
      excludeSimilar,
      excludeAmbiguous,
      noConsecutive,
    ]
  );

  // Generate an initial password on first mount so the app never opens empty.
  useEffect(() => {
    handleGeneratePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionsChange = () => {
    setActivePreset(null);
  };

  const handleToggleUppercase = () => {
    setUseUppercase((prev) => !prev);
    handleOptionsChange();
  };
  const handleToggleLowercase = () => {
    setUseLowercase((prev) => !prev);
    handleOptionsChange();
  };
  const handleToggleNumbers = () => {
    setUseNumbers((prev) => !prev);
    handleOptionsChange();
  };
  const handleToggleSymbols = () => {
    setUseSymbols((prev) => !prev);
    handleOptionsChange();
  };
  const handleLengthChange = (value) => {
    setLength(value);
    handleOptionsChange();
  };

  const handleToggleExcludeSimilar = () => {
    setExcludeSimilar((prev) => !prev);
    handleOptionsChange();
  };
  const handleToggleExcludeAmbiguous = () => {
    setExcludeAmbiguous((prev) => !prev);
    handleOptionsChange();
  };
  const handleToggleNoConsecutive = () => {
    setNoConsecutive((prev) => !prev);
    handleOptionsChange();
  };

  const handleSelectPreset = (presetId) => {
    const preset = PRESETS[presetId];
    if (!preset) return;

    const { options } = preset;
    setLength(options.length);
    setUseUppercase(options.useUppercase);
    setUseLowercase(options.useLowercase);
    setUseNumbers(options.useNumbers);
    setUseSymbols(options.useSymbols);
    setExcludeSimilar(options.excludeSimilar);
    setExcludeAmbiguous(options.excludeAmbiguous);
    setNoConsecutive(options.noConsecutive);
    setActivePreset(presetId);

    handleGeneratePassword(options);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={handleThemeToggle} />
      <main className="app-main">
        <Hero />

        <section className="card password-generator-card" aria-labelledby="generator-heading">
          <h2 id="generator-heading" className="visually-hidden">
            Password Generator
          </h2>

          <PasswordDisplay password={password} />

          {validationMessage && (
            <p className="validation-message" role="alert">
              {validationMessage}
            </p>
          )}

          <PasswordStrength password={password} />

          <PasswordOptions
            length={length}
            onLengthChange={handleLengthChange}
            useUppercase={useUppercase}
            onToggleUppercase={handleToggleUppercase}
            useLowercase={useLowercase}
            onToggleLowercase={handleToggleLowercase}
            useNumbers={useNumbers}
            onToggleNumbers={handleToggleNumbers}
            useSymbols={useSymbols}
            onToggleSymbols={handleToggleSymbols}
          />

          <button
            type="button"
            className="btn btn-primary btn-generate"
            onClick={() => handleGeneratePassword()}
          >
            Generate Password
          </button>
        </section>

        <PasswordPresets activePreset={activePreset} onSelectPreset={handleSelectPreset} />

        <AdvancedOptions
          excludeSimilar={excludeSimilar}
          onToggleExcludeSimilar={handleToggleExcludeSimilar}
          excludeAmbiguous={excludeAmbiguous}
          onToggleExcludeAmbiguous={handleToggleExcludeAmbiguous}
          noConsecutive={noConsecutive}
          onToggleNoConsecutive={handleToggleNoConsecutive}
        />

        <PasswordHistory history={history} onClearHistory={handleClearHistory} />

        <SecurityInfo />
      </main>
      <Footer />
    </div>
  );
}

export default App;
