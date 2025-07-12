import assert from 'assert';
import { scorePHQ9, scoreGAD7, scoreDASS21 } from '../src/score.js';

// PHQ-9 example answers all 2 -> total 18 -> Moderadamente grave
const phq9 = Array(9).fill(2);
const r1 = scorePHQ9(phq9);
assert.strictEqual(r1.total, 18);
assert.strictEqual(r1.level, 'Moderadamente grave');

// GAD-7 all 1 -> total 7 -> Leve
const gad7 = Array(7).fill(1);
const r2 = scoreGAD7(gad7);
assert.strictEqual(r2.total, 7);
assert.strictEqual(r2.level, 'Leve');

// DASS-21 severity bands for depression
const depIdx = [0,3,6,9,12,15,18];

// Normal (score 0)
let a = Array(21).fill(0);
let r = scoreDASS21(a);
assert.strictEqual(r.depression.score, 0);
assert.strictEqual(r.depression.level, 'Normal');

// Leve (score 10)
a = Array(21).fill(0);
depIdx.slice(0,5).forEach(i => { a[i] = 1; });
r = scoreDASS21(a);
assert.strictEqual(r.depression.score, 10);
assert.strictEqual(r.depression.level, 'Leve');

// Moderado (score 14)
a = Array(21).fill(0);
depIdx.forEach(i => { a[i] = 1; });
r = scoreDASS21(a);
assert.strictEqual(r.depression.score, 14);
assert.strictEqual(r.depression.level, 'Moderado');

// Severo (score 22)
a = Array(21).fill(0);
[0,3,6,9,12].forEach(i => { a[i] = 2; });
a[15] = 1;
r = scoreDASS21(a);
assert.strictEqual(r.depression.score, 22);
assert.strictEqual(r.depression.level, 'Severo');

// Extremamente Severo (score 28)
a = Array(21).fill(2);
r = scoreDASS21(a);
assert.strictEqual(r.depression.score, 28);
assert.strictEqual(r.depression.level, 'Extremamente Severo');

console.log('All tests passed.');
