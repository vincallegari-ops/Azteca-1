import { useState, useRef } from "react";
import { genMap } from "../constants/maps.js";
 
export function useGameState() {
  var u = useState;
 
  var a1 = u("splash"),      ph = a1[0],    sPh = a1[1];
  var a2 = u(""),            pN = a2[0],    sPN = a2[1];
  var a3 = u(0),             pC = a3[0],    sPC = a3[1];
 
  var _m = u(function() { return genMap(); });
  var mapData = _m[0], setMapData = _m[1];
  var ti = mapData.tiles, mRows = mapData.rows, mCols = mapData.cols;
 
  function sTi(newTiles) {
    setMapData(function(prev) {
      return { tiles: newTiles, rows: prev.rows, cols: prev.cols, variant: prev.variant };
    });
  }
 
  var a5 = u([]),    ps = a5[0],    sPs = a5[1];
  var a6 = u([]),    rv = a6[0],    sRv = a6[1];
  var _po = u([]),   playOrder = _po[0],    setPlayOrder = _po[1];
  var _fo = u([]),   foundingOrder = _fo[0], setFoundingOrder = _fo[1];
  var a7 = u(0),     tn = a7[0],    sTn = a7[1];
  var a8 = u(null),  sl = a8[0],    sSl = a8[1];
  var a9 = u(null),  af = a9[0],    sAf = a9[1];
  var b0s = u("attack"), gP = b0s[0], sGP = b0s[1];
  var b1s = u(0),    aCt = b1s[0],  sACt = b1s[1];
  var b2s = u(false), aF = b2s[0],  sAF = b2s[1];
  var _trMode = u(false), trMode = _trMode[0], setTrMode = _trMode[1];
  var b4s = u(null), pop = b4s[0],  sPop = b4s[1];
  var _aiQ = u([]),  aiQueue = _aiQ[0],  setAiQueue = _aiQ[1];
  var _aiIdx = u(-1), aiIdx = _aiIdx[0], setAiIdx = _aiIdx[1];
 
  var _turnAnn = u(null),    turnAnn = _turnAnn[0],    setTurnAnn = _turnAnn[1];
  var _atkErr = u(null),     atkErr = _atkErr[0],      setAtkErr = _atkErr[1];
  var _phaseReady = u(false), phaseReady = _phaseReady[0], setPhaseReady = _phaseReady[1];
  var _passCD = u(0),        passCd = _passCD[0],      setPassCd = _passCD[1];
  var _quitConfirm = u(false), quitConfirm = _quitConfirm[0], setQuitConfirm = _quitConfirm[1];
  var _pendingAtk = u(null), pendingAtk = _pendingAtk[0], setPendingAtk = _pendingAtk[1];
  var _diceAnim = u(false),  diceAnim = _diceAnim[0],  setDiceAnim = _diceAnim[1];
  var _diceResult = u(null), diceResult = _diceResult[0], setDiceResult = _diceResult[1];
  var _pendingET = u(false), pendingET = _pendingET[0], setPendingET = _pendingET[1];
  var _pendingDistrib = u(null), pendingDistrib = _pendingDistrib[0], setPendingDistrib = _pendingDistrib[1];
  var _pendingTransfer = u(null), pendingTransfer = _pendingTransfer[0], setPendingTransfer = _pendingTransfer[1];
  var _hta = u(false),       humanTurnActive = _hta[0], setHumanTurnActive = _hta[1];
  var _floatNotifs = u([]),  floatNotifs = _floatNotifs[0], setFloatNotifs = _floatNotifs[1];
  var _collectChoice = u(null), collectChoice = _collectChoice[0], setCollectChoice = _collectChoice[1];
  var _collectQueue = u([]), collectQueue = _collectQueue[0], setCollectQueue = _collectQueue[1];
  var _collectIdx = u(-1),   collectIdx = _collectIdx[0],   setCollectIdx = _collectIdx[1];
  var _displayPlayer = u(null), displayPlayer = _displayPlayer[0], setDisplayPlayer = _displayPlayer[1];
  var _displayMsg = u(""),   displayMsg = _displayMsg[0],  setDisplayMsg = _displayMsg[1];
 
  // Refs
  var aiDoneCbRef      = useRef(null);
  var timerRef         = useRef(null);
  var tiRef            = useRef(null);
  var psRef            = useRef(null);
  var tnRef            = useRef(0);
  var popRef           = useRef(null);
  var endTurnRef       = useRef(null);
  var endTurnCalledRef = useRef(false);
  var notifIdRef       = useRef(0);
  var collectingRef    = useRef(false);
  var collectGenRef    = useRef(0);
  var pendingBonusRef  = useRef({ eDefBonus: 0, eWallBonus: 0 });
  var atkErrRef        = useRef(null);
  var phaseReadyRef    = useRef(null);
  var passCdRef        = useRef(null);
 
  // Sync refs
  tiRef.current  = ti;
  psRef.current  = ps;
  tnRef.current  = tn;
  popRef.current = pop;
 
  return {
    // Phase
    ph, sPh,
    // Joueur
    pN, sPN, pC, sPC,
    // Map
    mapData, setMapData, ti, mRows, mCols, sTi,
    // Joueurs
    ps, sPs, rv, sRv,
    playOrder, setPlayOrder, foundingOrder, setFoundingOrder,
    // Tour
    tn, sTn, gP, sGP,
    // Sélection
    sl, sSl, af, sAf,
    // Actions
    aCt, sACt, aF, sAF, trMode, setTrMode,
    // Popup
    pop, sPop,
    // IA
    aiQueue, setAiQueue, aiIdx, setAiIdx,
    // Annonces
    turnAnn, setTurnAnn,
    // Erreurs
    atkErr, setAtkErr,
    // Phase ready
    phaseReady, setPhaseReady, passCd, setPassCd,
    // Quit
    quitConfirm, setQuitConfirm,
    // Combat
    pendingAtk, setPendingAtk, diceAnim, setDiceAnim, diceResult, setDiceResult,
    // End turn
    pendingET, setPendingET,
    // Distribs
    pendingDistrib, setPendingDistrib, pendingTransfer, setPendingTransfer,
    // Human turn
    humanTurnActive, setHumanTurnActive,
    // Float notifs
    floatNotifs, setFloatNotifs,
    // Collect
    collectChoice, setCollectChoice, collectQueue, setCollectQueue,
    collectIdx, setCollectIdx,
    // Display
    displayPlayer, setDisplayPlayer, displayMsg, setDisplayMsg,
    // Refs
    aiDoneCbRef, timerRef, tiRef, psRef, tnRef, popRef,
    endTurnRef, endTurnCalledRef, notifIdRef,
    collectingRef, collectGenRef, pendingBonusRef,
    atkErrRef, phaseReadyRef, passCdRef,
  };
}
