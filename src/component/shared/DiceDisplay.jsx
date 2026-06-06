import { useEffect, useRef, useState } from "react";

// ── Angles de repos par valeur de face ──────────────────────────
// Oriente le cube pour que la bonne valeur soit face caméra
const REST = {
  1: { x:   0, y:   0 },
  2: { x:   0, y:  90 },
  3: { x: -90, y:   0 },
  4: { x:  90, y:   0 },
  5: { x:   0, y: -90 },
  6: { x: 180, y:   0 },
};

// ── Points par face (positions en %) ────────────────────────────
const DOTS = {
  1: [[50,50]],
  2: [[28,28],[72,72]],
  3: [[28,28],[50,50],[72,72]],
  4: [[28,28],[72,28],[28,72],[72,72]],
  5: [[28,28],[72,28],[50,50],[28,72],[72,72]],
  6: [[28,22],[72,22],[28,50],[72,50],[28,78],[72,78]],
};

// ── Face du dé : pierre aztèque gravée ──────────────────────────
function Face({ value, transform }) {
  const dots = DOTS[value] || DOTS[1];
  const S = 54; // taille de la face en px
  return (
    <div style={{
      position: "absolute",
      width: S, height: S,
      transform,
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      borderRadius: 6,
      overflow: "hidden",
      background: "radial-gradient(circle at 35% 30%, #5a4a2a, #2a2010 70%, #0e0b04)",
      boxShadow: "inset 0 0 10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(200,150,30,0.15)",
      border: "1.5px solid rgba(180,120,20,0.5)",
    }}>
      {/* Motif gravé tressé */}
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:"repeating-linear-gradient(45deg,rgba(100,70,10,0.07) 0px,rgba(100,70,10,0.07) 1px,transparent 1px,transparent 8px),repeating-linear-gradient(-45deg,rgba(100,70,10,0.07) 0px,rgba(100,70,10,0.07) 1px,transparent 1px,transparent 8px)",
      }}/>
      {/* Bordure intérieure ornementale */}
      <div style={{
        position:"absolute",inset:3,
        border:"1px solid rgba(180,120,20,0.3)",
        borderRadius:4,
      }}/>
      {/* Points dorés */}
      {dots.map(([cx,cy],i) => (
        <div key={i} style={{
          position:"absolute",
          left: cx + "%", top: cy + "%",
          transform: "translate(-50%,-50%)",
          width: 9, height: 9,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #fff9e6, #FCD34D 40%, #C9941A)",
          boxShadow: "0 0 5px rgba(252,211,77,0.6), 0 1px 2px rgba(0,0,0,0.5)",
        }}/>
      ))}
    </div>
  );
}

// ── Cube 3D CSS ──────────────────────────────────────────────────
const S = 54; // taille du cube
const H = S / 2;

function Die({ rolling, value = 1, delay = 0 }) {
  const [rot, setRot] = useState({ x: 20, y: 30 });
  const [settling, setSettling] = useState(false);
  const rafRef = useRef(null);
  const t0Ref  = useRef(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (!rolling) {
      // S'orienter vers la bonne face
      const target = REST[value] || REST[1];
      setSettling(true);
      setRot(target);
      const tid = setTimeout(() => setSettling(false), 550);
      return () => clearTimeout(tid);
    }

    // Lancer : ~1800ms, easing sinusoïdal
    const DURATION = 1800;
    const TURNS = 3.5 + delay * 0.5;
    t0Ref.current = null;

    function frame(ts) {
      if (!t0Ref.current) t0Ref.current = ts;
      const p = Math.min((ts - t0Ref.current) / DURATION, 1);
      // ease out cubic
      const e = 1 - Math.pow(1 - p, 3);
      const wobble = Math.sin(p * Math.PI);
      setRot({
        x: 20  + TURNS * 360 * e + wobble * 25 * Math.sin(ts / 170),
        y: 30  + TURNS * 360 * e * 1.4 + wobble * 18 * Math.cos(ts / 140),
      });
      if (p < 1) rafRef.current = requestAnimationFrame(frame);
    }

    // Délai avant de démarrer ce dé (pour décalage visuel)
    const tid = setTimeout(() => {
      rafRef.current = requestAnimationFrame(frame);
    }, delay * 220);

    return () => {
      clearTimeout(tid);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [rolling, value, delay]);

  const transition = settling
    ? { transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)" }
    : {};

  return (
    <div style={{ width: S, height: S, perspective: S * 5, flexShrink: 0 }}>
      <div style={{
        width: S, height: S,
        position: "relative",
        transformStyle: "preserve-3d",
        transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        filter: rolling
          ? "drop-shadow(0 3px 8px rgba(0,0,0,0.9))"
          : "drop-shadow(0 6px 16px rgba(0,0,0,0.95)) drop-shadow(0 0 8px rgba(252,211,77,0.25))",
        ...transition,
      }}>
        <Face value={1} transform={`translateZ(${H}px)`}/>
        <Face value={6} transform={`rotateY(180deg) translateZ(${H}px)`}/>
        <Face value={2} transform={`rotateY(-90deg) translateZ(${H}px)`}/>
        <Face value={5} transform={`rotateY(90deg) translateZ(${H}px)`}/>
        <Face value={3} transform={`rotateX(90deg) translateZ(${H}px)`}/>
        <Face value={4} transform={`rotateX(-90deg) translateZ(${H}px)`}/>
      </div>
    </div>
  );
}

// ── Ligne de dés + total ─────────────────────────────────────────
function DiceRow({ label, color, d1, d2, bonus, rolling }) {
  const total = d1 + d2 + (bonus || 0);
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:6 }}>
      <span style={{ fontSize:13, color, fontWeight:700, minWidth:30, textAlign:"right" }}>
        {label}
      </span>
      <Die rolling={rolling} value={d1} delay={0}/>
      <span style={{ fontSize:11, color:"#475569" }}>+</span>
      <Die rolling={rolling} value={d2} delay={1}/>
      {(bonus||0) !== 0 && (
        <span style={{ fontSize:13, color: bonus > 0 ? "#22C55E" : "#EF4444" }}>
          {bonus > 0 ? "+" : ""}{bonus}
        </span>
      )}
      <span style={{ fontSize:12, color:"#475569" }}>=</span>
      <span style={{
        fontSize:20, fontWeight:900, color:"#FCD34D",
        fontFamily:"'BaronNeue','Black Ops One',serif",
        textShadow: rolling ? "none" : "0 0 10px rgba(252,211,77,0.5)",
        minWidth:26, textAlign:"center",
        opacity: rolling ? 0.3 : 1,
        transition: "opacity 0.4s",
      }}>
        {rolling ? "?" : total}
      </span>
    </div>
  );
}

// ── Export principal — interface identique à l'original ──────────
// props : { dice }
// dice.rolling = true pendant l'animation (optionnel, défaut false)
export default function DiceDisplay({ dice }) {
  if (!dice) return null;
  var d = dice;
  // rolling = true = dés en train de tourner (résultat masqué)
  var rolling = !!d.rolling;

  return (
    <div className="anim-slide" style={{ marginBottom: 8 }}>

      {/* Cible neutre */}
      {d.neutral && (
        <div style={{ fontSize:14, color:"#94A3B8", marginBottom:10, textAlign:"center" }}>
          Objectif :{" "}
          <strong style={{ color:"#FCD34D", fontSize:16 }}>&gt; {d.target}</strong>
        </div>
      )}

      {/* Nom ennemi PvP */}
      {!d.neutral && d.eName && (
        <div style={{ fontSize:13, color:"#94A3B8", marginBottom:10, textAlign:"center" }}>
          Duel contre{" "}
          <strong style={{ color:"#EF4444" }}>{d.eName}</strong>
        </div>
      )}

      {/* Dés attaquant */}
      <DiceRow
        label="Vous"
        color="#3B82F6"
        d1={d.myD1} d2={d.myD2}
        bonus={d.myBonus || 0}
        rolling={rolling}
      />

      {/* Dés défenseur PvP */}
      {!d.neutral && d.eD1 && (
        <DiceRow
          label="Déf."
          color="#EF4444"
          d1={d.eD1} d2={d.eD2}
          bonus={d.eBonus || 0}
          rolling={rolling}
        />
      )}

    </div>
  );
}
