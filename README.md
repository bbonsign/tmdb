# About

A small Express.js powered site to search for movies by title using the [TMDB](https://developers.themoviedb.org/3/getting-started/introduction) api.


# Set up

To run the application on your computer, you'll need an api token from TMDB; use the link above for more details.

Set `TMDB_API_TOKEN` as an environment variable to your api token; the application reads the token from the environment.

Run `npm install` to install the dependencies and then `npm run devstart` to run a local server.  The devstart command uses nodemon to watch for file changes and automatically restart the server.

By default the server will listen on port 8000, but you you can change this to another port by setting a `PORT` environment variable.
