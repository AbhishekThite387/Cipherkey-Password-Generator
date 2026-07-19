import React, { useState } from 'react';

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
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

function HistoryItem({ entry, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(entry);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <li className="history-item">
      <span className="history-item-index" aria-hidden="true">
        {index + 1}
      </span>
      <span className="history-item-password">{entry}</span>
      <button
        type="button"
        className={`btn-icon copy-btn ${copied ? 'copy-btn-success' : ''}`}
        onClick={handleCopy}
        aria-label={copied ? 'Password copied to clipboard' : `Copy password ${index + 1} to clipboard`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </li>
  );
}

function PasswordHistory({ history, onClearHistory }) {
  const [confirmingClear, setConfirmingClear] = useState(false);

  const handleClearClick = () => {
    if (confirmingClear) {
      onClearHistory();
      setConfirmingClear(false);
    } else {
      setConfirmingClear(true);
    }
  };

  return (
    <section className="card history-card" aria-labelledby="history-heading">
      <div className="history-header">
        <div>
          <h2 id="history-heading" className="section-heading">
            Password History
          </h2>
          <p className="history-subtext">Session-only — cleared when you close or reload this tab</p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            className={`btn btn-ghost btn-small ${confirmingClear ? 'btn-danger' : ''}`}
            onClick={handleClearClick}
            onBlur={() => setConfirmingClear(false)}
          >
            {confirmingClear ? 'Confirm clear?' : 'Clear History'}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="history-empty">No passwords generated yet this session.</p>
      ) : (
        <ul className="history-list">
          {history.map((entry, index) => (
            <HistoryItem key={`${entry}-${index}`} entry={entry} index={index} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default PasswordHistory;
