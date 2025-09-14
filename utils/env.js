// utils/env.js
export function isNode() {
  return typeof process !== 'undefined' && process.versions?.node
}
