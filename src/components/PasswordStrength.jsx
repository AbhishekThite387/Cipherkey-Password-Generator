import React, { useMemo } from 'react';
import { calculateStrength } from '../utils/passwordStrength.js';

const SIGNAL_BAR_COUNT = 5;

function PasswordStrength({ password }) {
  const strength = useMemo(() => calculateStrength(password), [password]);
  const filledBars = Math.max(1, Math.ceil((strength.percentage / 100) * SIGNAL_BAR_COUNT));

  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength-header">
        <span className="password-strength-label">Strength</span>
        <span className="password-strength-value" style={{ color: strength.color }}>
          {strength.strength}
        </span>
      </div>

      <div
        className="strength-signal"
        role="img"
        aria-label={`Password strength: ${strength.strength}`}
      >
        {Array.from({ length: SIGNAL_BAR_COUNT }).map((_, index) => (
          <span
            key={index}
            className={`strength-signal-bar ${index < filledBars ? 'strength-signal-bar-filled' : ''}`}
            style={{
              backgroundColor: index < filledBars ? strength.color : undefined,
              height: `${28 + index * 8}%`,
            }}
          />
        ))}
      </div>

      <p className="password-strength-entropy">
        Entropy: <strong>{strength.entropy}</strong> bits
      </p>
    </div>
  );
}

export default PasswordStrength;
