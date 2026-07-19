import React from 'react';

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}

const POINTS = [
  {
    title: 'Generated locally',
    body: 'Every password is created in your browser using crypto.getRandomValues(). Nothing is sent to a server.',
  },
  {
    title: 'Not saved to disk',
    body: 'Generated passwords are never written to localStorage. Only your light/dark theme preference is stored.',
  },
  {
    title: 'History clears on close',
    body: 'Your recent passwords live in memory for this tab only, so a reload or a new tab starts with a clean slate.',
  },
  {
    title: 'True randomness',
    body: 'A cryptographically secure random source with rejection sampling avoids the bias that Math.random() can introduce.',
  },
];

function SecurityInfo() {
  return (
    <section className="card security-info-card" aria-labelledby="security-heading">
      <div className="security-info-header">
        <span className="security-info-icon" aria-hidden="true">
          <ShieldIcon />
        </span>
        <h2 id="security-heading" className="section-heading">
          Security &amp; Privacy
        </h2>
      </div>
      <div className="security-info-grid">
        {POINTS.map((point) => (
          <div className="security-info-point" key={point.title}>
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SecurityInfo;
