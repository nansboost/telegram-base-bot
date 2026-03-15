// lib/didyoumean.js
// Fungsi sederhana untuk menyarankan command terdekat

function levenshtein(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitute
          matrix[i][j - 1] + 1,     // insert
          matrix[i - 1][j] + 1      // delete
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function suggest(input, candidates, maxDistance = 2) {
  if (!input || !candidates || !candidates.length) return null;
  let best = null;
  let bestDist = Infinity;

  for (const c of candidates) {
    const d = levenshtein(input, c);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }

  if (bestDist <= maxDistance) return best;
  return null;
}

module.exports = { levenshtein, suggest };
