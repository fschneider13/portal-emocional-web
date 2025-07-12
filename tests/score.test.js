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

// DASS-21 all 2 -> each subscale sum = 14 -> score*2 = 28 -> Severe/extreme
const dass21 = Array(21).fill(2);
const r3 = scoreDASS21(dass21);
assert.strictEqual(r3.depression.score, 28);
assert.strictEqual(r3.depression.level, 'Extremamente Severo');

console.log('All tests passed.');
