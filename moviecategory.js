// 1. HTML문서 내의 모든 메뉴 버튼을 선택
// 2. 각 메뉴 버튼에 큵릭 이벤트 리스너를 추가하여 클릭 시 getMoviesCategory 함수를 호출
// 3. 특정 카테고리의 영화 정보를 가져오는 비동기 함수를 정의 
// 4. 클릭된 버튼의 id 값을 가져와서 카테고리로 설정 
// 5. 클릭된 버튼에 따라서 다른 카테고리의 API엔드포인트를 선택 
// 6. URL에 API키, 언어 및 페이지 번호를 쿼리 문자열로 추가 // 입력 값 확인 'api_key', API_ACCESS_TOKEN
// 7. URL로부터 데이터를 가져오는 비동기적인 fetch 요청을 수행 // * URL = new URL 중복이 괜찮은지 여부 
// 8. 응답이 성공적이지 않으면 오류를 throw
// 9. 응답 데이터를 JSON 형식으로 파싱
// 10. 파싱된 데이터를 render()로 전달하여 화면에 표시 // * 맞는지 확인 필요 results?
// 11. try-catch 블록을 사용하여 에러를 처리. 에러 발생하면 콘솔에 에러메시지 출력
// 12. getMoviesCategory 함수의 정의를 종료 
// 13. *(지적사항) movieList 변수를 어디서 정의하고 사용하는지 확인 필요 (해결책) 함수 지정 movieList = data.result
// 14. *(지적사항) getMoviesCategory 함수 사용전 미리 정의 필요 (해결책) 함수 실행 위치에 초기값으로 지정, 함수 호출 여부

const menus = document.querySelectorAll(".menus button");

menus.forEach(menu => menu.addEventListener("click", (event) => getMoviesCategory(event)));

const getMoviesCategory = async (event) => {
    const category = event.target.id;
    movieList = data.results // 지피티 문제 지적 수용 
    let url;
    if (category === 'popular' || category === 'top_rated' || category === 'now_playing' || category === 'upcoming') {
        url = new URL(`https://api.themoviedb.org/3/movie/${category}`);
    } else {
        console.error('Invalid category');
        return;
    }

    url.searchParams.append('api_key', API_ACCESS_TOKEN); // 맞는지 확인 필요 
    url.searchParams.append('language', 'ko-KR');
    url.searchParams.append('page', '1');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        render(data.results);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

// 1. 영화 목록을 화면에 렌더링하는 함수차용 (메인 자바스크립트의 now playing 렌더 함수 재활용) 
// 2. 영화를 표시할 요소를 가져와서 내용을 초기화 
// 3. 영화 목록의 각 항목에 대해 반복
// 4. 각 영화에 대한 새로운 요소를 생성하고 클래스를 추가 
// 5. 영화 포스터, 제목 및 줄거리를 포함한 HTML 자리에 생성

const render=()=> {
    let movieHtml = ''
    
    for(let i=0;i<movieList.length;i++){
      movieHtml+=`
      <div class="col-lg-3 col-md-4 col-sm-6 movieCard">
      
      <img src="${tmdbImageBaseUrl}${movieList[i].poster_path}">
      
      <div class="title">
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