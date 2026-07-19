import React from 'react';

function Hero() {
  return (
    <section className="hero" aria-label="Introduction">
      <p className="hero-eyebrow">Local · Private · Cryptographically secure</p>
      <h1 className="hero-title">
        Generate passwords that never leave your browser.
      </h1>
      <p className="hero-subtitle">
        Cipherkey uses the Web Crypto API to build unpredictable passwords on your
        device. Nothing is transmitted, logged, or stored — you control every
        character.
      </p>
    </section>
  );
}

export default Hero;
