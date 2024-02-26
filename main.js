import config from "./apikey.js"


let API_ACCESS_TOKEN = config.TMDB_API_ACCESS_TOKEN;
let movieList = {};

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_ACCESS_TOKEN}`
    }
};

let url = new URL(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`) // now_playing (현재 상영 중인 영화 데이터 중에 1페이지에 해당하는 20개의 영화 데이터 가져오기 위한 URL, 수정 가능)
 

async function getData() {
    const response = await fetch(url, options);
    console.log(response);
    
    const data = await response.json();
    return data.results;

};


function render() {
  let movieHtml = ``;
  let tmdbImageBaseUrl = "https://image.tmdb.org/t/p/w500";

  for (let i = 0; i <= movieList.length; i += 4) {
    console.log(i)
    let oneRow = 
    `
      <div class="row">
    `

    for (let j = 0; j < 4 && i + j < movieList.length; j++) {
      let posterUrl = movieList[i+j].poster_path;
      let tmdbImageUrl = `${tmdbImageBaseUrl}${posterUrl}`
      console.log(tmdbImageUrl);
      let oneMovie =
      `
        <div class="col-lg-3 movieCard">

          <img src="${tmdbImageUrl}">

          <div class="title">
          ${movieList[i+j].title}
          </div>

          <div class="showing">
            <div class="grade">
              ${movieList[i+j].vote_average}
            </div>
            <div class="date">
              ${movieList[i+j].release_date}
            </div> 
          </div>

        </div>
      `
      oneRow += oneMovie
    };

    oneRow += 
    `
      </div>
    `
  
   movieHtml += oneRow;
  };

  document.getElementById("movie-board").innerHTML = movieHtml;

};

async function main() {
  movieList = await getData();
  console.log(movieList);
  
  render()
};

main();