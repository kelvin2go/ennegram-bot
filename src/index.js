const LINE = require('./handler/LineController');
const AIRTABLE = require('./handler/AirtableController');
const { router, route, text, payload } = require('bottender/router');

async function SayHi(context) {
  await context.sendText('Hi!');
}

async function Unknown(context) {
  console.log('UNKNOW', context);
  console.log(context.event);
  console.log(context.event.isPayload);
  await context.sendText('Sorry.');
}

async function Command(
  context,
  {
    match: {
      groups: { command },
    },
  }
) {
  // | input | command |
  // | --------- | ---------- |
  // | /join | `join` |
  // | /invite | `invite` |
  // | /whatever | `whatever` |
  //  await context.sendText(`Executing command: ${command}`);
  const response = await LINE.askQuestion(0);
  await context.pushFlex('this is a flex', response);
}

async function handleLineEvent(context) {
  const event = context.event;
  const payload = JSON.parse(event.payload);
  let profile = {
    userId: event.source.userId,
  };
  if (payload.type == 'test' && payload.test == 'ennegram') {
    const airtableProfile = await AIRTABLE.getProfile(profile.userId);
    if (!airtableProfile.length) {
      const lineProfile = await LINE.getProfile(context);
      await AIRTABLE.addProfile(lineProfile);
    } else {
      profile = airtableProfile[0].fields;
    }
    await AIRTABLE.addAnswer(profile, payload);

    //TODO: saveToAirtable
    const response = await LINE.askQuestion(payload.numberOfQuestion + 1);
    await context.pushFlex('test flex', response);
  }
}

async function App(context) {
  if (context.event.isPayload) {
    // handling the payload event
    return await handleLineEvent(context);
  }
  return router([
    payload('GET_STARTED', SayHi),
    // return the `Command` action when receiving "/join", "/invite", or "/whatever" text messages
    text(/^\/(?<command>\S+)$/i, Command),
    text(/^(hi|hello)$/i, SayHi),
    // return the `Unknown` action when when no other route matches the incoming text message
    route('*', Unknown),
  ]);
}

module.exports = App;
