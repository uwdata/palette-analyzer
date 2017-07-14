/**
 * @fileoverview A hand-crafted math library dealing mainly with linear algebra
 */

/**
 * Pointwise p-q
 * @param p {Array} Vector p.
 * @param q {Array} Vector q.
 * @returns {Array} The vector (p-q)
 */
export function sub (p, q) {
  return p.map((val, idx) => val - q[idx])
}

/**
 * Calculate the L2 distance between p and q, which is the square root of the
 * sum of the squares of the entries.
 * @param p {Array} Vector p.
 * @param q {Array} Vector q.
 * @return {Number} L2 distance.
 */
export function norm2 (p, q) {
  let r = sub(p, q).map((val) => val * val)
  let total = r.reduce((sum, val) => sum + val, 0)
  return Math.sqrt(total)
}