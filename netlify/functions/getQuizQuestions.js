//getQuizQuestions.js
const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const payload = {
            model: "gpt-3.5-turbo-0613",
            messages: [
                { "role": "system", "content": "You are a Spanish teacher." },
                { "role": "user", "content": "generate a quiz that numerically lists 5 unique Spanish subjunctive phrases. Leave the verb unconjugated and within parenthesis.  List the 5 verb solutions numerically in order of question after the sentences. Generate no other text."}
            ],    max_tokens: 300
        };

        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
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
        console.error("Error making API call:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed fetching quiz data." })
        };
    }
};

