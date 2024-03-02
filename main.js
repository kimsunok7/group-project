let API_ACCESS_TOKEN = config.TMDB_API_ACCESS_TOKEN; //API 토큰 받아오기
let url = new URL(
  `https://api.themoviedb.org/3/movie/now_playing?region=KR&language=ko-KR`
); //현재 한국에서 상영중인 영화목록(기본셋팅)
let tmdbImageBaseUrl = "https://image.tmdb.org/t/p/w500";

//선옥작성
const searchIcon = document.querySelector(".searchIcon");
const search2Icon = document.querySelector(".search2Icon");
const searchInput = document.querySelector(".searchInput");
const grade = document.querySelector(".grade");

searchIcon.addEventListener("click", () => {
  searchIcon.classList.add("active");
  searchInput.classList.add("active");
  search2Icon.classList.add("active");
});

const getMoviesByKeyword = async () => {
  const keyword = searchInput.value;
  console.log("keyword", keyword);
  url = new URL(
    `https://api.themoviedb.org/3/search/movie?query=${keyword}&language=ko-KR`
  );
  getMovieData();
};

// 호진 작성

const menus = document.querySelectorAll(".menus button");
console.log("mmm", menus);

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getMoviesCategory(event))
);

const getMoviesCategory = async (event) => {
  const category = event.target.id;
  console.log("category", category);
  let url;
  if (
    category === "popular" ||
    category === "top_rated" ||
    category === "now_playing"
  ) {
    url = new URL(`https://api.themoviedb.org/3/movie/${category}`);
    url.searchParams.append("language", "ko-KR");
  } else {
    console.error("Invalid category");
    return;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("category", data);
    movieList = data.results;
    render();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

// 수영작성
const pageSize = 20; // 한 페이지에 들어갈 개수
const groupSize = 10; // pagination 5개씩 묶음
let page = 1;
let totalResult = 0;
let totalPage = 0;
let movieList = [];
let genresList = [];
let likeLMovieList = [];
let genreObject = {};

/* 여러개 장르를 선택할 때, 선택한 장르들의 id 값을 담아줄 변수 selectedGenresList 선언 */
let selectedGenresList = [];

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_ACCESS_TOKEN}`,
  },
};

/* 장르 버튼 별로 버튼 생성 및 클릭 이벤트 추가 */
const genreMenus = document.querySelectorAll("#genre_menus button");
genreMenus.forEach((genre) =>
  genre.addEventListener("click", (event) => genreFilterRender(event))
);

/* TMDB에서 영화 데이터를 가져오는 함수 */
const getMovieData = async () => {
  try {
    url.searchParams.set("page", page); // =>&page=page
    url.searchParams.set("pageSize", pageSize);

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.status === 200) {
      if (data.results.length === 0) {
        throw new Error("No result for this search");
      }
      movieList = data.results;
      totalResult = data.total_results; // 전체 개수 불러오기
      totalPage = data.total_pages; // 전체 페이지 불러오기

      console.log("데이터 확인", data);
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("error여기맞지?", error.message);
    errorRender(error.message);
  }
};

/* TMDB API를 통해 등록되어 있는 장르 id와 장르 이름이 담겨 있는 데이터를 가져오는 함수 */
const getGenresList = async () => {
  url = new URL(
    "https://api.themoviedb.org/3/genre/movie/list?&language=ko-KR"
  );
  const response = await fetch(url, options);
  const data = await response.json();
  genresList = data.genres;
};

/* 클릭한 장르에 해당하는 영화 목록만 필터링해서 렌더링해서 index.html 페이지에 보여주는 함수 */
const genreFilterRender = (event) => {
  page = 1; // 장르를 누르면 1페이지로 초기설정
  const genreName = event.target.textContent;
  let genreId = 0;

  // 클릭한 장르 텍스트를 의미하는 ID 값 찾기
  for (let i = 0; i < genresList.length; i++) {
    if (genresList[i].name === genreName) {
      genreId = genresList[i].id;
      break;
    }
  }

  // selectedGenresList 배열 안에 선택한 장르의 ID 값을 중복 체크하여 추가하기
  if (selectedGenresList.length === 0) {
    selectedGenresList.push(genreId);
  } else if (selectedGenresList.includes(genreId)) {
    selectedGenresList.forEach((id, idx) => {
      if (id === genreId) {
        selectedGenresList.splice(idx, 1);
      }
    });
  } else {
    selectedGenresList.push(genreId);
  }
  console.log(selectedGenresList);

  // selectedGenresList 배열 안에 담긴 ID 값을 기반으로 하이라이트 표시하는 함수 호출
  highlightSelectedGenreButtons();

  /* 선택한 여러개의 장르 ID 값을 콤마로 구분해서 URL에 넣도록 수정 */
  url = new URL(
    `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenresList.join(
      ","
    )}&language=ko-KR`
  );
  getMovieData();
};

/* 선택한 장르의 버튼들만 색깔이 파란색으로 표시되도록 하는 함수 */
function highlightSelectedGenreButtons() {
  genreMenus.forEach((genre) => {
    genre.classList.remove("highlight");
  });

  if (selectedGenresList.length !== 0) {
    selectedGenresList.forEach((id) => {
      let genreClassName = "";
      for (let i = 0; i < genresList.length; i++) {
        if (id === genresList[i].id) {
          genreClassName = genresList[i].name;
        }
      }
      genreMenus.forEach((genre) => {
        if (genre.id === genreClassName) {
          genre.classList.add("highlight");
        }
      });
    });
  }
}

/* 리셋 버튼 작업 진행 중 */
function resetBtn() {
  const resetButton = document.getElementById("clear");
  if (selectedGenresList.length === 0) {
    resetButton.style.display = "none";
  } else {
    resetButton.classList.add("highlight");
    resetButton.addEventListener("click", () => {
      selectedGenresList = [];
      genreMenus.forEach((genre) => {
        genre.classList.remove("highlight");
      });
    });
  }
}

/* NowPlaying 영화 목록을 렌더링해서 index.html 페이지에 추가하는 함수 */
const render = () => {
  searchInput.value = ""; //입력창 초기화
  let movieHtml = "";

  for (let i = 0; i < movieList.length; i++) {
    let vote = movieList[i].vote_average;
    let gradeColor = "";

    if (vote >= 8) {
      gradeColor = "#28a745";
    } else if (vote > 6) {
      gradeColor = "purple";
    } else {
      gradeColor = "#777777";
    }

    // 장르 정보를 가져와서 추가
    let genres = [];
    for (let j = 0; j < movieList[i].genre_ids.length; j++) {
      for (let k = 0; k < genresList.length; k++) {
        if (movieList[i].genre_ids[j] === genresList[k].id) {
          genres.push(genresList[k].name);
          break;
        }
      }
    }
    let genreNames = genres.join(", ");

    movieHtml += `
    <div class="col-lg-3 col-md-4 col-sm-6 movieCard">
      <div class="cardImageArea">
      <img src="${movieList[i].poster_path ? tmdbImageBaseUrl + movieList[i].poster_path : 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-10.png'}">
          <div class="overview">
            <p>
              ${
                movieList[i].overview == null || movieList[i].overview == ""
                  ? ""
                  : movieList[i].overview.length > 200
                  ? movieList[i].overview.substring(0, 200) + "..."
                  : movieList[i].overview
              }
            </p>
          </div>
      </div>
    <div class="title">
      <div>
        ${movieList[i].title}
      </div>
      <div class="heart-img"  onclick="selectMovie(movieList[${i}].title)">
          <i class="fa-solid fa-heart"></i>
        </div>
     
    </div>
    

    <div class="genre">
      ${genreNames}
      </div>
    <div class="showing">
      <div class="grade" style="background-color:${gradeColor}">
    
        ${movieList[i].vote_average.toFixed(1)}
      </div>
      
      <div class="date">
        ${movieList[i].release_date}
      </div> 
    </div>
    
    </div>`;
  }

  document.getElementById("movie-board-input").innerHTML = movieHtml;
};

//에러날때 에러Render추가
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${errorMessage}
</div>`;
  document.getElementById("movie-board-input").innerHTML = errorHTML;
};

/* 구현한 함수를 동작 순서대로 담아서 최종 실행하는 main 함수 */
const main = async () => {
  page = 1;
  getGenresList();

  // 장르 버튼들 하이라이트 되어 있는 것 초기화 및 선택한 장르들의 ID 값을 담고 있는 배열도 초기화
  genreMenus.forEach((genre) => {
    genre.classList.remove("highlight");
  });
  selectedGenresList = [];

  url = new URL(
    `https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&region=KR`
  );
  getMovieData();
};

main();

const paginationRender = () => {
  // pageSize
  // page
  // groupSize
  // totalPage
  // totalResult

  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // firstPage, lastPage
  let lastPage = pageGroup * groupSize;
  // 예) lastPage가 5인데 totalPage가 3인경우
  if (lastPage > totalPage) {
    lastPage = totalPage;
  }
  // 예) lastPage가 3이면 firstPage가 음수가 된다 이러한 일을 방지
  let firstPage =
    lastPage - (groupSize - 1) <= 0
      ? 1
      : pageGroup * groupSize - (groupSize - 1);

  let paginationHTML = "";
  if (pageGroup !== 1) {
    paginationHTML += `
          <li class="page-item" onclick="moveToPreGroupPage(${firstPage})"><a class="page-link" href="#">< 이전</a></li>
      `;
  }
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `
          <li class="page-item" onclick="moveToPage(${i})"><a class="page-link ${
      i === page ? "active2" : ""
    }" href="#">${i}</a></li>
      `;
  }
  if (pageGroup !== Math.ceil(totalPage / groupSize)) {
    paginationHTML += `
          <li class="page-item" onclick="moveToNextGroupPage(${firstPage})"><a class="page-link" href="#">다음 ></a></li>
      `;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

//클릭한 page로 넘어가는 함수
const moveToPage = (pageNum) => {
  page = pageNum;
  getMovieData();
};

//다음페이지로 넘어가는 함수
const moveToNextGroupPage = (pageNum) => {
  page = pageNum + groupSize;
  getMovieData();
};

//이전페이지로 넘어가는 함수
const moveToPreGroupPage = (pageNum) => {
  page = pageNum - groupSize;
  getMovieData();
};
