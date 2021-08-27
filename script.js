const search = document.getElementById("search-input"),
  searchResults = document.getElementById("search-results"),
  resultsText = document.getElementById("results-text"),
  nominationsList = document.getElementById("nominations-list"),
  submitBtn = document.getElementById("btn-submit"),
  resetBtn = document.getElementById("btn-reset"),
  movies = document.getElementById("movies"),
  nominate = document.getElementById("btn-nominate"),
  nominationsHeader = document.getElementById("nominations-header"),
  baseURL = `https://www.omdbapi.com/`,
  APIKEY = "6bd53730";

let nominationsArr = [];

// Search Movie
function searchMovie(e) {
  e.preventDefault();
  const term = search.value;
  resultsText.innerHTML = `<h3>Results for "${term}"</h3>`;
  if (term.trim()) {
    try {
      fetch(`${baseURL}?apikey=${APIKEY}&s=${term}&type=movie`)
        .then(res => res.json())
        .then(data => {
          if (data.Error) {
            movies.innerHTML = `<p>Sorry 😥... ${data.Error} Try again!</p>`;
          } else {
            movies.scrollIntoView();
            movies.innerHTML = "";
            resultsText.innerHTML = `<h3>Results for "${term}"</h3>`;
            const sortedMovies = data.Search.sort(function (x, y) {
              return y.Year - x.Year;
            });
            sortedMovies
              .map(movie => {
                const movieLi = document.createElement("li");
                const movieDiv = document.createElement("div");
                movieLi.id = movie.imdbID;

                movieDiv.innerHTML = `◾ ${movie.Title} (${movie.Year})&nbsp;&nbsp;`;

                // Nomination Button
                const nominationButton = document.createElement("button");
                nominationButton.innerHTML = "Nominate";
                nominationButton.setAttribute(
                  "onclick",
                  `nominateMovie("${movie.imdbID}", "${movie.Title}", "${movie.Year}", "${movie.Poster}")`
                );
                const found = nominationsArr.some(el => el.id === movie.imdbID);
                if (found) {
                  nominationButton.disabled = true;
                }

                movieLi.appendChild(movieDiv);
                movieLi.appendChild(nominationButton);
                movies.appendChild(movieLi);
              })
              .join("");
          }
        });
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  } else {
    movies.innerHTML = `<p>Sorry 😥... You need to type in something! Try again!</p>`;
  }
}

// Nominate Movie
function nominateMovie(id, title, year, pic) {
  let num = nominationsArr.length;
  const found = nominationsArr.some(el => el.id === id);
  const nominateBtn = document.getElementById(id);
  console.log(num);
  console.log(nominationsArr);

  if (num < 5 && !found) {
    nominationsArr.push({
      id: id,
      title: title,
      year: year,
      pic: pic
    });
    nominateBtn.getElementsByTagName("button")[0].disabled = true;
  }

  loadNominations();
}

// Load Nominations list
function loadNominations() {
  let num = nominationsArr.length;

  console.log(num);

  if (num === 0) {
    nominationsList.innerHTML = `<p>Search for movies. Nominate your top five favorite movies.</p>`;
    nominationsHeader.innerHTML = `<h3>Nominations</h3>
    <p>${num}/5</p>`;
  } else if (num > 0) {
    nominationsList.innerHTML = "";
    nominationsHeader.innerHTML = `<h3>Nominations</h3>
    <p>${num}/5</p>`;
    nominationsArr.map(nomination => {
      console.log(nomination);
      const movieLi = document.createElement("li");
      const movieDiv = document.createElement("div");
      movieDiv.className = "nominations-list";
      const nominateList = document.createElement("ul");
      movieLi.id = nomination.imdbID;

      movieDiv.innerHTML = `<img src=${nomination.pic} class="poster" />
      <p>${nomination.title} (${nomination.year})&nbsp;&nbsp;</p>`;

      // Nomination Button
      const removeButton = document.createElement("button");
      removeButton.innerHTML = "X";
      removeButton.setAttribute("onclick", `remove("${nomination.id}")`);

      nominationsList.appendChild(nominateList);
      movieLi.appendChild(movieDiv);
      movieLi.appendChild(removeButton);
      nominateList.appendChild(movieLi);
    });
  }
}

// Remove Nomination
function remove(id) {
  const nominationItem = document.getElementById(id);

  if (nominationItem) {
    nominationItem.getElementsByTagName("button")[0].disabled = false;
  }

  nominationsArr = nominationsArr.filter(movie => movie.id !== id);
  nominationsList.innerHTML = "";
  loadNominations();
}

// Clear Search List
function clearSearchData() {
  movies.innerHTML = "";
  resultsText.innerHTML = `<h3 id="results-text">Results</h3>`;
  searchResults.style.display = "none";
  search.value = "";
}

// Submit Search and display Search Results Lst
function handleSubmit(e) {
  if (e.type === "search" || submitBtn) {
    if (search.value !== "") {
      searchMovie(e);
      searchResults.style.display = "flex";
    } else {
      search.value = "";
    }
  }
}

// Reset Button
function handleReset() {
  resultsText.innerHTML = ``;
  movies.innerHTML = ``;
}

// Eventlisteners
// search.addEventListener("search", searchMovie);
search.addEventListener("search", handleSubmit);
submitBtn.addEventListener("click", handleSubmit);
resetBtn.addEventListener("click", clearSearchData);

if (null) {
  nominate.addEventListener("submit", nominateMovie);
}
