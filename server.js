const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/subscribe', (req, res) => {
  if (
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ) {
    return res.json({"success": false, "msg": "please select captcha"});
  }

  // secrect key
  const secretKey = 'enter you key here';

  //verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make request to verifyUrl
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    console.log(body);

    //if not successfull
    if (body.success !== undefined && !body.success) {
      return res.json({"success": false, "msg": "Failed captcha verification"});
    }

    // if successfull
    return res.json({"success": true, "msg": "Captcha Passed"});
  });
});

app.listen(3000, () => {
  console.log('server started on port 3000');
});