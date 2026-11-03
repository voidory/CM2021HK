import React, { useEffect, useState } from 'react';

interface CloudBackgroundProps {
  animationsEnabled: boolean;
}

interface ClickParticle {
  id: number;
  x: number;
  y: number;
}

export const CloudBackground: React.FC<CloudBackgroundProps> = ({ animationsEnabled }) => {
  const [particles, setParticles] = useState<ClickParticle[]>([]);

  useEffect(() => {
    if (!animationsEnabled) return;

    const handleClick = (e: MouseEvent) => {
      // Don't create particle if user clicked an interactive button or input
      const target = e.target as HTMLElement;
      if (target.closest('button, input, select, a, textarea')) return;

      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };

      setParticles(prev => [...prev.slice(-8), newParticle]);

      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 700);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [animationsEnabled]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-gradient-to-b from-sky-100/90 via-sky-50 to-indigo-50/50">
      {/* Background Soft Clouds */}
      <div
        className={`absolute -top-12 -left-16 w-80 h-40 bg-white/70 rounded-full blur-2xl ${
          animationsEnabled ? 'cloud-float-1' : ''
        }`}
      />
      <div
        className={`absolute top-20 -right-20 w-96 h-48 bg-white/60 rounded-full blur-2xl ${
          animationsEnabled ? 'cloud-float-2' : ''
        }`}
      />
      <div
        className={`absolute bottom-10 left-1/4 w-[32rem] h-56 bg-sky-200/40 rounded-full blur-3xl ${
          animationsEnabled ? 'cloud-float-1' : ''
        }`}
      />
      <div
        className={`absolute -bottom-16 right-10 w-96 h-48 bg-white/80 rounded-full blur-2xl ${
          animationsEnabled ? 'cloud-float-2' : ''
        }`}
      />

      {/* Floating Decorative SVG Cloud Silhouettes */}
      <svg
        className={`absolute top-16 left-12 w-28 h-16 text-white/60 fill-current drop-shadow-sm ${
          animationsEnabled ? 'cloud-float-1' : ''
        }`}
        viewBox="0 0 24 24"
      >
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>

      <svg
        className={`absolute top-44 right-16 w-36 h-20 text-white/50 fill-current drop-shadow-sm ${
          animationsEnabled ? 'cloud-float-2' : ''
        }`}
        viewBox="0 0 24 24"
      >
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>

      {/* Gentle Click Particles */}
      {animationsEnabled &&
        particles.map(p => (
          <span
            key={p.id}
            className="absolute text-base select-none animate-ping transition-opacity opacity-75"
            style={{
              left: p.x - 10,
              top: p.y - 10,
              animationDuration: '650ms'
            }}
          >
            ☁️
          </span>
        ))}
    </div>
  );
};
