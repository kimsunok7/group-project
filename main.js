let API_ACCESS_TOKEN = config.TMDB_API_ACCESS_TOKEN; //API 토큰 받아오기
let url = new URL(`https://api.themoviedb.org/3/movie/now_playing?region=KR&language=ko-KR`) //현재 한국에서 상영중인 영화목록(기본셋팅)
let tmdbImageBaseUrl = "https://image.tmdb.org/t/p/w500";



const pageSize = 20 // 한 페이지에 들어갈 개수
const groupSize = 10 // pagination 5개씩 묶음
let page = 1
let totalResult=0
let totalPage=0

let movieList = []
let genresList = []
let likeLMovieList = []
let genreObject = {};

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_ACCESS_TOKEN}`
    }
};



/* 장르 버튼 별로 버튼 생성 및 클릭 이벤트 추가 */
const genreMenus = document.querySelectorAll("#genre_menus button");
genreMenus.forEach(genre => genre.addEventListener("click", (event) => genreFilterRender(event)));

// 초기화할 정보를 넣는 함수
const settingInitial=()=>{
  page = 1
}


/* TMDB에서 영화 데이터를 가져오는 함수 */
const getMovieData =async()=> {
    url.searchParams.set("page",page) // =>&page=page
    url.searchParams.set("pageSize",pageSize)
    const response = await fetch(url, options);
    const data = await response.json();
    movieList = data.results
    totalResult = data.total_results // 전체 개수 불러오기
    totalPage = data.total_pages // 전체 페이지 불러오기

    console.log("데이터 확인",data)
    render()
    paginationRender()
};


/* TMDB API를 통해 등록되어 있는 장르 id와 장르 이름이 담겨 있는 데이터를 가져오는 함수 */
const getGenresList=async()=> {
  url = new URL('https://api.themoviedb.org/3/genre/movie/list?language=en')
  const response = await fetch(url, options);
  const data = await response.json();
  genresList = data.genres
};




/* 클릭한 장르에 해당하는 영화 목록만 필터링해서 렌더링해서 index.html 페이지에 보여주는 함수 */
const genreFilterRender=(event)=> {
  settingInitial()
  const genreName = event.target.textContent;
  let genreId = 0;
  let genreMovies = [];

  // 클릭한 장르 텍스트를 의미하는 ID 값 찾기
  for (let i = 0; i < genresList.length; i++) {
    if (genresList[i].name === genreName) {
      genreId = genresList[i].id
      break
    };
  
  };

  url = new URL(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=ko-KR&watch_region=KR`)
  getMovieData()

};


/* NowPlaying 영화 목록을 렌더링해서 index.html 페이지에 추가하는 함수 */
const render=()=> {
  let movieHtml = ''
  for(let i=0;i<movieList.length;i++){
    
    movieHtml+=`
    <div class="col-lg-3 col-md-4 col-sm-6 movieCard" onclick="selectMovie(movieList[${i}].title)">
    
    <img src="${tmdbImageBaseUrl}${movieList[i].poster_path}">
    
    <div class="title"">
    ${movieList[i].title}
    </div>
    
    <div class="showing">
      <div class="grade">
        ${movieList[i].vote_average}
      </div>
      <div class="date">
        ${movieList[i].release_date}
      </div> 
    </div>
    
    </div>`
  }

 
  document.getElementById("movie-board-input").innerHTML = movieHtml;

};

const selectMovie = (title) => {
  console.log("처음",likeLMovieList.length)
  if(likeLMovieList.length>4){
    alert("5개까지만 찜이 가능합니다!")
    return
  }
  likeLMovieList.push(title)
 
  likeMovieRender()
};

const likeMovieRender = ()=>{
  let likeMovieHTML = ''
  
  for(let i=0;i<likeLMovieList.length;i++){
    likeMovieHTML+=`
    <div class="likeMovie-list">
      ${likeLMovieList[i]}
    </div>
    `
  }
  document.getElementById("likeMovieInput").innerHTML=likeMovieHTML
}


/* 구현한 함수를 동작 순서대로 담아서 최종 실행하는 main 함수 */
const main = async()=> {
  settingInitial()
  getGenresList() //장르목록을 가져오는 함수
  url = new URL(`https://api.themoviedb.org/3/movie/now_playing?region=KR&language=ko-KR`)  //현재 한국에서 상영중인 영화목록(기본셋팅)
  //url = new URL(`https://api.themoviedb.org/3/search/movie?query=황야&language=ko-KR&page=1`) 
  getMovieData()
};

main();

//home icon을 누르면 기본 셋팅으로 돌아가는 기능
const homeIcon = document.querySelector(".header-img")
homeIcon.addEventListener("click",main)


const paginationRender= ()=>{
  // pageSize
  // page
  // groupSize
  // totalPage
  // totalResult

  // pageGroup
  const pageGroup = Math.ceil(page/groupSize)
  // firstPage, lastPage
  let lastPage = pageGroup * groupSize
  // 예) lastPage가 5인데 totalPage가 3인경우
  if(lastPage>totalPage){
      lastPage=totalPage
  }
  // 예) lastPage가 3이면 firstPage가 음수가 된다 이러한 일을 방지
  let firstPage = lastPage - (groupSize-1) <=0 ? 1 : pageGroup * groupSize - (groupSize-1)
  
  let paginationHTML = ''
  if(pageGroup!==1){
      paginationHTML+=`
          <li class="page-item" onclick="moveToPreGroupPage(${firstPage})"><a class="page-link" href="#">< 이전</a></li>
      `
  }
  for(let i=firstPage;i<=lastPage;i++){
      paginationHTML+=`
          <li class="page-item" onclick="moveToPage(${i})"><a class="page-link ${i===page?"active2":''}" href="#">${i}</a></li>
      `
  }
  if(pageGroup!==Math.ceil(totalPage/groupSize)){
      paginationHTML+=`
          <li class="page-item" onclick="moveToNextGroupPage(${firstPage})"><a class="page-link" href="#">다음 ></a></li>
      `
  }
  

  document.querySelector(".pagination").innerHTML = paginationHTML
}


//클릭한 page로 넘어가는 함수
const moveToPage = (pageNum)=>{
  page = pageNum
  getMovieData()
}

//다음페이지로 넘어가는 함수
const moveToNextGroupPage = (pageNum)=>{
  page = pageNum + groupSize;
  getMovieData()
}

//이전페이지로 넘어가는 함수
const moveToPreGroupPage = (pageNum)=>{
  page = pageNum - groupSize
  getMovieData()
}



  // // 클릭한 장르 ID 값과 대응하는 영화 목록만 필터링
  // for (let i = 0; i < movieObject.length; i++) {
  //   if (movieObject[i].genre_ids.includes(genreId)){
  //     genreMovies.push(movieObject[i])
  //   };
  // };
  // console.log(genreMovies);


  // // 장르에 해당하는 영화 목록을 보여주기 위한 HTML 코드 index.html에 추가하기
  // let movieHtml = ``;
  // let oneRow = `<div class="row">`;

  // for (let i = 0; i < genreMovies.length; i++) {
  //     let posterUrl = genreMovies[i].poster_path;
  //     let tmdbImageUrl = `${tmdbImageBaseUrl}${posterUrl}`;

  //     let oneMovie = `
  //         <div class="col-lg-3 movieCard">
  //           <img src="${tmdbImageUrl}">
  //           <div class="title">${genreMovies[i].title}</div>
  //           <div class="showing">
  //             <div class="grade">${genreMovies[i].vote_average}</div>
  //             <div class="date">${genreMovies[i].release_date}</div> 
  //           </div>
  //         </div>
  //     `;

  //     oneRow += oneMovie;

  //     if (((i + 1) % 4) === 0 || i === genreMovies.length - 1) {
  //         oneRow += `</div>`;
  //         movieHtml += oneRow;

  //         if (i !== genreMovies.length - 1) {
  //             oneRow = `<div class="row">`;
  //         };
  //     };
  // };

  // document.getElementById("movie-board").innerHTML = movieHtml;