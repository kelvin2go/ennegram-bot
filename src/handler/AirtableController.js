const axios = require('axios');

const TOKEN = process.env.AIRTABLE_KEY;
const base = `appQfIIV2F6yxXN3z`;

const API_URL = `https://api.airtable.com/v0/${base}`;
const config = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
};
const postconfig = {
  ...config,
  headers: {
    ...config.headers,
    'Content-Type': 'application/json',
  },
};
async function addProfile(profile) {
  const fields = {
    userId: profile.userId,
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
    avatar: [{ url: profile.pictureUrl }],
    profile: JSON.stringify(profile),
  };
  let result = {};
  try {
    result = await axios.post(`${API_URL}/users`, { fields }, postconfig);
    result = result.data;
  } catch (err) {
    console.log(err);
  }
  return result;
}

async function getProfile(userId) {
  // console.log('getting user prfile', userId);
  const { data } = await axios.get(
    `${API_URL}/users?filterByFormula=({userId}='${userId}')`,
    config
  );
  return data.hasOwnProperty('records') ? data.records : {};
}

async function getAnswer(profile) {
  const userId = profile.userId;
  const { data } = await axios.get(
    `${API_URL}/answers?filterByFormula=({userId}='${userId}')`,
    config
  );
  // console.log(`getAns ${userId}`, data.records);
  return data.hasOwnProperty('records') ? data.records : [];
}

async function addAnswer(profile, answer) {
  // console.log('ANSWERING', answer);
  const originAns = await getAnswer(profile);
  let records = [];
  if (originAns.length > 0) {
    const newAns = {
      ...JSON.parse(originAns[0].fields.answers),
      [answer.numberOfQuestion]: answer.value,
    };
    records.push({
      id: originAns[0].id,
      fields: {
        userId: profile.userId,
        answers: JSON.stringify(newAns),
      },
    });
    const data = { records };
    try {
      await axios.patch(`${API_URL}/answers`, data, postconfig);
    } catch (err) {
      console.log(err);
    }
  } else {
    records.push({
      fields: {
        userId: profile.userId,
        answers: JSON.stringify({ [answer.numberOfQuestion]: answer.value }),
      },
    });
    const data = { records };
    try {
      await axios.post(`${API_URL}/answers`, data, postconfig);
    } catch (err) {
      console.log(err);
    }
  }

  // console.log('savedAns+new', records);
  // const fields = {
  //   userId: profile.userId,
  //   answers: JSON.stringify(savedAns),
  // };
}

const AIRTABLE = {
  getProfile,
  addProfile,
  addAnswer,
};

module.exports = AIRTABLE;
