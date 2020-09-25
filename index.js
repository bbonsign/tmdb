const searchInput = document.querySelector("#search");
const searchForm = document.querySelector("#search-form");
const datalist = document.querySelector("#predictions");
const resultsContainer = document.querySelector("#results-container");
const pageNavContainer = document.querySelector("#page-nav");

const queryParams = new URLSearchParams(window.location.search);
const searchTermFromURL = queryParams.get('query') || '';
const pageFromURL = Number(queryParams.get('page')) || 1;

window.onload = () => {
  handleSearch(searchTermFromURL, page = pageFromURL);
  searchInput.value = searchTermFromURL;
};

async function queryApi(searchTerm, page = 1) {
  const searchURL = `/json?query=${searchTerm}&language=${navigator.language}&page=${page}`;
  const response = await fetch(searchURL);
  return await response.json();
}

searchInput.addEventListener('input', async () => {
  clearElement(datalist);
  const searchTerm = searchInput.value;
  if (searchTerm.length > 1) {
    const responseJson = await queryApi(searchTerm);
    console.log(responseJson);
    for (let result of responseJson.results) {
      const option = document.createElement('option');
      option.value = result.title;
      datalist.appendChild(option);
    }
  }
});

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  const newSearch = searchInput.value.trim();
  if (newSearch.length > 0) {
    window.location = `/?query=${newSearch}&language=${navigator.language}&page=1`
  }
});

async function handleSearch(searchTerm, page = 1) {
  if (searchTerm.length === 0) {
    return;
  }
  const responseJson = await queryApi(searchTerm, page);
  if (responseJson.total_results === 0) {
    noResultMessage(sanitized(searchTerm));
  }
  else {
    const resultsArr = responseJson.results;
    resultsList(resultsArr);
    pageNav(responseJson, searchTerm);
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
    poster_path: posterPath
  } = moveObj;

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
  image.setAttribute('alt', "No poster provided for this movie");
  image.src = 'public/image_not_supported-black-36dp.svg';
  return image;
}

function clearElement(element) {
  element.innerHTML = '';
}

// Create the links for the bottom of the site to naviagate to
// other pages of the search results.
function pageNav(responseJson, searchTerm) {
  const currentPage = pageFromURL;
  const lastPage = responseJson.total_pages;
  const validNumbers = [1, 2, currentPage - 1, currentPage, currentPage + 1, lastPage - 1, lastPage];

  if (currentPage !== 1) {
    const prev = document.createElement('a');
    prev.classList.add('page-link');
    prev.href = `/?query=${searchTerm}&language=${navigator.language}&page=${currentPage - 1}`;
    prev.setAttribute('alt', 'Previous page of search results');
    prev.innerText = '<<';
    pageNavContainer.appendChild(prev);
  }
  for (let i = 1; i <= responseJson.total_pages; i++) {
    if (validNumbers.includes(i)) {
      const link = document.createElement('a');
      link.classList.add('page-link');
      link.setAttribute('data-active-page', i === currentPage ? 'true' : '');
      link.href = `/?query=${searchTerm}&language=${navigator.language}&page=${i}`;
      link.setAttribute('alt', `Page ${i} of search results`);
      link.innerText = i;
      pageNavContainer.appendChild(link);
    }
  }
  if (currentPage !== lastPage) {
    const prev = document.createElement('a');
    prev.classList.add('page-link');
    prev.href = `/?query=${searchTerm}&language=${navigator.language}&page=${currentPage + 1}`;
    prev.setAttribute('alt', 'Next page of search results');
    prev.innerText = '>>';
    pageNavContainer.appendChild(prev);
  }
};
