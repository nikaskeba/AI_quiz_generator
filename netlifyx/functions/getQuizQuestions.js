 //getQuizQuestions.js
const axios = require('axios');

exports.handler = async function(event, context) {
    const requestBody = JSON.parse(event.body); // Parsing the incoming request body
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Allow any origin
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    };
    try {
        const payload = {
            model: "gpt-3.5-turbo-0613",
            messages: [
                { "role": "system", "content": "You are a Spanish teacher." },
                { "role": "user", "content": requestBody.content } // Using the content sent from the React component
            ],
            max_tokens: 300
        };

        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        return {
            statusCode: 200,
            headers: corsHeaders, // Adding CORS headers
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error("Error making API call:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed fetching quiz data." })
        };
    }
};