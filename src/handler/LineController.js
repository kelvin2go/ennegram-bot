const ennegram = require('../data/charactors-9.json');
const TEMPLATE = require('../template/line');
const axios = require('axios');

const LINE_TOKEN = process.env.LINE_ACCESS_TOKEN;

const ennegramData = JSON.parse(JSON.stringify(ennegram));

function askQuestion(numberOfQuestion = 0) {
  // console.log(ennegramData[numberOfQuestion]);
  const newContents = [];
  let i = 1;
  for (const question in ennegramData[numberOfQuestion]) {
    // console.log(`${question}: ${ennegramData[numberOfQuestion][question]}`);
    let newButton = {
      ...TEMPLATE.BUTTON,
      action: {
        ...TEMPLATE.BUTTON.action,
        label: `${question.length > 12 ? i : question}`,
        displayText: `${numberOfQuestion + 1}: ${question}`,
        data: JSON.stringify({
          numberOfQuestion,
          value: ennegramData[numberOfQuestion][question],
          type: 'test',
          test: 'ennegram',
        }),
      },
    };
    if (question.length > 12) {
      newContents.push({
        type: 'text',
        text: `${i}: ${question}`,
        wrap: true,
        size: 'sm',
      });
    }
    newContents.push(newButton);
    i++;
  }
  const title = {
    ...TEMPLATE.BUBBLE.body.contents[0],
    text: `Q${numberOfQuestion + 1} of 144`,
  };

  let response = Object.assign(TEMPLATE.BUBBLE);
  response.body.contents[0] = title;
  response.body.contents[1].contents = newContents;
  // console.log("RES", response)
  return response;
}

async function getProfile(ctx) {
  const profileUrl = 'https://api.line.me/v2/bot/profile/';
  const { userId } = ctx.event.source;
  const headers = {
    Authorization: `Bearer ${LINE_TOKEN} `,
  };
  const { data } = await axios.get(`${profileUrl}${userId} `, { headers });
  return data;
}

module.exports = {
  askQuestion,
  getProfile,
};
