const React = require("react");
const ReactDOM = require("react-dom/server")
import App from "../browser/shared/App";
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
import serialize from 'serialize-javascript'
import { fetchPopularRepos } from '../browser/shared/api'

//const routes = require('../server/routes');
const path = require('path');

// const Promise = require('bluebird');
const bodyParser = require('body-parser');

app.use(express.static('./dist'));


// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// log routes
app.use(function (req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("*", (req, res, next) => {
  fetchPopularRepos()
    .then((data) => {
      const markup = ReactDOM.renderToString(
        <App serverData={data} />
      )
      
      res.send(`
      <!DOCTYPE html>
      <html>
        <head>
         <title>SSR with React Router</title>
         <script src="/bundle.js" defer></script>
         <link href="/main.css" rel="stylesheet">
         <script>
         window.__INITIAL_DATA__ = ${serialize(data)}
       </script>
        </head>
        <body>
           <div id="app">${markup}</div>
        </body>
      </html>
      `)
    })

})

// app.use('/', routes);

app.listen(4000, () => console.log(`server is running at the port ${process.env.PORT}`));
