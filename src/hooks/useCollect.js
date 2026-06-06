import { capArmy, effAmount, hexNbV } from "../constants/game.js";
 
export function useCollect({ ti, ps, tn, mRows, mCols, sTi, sPs, setFloatNotifs, setCollectIdx, collectingRef, collectGenRef, notifIdRef, COLORS }) {
 
  function canLevy(t, turn) {
    if (t.isDesert) return false;
    if (t.heldSince >= turn || t.leviedThis) return false;
    if (turn - t.lastLevy < 3) return false;
    return t.barracks > 0;
  }
 
  function canTax(t, turn) {
    if (t.isDesert) return false;
    if (t.heldSince >= turn || t.leviedThis) return false;
    if (turn - t.lastTax < 3) return false;
    return t.bank > 0;
  }
 
  function autoCollect(tid, type) {
    var t = ti[tid]; if (!t) return;
    var amt = effAmount(ti, tid, 0, mRows, mCols);
    var ni = ti.map(function(i) { return Object.assign({}, i); });
    var np = ps.map(function(p) { return Object.assign({}, p); });
    var curTn = tn;
 
    if (type === "army") {
      ni[tid] = Object.assign({}, t, { army: capArmy(t.army + amt, t.size), lastLevy: curTn, leviedThis: true });
      sTi(ni);
    } else {
      ni[tid] = Object.assign({}, t, { lastTax: curTn, leviedThis: true });
      np[0] = Object.assign({}, np[0], { gold: np[0].gold + amt });
      sTi(ni); sPs(np);
    }
 
    notifIdRef.current++;
    var nid = notifIdRef.current;
    var capturedGen = collectGenRef.current;
    var clanIdx = Math.max(0, COLORS.findIndex(function(c) { return c.h === ps[0].color; })) + 1;
    var playerCol = ps[0] ? ps[0].color : "#FCD34D";
 
    setFloatNotifs(function(prev) {
      return prev.concat([{ id: nid, tileId: tid, type: type, amount: amt, clanIdx: clanIdx, static: true, color: playerCol }]);
    });
 
    setTimeout(function() {
      if (collectGenRef.current !== capturedGen) return;
      setFloatNotifs(function(prev) { return prev.filter(function(n) { return n.id !== nid; }); });
    }, 1000);
 
    setTimeout(function() {
      if (collectGenRef.current !== capturedGen) return;
      collectingRef.current = false;
      setCollectIdx(function(i) { return i + 1; });
    }, 1000);
  }
 
  return { canLevy, canTax, autoCollect };
}
