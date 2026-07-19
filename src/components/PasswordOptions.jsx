import React from 'react';
import { MIN_LENGTH, MAX_LENGTH } from '../utils/passwordGenerator.js';

function OptionCheckbox({ id, label, checked, onChange, hint }) {
  return (
    <label className="option-checkbox" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      <span className="option-checkbox-box" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.5 4 6 11.5 2.5 8" />
        </svg>
      </span>
      <span className="option-checkbox-text">
        <span className="option-checkbox-label">{label}</span>
        {hint && (
          <span id={`${id}-hint`} className="option-checkbox-hint">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

function PasswordOptions({
  length,
  onLengthChange,
  useUppercase,
  onToggleUppercase,
  useLowercase,
  onToggleLowercase,
  useNumbers,
  onToggleNumbers,
  useSymbols,
  onToggleSymbols,
}) {
  return (
    <div className="password-options">
      <div className="length-control">
        <div className="length-control-header">
          <label htmlFor="length-slider" className="length-control-label">
            Password Length
          </label>
          <span className="length-control-value" aria-hidden="true">
            {length}
          </span>
        </div>
        <input
          id="length-slider"
          type="range"
          min={MIN_LENGTH}
          max={MAX_LENGTH}
          value={length}
          onChange={(e) => onLengthChange(Number(e.target.value))}
          aria-valuemin={MIN_LENGTH}
          aria-valuemax={MAX_LENGTH}
          aria-valuenow={length}
          aria-label={`Password length: ${length} characters`}
        />
        <div className="length-control-scale" aria-hidden="true">
          <span>{MIN_LENGTH}</span>
          <span>{MAX_LENGTH}</span>
        </div>
      </div>

      <fieldset className="character-options">
        <legend>Character Types</legend>
        <div className="character-options-grid">
          <OptionCheckbox
            id="opt-uppercase"
            label="Uppercase"
            hint="A–Z"
            checked={useUppercase}
            onChange={onToggleUppercase}
          />
          <OptionCheckbox
            id="opt-lowercase"
            label="Lowercase"
            hint="a–z"
            checked={useLowercase}
            onChange={onToggleLowercase}
          />
          <OptionCheckbox
            id="opt-numbers"
            label="Numbers"
            hint="0–9"
            checked={useNumbers}
            onChange={onToggleNumbers}
          />
          <OptionCheckbox
            id="opt-symbols"
            label="Symbols"
            hint="!@#$%…"
            checked={useSymbols}
            onChange={onToggleSymbols}
          />
        </div>
      </fieldset>
    </div>
  );
}

export default PasswordOptions;
