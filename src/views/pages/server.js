// whatsapp webhook to get messages
// https://api.whatsapp.com/webhook/
// https://api.whatsapp.com/send?phone=+917078181818&text=hello
// https://api.whatsapp.com/send?phone=+917078181818&text=hello
// https://api.whatsapp.com/send?phone=+917078181818&text=hello

const token = 'EAAPQXUK6bX8BAFMIipyrZB3J7LrnIZCXCRbDih8qmjufX7Qju8UAZA81j9C1RhMgI4Ou2lVmu5MadvWaq0xr9r3k5ALWpzr3WOQYqL9BF46nOZB7rpaKeJdIZAIJiIV9n0baYqH3aGMPBHxNHyy4mlfZCkOjmbfzrKTQQNH7FkJGPQq3PdJpTxG76hrzTGsbgqM21OMZCwjZBdKAFAcbZC8IVNTqWAY860x0ZD';

const request = require('request'),
express = require('express'),
body_parser = require('body-parser'),
axios = require('axios'),
app = express().use(body_parser.json());

app.listen(process.env.PORT || 5000, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => {
    let body = req.body;
    if(body.object)
    {
      console.log(body.object);
    }

    });

