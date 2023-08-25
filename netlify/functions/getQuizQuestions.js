//getQuizQuestions.js
const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {

            messages: [
                {"role": "system", "content": "You are a Spanish teacher"},
                {"role": "user", "content": "Generate quiz questions for Spanish subjunctive leaving the verb in its unconjugated form. List the answers at the end."}
            ],
            max_tokens: 120,
            stop: null,
            temperature: 0.7,
        }, {
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
