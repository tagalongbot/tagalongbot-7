// Refactor one day to be easily readable
let { API_AI_KEY } = process.env;

let request = require('request');

let { randomize } = require('../libs/helpers.js');

let API_AI = require('apiai');
let API_AI_APP = API_AI(API_AI_KEY);

let intents = ['findData'];

let INTENTS = intents.reduce(
	(intents, intent) => {
		intents[intent] = require(`../intents/${intent}`);
		return intents;
	}, {}
);

let createTextMsg = (text) => {
  return { messages: [{ text }] };
}

let handleResponse = (res, user) => ({ result, sessionId }) => {
  let { parameters, metadata } = result;
  let intentFN = INTENTS[metadata.intentName];

  if (result.source === 'agent' && intentFN) {
    intentFN({ res, parameters, user });
    return;
  } else if (result.source === 'domains') {
    let message;
    message = createTextMsg(result.fulfillment.speech);
    message.set_attributes = Object.assign(message.set_attributes || {}, { DF_SESSION_ID: sessionId });
    res.send(message);
  }
}

let handleError = (res) => (error) => {
	res.send({ error });
}

let handleAI = ({ query }, res) => {
  let { DF_SESSION_ID, DF_CONTEXT, queryString } = query;
  let { messenger_user_id, first_name, last_name, gender } = query;

  let newSessionId = (!DF_SESSION_ID || DF_SESSION_ID === "0") ? Math.random().toString().slice(2) : 0;
  let sessionId = (DF_SESSION_ID && DF_SESSION_ID != "0") ? DF_SESSION_ID : newSessionId;

  let name = (DF_CONTEXT || 'DEFAULT');
  let parameters = query;
  let contexts = [{ name, parameters }];

  let request = API_AI_APP.textRequest(queryString, { sessionId, contexts });

  let user = { first_name, last_name, gender, messenger_user_id }; 

	request.on('response', handleResponse(res, user));
	request.on('error', handleError(res));
	request.end();
}

module.exports = handleAI;