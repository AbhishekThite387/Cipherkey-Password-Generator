import React, { useState } from 'react';

function ChevronIcon({ expanded }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`chevron-icon ${expanded ? 'chevron-icon-expanded' : ''}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AdvancedToggle({ id, label, description, checked, onChange }) {
  return (
    <label className="advanced-toggle" htmlFor={id}>
      <span className="advanced-toggle-text">
        <span className="advanced-toggle-label">{label}</span>
        <span className="advanced-toggle-description">{description}</span>
      </span>
      <span className="switch">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <span className="switch-track" aria-hidden="true">
          <span className="switch-thumb" />
        </span>
      </span>
    </label>
  );
}

function AdvancedOptions({
  excludeSimilar,
  onToggleExcludeSimilar,
  excludeAmbiguous,
  onToggleExcludeAmbiguous,
  noConsecutive,
  onToggleNoConsecutive,
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="card advanced-options-card">
      <button
        type="button"
        className="advanced-options-trigger"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="advanced-options-panel"
      >
        <span className="section-heading">Advanced Options</span>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded && (
        <div className="advanced-options-panel" id="advanced-options-panel">
          <AdvancedToggle
            id="opt-exclude-similar"
            label="Exclude similar characters"
            description="Removes O, 0, I, l, 1, and | to prevent misreads"
            checked={excludeSimilar}
            onChange={onToggleExcludeSimilar}
          />
          <AdvancedToggle
            id="opt-exclude-ambiguous"
            label="Exclude ambiguous symbols"
            description={'Removes symbols like the pipe, backtick, and quote marks that can be awkward to type'}
            checked={excludeAmbiguous}
            onChange={onToggleExcludeAmbiguous}
          />
          <AdvancedToggle
            id="opt-no-consecutive"
            label="No consecutive identical characters"
            description={'Prevents repeats like "aa" or "11" from appearing'}
            checked={noConsecutive}
            onChange={onToggleNoConsecutive}
          />
        </div>
      )}
    </section>
  );
}

export default AdvancedOptions;
