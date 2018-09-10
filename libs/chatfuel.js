let { BOT_ID } = process.env;

let fetch = require('node-fetch');

let { createURL } = require('../libs/helpers/strings.js');

let sendBroadcast = async (data) => {
  let { user_id, block_name: chatfuel_block_name, user_attributes } = data;

  let chatfuel_token = ``;

  let url = createURL(
    `https://api.chatfuel.com/bots/<BOT_ID>/users/<USER_ID>/send`,
    { chatfuel_token, chatfuel_block_name, ...user_attributes }
  );

  let options = {
    method: 'POST',
    headers: {
      ['Content-Type']: 'application/json',
    }
  }

  let response = await fetch(url, options).then(res => res.json());

  return response;
}

module.exports = {
  sendBroadcast,
}