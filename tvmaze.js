"use strict";

const unknownImg = 'https://tinyurl.com/tv-missing';
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodesList = $("#episodesList");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(query) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios({
    baseURL: 'https://api.tvmaze.com/',
    url: "search/shows",
    method: "GET",
    params: {q: query, },
  });   
  return res.data.map(val => {
    const show = val.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : unknownImg,
    };
  }); 
}

/** Given list of shows, create markup for each and to DOM */

  function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(    //show image and alt if not possible
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4"> 
         <div class="media">
           <img
              src=${show.image} 
              alt=${unknownImg}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>`
      );
    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}
//event listener > submit form
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});



/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  const res = await axios({
    baseURL: 'https://api.tvmaze.com/',
    url: `shows/${id}/episodes`,
    method: "GET",
  });   
  
  return res.data.map(e => ({
    id: e.id,
    name: e.name,
    season: e.season,
    number: e.number,
  }));
}

/** Write a clear docstring for this function... */
//adding new list item with name and season and episode numbers
function populateEpisodes(eps) {
  $episodesList.empty();

  for (let ep of eps) {
    const $episode = $(
      `<li>
         ${ep.name} (Season: ${ep.season}, Episode: ${ep.number})
       </li>`
    );
    $episodesList.append($episode);
  }
  $episodesArea.show();
}

async function getEpisodesAndDisplay(e) {

  const showId = $(e.target).closest(".Show").data("show-id");

  //retrieve show id and the closest epsiode set likewise

  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);

