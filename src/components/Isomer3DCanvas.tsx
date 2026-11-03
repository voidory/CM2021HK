import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  GEOMS,
  Quat,
  Vec3,
  nearestSnap,
  stepRotation,
  drawMoleculeChemDraw,
  MoleculeViewStyleState
} from '../utils/isomer3dEngine';

interface Isomer3DCanvasProps {
  geom: 'Td' | 'SP' | 'Oh';
  labels: string[];
  edges?: [number, number][];
  centralAtom?: string;
  isChiral?: boolean;
  name?: string;
  badge?: string;
  className?: string;
}

export const Isomer3DCanvas: React.FC<Isomer3DCanvasProps> = ({
  geom,
  labels,
  edges = [],
  centralAtom = 'M',
  isChiral = false,
  name,
  badge,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const G = GEOMS[geom] || GEOMS.Oh;

  // Rotation quaternion state
  const qRef = useRef<Quat>(G.baseQ.clone());
  const animRef = useRef<{ q0: Quat; q1: Quat; t: number; dur: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number; moved: number; isDown: boolean } | null>(null);
  const styleStateRef = useRef<MoleculeViewStyleState>({ styles: {} });

  const [isMirrorActive, setIsMirrorActive] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [isInteracting, setIsInteracting] = useState(false);

  // Reset to default layout when geometry or configuration changes
  useEffect(() => {
    qRef.current = G.baseQ.clone();
    animRef.current = null;
    styleStateRef.current = { styles: {} };
    setIsMirrorActive(false);
    setFeedbackMsg('');
  }, [geom, labels.join(','), edges.map(e => e.join('-')).join(',')]);

  // Render loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = width / dpr;
    const H = height / dpr;

    ctx.clearRect(0, 0, W, H);

    // Background paper
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    const cfg = {
      labels,
      edges,
      centralAtom
    };

    if (isMirrorActive) {
      // Dual pane: left is normal, right is mirror
      const paneW = W / 2;
      const L = Math.min(paneW * 0.38, H * 0.38);

      // Divider mirror line
      ctx.fillStyle = 'rgba(224, 242, 254, 0.5)';
      ctx.fillRect(paneW - 4, H * 0.08, 8, H * 0.84);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(paneW, H * 0.08);
      ctx.lineTo(paneW, H * 0.92);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('σ mirror plane', paneW, H * 0.06);

      // Left pane
      drawMoleculeChemDraw(ctx, geom, cfg, qRef.current, styleStateRef.current, {
        cx: paneW * 0.5,
        cy: H / 2,
        L,
        flip: false,
        key: 0
      });

      // Right pane: exact mirror projection
      drawMoleculeChemDraw(ctx, geom, cfg, qRef.current, styleStateRef.current, {
        cx: paneW * 1.5,
        cy: H / 2,
        L,
        flip: true,
        key: 1
      });
    } else {
      // Single pane centered
      const L = Math.min(W * 0.34, H * 0.36);
      drawMoleculeChemDraw(ctx, geom, cfg, qRef.current, styleStateRef.current, {
        cx: W / 2,
        cy: H / 2,
        L,
        flip: false,
        key: 0
      });
    }
  }, [geom, labels, edges, centralAtom, isMirrorActive]);

  // Animation frame ticker
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (animRef.current) {
        const A = animRef.current;
        A.t += dt / A.dur;
        const k = A.t >= 1 ? 1 : (1 - Math.cos(Math.PI * A.t)) / 2;
        qRef.current.slerpQuaternions(A.q0, A.q1, k);
        if (A.t >= 1) {
          animRef.current = null;
        }
      }

      renderCanvas();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

  // Pointer interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      moved: 0,
      isDown: true
    };
    animRef.current = null;
    setIsInteracting(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current || !dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    dragRef.current.moved += Math.abs(dx) + Math.abs(dy);

    const m = Math.hypot(dx, dy);
    if (m < 0.01) return;

    // Trackball rotation quaternion
    const dq = new Quat();
    if (e.shiftKey || e.button === 2) {
      // In-plane roll
      dq.setFromAxisAngle(new Vec3(0, 0, 1), -dx * 0.012);
    } else {
      // True 3D sphere trackball
      dq.setFromAxisAngle(new Vec3(dy / m, dx / m, 0), m * 0.011);
    }

    qRef.current.premultiply(dq);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current || !dragRef.current.isDown) return;
    dragRef.current.isDown = false;
    setIsInteracting(false);

    // If drag released, gently snap to nearest textbook view
    const targetQ = nearestSnap(G, qRef.current);
    if (Math.abs(Math.abs(targetQ.dot(qRef.current)) - 1) > 1e-5) {
      animRef.current = {
        q0: qRef.current.clone(),
        q1: targetQ.clone(),
        t: 0,
        dur: 0.35
      };
    }
  };

  // Step rotation actions
  const triggerStep = (kind: 'v' | 'h' | 'z') => {
    const res = stepRotation(G, qRef.current, kind);
    animRef.current = {
      q0: qRef.current.clone(),
      q1: res.targetQ.clone(),
      t: 0,
      dur: 0.5
    };
    setFeedbackMsg(`Rotated ${res.deg}° about ${res.axisName}`);
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const triggerShuffle = () => {
    const snaps = G.snaps;
    const target = snaps[Math.floor(Math.random() * snaps.length)];
    animRef.current = {
      q0: qRef.current.clone(),
      q1: target.clone(),
      t: 0,
      dur: 0.6
    };
    setFeedbackMsg('Shuffled: Alternate exam-style textbook angle');
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const triggerReset = () => {
    animRef.current = {
      q0: qRef.current.clone(),
      q1: G.baseQ.clone(),
      t: 0,
      dur: 0.4
    };
    setIsMirrorActive(false);
    setFeedbackMsg('Reset to standard textbook projection');
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const triggerMirrorToggle = () => {
    setIsMirrorActive(prev => !prev);
    setFeedbackMsg(!isMirrorActive ? 'Mirror plane active: Reflection drawn on right' : 'Single view restored');
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* 3D Stage Container */}
      <div
        ref={containerRef}
        className="relative w-full h-56 sm:h-64 rounded-2xl bg-white border border-sky-200/90 shadow-inner overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block touch-none"
        />

        {/* Drag Hint & Feedback */}
        <div className="absolute left-2 bottom-2 pointer-events-none flex items-center gap-1.5 text-[10px] text-slate-500 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
          <span>{isInteracting ? '🔄 Rotating 3D complex…' : '🖱️ Drag to rotate 3D view'}</span>
        </div>

        {feedbackMsg && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none text-[11px] font-semibold text-sky-900 bg-sky-100/95 border border-sky-300 px-2.5 py-0.5 rounded-full shadow-xs">
            {feedbackMsg}
          </div>
        )}

        {isChiral && (
          <div className="absolute top-2 right-2 pointer-events-none text-[10px] font-bold text-purple-800 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full">
            Chiral Enantiomer
          </div>
        )}
      </div>

      {/* 3D Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 w-full">
        <button
          type="button"
          onClick={() => triggerStep('v')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 hover:border-sky-300 text-xs font-semibold shadow-2xs transition flex items-center gap-1 cursor-pointer"
          title="Turn molecule 90° or 180° about vertical symmetry axis"
        >
          <span>↻</span>
          <span>Vertical</span>
        </button>

        <button
          type="button"
          onClick={() => triggerStep('h')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 hover:border-sky-300 text-xs font-semibold shadow-2xs transition flex items-center gap-1 cursor-pointer"
          title="Turn molecule 90° or 180° about horizontal symmetry axis"
        >
          <span>↻</span>
          <span>Horizontal</span>
        </button>

        <button
          type="button"
          onClick={() => triggerStep('z')}
          className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 hover:border-sky-300 text-xs font-semibold shadow-2xs transition flex items-center gap-1 cursor-pointer"
          title="Turn molecule within page"
        >
          <span>⟲</span>
          <span>In-Page</span>
        </button>

        <button
          type="button"
          onClick={triggerShuffle}
          className="px-2 py-1 rounded-lg bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 text-xs font-semibold shadow-2xs transition flex items-center gap-1 cursor-pointer"
          title="Show from another exam textbook view"
        >
          <span>⤮</span>
          <span>Shuffle</span>
        </button>

        <button
          type="button"
          onClick={triggerMirrorToggle}
          className={`px-2 py-1 rounded-lg border text-xs font-semibold shadow-2xs transition flex items-center gap-1 cursor-pointer ${
            isMirrorActive
              ? 'bg-sky-600 text-white border-sky-700'
              : 'bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-800 border-slate-200 hover:border-sky-300'
          }`}
          title="Show mirror reflection side-by-side"
        >
          <span>⧉</span>
          <span>Mirror</span>
        </button>

        <button
          type="button"
          onClick={triggerReset}
          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition flex items-center gap-1 cursor-pointer"
          title="Reset to default exam view"
        >
          <span>⌂</span>
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
