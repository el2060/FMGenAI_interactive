// Approximates the way an LLM tokenizer breaks text into sub-word pieces.
// Words longer than 5 chars get chunked into 4-char pieces; punctuation is its own token.
// Tuned so the sample sentence in Level 1 lands at exactly 25 tokens.
export function tokenSegments(text) {
  const segs = [];
  let idx = 0;
  const re = /(\s+)|(\w+)|([^\w\s])/g;
  let m;
  while ((m = re.exec(text))) {
    if (m[1] !== undefined) {
      segs.push({ kind: 'ws', text: m[1] });
    } else if (m[2] !== undefined) {
      const w = m[2];
      if (w.length > 5) {
        for (let i = 0; i < w.length; i += 4) {
          segs.push({ kind: 'tok', text: w.slice(i, i + 4), idx: idx++ });
        }
      } else {
        segs.push({ kind: 'tok', text: w, idx: idx++ });
      }
    } else if (m[3] !== undefined) {
      segs.push({ kind: 'tok', text: m[3], idx: idx++ });
    }
  }
  return segs;
}

export function countTokens(text) {
  return tokenSegments(text).filter((s) => s.kind === 'tok').length;
}
