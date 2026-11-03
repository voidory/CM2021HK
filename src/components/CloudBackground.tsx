import React, { useEffect, useId, useRef } from 'react';

interface CloudBackgroundProps {
  animationsEnabled: boolean;
}

// Keep the existing export so App's animation setting controls the new mascot.
export const CloudBackground: React.FC<CloudBackgroundProps> = ({ animationsEnabled }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pupils = useRef<Array<SVGGElement | null>>([]);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = 0;
    let target: { x: number; y: number } | null = null;
    const positions = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    const centers = [77, 121];
    const reset = () => {
      positions.forEach(p => { p.x = 0; p.y = 0; });
      pupils.current.forEach(p => p?.setAttribute('transform', 'translate(0 0)'));
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') target = { x: event.clientX, y: event.clientY };
    };
    const leave = () => { target = null; };
    const tick = (time: number) => {
      const dt = previous ? Math.min(time - previous, 64) : 16;
      previous = time;
      const easing = 1 - Math.exp(-dt / 85);
      const svg = svgRef.current;
      const matrix = svg?.getScreenCTM();
      if (svg && matrix) {
        const inverse = matrix.inverse();
        const point = svg.createSVGPoint();
        point.x = target?.x ?? 0;
        point.y = target?.y ?? 0;
        const local = point.matrixTransform(inverse);
        positions.forEach((position, i) => {
          const dx = local.x - centers[i];
          const dy = local.y - 92;
          const distance = Math.hypot(dx, dy);
          const strength = target ? Math.min(distance / 110, 1) : 0;
          const tx = distance ? dx / distance * 5.5 * strength : 0;
          const ty = distance ? dy / distance * 7 * strength : 0;
          position.x += (tx - position.x) * easing;
          position.y += (ty - position.y) * easing;
          pupils.current[i]?.setAttribute('transform', `translate(${position.x.toFixed(3)} ${position.y.toFixed(3)})`);
        });
      }
      frame = window.requestAnimationFrame(tick);
    };
    const sync = () => {
      window.cancelAnimationFrame(frame);
      previous = 0;
      if (animationsEnabled && !media.matches && !document.hidden) frame = window.requestAnimationFrame(tick);
      else reset();
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', sync);
    media.addEventListener('change', sync);
    sync();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', sync);
      media.removeEventListener('change', sync);
    };
  }, [animationsEnabled]);

  return (
    <div className="cloud-mascot" data-animated={animationsEnabled} aria-hidden="true">
      <style>{`
        .cloud-mascot { position:fixed; left:max(12px, env(safe-area-inset-left)); bottom:max(12px, env(safe-area-inset-bottom)); width:164px; z-index:20; pointer-events:none; user-select:none; }
        .cloud-mascot svg { display:block; width:100%; height:auto; overflow:visible; }
        .cloud-mascot .cloud-body { transform-origin:100px 90px; animation:mascot-hover 6.4s ease-in-out infinite; }
        .cloud-mascot .cloud-shadow { transform-origin:100px 157px; animation:mascot-shadow 6.4s ease-in-out infinite; }
        .cloud-mascot .cloud-eye { transform-box:fill-box; transform-origin:center; animation:mascot-blink 7.3s linear infinite; }
        .cloud-mascot .cloud-eye-right { animation-delay:.045s; }
        .cloud-mascot .cloud-glint { animation:mascot-glint 4.8s ease-in-out infinite; }
        @keyframes mascot-hover { 0%,100% { transform:translate(0,0) rotate(-2deg); } 25% { transform:translate(3px,-6px) rotate(.5deg); } 50% { transform:translate(0,-11px) rotate(2deg); } 75% { transform:translate(-3px,-5px) rotate(-.5deg); } }
        @keyframes mascot-shadow { 0%,100% { transform:scaleX(1); opacity:.22; } 50% { transform:scaleX(.76); opacity:.11; } }
        @keyframes mascot-blink { 0%,38%,40.5%,43%,45.5%,94%,97%,100% { transform:scaleY(1); } 39.2%,44.2%,95.5% { transform:scaleY(.06); } }
        @keyframes mascot-glint { 0%,100% { opacity:.65; } 50% { opacity:1; } }
        .cloud-mascot[data-animated="false"] * { animation:none !important; }
        @media (prefers-reduced-motion:reduce) { .cloud-mascot * { animation:none !important; } }
        @media (max-width:640px) { .cloud-mascot { width:100px; left:max(6px, env(safe-area-inset-left)); bottom:max(6px, env(safe-area-inset-bottom)); } }
      `}</style>
      <svg viewBox="0 0 200 175" ref={svgRef} focusable="false">
        <defs>
          <linearGradient id={`${id}-body`} x1="0" y1="0" x2=".25" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".6" stopColor="#f8fdff" />
            <stop offset="1" stopColor="#c5e6fa" />
          </linearGradient>
          <radialGradient id={`${id}-iris`}>
            <stop offset="0" stopColor="#459fc9" />
            <stop offset="1" stopColor="#173953" />
          </radialGradient>
          <filter id={`${id}-shadow`} x="-30%" y="-40%" width="160%" height="190%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#4a86ac" floodOpacity=".2" />
          </filter>
          <filter id={`${id}-blur`}><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
        <ellipse className="cloud-shadow" cx="100" cy="157" rx="53" ry="6" fill="#497fa4" filter={`url(#${id}-blur)`} />
        <g className="cloud-body">
          <path d="M48 130C26 130 17 117 20 101C22 88 33 80 47 81C43 60 59 43 78 47C88 19 127 22 138 52C159 48 177 63 174 84C195 91 195 116 178 126C172 130 166 131 156 131Z" fill={`url(#${id}-body)`} stroke="#beddf0" strokeWidth="1.5" filter={`url(#${id}-shadow)`} />
          <path d="M57 70C57 59 66 54 75 56M91 46C102 34 119 40 125 51M146 66C155 65 163 72 163 79" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" opacity=".85" />
          <ellipse cx="57" cy="109" rx="10" ry="5" fill="#f5bbd0" opacity=".5" />
          <ellipse cx="142" cy="109" rx="10" ry="5" fill="#f5bbd0" opacity=".5" />
          {[77, 121].map((cx, i) => (
            <g key={cx}>
              <path d={`M${cx - 9} 71Q${cx} 66 ${cx + 8} 71`} stroke="#6d9ab5" strokeWidth="2" fill="none" strokeLinecap="round" />
              <g className={`cloud-eye ${i ? 'cloud-eye-right' : ''}`}>
                <ellipse cx={cx} cy="92" rx="13" ry="17" fill="#fff" stroke="#bfddeb" strokeWidth="1.2" />
                <g ref={node => { pupils.current[i] = node; }}>
                  <ellipse cx={cx} cy="92" rx="7" ry="9" fill={`url(#${id}-iris)`} />
                  <ellipse cx={cx} cy="93" rx="3.5" ry="5.5" fill="#102b40" />
                  <circle cx={cx - 2} cy="88" r="2.5" fill="white" />
                  <circle className="cloud-glint" cx={cx + 2.5} cy="95" r="1.2" fill="#d4f6ff" />
                </g>
              </g>
            </g>
          ))}
          <path d="M91 113Q99 122 108 113" fill="none" stroke="#527c99" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
