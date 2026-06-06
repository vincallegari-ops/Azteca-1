import { useState, useEffect, useRef } from "react";
import {BARON_FONT} from "../../constant/assets.js";
import {SOLEIL_AZTEC, CLAN_BTN_EAGLE, CLAN_BTN_JAGUAR, CLAN_BTN_SNAKE, CLAN_BTN_PIRANHA,
        P_JOUEUR, P_MOCTE, P_NEZA, P_HUITZ,
        HEX_EAGLE, HEX_JAGUAR, HEX_SNAKE, HEX_PIRANHA, HEX_PAYSAN,
        IMG_TOUR, IMB_BANQUE, IMG_CASERNE}
 from "../../constant/assets.js";

// ── Tableau combat ───────────────────────────────────────────────
function CombatTable() {
  const rows = [
    { ecart: "Égalité (0-1)",   bonusDef: "+2",  pertesVic: "-3 att",  pertesDef: "-2 déf" },
    { ecart: "Avantage (2-5)",  bonusDef: "+1",  pertesVic: "-2 att",  pertesDef: "-3 déf" },
    { ecart: "Supériorité (6-9)",bonusDef: "0",  pertesVic: "-2 att",  pertesDef: "-4 déf" },
    { ecart: "Domination (10+)", bonusDef: "-1", pertesVic: "-1 att",  pertesDef: "-6 déf" },
  ];
  const th = {
    fontFamily: "'BaronNeue','Black Ops One',serif",
    fontSize: 10,
    color: "#64748B",
    letterSpacing: "0.06em",
    padding: "6px 8px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    whiteSpace: "nowrap",
  };
  const td = {
    fontSize: 11,
    color: "#CBD5E1",
    fontFamily: "Georgia, serif",
    padding: "6px 8px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  };
  return (
    <div style={{ overflowX: "auto", marginTop: 10 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>Écart d'armée</th>
            <th style={th}>Bonus déf.</th>
            <th style={{ ...th, color: "#86EFAC" }}>Pertes victoire</th>
            <th style={{ ...th, color: "#FCA5A5" }}>Pertes défaite</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ ...td, textAlign: "left", color: "#94A3B8" }}>{r.ecart}</td>
              <td style={{ ...td, color: r.bonusDef.startsWith("+") ? "#FCA5A5" : r.bonusDef === "0" ? "#94A3B8" : "#86EFAC" }}>{r.bonusDef}</td>
              <td style={{ ...td, color: "#86EFAC" }}>{r.pertesVic}</td>
              <td style={{ ...td, color: "#FCA5A5" }}>{r.pertesDef}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 10, color: "#475569", fontFamily: "Georgia,serif", marginTop: 6, marginBottom: 0 }}>
        * Écart = armée attaquante − armée défenseure. Bonus déf. = ajout au jet de dés défenseur.
      </p>
    </div>
  );
}

// ── Section générique ────────────────────────────────────────────
function Section({ section }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 12,
    }}>
      <div style={{ marginBottom: 10 }}>
        <span style={{
          fontFamily: "'BaronNeue','Black Ops One',serif",
          fontSize: 14,
          color: section.color,
          letterSpacing: "0.08em",
        }}>
          {section.title}
        </span>
      </div>

      {/* Images inline optionnelles */}
      {section.images && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
          {section.images.map((img, i) => (
            <img key={i} src={img.src} alt={img.alt || ""}
              style={{ width: img.w || 44, height: img.h || 44, objectFit: "contain" }}
            />
          ))}
        </div>
      )}

      {section.text && (
        <p style={{
          fontSize: 13,
          color: "#CBD5E1",
          lineHeight: 1.65,
          margin: "0 0 10px 0",
          fontFamily: "Georgia, serif",
        }}>
          {section.text}
        </p>
      )}

      {section.items && section.items.map((item, i) => (
        <div key={i} style={{
          display: "flex", gap: 8, alignItems: "flex-start",
          marginBottom: i < section.items.length - 1 ? 8 : 0,
          paddingLeft: 4,
        }}>
          {item.img && (
            <img src={item.img} alt=""
              style={{ width: 28, height: 28, objectFit: "contain", flexShrink: 0, marginTop: 1 }}
            />
          )}
          {!item.img && (
            <div style={{
              width: 3, flexShrink: 0, marginTop: 6,
              height: 3, borderRadius: "50%",
              background: section.color,
            }}/>
          )}
          <div style={{ lineHeight: 1.55 }}>
            <span style={{
              fontFamily: "'BaronNeue','Black Ops One',serif",
              fontSize: 12,
              color: section.color,
              letterSpacing: "0.04em",
            }}>
              {item.label}
            </span>
            <span style={{
              fontSize: 12,
              color: "#94A3B8",
              fontFamily: "Georgia, serif",
            }}>
              {" — "}{item.desc}
            </span>
          </div>
        </div>
      ))}

      {section.table && <CombatTable />}
    </div>
  );
}

// ── Pages ────────────────────────────────────────────────────────
function getPages() {
  return [

    // PAGE 1
    {
      pageTitle: "Le jeu",
      sections: [
        {
          title: "Objectif",
          color: "#FCD34D",
          images: [{ src: SOLEIL_AZTEC, w: 52, h: 52 }],
          text: "Dominez la carte en 15 tours. Chaque tuile que vous contrôlez rapporte des points égaux à sa taille. Le joueur avec le score le plus élevé à la fin du tour 15 gagne.",
        },
        {
          title: "Choix du clan",
          color: "#F97316",
          items: [
            {
              img: CLAN_BTN_JAGUAR,
              label: "Jaguar",
              desc: "Choisissez parmi Jaguar, Aigle, Piranha ou Serpent. Votre clan détermine votre couleur sur la carte.",
            },
            {
              img: CLAN_BTN_EAGLE,
              label: "Nom",
              desc: "Donnez un nom à votre chef. Il apparaîtra tout au long de la partie.",
            },
          ],
          extraImages: null,
        },
        {
          title: "Révélation des adversaires",
          color: "#38BDF8",
          images: [
            { src: P_JOUEUR, w: 52, h: 52 },
            { src: P_MOCTE, w: 52, h: 52 },
            { src: P_NEZA, w: 52, h: 52 },
            { src: P_HUITZ, w: 52, h: 52 },
          ],
          text: "Après votre sélection, 3 adversaires IA se révèlent un par un. Chacun possède une stratégie propre : certains ciblent le leader, d'autres accumulent discrètement avant de frapper.",
          items: [
            { label: "Ordre de passage", desc: "Tiré aléatoirement. Le 1er joueur reçoit +2 or de compensation, le 2e +1 or." },
          ],
        },
      ],
    },

    // PAGE 2
    {
      pageTitle: "Les tours",
      sections: [
        {
          title: "Tour 0 — Fondation",
          color: "#22C55E",
          text: "Avant le tour 1, chaque joueur choisit sa capitale dans l'ordre inverse du tour de jeu : le dernier à jouer fonde en premier.",
          items: [
            { label: "Capitale", desc: "La tuile fondée démarre avec une Caserne et une Banque déjà construites." },
            { label: "Coût", desc: "La fondation coûte autant que la taille de la tuile. Choisissez une tuile dans votre budget." },
            { label: "Restriction", desc: "Impossible de fonder sur un temple (tuile désert)." },
          ],
        },
        {
          title: "Tours 1 à 15 — Les 3 phases",
          color: "#38BDF8",
          items: [
            { label: "1. Attaque / Transfert", desc: "Sélectionnez une de vos tuiles (armée ≥ 2) puis cliquez une tuile adjacente pour attaquer ou envoyer des soldats vers une tuile alliée." },
            { label: "2. Collecte", desc: "Vos casernes lèvent des soldats et vos banques génèrent de l'or automatiquement si les conditions sont remplies." },
            { label: "3. Construction", desc: "Dépensez votre or pour construire un bâtiment sur une tuile que vous contrôlez." },
          ],
        },
        {
          title: "Précisions importantes",
          color: "#F97316",
          items: [
            { label: "Tour 1", desc: "1 seule action d'attaque ou de transfert (au lieu de 2 à partir du tour 2)." },
            { label: "Tours 1 à 4", desc: "Les attaques entre joueurs sont interdites. Seules les tuiles neutres peuvent être attaquées." },
            { label: "Après une victoire", desc: "Choisissez comment répartir vos soldats entre la tuile d'origine et la tuile conquise." },
            { label: "Échec d'attaque", desc: "En cas d'échec, votre action est terminée. Vous ne pouvez plus attaquer ce tour." },
          ],
        },
      ],
    },

    // PAGE 3
    {
      pageTitle: "Combats & Bâtiments",
      sections: [
        {
          title: "Résolution des combats",
          color: "#A78BFA",
          images: [
            { src: HEX_PAYSAN, w: 56, h: 56},
            { src: HEX_EAGLE, w: 56, h: 56},
            { src: HEX_JAGUAR, w: 56, h: 56},
            { src: HEX_SNAKE, w: 56, h: 56},
            { src: HEX_PIRANHA, w: 56, h: 56},
          ],
          text: "Chaque camp lance 2 dés. Le total le plus élevé l'emporte. Sur une tuile neutre, pas de dés adverses : vous devez simplement dépasser un seuil calculé depuis la taille de la tuile.",
          items: [
            { label: "Tour de défense", desc: "+1 au jet du défenseur sur la tuile protégée. Détruite si la tuile est capturée." },
          ],
          table: true,
        },
        {
          title: "Coûts & Effets des bâtiments",
          color: "#22C55E",
          items: [
            {
              img: IMG_TOUR,
              label: "Tour  —  5 or",
              desc: "+1 au jet de dés défenseur sur cette tuile.",
            },
            {
              img: IMG_CASERNE,
              label: "Caserne  —  8 or",
              desc: "Lève des soldats tous les 3 tours. Quantité : jusqu'à 5 soldats si la tuile est adjacente à votre capitale, jusqu'à 3 sinon.",
            },
            {
              img: IMG_BANQUE,
              label: "Banque  —  8 or",
              desc: "Génère de l'or tous les 3 tours. Même calcul de quantité que la caserne. Rapporte aussi +3 or passif tous les 2 tours.",
            },
          ],
        },
      ],
    },

  ];
}

export default function Tutorial({ onBack, fromGame }) {
  const [page, setPage] = useState(0);
  const PAGES = getPages();
  const current = PAGES[page];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#0a0a0a",
      color: "#E2E8F0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowY: "auto",
      padding: "20px 16px 32px",
      boxSizing: "border-box",
    }}>
      <style>{`@font-face { font-family: 'BaronNeue'; src: url('${BARON_FONT}') format('opentype'); }`}</style>

      <div style={{ maxWidth: 480, width: "100%", margin: "0 auto" }}>

        <h1 style={{
          fontFamily: "'BaronNeue','Black Ops One',serif",
          fontSize: 26,
          color: "#D97706",
          textAlign: "center",
          marginBottom: 4,
          letterSpacing: "0.1em",
        }}>
          AZTECA
        </h1>

        {/* Indicateur de page */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
          {PAGES.map((_, i) => (
            <div key={i} onClick={() => setPage(i)} style={{
              width: i === page ? 24 : 8,
              height: 8, borderRadius: 4,
              background: i === page ? "#D97706" : "#334155",
              cursor: "pointer", transition: "all 0.3s",
            }}/>
          ))}
        </div>

        <p style={{
          textAlign: "center", fontSize: 12, color: "#64748B",
          fontFamily: "'BaronNeue','Black Ops One',serif",
          marginBottom: 16, marginTop: 0,
          letterSpacing: "0.14em", textTransform: "uppercase",
        }}>
          {current.pageTitle}
        </p>

        {current.sections.map((s, i) => <Section key={i} section={s} />)}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
          <button onClick={onBack} style={{
            background: "#1E293B", color: "#94A3B8",
            border: "1px solid #334155", padding: "11px 20px",
            borderRadius: 10, fontSize: 12,
            fontFamily: "'BaronNeue','Black Ops One',serif",
            cursor: "pointer", letterSpacing: "0.1em",
          }}>
            {fromGame ? "RETOUR A LA PARTIE" : "RETOUR AU MENU"}
          </button>

          {page > 0 && (
            <button onClick={() => setPage(p => p - 1)} style={{
              background: "#1E293B", color: "#94A3B8",
              border: "1px solid #334155", padding: "11px 20px",
              borderRadius: 10, fontSize: 12,
              fontFamily: "'BaronNeue','Black Ops One',serif",
              cursor: "pointer", letterSpacing: "0.1em",
            }}>
              PRECEDENT
            </button>
          )}

          {page < PAGES.length - 1 && (
            <button onClick={() => setPage(p => p + 1)} style={{
              background: "linear-gradient(135deg,#D97706,#B45309)",
              color: "#FFF", border: "none", padding: "11px 24px",
              borderRadius: 10, fontSize: 12,
              fontFamily: "'BaronNeue','Black Ops One',serif",
              cursor: "pointer", letterSpacing: "0.1em",
            }}>
              SUIVANT
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
