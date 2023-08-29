//getQuizQuestions.js
const axios = require('axios');

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const requestBody = JSON.parse(event.body);
    const userContent = requestBody.userContent;

    const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
    const payload = {
        model: "gpt-3.5-turbo-0613",
        messages: [
            { "role": "system", "content": "You are a Spanish teacher." },
            { "role": "user", "content": userContent }
        ],
        max_tokens: 300
    };

    try {
        const response = await axios.post(OPENAI_API_ENDPOINT, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        return {
            statusCode: 500,
            body: "Internal Server Error"
        };
    }
};


