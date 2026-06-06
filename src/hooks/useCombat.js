import { d6, defB, capArmy } from "../constants/game.js";
 
export function useCombat({ ti, ps, tn, aCt, sACt, aF, sAF, sTi, sPop, sGP, sSl, sAf, setTrMode, setPendingAtk, setDiceAnim, setDiceResult, diceResult, setPendingDistrib, startLevy, endTurn, MAX_TURNS }) {
 
  function nO(x) { return Math.max(2, x.army); }
 
  function confirmAtk(pendingAtk) {
    if (!pendingAtk) return;
    var tI = pendingAtk.tI, fI = pendingAtk.fI;
    var tg = ti[tI], fr = ti[fI];
    var d1a = d6(), d2a = d6(), mR = d1a + d2a;
    var dI = null;
 
    if (tg.owner === null) {
      var aj = nO(tg);
      var defBonusN = defB(tg.army, fr.army), wallBonusN = tg.wall ? 1 : 0;
      var totalBonusN = Math.min(0, defBonusN + wallBonusN);
      var adjustedTarget = aj + totalBonusN;
      dI = { myD1: d1a, myD2: d2a, myBonus: 0, target: adjustedTarget, neutral: true, gap: fr.army - tg.army, atkLoss: 0, defLoss: 0, converted: Math.max(1, Math.floor(tg.size / 2)), eDefBonus: defBonusN, eWallBonus: wallBonusN, totalBonus: totalBonusN };
    } else {
      var gap0 = fr.army - tg.army;
      var defBonus = defB(tg.army, fr.army), wallBonus = tg.wall ? 1 : 0, db2 = defBonus + wallBonus;
      var d1b = d6(), d2b = d6(), dR2 = d1b + d2b + db2;
      var en = ps[tg.owner];
      dI = { myD1: d1a, myD2: d2a, myBonus: 0, eD1: d1b, eD2: d2b, eBonus: db2, eDefBonus: defBonus, eWallBonus: wallBonus, totalBonus: db2, eName: en ? en.name : "?", neutral: false, dR: dR2, gap: gap0 };
    }
 
    setDiceAnim(true);
    setDiceResult(null);
    setTimeout(function() {
      setDiceAnim(false);
      setDiceResult({ dI: dI, tI: tI, fI: fI, mR: mR });
    }, 2000);
  }
 
  function applyAtk() {
    if (!diceResult) return;
    var dI = diceResult.dI, tI = diceResult.tI, fI = diceResult.fI, mR = diceResult.mR;
    var tg = ti[tI], fr = ti[fI];
    var ni = ti.map(function(i) { return Object.assign({}, i); });
    var won = false;
    var gap = dI.gap || 0;
 
    if (tg.owner === null) {
      var aj = dI.target;
      var at = Object.assign({}, tg.attempts || {}); at[0] = (at[0] || 0) + 1;
      if (mR > aj) {
        var converted = Math.max(1, Math.floor(tg.size / 2));
        ni[fI] = Object.assign({}, fr, { army: fr.army });
        ni[tI] = Object.assign({}, tg, { owner: 0, army: converted, heldSince: tn, lastLevy: -99, lastTax: -99, attempts: {}, bType: null, bTurns: 0, isCapital: false });
        won = true;
      } else {
        ni[fI] = Object.assign({}, fr, { army: Math.max(0, fr.army - 2) });
        ni[tI] = Object.assign({}, tg, { army: Math.max(1, tg.army - 1), attempts: at });
      }
    } else {
      var dR = dI.dR;
      var atkLoss, defLoss;
      if (gap < 2)       { atkLoss = 3; defLoss = 2; }
      else if (gap <= 5)  { atkLoss = 2; defLoss = 3; }
      else if (gap <= 10) { atkLoss = 2; defLoss = 4; }
      else                { atkLoss = 1; defLoss = 6; }
 
      if (mR > dR) {
        var oldOwner = tg.owner;
        ni[fI] = Object.assign({}, fr, { army: Math.max(0, fr.army - atkLoss) });
        ni[tI] = Object.assign({}, tg, { owner: 0, army: tg.size, heldSince: tn, lastLevy: -99, lastTax: -99, wall: 0, attempts: {}, bType: null, bTurns: 0, isCapital: false });
        won = true;
        if (tg.isCapital) {
          var oppOwned = ni.filter(function(x) { return x.owner === oldOwner; });
          if (oppOwned.length > 0) {
            var pick = oppOwned[Math.floor(Math.random() * oppOwned.length)];
            ni[pick.id] = Object.assign({}, ni[pick.id], { isCapital: true });
          }
        }
      } else {
        ni[fI] = Object.assign({}, fr, { army: Math.max(0, fr.army - atkLoss) });
        ni[tI] = Object.assign({}, tg, { army: Math.max(0, tg.army - defLoss), wall: 0 });
      }
    }
 
    sTi(ni);
    var newACt = aCt + 1;
    sACt(newACt);
    var didFail = !won;
    if (didFail) sAF(true);
    setPendingAtk(null); setDiceResult(null); setDiceAnim(false);
 
    var mx2 = tn === 1 ? 1 : 2;
    if (won) {
      var remainArmy = ni[fI].army;
      if (remainArmy > 0) {
        setPendingDistrib({ fI: fI, tI: tI, total: remainArmy, newACt: newACt, mx2: mx2 });
        return;
      }
      sSl(null); sAf(null); setTrMode(false);
      if (newACt >= mx2 || aF) {
        if (tn === MAX_TURNS) { sGP("done"); endTurn(); }
        else { startLevy(tn, ni, 400); }
      }
    } else {
      sSl(null); sAf(null); setTrMode(false);
      if (didFail || newACt >= mx2 || aF) {
        if (tn === MAX_TURNS) { sGP("done"); endTurn(); }
        else { startLevy(tn, ni, 900); }
      }
    }
  }
 
  return { confirmAtk, applyAtk, nO };
}
