const TYPES = require('../data/type');

function calculate(answers) {
  const report = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    I: 0,
  };

  const convert = {
    A: 9,
    B: 6,
    C: 3,
    D: 1,
    E: 4,
    F: 2,
    G: 8,
    H: 5,
    I: 7,
  };

  const missing = [];
  const keys = [];
  for (const [key, value] of Object.entries(answers)) {
    report[value] = report[value] + 1;
    keys.push(parseInt(key));
  }
  for (var i = 0; i < 144; i++) {
    if (!keys.includes(i)) {
      missing.push(i);
    }
  }
  console.log('missing', missing);
  const res = Object.keys(report).map((x) => {
    return { group: `${convert[x]}`, value: report[x] };
  });
  return {
    report: res.sort(function (a, b) {
      return b.value - a.value;
    }),
    missing,
  };
}

function flexbaseline(response) {
  const result = response.map((ele) => {
    return {
      type: 'box',
      layout: 'baseline',
      spacing: 'sm',
      contents: [
        {
          type: 'text',
          text: `${TYPES[ele.group]}`,
          color: '#aaaaaa',
          wrap: true,
          size: 'sm',
          flex: 4,
        },
        {
          type: 'text',
          text: `${ele.value}`,
          wrap: true,
          size: 'sm',
          color: '#666666',
          flex: 1,
        },
      ],
    };
  });

  return result;
}

function report(answers) {
  const userReport = calculate(answers);
  return userReport;
}
module.exports = {
  report,
  flexbaseline,
};
