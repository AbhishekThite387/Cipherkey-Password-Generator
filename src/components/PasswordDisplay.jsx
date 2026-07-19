import React, { useState, useEffect, useRef } from 'react';

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  // Fallback for environments without the async Clipboard API
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let succeeded = false;
  try {
    succeeded = document.execCommand('copy');
  } catch (err) {
    succeeded = false;
  }
  document.body.removeChild(textarea);
  return succeeded;
}

function PasswordDisplay({ password }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (!password) return;
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="password-display">
      <div className="password-display-readout" role="group" aria-label="Generated password">
        <span className="password-display-scanline" aria-hidden="true" />
        <output
          className="password-text"
          aria-live="polite"
          aria-label="Generated password"
        >
          {password || 'Click "Generate Password" to begin'}
        </output>
        <button
          type="button"
          className={`btn-icon copy-btn ${copied ? 'copy-btn-success' : ''}`}
          onClick={handleCopy}
          disabled={!password}
          aria-label={copied ? 'Password copied to clipboard' : 'Copy password to clipboard'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <p className={`copy-feedback ${copied ? 'copy-feedback-visible' : ''}`} role="status">
        {copied ? 'Copied to clipboard!' : ''}
      </p>
    </div>
  );
}

export default PasswordDisplay;
