const express = require('express')
const app = express();
const fetch = require("node-fetch");
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
const BASE_TMDB_URL = 'https://api.themoviedb.org/3/'
const API_QUERY_PARAM = `api_key=${TMDB_API_TOKEN}`

app.use(express.static(path.join(__dirname + '')))


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`)
});


app.get('/', (req, res) => {
  console.log(`--> Request from: ${req.url}`);
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/search', async (req, res) => {
  const getParams = url.parse(req.url, parseQueryString = true).query;
  const {query, language} = getParams;
  // console.log(query);
  const tmdbURL = encodeURI(`${BASE_TMDB_URL}search/movie?${API_QUERY_PARAM}&query=${query}&language=${language}`);
  console.log(tmdbURL);
  const data = await fetch(tmdbURL);
  const resultsJson = await data.json();
  // console.log(resultsJson);
  res.json(resultsJson);
});
