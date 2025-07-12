export function scorePHQ9(answers) {
  const total = answers.reduce((a, b) => a + b, 0);
  let level = '';
  if (total <= 4) level = 'Mínimo';
  else if (total <= 9) level = 'Leve';
  else if (total <= 14) level = 'Moderado';
  else if (total <= 19) level = 'Moderadamente grave';
  else level = 'Grave';
  return { total, level };
}

export function scoreGAD7(answers) {
  const total = answers.reduce((a, b) => a + b, 0);
  let level = '';
  if (total <= 4) level = 'Mínimo';
  else if (total <= 9) level = 'Leve';
  else if (total <= 14) level = 'Moderado';
  else level = 'Grave';
  return { total, level };
}

export function scoreDASS21(answers) {
  const depressionIdx = [0,3,6,9,12,15,18];
  const anxietyIdx = [1,4,7,10,13,16,19];
  const stressIdx = [2,5,8,11,14,17,20];
  const sum = idxs => idxs.reduce((t,i)=>t+answers[i],0)*2;
  const depression = sum(depressionIdx);
  const anxiety = sum(anxietyIdx);
  const stress = sum(stressIdx);
  const classify = (val, scale) => {
    const table = {
      depression: [0,10,14,21,28],
      anxiety: [0,8,10,15,20],
      stress: [0,15,19,26,34]
    }[scale];
    const labels = ['Normal','Leve','Moderado','Severo','Extremamente Severo'];
    let i = table.findIndex(th => val < th);
    if (i === -1) i = labels.length - 1;
    return labels[i];
  };
  return {
    depression: { score: depression, level: classify(depression,'depression') },
    anxiety: { score: anxiety, level: classify(anxiety,'anxiety') },
    stress: { score: stress, level: classify(stress,'stress') }
  };
}
