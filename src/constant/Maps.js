import { TN, rSz, hexNbV } from "./game.js";
 
export function genMap() {
  var rows = 5, cols = 5;
 
  // Tuiles intérieures pour les déserts temple
  var interior = [];
  for (var i = 0; i < rows * cols; i++) {
    var r = Math.floor(i / cols), c = i % cols;
    if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1) interior.push(i);
  }
  interior.sort(function() { return Math.random() - 0.5; });
  var deserts = new Set([interior[0], interior[1]]);
 
  // Tuiles de bord
  var border = [];
  for (var j = 0; j < rows * cols; j++) {
    var rr = Math.floor(j / cols), cc = j % cols;
    if (rr === 0 || rr === rows - 1 || cc === 0 || cc === cols - 1) border.push(j);
  }
  border.sort(function() { return Math.random() - 0.5; });
 
  // Vérifier si une suppression isolerait une tuile
  function wouldIsolate(removed, deserts) {
    var invalid = new Set(Array.from(removed).concat(Array.from(deserts)));
    for (var ci = 0; ci < rows * cols; ci++) {
      if (invalid.has(ci)) continue;
      var cr = Math.floor(ci / cols), cc2 = ci % cols;
      var dirs = cr % 2 === 0
        ? [[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]]
        : [[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]];
      var hasNeighbour = false;
      for (var di = 0; di < dirs.length; di++) {
        var nr = cr + dirs[di][0], nc = cc2 + dirs[di][1];
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          var nid = nr * cols + nc;
          if (!invalid.has(nid)) { hasNeighbour = true; break; }
        }
      }
      if (!hasNeighbour) return true;
    }
    return false;
  }
 
  // Choisir 2 tuiles de bord à supprimer sans isoler
  var removed = new Set();
  for (var bi = 0; bi < border.length && removed.size < 2; bi++) {
    var candidate = new Set(Array.from(removed).concat([border[bi]]));
    if (!wouldIsolate(candidate, deserts)) removed.add(border[bi]);
  }
  if (removed.size < 1) removed = new Set();
 
  var tiles = TN.map(function(n, i) {
    var s = rSz();
    return {
      id: i, name: n, size: s, owner: null, army: s,
      heldSince: -1, lastLevy: -99, lastTax: -99,
      wall: 0, barracks: 0, bank: 0,
      bTurns: 0, bType: null, attempts: {},
      leviedThis: false, isCapital: false,
      isDesert: deserts.has(i) || removed.has(i),
      isRemoved: removed.has(i),
    };
  });
 
  return { tiles: tiles, rows: rows, cols: cols, variant: 0 };
}
