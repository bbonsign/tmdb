const searchInput = document.querySelector("#search");
const searchForm = document.querySelector("#search-form");
const resultsContainer = document.querySelector("#results-container");

window.onload = () => {
  handleSearch();
};

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  handleSearch()
});

async function handleSearch() {
  const searchTerm = searchInput.value.trim();
  console.log(searchTerm);
  if (searchTerm.length === 0) {
    return
  }

  const searchURL = `/search?query=${searchTerm}&language=${navigator.language}`
  const response = await fetch(searchURL);
  const responseJson = await response.json();
  if (responseJson.total_results === 0) {
    noResultMessage(sanitized(searchTerm));
  }
  else {
    console.log(responseJson);
    const resultsArr = await responseJson.results;
    console.log(await resultsArr);
    resultsList(resultsArr);
    localStorage.clear();
    localStorage.setItem('searchTerm', searchTerm)
  }
}

function sanitized(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

function noResultMessage(searchTerm) {
  clearElement(resultsContainer);
  const messageElement = document.createElement('p');
  messageElement.classList.add('no-result-message');
  messageElement.innerHTML = `Sorry, no movies matched: <b>${searchTerm}</b>`;
  resultsContainer.appendChild(messageElement);
}

function resultsList(resultsArr) {
  clearElement(resultsContainer);
  for (let movie of resultsArr) {
    const card = resultCard(movie);
    resultsContainer.appendChild(card);
  }
};

function resultCard(moveObj) {
  const {
    id,
    title,
    overview,
    release_date: releaseDate = '',
    poster_path: posterPath} = moveObj;

  const titleElement = linkWrapper(id, title, cardTitle(title));
  const dateElement = cardDate(releaseDate);
  const imageElement = linkWrapper(id, title, posterPath ? cardImage(posterPath, title) : missingImage());
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
  //releaseDate comes from the API in YYYY-MM-DD format, or empty
  console.log(releaseDate);
  const dateElement = document.createElement('p');
  dateElement.classList.add('date');
  if (releaseDate.length > 0) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const date = new Date(releaseDate + 'T14:48:00.000+09:00');
    const formatter = new Intl.DateTimeFormat('default', options);
    dateElement.innerText = formatter.format(date);
  }
  else {
    dateElement.innerText = 'Date not available';
  }
  return dateElement;
}

function cardOverview(overview) {
  const overviewElement = document.createElement('p');
  overviewElement.classList.add('overview');
  overviewElement.innerText = overview ? overview : 'Movie overview not provided';
  return overviewElement;
}

function linkWrapper(movieId, movieTitle, element) {
  const anchor = document.createElement('a')
  anchor.href = `https://www.themoviedb.org/movie/${movieId}`;
  anchor.setAttribute('alt', `TMDB page for ${movieTitle}`);
  anchor.appendChild(element);
  return anchor;
}

function cardImage(imagePath, movieTitle) {
  const image = document.createElement("img");
  image.classList.add('poster');
  image.setAttribute('alt', `Poster for the movie ${movieTitle}`);
  image.src = `https://image.tmdb.org/t/p/w94_and_h141_bestv2/${imagePath}`;
  return image;
}

function missingImage() {
  const image = document.createElement("img");
  image.classList.add('poster', 'missing-poster');
  image.alt = "No poster provided for this movie";
  image.src = 'public/image_not_supported-black-36dp.svg';
  return image;
}

function clearElement(element) {
  element.innerHTML = '';
}
