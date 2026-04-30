// Load environment variables from .env and make them accessible via process.env
require('dotenv').config();

// Import the Anthropic SDK client
const Anthropic = require('@anthropic-ai/sdk');

// Initialise the Anthropic client using the API key from environment variables
const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Async function that takes sensor readings and returns an AI compliance report
// Uses await to pause execution until the API responds (returns a Promise)
async function checkCompliance(readings) {

    // Define the compliance specification — the acceptable threshold for each sensor
    const spec = {
        temperature: { min: 18, max: 24 },
        humidity: { min: 30, max: 60 },
        air_quality: { max: 100 }
    };

    // Send the readings and spec to Claude and await the response
    // Specifies the model, token limit, and the instruction message
    const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
            {
                role: 'user',
                content: `You are an asset compliance checker. 
        
Here is the sensor reading:
${JSON.stringify(readings, null, 2)}

Here is the specification:
${JSON.stringify(spec, null, 2)}

Check each reading against the spec and return a short compliance report in plain English. Flag any values outside the spec clearly.`
            }
        ]
    });

    // Return the text content from Claude's response
    return message.content[0].text;
}

module.exports = { checkCompliance };