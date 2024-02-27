import config from "./apikey.js"

let url = new URL(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`)
let tmdbImageBaseUrl = "https://image.tmdb.org/t/p/w500";

let API_ACCESS_TOKEN = config.TMDB_API_ACCESS_TOKEN;

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_ACCESS_TOKEN}`
    }
};


let movieObject = {};
let genreObject = {};

/* 장르 버튼 별로 버튼 생성 및 클릭 이벤트 추가 */
const genreMenus = document.querySelectorAll("#genre_menus button");
genreMenus.forEach(genre => genre.addEventListener("click", (event) => genreFilterRender(event)));


/* TMDB에서 영화 데이터를 가져오는 함수 */
async function getMovieData() {
    const response = await fetch(url, options);
    
    const data = await response.json();
    return data.results;

};


async function getGenresList() {
  url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
  const response = await fetch(url, options);
  let genreData = await response.json();
  
  genreData = genreData["genres"];
  return genreData;

};


function genreFilterRender(event) {
  const genreName = event.target.textContent;
  let genreId = null;
  let genreMovies = [];

  // 클릭한 장르 텍스트를 의미하는 ID 값 찾기
  for (let i = 0; i < genreObject.length; i++) {
    if (genreObject[i].name === genreName) {
      genreId = genreObject[i].id
      break
    };
  
  };

  // 클릭한 장르 ID 값과 대응하는 영화 목록만 필터링
  for (let i = 0; i < movieObject.length; i++) {
    if (movieObject[i].genre_ids.includes(genreId)){
      genreMovies.push(movieObject[i])
    };
  };
  console.log(genreMovies);


  // 장르에 해당하는 영화 목록을 보여주기 위한 HTML 코드 index.html에 추가하기
  let movieHtml = ``;
  let oneRow = `<div class="row">`;

  for (let i = 0; i < genreMovies.length; i++) {
      let posterUrl = genreMovies[i].poster_path;
      let tmdbImageUrl = `${tmdbImageBaseUrl}${posterUrl}`;

      let oneMovie = `
          <div class="col-lg-3 movieCard">
            <img src="${tmdbImageUrl}">
            <div class="title">${genreMovies[i].title}</div>
            <div class="showing">
              <div class="grade">${genreMovies[i].vote_average}</div>
              <div class="date">${genreMovies[i].release_date}</div> 
            </div>
          </div>
      `;

      oneRow += oneMovie;

      if (((i + 1) % 4) === 0 || i === genreMovies.length - 1) {
          oneRow += `</div>`;
          movieHtml += oneRow;

          if (i !== genreMovies.length - 1) {
              oneRow = `<div class="row">`;
          };
      };
  };

  document.getElementById("movie-board").innerHTML = movieHtml;
};



function render() {
  let movieHtml = ``;

  for (let i = 0; i < movieObject.length; i += 4) {
    // console.log(i)
    let oneRow = 
    `
      <div class="row">
    `

    for (let j = 0; j < 4 && i + j < movieObject.length; j++) {
      let posterUrl = movieObject[i+j].poster_path;
      let tmdbImageUrl = `${tmdbImageBaseUrl}${posterUrl}`
      // console.log(tmdbImageUrl);
      let oneMovie =
      `
        <div class="col-lg-3 movieCard">

          <img src="${tmdbImageUrl}">

          <div class="title">
          ${movieObject[i+j].title}
          </div>

          <div class="showing">
            <div class="grade">
              ${movieObject[i+j].vote_average}
            </div>
            <div class="date">
              ${movieObject[i+j].release_date}
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
  movieObject = await getMovieData();
  // console.log(movieObject);

  genreObject = await getGenresList();

  render();
};

main();