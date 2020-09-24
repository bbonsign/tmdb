const searchInput = document.querySelector("#search");
const searchForm = document.querySelector("#search-form");
const resultsContainer = document.querySelector("#results-container");

searchForm.addEventListener("submit", async e => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  const response = await fetch(`/search?query=${searchTerm}&language=${navigator.language}`);
  const responseJson = await response.json();
  console.log(responseJson);
  const resultsArr = await responseJson.results;
  console.log(await resultsArr);
  ResultsList(await resultsArr);
});


function ResultsList(resultsArr) {
  clearElement(resultsContainer);
  for (let movie of resultsArr) {
    const card = Resultcard(movie);
    resultsContainer.appendChild(card);
  }
};

function Resultcard(moveObj) {
  const {title,
    overview,
    release_date: releaseDate,
    poster_path: posterPath} = moveObj;

  const titleElement = cardTitle(title);
  const dateElement = cardDate(releaseDate);
  const imageElement = posterPath ? cardImage(posterPath) : missingImage();
  imageElement.alt = `Poster for the movie ${title}`
  const overviewElement = cardOverview(overview);

  const card = document.createElement('li')
  card.classList.add('movie-card');
  card.appendChild(imageElement);

  const flexContainer = document.createElement('div');
  flexContainer.classList.add('details');
  flexContainer.appendChild(titleElement);
  flexContainer.appendChild(dateElement);
  flexContainer.appendChild(overviewElement);
  card.appendChild(flexContainer);
  return card;
};

function cardTitle(title) {
  const titleElement = document.createElement('h2');
  titleElement.classList.add('title');
  titleElement.innerText = title;
  return titleElement;
}

function cardDate(releaseDate) {
  //releaseDate comes from the API in YYYY-MM-DD format
  const date = new Date(releaseDate);
  var options = {year: 'numeric', month: 'long', day: 'numeric'};
  const formatter = new Intl.DateTimeFormat('default', options);
  const dateElement = document.createElement('p');
  dateElement.classList.add('date');
  dateElement.innerText = formatter.format(date);
  return dateElement;
}

function cardOverview(overview) {
  const overviewElement = document.createElement('p');
  overviewElement.classList.add('overview');
  overviewElement.innerText = overview ? overview : 'Movie overview not provided';
  return overviewElement;
}

function cardImage(imagePath) {
  const image = document.createElement("img")
  image.classList.add('poster');
  image.src = `https://image.tmdb.org/t/p/w94_and_h141_bestv2/${imagePath}`;
  return image;
}

function missingImage() {
  const image = document.createElement("img")
  image.classList.add('poster', 'missing-poster');
  image.alt = "No poster provided for this movie";
  image.src = 'public/image_not_supported-black-36dp.svg';
  return image;
}

function clearElement(element) {
  element.innerHTML = '';
}
