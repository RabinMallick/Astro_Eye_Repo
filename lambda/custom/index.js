const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());


// 1. Handlers ===================================================================================

const LaunchHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        const speechOutput = `${requestAttributes.t('WELCOME')} ${requestAttributes.t('HELP')}`;
        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const AboutHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AboutIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();

        return responseBuilder
            .speak(requestAttributes.t('ABOUT'))
            .getResponse();
    },
};

const EyeIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        console.log(request.intent.name);
        return request.type === 'IntentRequest' && request.intent.name === 'EyeIntent';
    },
    handle(handlerInput) {

        const responseBuilder = handlerInput.responseBuilder;
        const direction = handlerInput.requestEnvelope.request.intent.slots.direction.value;
        console.log("Value : ");
        console.log(direction);

        
        let speechOutput = "";
        if(direction == "left"){
            speechOutput = "Looking "+direction;
        }
        else if(direction == "right"){
            speechOutput = "Looking "+direction;
        }
        else if(direction == "blink"){
            speechOutput = "Blinking...";
        }

        const speech = "Waiting for next command";
        return responseBuilder.speak(speechOutput).reprompt(speech).getResponse();
    },
};


const YesHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;
        const speechOutput = `Say again to do something with my eyes.`;

        return responseBuilder
            .speak(speechOutput)
            .getResponse();
    },
};



const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        return responseBuilder
            .speak(requestAttributes.t('HELP'))
            .reprompt(requestAttributes.t('HELP'))
            .getResponse();
    },
};

const StopHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.NoIntent'
            || request.intent.name === 'AMAZON.CancelIntent'
            || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        return responseBuilder
            .speak(requestAttributes.t('STOP'))
            .getResponse();
    },
};

const SessionEndedHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;

        console.log(`Error handled: ${error.message}`);
        console.log(` Original request was ${JSON.stringify(request, null, 2)}\n`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const FallbackHandler = {

  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.

  //              This handler will not be triggered except in that locale, so it can be

  //              safely deployed for any locale.

  canHandle(handlerInput) {

    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest'

      && request.intent.name === 'AMAZON.FallbackIntent';

  },

  handle(handlerInput) {

    return handlerInput.responseBuilder

      .speak(FALLBACK_MESSAGE)

      .reprompt(FALLBACK_REPROMPT)

      .getResponse();

  },

};


// 2. Constants ==================================================================================

const languageStrings = {
    en: {
        translation: {
            WELCOME: 'Hi I am Astro Robo.',
            HELP: 'Say look left, look right or blink. ',
            ABOUT: 'Astro is a 4 legged Robot. A project by Ghost robotics and is on progress.',
            STOP: 'Okay, see you next time!',
        },
    },
    // , 'de-DE': { 'translation' : { 'TITLE'   : "Local Helfer etc." } }
};
const data = {
    city: 'Gloucester',
    state: 'MA',
    postcode: '01930',
    restaurants: [
        {
            name: "Zeke's Place",
            address: '66 East Main Street',
            phone: '978-283-0474',
            meals: 'breakfast, lunch',
            description: 'A cozy and popular spot for breakfast.  Try the blueberry french toast!',
        },
        {
            name: 'Morning Glory Coffee Shop',
            address: '25 Western Avenue',
            phone: '978-281-1851',
            meals: 'coffee, breakfast, lunch',
            description: 'A homestyle diner located just across the street from the harbor sea wall.',
        },
        {
            name: 'Sugar Magnolias',
            address: '112 Main Street',
            phone: '978-281-5310',
            meals: 'breakfast, lunch',
            description: 'A quaint eatery, popular for weekend brunch.  Try the carrot cake pancakes.',
        },
        {
            name: 'Seaport Grille',
            address: '6 Rowe Square',
            phone: '978-282-9799',
            meals: 'lunch, dinner',
            description: 'Serving seafood, steak and casual fare.  Enjoy harbor views on the deck.',
        },
        {
            name: 'Latitude 43',
            address: '25 Rogers Street',
            phone: '978-281-0223',
            meals: 'lunch, dinner',
            description: 'Features artsy decor and sushi specials.  Live music evenings at the adjoining Minglewood Tavern.',
        },
        {
            name: "George's Coffee Shop",
            address: '178 Washington Street',
            phone: '978-281-1910',
            meals: 'coffee, breakfast, lunch',
            description: 'A highly rated local diner with generously sized plates.',
        },

    ],
    attractions: [
        {
            name: 'Whale Watching',
            description: 'Gloucester has tour boats that depart twice daily from Rogers street at the harbor.  Try either the 7 Seas Whale Watch, or Captain Bill and Sons Whale Watch. ',
            distance: '0',
        },
        {
            name: 'Good Harbor Beach',
            description: 'Facing the Atlantic Ocean, Good Harbor Beach has huge expanses of soft white sand that attracts hundreds of visitors every day during the summer.',
            distance: '2',
        },
        {
            name: 'Rockport',
            description: 'A quaint New England town, Rockport is famous for rocky beaches, seaside parks, lobster fishing boats, and several art studios.',
            distance: '4',
        },
        {
            name: 'Fenway Park',
            description: 'Home of the Boston Red Sox, Fenway park hosts baseball games From April until October, and is open for tours. ',
            distance: '38',
        },
    ],
};

const SKILL_NAME = 'Astro Eye';
const FALLBACK_MESSAGE = `The ${SKILL_NAME} skill can\'t help you with that.  It can help you learn about astro, move it's eyes and blink.`;
const FALLBACK_REPROMPT = 'What can I help you with?';



// 3. Helper Functions ==========================================================================


const myAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET',
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true,
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    },
};

// 4. Export =====================================================================================

// const skillBuilder = Alexa.SkillBuilders.custom();
// exports.handler = skillBuilder
//     .addRequestHandlers(
//         LaunchHandler,
//         AboutHandler,
//         CoffeeHandler,
//         BreakfastHandler,
//         LunchHandler,
//         DinnerHandler,
//         YesHandler,
//         AttractionHandler,
//         GoOutHandler,
//         HelpHandler,
//         StopHandler,
//         FallbackHandler,
//         SessionEndedHandler
//     )
//     .addRequestInterceptors(LocalizationInterceptor)
//     .addErrorHandlers(ErrorHandler)
//     .lambda();

app.post('/', function (req, res) {

    // if (!skill) {

    skill = Alexa.SkillBuilders.custom()
        .addRequestHandlers(
            LaunchHandler,
            EyeIntentHandler,
            AboutHandler,
            YesHandler,
            HelpHandler,
            StopHandler,
            FallbackHandler,
            SessionEndedHandler
        )
        .addRequestInterceptors(LocalizationInterceptor)
        .addErrorHandlers(ErrorHandler)
        .create();

    // }

    skill.invoke(req.body)
        .then(function (responseBody) {
            res.json(responseBody);
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).send('Error during the request');
        });

});

app.listen(8000, function () {
    console.log('Development endpoint listening on port 8000!');
});

