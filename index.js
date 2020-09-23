const searchInput = document.querySelector("#search");
const searchForm = document.querySelector("#searchForm");

searchForm.addEventListener("submit", async e => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  const results = await fetch(`/search?query=${searchTerm}`);
  // const jsonResults = await results.json();
  console.log(await results.json());
});
