import assert from 'assert';
import { scorePHQ9, scoreGAD7, scoreDASS21 } from '../src/score.js';

// PHQ-9 example answers all 2 -> total 18 -> Moderadamente grave
const phq9 = Array(9).fill(2);
const r1 = scorePHQ9(phq9);
assert.strictEqual(r1.total, 18);
assert.strictEqual(r1.level, 'Moderadamente grave');

// PHQ-9 boundary and low-score cases
const phq9Low = Array(9).fill(0);
let r = scorePHQ9(phq9Low);
assert.strictEqual(r.total, 0);
assert.strictEqual(r.level, 'Mínimo');

r = scorePHQ9([1,1,1,1,0,0,0,0,0]); // total 4
assert.strictEqual(r.total, 4);
assert.strictEqual(r.level, 'Mínimo');

r = scorePHQ9([1,1,1,1,1,0,0,0,0]); // total 5
assert.strictEqual(r.total, 5);
assert.strictEqual(r.level, 'Leve');

r = scorePHQ9(Array(9).fill(1)); // total 9
assert.strictEqual(r.total, 9);
assert.strictEqual(r.level, 'Leve');

r = scorePHQ9([2,2,2,2,2,0,0,0,0]); // total 10
assert.strictEqual(r.total, 10);
assert.strictEqual(r.level, 'Moderado');

r = scorePHQ9([2,2,2,2,2,2,2,0,0]); // total 14
assert.strictEqual(r.total, 14);
assert.strictEqual(r.level, 'Moderado');

r = scorePHQ9([3,3,3,3,3,0,0,0,0]); // total 15
assert.strictEqual(r.total, 15);
assert.strictEqual(r.level, 'Moderadamente grave');

r = scorePHQ9([3,3,3,3,3,3,1,0,0]); // total 19
assert.strictEqual(r.total, 19);
assert.strictEqual(r.level, 'Moderadamente grave');

r = scorePHQ9([3,3,3,3,3,3,2,0,0]); // total 20
assert.strictEqual(r.total, 20);
assert.strictEqual(r.level, 'Grave');

// GAD-7 all 1 -> total 7 -> Leve
const gad7 = Array(7).fill(1);
const r2 = scoreGAD7(gad7);
assert.strictEqual(r2.total, 7);
assert.strictEqual(r2.level, 'Leve');

// GAD-7 boundary and low-score cases
const gad7Low = Array(7).fill(0);
r = scoreGAD7(gad7Low);
assert.strictEqual(r.total, 0);
assert.strictEqual(r.level, 'Mínimo');

r = scoreGAD7([1,1,1,1,0,0,0]); // total 4
assert.strictEqual(r.total, 4);
assert.strictEqual(r.level, 'Mínimo');

r = scoreGAD7([1,1,1,1,1,0,0]); // total 5
assert.strictEqual(r.total, 5);
assert.strictEqual(r.level, 'Leve');

r = scoreGAD7(Array(7).fill(1)); // total 7
assert.strictEqual(r.total, 7);
assert.strictEqual(r.level, 'Leve');

r = scoreGAD7([2,2,2,2,2,0,0]); // total 10
assert.strictEqual(r.total, 10);
assert.strictEqual(r.level, 'Moderado');

r = scoreGAD7([2,2,2,2,2,1,1]); // total 12
assert.strictEqual(r.total, 12);
assert.strictEqual(r.level, 'Moderado');

r = scoreGAD7([3,3,3,3,3,0,0]); // total 15
assert.strictEqual(r.total, 15);
assert.strictEqual(r.level, 'Grave');

// DASS-21 all 2 -> each subscale sum = 14 -> score*2 = 28 -> Severe/extreme
const dass21 = Array(21).fill(2);
const r3 = scoreDASS21(dass21);
assert.strictEqual(r3.depression.score, 28);
assert.strictEqual(r3.depression.level, 'Extremamente Severo');

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

// DASS-21 boundary and low-score cases
const dassLow = Array(21).fill(0);
let rd = scoreDASS21(dassLow);
assert.strictEqual(rd.depression.score, 0);
assert.strictEqual(rd.depression.level, 'Leve');
assert.strictEqual(rd.anxiety.score, 0);
assert.strictEqual(rd.anxiety.level, 'Leve');
assert.strictEqual(rd.stress.score, 0);
assert.strictEqual(rd.stress.level, 'Leve');

// Depression score 10 -> Moderado
rd = scoreDASS21([
 1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0
]);
assert.strictEqual(rd.depression.score, 10);
assert.strictEqual(rd.depression.level, 'Moderado');

// Anxiety score 8 -> Moderado
rd = scoreDASS21([
 0,1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0
]);
assert.strictEqual(rd.anxiety.score, 8);
assert.strictEqual(rd.anxiety.level, 'Moderado');

// Stress score 16 -> Moderado
rd = scoreDASS21([
 0,0,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0
]);
assert.strictEqual(rd.stress.score, 16);
assert.strictEqual(rd.stress.level, 'Moderado');

console.log('All tests passed.');
