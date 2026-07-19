import React from 'react';
import { PRESETS } from '../utils/passwordGenerator.js';

function PasswordPresets({ activePreset, onSelectPreset }) {
  return (
    <section className="card presets-card" aria-labelledby="presets-heading">
      <h2 id="presets-heading" className="section-heading">
        Quick Presets
      </h2>
      <div className="presets-grid">
        {Object.values(PRESETS).map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`preset-btn ${activePreset === preset.id ? 'preset-btn-active' : ''}`}
            onClick={() => onSelectPreset(preset.id)}
            aria-pressed={activePreset === preset.id}
          >
            <span className="preset-btn-label">{preset.label}</span>
            <span className="preset-btn-description">{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default PasswordPresets;
