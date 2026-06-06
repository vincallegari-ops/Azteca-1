import { d2x6, defB, capArmy, effAmount, hexNbV } from "../constants/game.js";
 
export function useAI({ mRows, mCols, setAiQueue, setAiIdx, aiDoneCbRef, BN }) {
 
  function nO(x) { return Math.max(2, x.army); }
 
  function aiTiles(ni, p) { return ni.filter(function(t) { return t.owner === p; }); }
 
  function aiAdj(ni, my, rows, cols) {
    var ms = new Set(my.map(function(i) { return i.id; })), adj = [];
    my.forEach(function(t) {
      hexNbV(t.id, rows, cols).forEach(function(n) {
        if (!ms.has(n) && ni[n] && !ni[n].isDesert && !ni[n].isRemoved) adj.push({ target: n, from: t.id });
      });
    });
    return adj;
  }
 
  function aiCapture(ni, np, p, from, tgt, curTn, steps) {
    var fr = ni[from], tg = ni[tgt], mR = d2x6();
    if (tg.owner === p) return false;
    var gap = fr.army - tg.army;
 
    if (tg.owner === null) {
      var nb = defB(fr.army, tg.army), aO = nO(tg) + nb;
      var at2 = Object.assign({}, tg.attempts || {}); at2[p] = (at2[p] || 0) + 1;
      if (mR > aO) {
        ni[from] = Object.assign({}, fr, { army: fr.army });
        ni[tgt]  = Object.assign({}, tg, { owner: p, army: tg.size, heldSince: curTn, lastLevy: -99, lastTax: -99, attempts: {}, bType: null, bTurns: 0, isCapital: false });
        steps.push({ text: np[p].name + " conquiert " + tg.name, color: np[p].color, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
        return true;
      }
      ni[from] = Object.assign({}, fr, { army: Math.max(0, fr.army - 2) });
      ni[tgt]  = Object.assign({}, tg, { army: Math.max(1, tg.army - 1), attempts: at2 });
      steps.push({ text: np[p].name + " echoue sur " + tg.name, color: np[p].color, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
      return false;
    }
 
    var db2 = defB(fr.army, tg.army) + (tg.wall ? 1 : 0), dR = d2x6() + db2;
    var atkLoss, defLoss;
    if (gap < 2)       { atkLoss = 3; defLoss = 2; }
    else if (gap <= 5)  { atkLoss = 2; defLoss = 3; }
    else if (gap <= 10) { atkLoss = 2; defLoss = 4; }
    else                { atkLoss = 1; defLoss = 6; }
 
    if (mR > dR) {
      var old0 = tg.owner;
      ni[from] = Object.assign({}, fr, { army: Math.max(0, fr.army - atkLoss) });
      ni[tgt]  = Object.assign({}, tg, { owner: p, army: tg.size, heldSince: curTn, lastLevy: -99, lastTax: -99, wall: 0, attempts: {}, bType: null, bTurns: 0, isCapital: false });
      if (tg.isCapital) {
        var opp = ni.filter(function(x) { return x.owner === old0; });
        if (opp.length > 0) { var pp2 = opp[Math.floor(Math.random() * opp.length)]; ni[pp2.id] = Object.assign({}, ni[pp2.id], { isCapital: true }); }
      }
      steps.push({ text: np[p].name + " prend " + tg.name, color: np[p].color, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
      return true;
    }
    ni[from] = Object.assign({}, fr, { army: Math.max(0, fr.army - atkLoss) });
    ni[tgt]  = Object.assign({}, ni[tgt], { army: Math.max(0, ni[tgt].army - defLoss), wall: 0 });
    steps.push({ text: np[p].name + " échoue sur " + tg.name, color: np[p].color, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
    return false;
  }
 
  function aiLevy(ni, np, p, curTn, steps, COLORS) {
    var my = aiTiles(ni, p), levied = false, levFloats = [];
    var clanIdx = Math.max(0, COLORS.findIndex(function(c) { return c.h === np[p].color; })) + 1;
    my.forEach(function(t) {
      if (t.barracks > 0 && curTn - t.lastLevy >= 3 && t.heldSince < curTn) {
        var amt = effAmount(ni, t.id, p, mRows, mCols);
        ni[t.id] = Object.assign({}, ni[t.id], { army: capArmy(ni[t.id].army + amt, ni[t.id].size), lastLevy: curTn });
        levied = true; levFloats.push({ tileId: t.id, type: "army", amount: amt, clanIdx: clanIdx });
      }
    });
    if (levied) steps.push({ text: np[p].name + " leve des soldats", color: np[p].color, floats: levFloats, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
    return levied;
  }
 
  function aiTax(ni, np, p, curTn, steps, COLORS) {
    var my = aiTiles(ni, p), taxed = false, taxFloats = [];
    var clanIdx = Math.max(0, COLORS.findIndex(function(c) { return c.h === np[p].color; })) + 1;
    my.forEach(function(t) {
      if (t.bank > 0 && curTn - t.lastTax >= 3 && t.heldSince < curTn) {
        var amt = effAmount(ni, t.id, p, mRows, mCols);
        ni[t.id] = Object.assign({}, ni[t.id], { lastTax: curTn });
        np[p] = Object.assign({}, np[p], { gold: np[p].gold + amt });
        taxed = true; taxFloats.push({ tileId: t.id, type: "tax", amount: amt, clanIdx: clanIdx });
      }
    });
    if (taxed) steps.push({ text: np[p].name + " collecte de l'or", color: np[p].color, floats: taxFloats, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
    return taxed;
  }
 
  function aiBuild(ni, np, p, pref, steps) {
    if (np[p].gold < 5) return;
    var my = aiTiles(ni, p).filter(function(t) { return !t.bType && !t.isDesert; });
    if (!my.length) return;
    var tgt = my[0], bt2 = null;
    if (pref === "barracks" && my.find(function(t) { return !t.barracks; })) tgt = my.find(function(t) { return !t.barracks; });
    else if (pref === "bank" && my.find(function(t) { return !t.bank; })) tgt = my.find(function(t) { return !t.bank; });
    if (!tgt.barracks && np[p].gold >= 8) bt2 = "barracks";
    else if (!tgt.bank && np[p].gold >= 8) bt2 = "bank";
    else if (!tgt.wall && np[p].gold >= 5) bt2 = "wall";
    if (!bt2) return;
    var c2 = bt2 === "wall" ? 5 : 8;
    ni[tgt.id] = Object.assign({}, ni[tgt.id], { bType: bt2, bTurns: bt2 === "wall" ? 1 : 2 });
    np[p] = Object.assign({}, np[p], { gold: np[p].gold - c2 });
    steps.push({ text: np[p].name + " construit " + BN[bt2], color: np[p].color, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
  }
 
  function aiXfer(ni, np, p, tOwner, steps) {
    var my = aiTiles(ni, p), ms = new Set(my.map(function(t) { return t.id; }));
    var front = my.filter(function(t) { return hexNbV(t.id, mRows, mCols).some(function(n) { return ni[n] && (tOwner >= 0 ? ni[n].owner === tOwner : (ni[n].owner !== p && ni[n].owner !== null && !ni[n].isDesert)); }); });
    if (!front.length) front = my.filter(function(t) { return hexNbV(t.id, mRows, mCols).some(function(n) { return ni[n] && ni[n].owner === null && !ni[n].isDesert; }); });
    if (!front.length) return false;
    var fset = new Set(front.map(function(t) { return t.id; }));
    var interior = my.filter(function(t) { return !fset.has(t.id) && t.army > 2; });
    interior.sort(function(a, b) { return b.army - a.army; });
    if (!interior.length) return false;
    var src = interior[0];
    var destId = hexNbV(src.id, mRows, mCols).find(function(n) { return ms.has(n); });
    if (destId === undefined) return false;
    var amt = Math.max(1, Math.floor(ni[src.id].army * 0.5));
    if (ni[src.id].army - amt < 1) amt = ni[src.id].army - 1;
    if (amt < 1) return false;
    ni[src.id] = Object.assign({}, ni[src.id], { army: ni[src.id].army - amt });
    ni[destId] = Object.assign({}, ni[destId], { army: capArmy(ni[destId].army + amt, ni[destId].size) });
    steps.push({ text: np[p].name + " repositionne ses troupes", color: np[p].color, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
    return true;
  }
 
  function aiLeader(ni, np, excl) {
    var b = -1, bs = -1;
    for (var qi = 0; qi < np.length; qi++) {
      if (qi === excl) continue;
      var sc = ni.filter(function(t) { return t.owner === qi; }).reduce(function(s, t) { return s + t.size; }, 0);
      if (sc > bs) { bs = sc; b = qi; }
    }
    return b;
  }
 
  function doOneAi(p, ni, np, curTn, COLORS) {
    var steps = [], my = aiTiles(ni, p);
    if (!my.length) {
      steps.push({ text: np[p].name + " elimine.", color: np[p].color, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
      return { ni: ni, np: np, steps: steps };
    }
 
    my.forEach(function(t) {
      if (t.bType && t.bTurns > 0) {
        ni[t.id] = Object.assign({}, ni[t.id], { bTurns: ni[t.id].bTurns - 1 });
        if (ni[t.id].bTurns <= 0) {
          var bt = ni[t.id].bType;
          if (bt === "wall") ni[t.id].wall = 1;
          else if (bt === "barracks") ni[t.id].barracks = 1;
          else if (bt === "bank") ni[t.id].bank = 1;
          ni[t.id].bType = null;
        }
      }
    });
 
    var strat = np[p].strat || "raider";
    var adj = aiAdj(ni, my, mRows, mCols);
    var maxA = curTn === 1 ? 1 : 2, aOk = true;
    var noPvP = curTn <= 4, pvpDone = 0;
 
    if (strat === "raider") {
      aiXfer(ni, np, p, -1, steps);
      adj = aiAdj(ni, aiTiles(ni, p), mRows, mCols);
      for (var ak = 0; ak < maxA && aOk; ak++) {
        adj = aiAdj(ni, aiTiles(ni, p), mRows, mCols);
        var pvpR = noPvP || pvpDone >= 1 ? [] : adj.filter(function(a) { var tg = ni[a.target]; if (!tg || tg.owner === null || tg.owner === p || tg.isDesert) return false; return ni[a.from].army - tg.army >= 2 && ni[a.from].army >= 2; }).sort(function(a, b) { return (ni[b.from].army - ni[b.target].army) - (ni[a.from].army - ni[a.target].army); });
        var neutR = adj.filter(function(a) { var tg = ni[a.target]; return tg.owner === null && !tg.isDesert && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }).sort(function(a, b) { return ni[b.target].size - ni[a.target].size; });
        var isPvpR = !!(pvpR[0]); var tR = pvpR[0] || neutR[0];
        if (tR) { aOk = aiCapture(ni, np, p, tR.from, tR.target, curTn, steps); if (isPvpR) pvpDone++; } else aOk = false;
      }
      aiLevy(ni, np, p, curTn, steps, COLORS);
 
    } else if (strat === "endgame") {
      if (curTn <= 9) {
        for (var ak2 = 0; ak2 < maxA && aOk; ak2++) { adj = aiAdj(ni, aiTiles(ni, p), mRows, mCols); var nE = adj.filter(function(a) { var tg = ni[a.target]; return tg.owner === null && !tg.isDesert && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }).sort(function(a, b) { return ni[b.target].size - ni[a.target].size; }); if (nE.length && Math.random() < 0.75) aOk = aiCapture(ni, np, p, nE[0].from, nE[0].target, curTn, steps); else aOk = false; }
        aiLevy(ni, np, p, curTn, steps, COLORS); if (np[p].gold >= 8) aiBuild(ni, np, p, "barracks", steps);
      } else {
        var ldrE = aiLeader(ni, np, p); aiXfer(ni, np, p, ldrE, steps);
        for (var ak2b = 0; ak2b < maxA && aOk; ak2b++) { adj = aiAdj(ni, aiTiles(ni, p), mRows, mCols); var pvpE = noPvP || pvpDone >= 1 ? [] : adj.filter(function(a) { var tg = ni[a.target]; return (ldrE >= 0 ? tg.owner === ldrE : (tg.owner !== null && tg.owner !== p)) && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }); var neutE = adj.filter(function(a) { var tg = ni[a.target]; return tg.owner === null && !tg.isDesert && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }); var isPvpE = !!(pvpE[0]); var tE = pvpE[0] || neutE[0]; if (tE) { aOk = aiCapture(ni, np, p, tE.from, tE.target, curTn, steps); if (isPvpE) pvpDone++; } else aOk = false; }
        aiLevy(ni, np, p, curTn, steps, COLORS);
      }
 
    } else if (strat === "blitzkrieg") {
      adj = aiAdj(ni, aiTiles(ni, p), mRows, mCols);
      var armBZ = adj.filter(function(a) { var tg = ni[a.target]; return !tg.isDesert && (curTn < 12 ? tg.owner === null : true) && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }).sort(function(a, b) { return ni[b.target].size - ni[a.target].size; });
      var wonBZ = false, fromBZ = -1, tgtBZ = -1;
      if (armBZ.length) { fromBZ = armBZ[0].from; tgtBZ = armBZ[0].target; wonBZ = aiCapture(ni, np, p, fromBZ, tgtBZ, curTn, steps); }
      if (maxA >= 2 && wonBZ && tgtBZ >= 0 && ni[tgtBZ].owner === p) { var amt2 = Math.max(1, Math.floor(ni[fromBZ].army * 0.5)); if (ni[fromBZ].army - amt2 >= 1 && amt2 >= 1) { ni[fromBZ] = Object.assign({}, ni[fromBZ], { army: ni[fromBZ].army - amt2 }); ni[tgtBZ] = Object.assign({}, ni[tgtBZ], { army: capArmy(ni[tgtBZ].army + amt2, ni[tgtBZ].size) }); steps.push({ text: np[p].name + " avance ses troupes", color: np[p].color, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) }); } }
      aiLevy(ni, np, p, curTn, steps, COLORS);
 
    } else if (strat === "kingmaker") {
      var ldrK = aiLeader(ni, np, p); aiXfer(ni, np, p, ldrK, steps);
      for (var ak4 = 0; ak4 < maxA && aOk; ak4++) { adj = aiAdj(ni, aiTiles(ni, p), mRows, mCols); var pvpKraw = (!noPvP && pvpDone < 1) ? adj.filter(function(a) { var tg = ni[a.target]; return (ldrK >= 0 ? tg.owner === ldrK : (tg.owner !== null && tg.owner !== p)) && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }) : []; var pvpK = pvpKraw.filter(function(a) { return !(ni[a.target].owner === 0 && ldrK === 0) || Math.random() < 0.6; }); pvpK.sort(function(a, b) { return (ni[a.target].isCapital ? -1 : 1) || (ni[b.target].size - ni[a.target].size); }); var neutK = adj.filter(function(a) { var tg = ni[a.target]; return tg.owner === null && !tg.isDesert && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }); var isPvpK = !!(pvpK[0]); var tK = pvpK[0] || neutK[0]; if (tK) { aOk = aiCapture(ni, np, p, tK.from, tK.target, curTn, steps); if (isPvpK) pvpDone++; } else aOk = false; }
      aiLevy(ni, np, p, curTn, steps, COLORS); if (np[p].gold >= 8) aiBuild(ni, np, p, "barracks", steps);
 
    } else if (strat === "backstabber") {
      if (curTn <= 10) {
        for (var ak5 = 0; ak5 < maxA && aOk; ak5++) { adj = aiAdj(ni, aiTiles(ni, p), mRows, mCols); var nBS = adj.filter(function(a) { var tg = ni[a.target]; return tg.owner === null && !tg.isDesert && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }).sort(function(a, b) { return ni[b.target].size - ni[a.target].size; }); if (nBS.length && Math.random() < 0.8) aOk = aiCapture(ni, np, p, nBS[0].from, nBS[0].target, curTn, steps); else aOk = false; }
        aiLevy(ni, np, p, curTn, steps, COLORS); if (np[p].gold >= 8) aiBuild(ni, np, p, "barracks", steps);
      } else {
        aiXfer(ni, np, p, 0, steps);
        for (var ak5b = 0; ak5b < maxA && aOk; ak5b++) { adj = aiAdj(ni, aiTiles(ni, p), mRows, mCols); var pvpBS = adj.filter(function(a) { var tg = ni[a.target]; return tg.owner === 0 && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }).sort(function(a, b) { return (ni[a.target].isCapital ? -1 : 1) || (ni[b.target].size - ni[a.target].size); }); var neutBS = adj.filter(function(a) { var tg = ni[a.target]; return tg.owner === null && !tg.isDesert && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }); var isPvpBS = !!(pvpBS[0]); var tBS = pvpBS[0] || neutBS[0]; if (tBS) { aOk = aiCapture(ni, np, p, tBS.from, tBS.target, curTn, steps); if (isPvpBS) pvpDone++; } else aOk = false; }
        aiLevy(ni, np, p, curTn, steps, COLORS);
      }
 
    } else {
      // wave
      var ws = np[p].waveState || { ph: 0, ct: 0 };
      var wph = ws.ph, wct = ws.ct;
      if (curTn >= 12) wph = 1;
      if (wph === 0) {
        aiLevy(ni, np, p, curTn, steps, COLORS); aiTax(ni, np, p, curTn, steps, COLORS);
        if (np[p].gold >= 8) aiBuild(ni, np, p, "barracks", steps);
        if (np[p].gold >= 8) aiBuild(ni, np, p, "bank", steps);
        wct++; if (wct >= 2) { wph = 1; wct = 0; }
      } else {
        aiXfer(ni, np, p, -1, steps);
        for (var ak6 = 0; ak6 < maxA && aOk; ak6++) { adj = aiAdj(ni, aiTiles(ni, p), mRows, mCols); var pvpW = noPvP || pvpDone >= 1 ? [] : adj.filter(function(a) { var tg = ni[a.target]; return tg.owner !== null && tg.owner !== p && !tg.isDesert && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }); var neutW = adj.filter(function(a) { var tg = ni[a.target]; return tg.owner === null && !tg.isDesert && ni[a.from].army >= tg.army && ni[a.from].army >= 2; }); pvpW.sort(function(a, b) { return ni[b.target].size - ni[a.target].size; }); neutW.sort(function(a, b) { return ni[b.target].size - ni[a.target].size; }); var isPvpW = !!(pvpW[0]); var tW = pvpW[0] || neutW[0]; if (tW) { aOk = aiCapture(ni, np, p, tW.from, tW.target, curTn, steps); if (isPvpW) pvpDone++; } else aOk = false; }
        aiLevy(ni, np, p, curTn, steps, COLORS); wct++; if (wct >= 2) { wph = 0; wct = 0; }
      }
      np[p] = Object.assign({}, np[p], { waveState: { ph: wph, ct: wct } });
    }
 
    if (!steps.length) steps.push({ text: np[p].name + " consolide ses positions", color: np[p].color, tiles: ni.map(function(x) { return Object.assign({}, x); }), players: np.map(function(x) { return Object.assign({}, x); }) });
    return { ni: ni, np: np, steps: steps };
  }
 
  function playAiSteps(aiPlayers, startTiles, startPlayers, curTn, callback, COLORS) {
    var ni = startTiles.map(function(x) { return Object.assign({}, x); });
    var np = startPlayers.map(function(x) { return Object.assign({}, x); });
    var allSteps = [];
    for (var i = 0; i < aiPlayers.length; i++) {
      var k = aiPlayers[i]; if (k === 0) continue;
      var rs = doOneAi(k, ni, np, curTn, COLORS); ni = rs.ni; np = rs.np; allSteps = allSteps.concat(rs.steps);
    }
    if (allSteps.length > 0) {
      aiDoneCbRef.current = function() { callback(ni, np); };
      setAiQueue(allSteps);
      setAiIdx(0);
    } else { callback(ni, np); }
    return { ni: ni, np: np };
  }
 
  return { doOneAi, playAiSteps };
}
