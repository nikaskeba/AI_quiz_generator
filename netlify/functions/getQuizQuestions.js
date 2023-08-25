// getQuestions.js
const axios = require('axios');

exports.handler = async function(event, context) {
    const body = JSON.parse(event.body);
    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: body.prompt,
            max_tokens: 150
        })
    });
    
    const data = response.data;

    return {
        statusCode: 200,
        body: JSON.stringify(data.choices[0].text.trim())
    };
};
