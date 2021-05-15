//Connection to Watson code based on IBMCloud Documentation https://cloud.ibm.com/apidocs/assistant-v1?cv=1&code=go


'use strict';

const alexaVerifier = require('alexa-verifier');
const WatsonAssistant = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

function throwError(reason) {
  return {
    version: '1.0',
    response: {
      shouldEndSession: true,
      outputSpeech: {
        type: 'PlainText',
        text: reason || 'Error - Try again later'
      }
    }
  };
}

let assistant;
let context;

function connectToAlexa(args, rawBody) {
  return new Promise(function(resolve, reject) {
    const certificateUrl = args.__ow_headers.signaturecertchainurl;
    const signature = args.__ow_headers.signature;
    alexaVerifier(certificateUrl, signature, rawBody, function(err) {
      if (err) {
        console.error('err? ' + JSON.stringify(err));
        throw Error('Couldn't complete Alexa verification.');
      }
      resolve();
    });
  });
}

function connectToWatsonClient(args) {
  assistant = new WatsonAssistant({
    version: '2020-02-02',
    authenticator: new IamAuthenticator({ apikey: args.WATSON_APIKEY }),
    serviceUrl: args.WATSON_URL
  });

  console.log('Connected to Watson Skill');
}

function getWatsonMessage(request, skillId) {
  return new Promise(function(resolve, reject) {
	if (request.intent) {
		const userInput = request.intent.slots.EveryThingSlot.value;
	}
	else {
		 const userInput = 'start skill';
	}
    console.log('Watson Conversation Dialog Skill_ID: ' + skillId);
    console.log('User input: ' + userInput);

    assistant.message(
      {
        input: { text: userInput },
        workspaceId: skillId,
        context: context
      },
      function(err, watsonResponse) {
        if (err) {
          console.error(err);
          reject(Error('Could not connect to Watson Skill.'));
        } else {
          console.log('Output from Watson skill: ', watsonResponse.result);
          context = watsonResponse.result.context;
          resolve(watsonResponse);
        }
      }
    );
  });
}

function sendResponse(response, resolve) {
  console.log('Sending the response to Alexa');
  console.log(response);

  const output = response.result.output.text.join(' ');
  console.log('Output text: ' + output);

  resolve({
    version: '1.0',
    response: {
      shouldEndSession: false,
      outputSpeech: {
        type: 'PlainText',
        text: output
      }
    },
    sessionAttributes: { watsonContext: context }
  });
}

function main(args) {
  console.log('Starting the Alexa Action');
  console.log(args);
  return new Promise(function(resolve, reject) {
    if (!args.__ow_body) {
      return reject(throwError('Error - only call this function from Alexa.'));
    }

    const body = Buffer.from(args.__ow_body, 'base64').toString('ascii');

    const alexaData = JSON.parse(body).session.attributes;
    console.log('Alexa Info:');
    console.log(alexaData);
    if (typeof alexaData !== 'undefined' && Object.prototype.hasOwnProperty.call(alexaData, 'watsonContext')) {
      context = alexaData.watsonContext;
    } else {
      context = {};
    }

    const request = JSON.parse(body).request;

    connectToAlexa(args, body)
      .then(() => connectToWatsonClient(args))
      .then(() => getWatsonMessage(request, args.DIALOG_SKILL_KEY))
      .then(watsonResponse => sendResponse(watsonResponse, resolve))
      .catch(err => {
        console.error('Caught error: ');
        console.log(err);
        reject(throwError(err));
      });
  });
}

exports.main = main;