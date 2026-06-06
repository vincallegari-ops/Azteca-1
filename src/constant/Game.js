export var MAX_TURNS = 15;
 
export var TN = ["Teno","Texco","Tlate","Chapu","Xochi","Tlaco","Azca","Izta","Culhu","Teopan","Xocal","Malil","Tula","Cempa","Cholu","Mitla","Palen","Caxa","Teoti","Coatl","Atzal","Tepox","Cuixc","Oxtla","Ixtep"];
 
export var COLORS = [
  {n:"Bleu",  h:"#3B82F6"},
  {n:"Jaune", h:"#EAB308"},
  {n:"Rouge", h:"#EF4444"},
  {n:"Vert",  h:"#22C55E"},
];
 
export var ADV = [
  {n:"Huitz",  e:"\u2694\uFE0F",  f:"\u26A1",         strat:"raider",     desc:"Dieu de la guerre. Transfère puis attaque. Cible toujours en PvP."},
  {n:"Tlaca",  e:"\uD83C\uDFDB\uFE0F", f:"\uD83D\uDC51", strat:"endgame",  desc:"Stratège impérial. Expand puis écrase le leader en fin de partie."},
  {n:"Mocte",  e:"\uD83D\uDC51",  f:"\uD83E\uDDD4",   strat:"endgame",    desc:"Le patient. Expand d'abord, puis écrase le leader en fin de partie."},
  {n:"Itzco",  e:"\uD83D\uDEE1\uFE0F", f:"\uD83E\uDDD4", strat:"blitzkrieg", desc:"Conquistador. Attaque immédiatement, avance sans jamais reculer."},
  {n:"Neza",   e:"\uD83E\uDE99",  f:"\uD83E\uDDD3",   strat:"kingmaker",  desc:"Le faiseur de rois. Détruit toujours le joueur en tête du score."},
  {n:"Cuauh",  e:"\uD83C\uDF0B",  f:"\uD83E\uDDD4",   strat:"kingmaker",  desc:"Dernier empereur. Traque le leader et l'affaiblit sans relâche."},
  {n:"Coatl",  e:"\uD83C\uDF27\uFE0F", f:"\uD83D\uDC32", strat:"backstabber", desc:"Le traître. Expand tranquillement puis trahit le joueur humain."},
  {n:"Quetzal",e:"\uD83D\uDC0D",  f:"\uD83D\uDC09",   strat:"wave",       desc:"Serpent à plumes. Accumule 2 tours, frappe 2 tours, sans fin."},
];
 
export var BN = {
  wall:     "Tour de défense",
  barracks: "Caserne",
  bank:     "Banque",
};
 
// ── Fonctions utilitaires ─────────────────────────────────────────────────────
 
export function rSz() {
  var v = Math.floor(Math.random()*3) + Math.floor(Math.random()*3) + Math.floor(Math.random()*3);
  return Math.max(4, Math.min(10, v + 4));
}
 
export function d6() {
  return Math.floor(Math.random() * 6) + 1;
}
 
export function d2x6() {
  return d6() + d6();
}
 
export function defB(a, d) {
  var x = d - a;
  if (x <= 0)  return  2;
  if (x <= 2)  return  1;
  if (x <= 4)  return  0;
  if (x <= 6)  return -1;
  if (x <= 9)  return -2;
  if (x <= 14) return -3;
  return -5;
}
 
export function capArmy(army, size) {
  return Math.min(army, size * 4);
}
 
export function effAmount(tiles, tileId, player, rows, cols) {
  var t = tiles[tileId];
  if (isAdjToCapital(tiles, tileId, player, rows, cols)) return Math.min(5, t.size);
  return Math.min(3, Math.floor(t.size / 2));
}
 
export function getCapital(tiles, player) {
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].owner === player && tiles[i].isCapital) return tiles[i];
  }
  return null;
}
 
export function isAdjToCapital(tiles, tileId, player, rows, cols) {
  var cap = getCapital(tiles, player);
  if (!cap) return false;
  if (cap.id === tileId) return true;
  return hexNbV(cap.id, rows, cols).includes(tileId);
}
 
export function hexNbV(id, rows, cols) {
  var r = Math.floor(id / cols), c = id % cols, res = [];
  var dirs = r % 2 === 0
    ? [[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]]
    : [[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]];
  for (var i = 0; i < dirs.length; i++) {
    var nr = r + dirs[i][0], nc = c + dirs[i][1];
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) res.push(nr * cols + nc);
  }
  return res;
}
