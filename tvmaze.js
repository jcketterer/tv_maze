/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const noImageUrl = 'http://tinyurl.com/missing-tv'

async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const res = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${ query }`);
  let shows = res.data.map(resultArray => {
    let tvShow = resultArray.show;
    return {
      id: tvShow.id,
      name: tvShow.name,
      summary: tvShow.summary,
      image: tvShow.image ? tvShow.image.medium : noImageUrl
    };
  });
  console.log(shows);
  return shows;
};


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let tvShow of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${ tvShow.id }">
         <div class="card" data-show-id="${ tvShow.id }">
          <img class="card-img-top" src="${ tvShow.image }">
           <div class="card-body">
             <h5 class="card-title">${ tvShow.name }</h5>
             <p class="card-text">${ tvShow.summary }</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze name id season and number
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const res = await axios.get(
    `http://api.tvmaze.com/shows/${ id }/episodes`);
  let episodes = res.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));
  console.log(episodes);
  return episodes;
}

function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();

  for (let episode of episodes) {
    let $item = $(
      `<li>
        ${ episode.name }
        (season ${ episode.season }, episode ${ episode.number })
      </li>`
    );
    $episodesList.append($item);
  }
  $('#episodes-area').show();
}

//click handle 

$('#shows-list').on('click', '.get-episodes', async function episodeClick(e) {
  let showId = $(e.target).closest('.Show').data('show-id');
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
})








