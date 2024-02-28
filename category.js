// HTML <div id="movie-container"> 추가 
// HTML button, id="popular" "top_rated" "now_playing"  값 추가 

const apiKey = ''; // 키값 설정 

// 1. 현재 상영중인 영화 목록을 URL로 만듬 
// 2. URL에 API 키, 언어 및 페이지 번호를 쿼리 문자열로 추가 
// 3. try 함수를 써서 URL 정보 가져오고 오류 Catch
// 4. 응답 데이터를 JSON 형식으로 파싱 
// 5. 파싱된 데이터를 render() 함수로 전달하여 화면에 표시 
// 6. 발생된 에러 콘솔에 메시지 출력 
// 7. getAllMovies 함수 종료 


const getAllMovies = async () => {
    const url = new URL('https://api.themoviedb.org/3/movie/now_playing');
    url.searchParams.append('api_key', apiKey);
    url.searchParams.append('language', 'en-US');
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

// 1. HTML문서 내의 모든 메뉴 버튼을 선택
// 2. 각 메뉴 버튼에 큵릭 이벤트 리스너를 추가하여 클릭 시 getMoviesCategory 함수를 호출
// 3. 특정 카테고리의 영화 정보를 가져오는 비동기 함수를 정의 
// 4. 클릭된 버튼의 id 값을 가져와서 카테고리로 설정 
// 5. 클릭된 버튼에 따라서 다른 카테고리의 API엔드포인트를 선택 
// 6. URL에 API키, 언어 및 페이지 번호를 쿼리 문자열로 추가 
// 7. URL로부터 데이터를 가져오는 비동기적인 fetch 요청을 수행
// 8. 응답이 성공적이지 않으면 오류를 throw
// 9. 응답 데이터를 JSON 형식으로 파싱
// 10. 파싱된 데이터를 render()로 전달하여 화면에 표시
// 11. try-catch 블록을 사용하여 에러를 처리. 에러 발생하면 콜솔에 에러메시지 출력
// 12. getMoviesCategory 함수의 정의를 종료 

const menus = document.querySelectorAll(".menus button");

menus.forEach(menu => menu.addEventListener("click", (event) => getMoviesCategory(event)));

const getMoviesCategory = async (event) => {
    const category = event.target.id;

    let url;
    if (category === 'popular' || category === 'top_rated' || category === 'now_playing') {
        url = new URL(`https://api.themoviedb.org/3/movie/${category}`);
    } else {
        console.error('Invalid category');
        return;
    }

    url.searchParams.append('api_key', apiKey);
    url.searchParams.append('language', 'en-US');
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


// 1. 영화 목록을 화면에 렌더링하는 함수를 정의 
// 2. 영화를 표시할 요소를 가져와서 내용을 초기화 
// 3. 영화 목록의 각 항목에 대해 반복
// 4. 각 영화에 대한 새로운 요소를 생성하고 클래스를 추가 
// 5. 영화 포스터, 제목 및 줄거리를 포함한 HTML을 생성
// 6. movieContainer에 movieElement를 자식요소로 추가하여 화면 표시  



const render = (movieList) => {
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = '';

    movieList.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.overview}</p>
        `;
        movieContainer.appendChild(movieElement);
    });
};
