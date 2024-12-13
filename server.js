
const express = require('express');
const routes = require('./routes/routes');

const app = express();

const PORT = 8080;
app.use(express.json());

app.use('/route', routes);

app.get("/", (req, res) => res.send(`
    <html>
      <head><title>Hell Yeah Brother</title></head>
      <body style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1>Hell Yeah Brother</h1>
        <img src="https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif" alt="Cool kid doing thumbs up" />
      </body>
    </html>
  `));

app.listen(PORT, () => {
    console.log("Listening for requests");
});