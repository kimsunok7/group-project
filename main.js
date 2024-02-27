const apiKey = '5417774e80264c08899aa6b53db4b6c5';

function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.className = 'card';

    const movieImage = document.createElement('img');
    movieImage.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    const movieBody = document.createElement('div');
    movieBody.className = 'card-body';
    movieBody.textContent = movie.title;

    movieCard.appendChild(movieImage);
    movieCard.appendChild(movieBody);

    return movieCard;
}

function loadMovies(category) {
    let url;
    switch (category) {
        case 'popular':
            url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&api_key=${apiKey}`;
            break;
        case 'korean':
            url = `https://api.themoviedb.org/3/discover/movie?with_original_language=ko&language=ko-KR&api_key=${apiKey}`;
            break;
        case 'action':
            url = `https://api.themoviedb.org/3/discover/movie?with_genres=28&language=ko-KR&api_key=${apiKey}`;
            break;
        case 'comedy':
            url = `https://api.themoviedb.org/3/discover/movie?with_genres=35&language=ko-KR&api_key=${apiKey}`;
            break;
        case 'romance':
            url = `https://api.themoviedb.org/3/discover/movie?with_genres=10749&language=ko-KR&api_key=${apiKey}`;
            break;
        default:
            url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&api_key=${apiKey}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {

            const movieContainer = document.querySelector('#movie-container');
            movieContainer.innerHTML = ''; // 컨테이너 비우기


            // 18개의 결과만 사용 ///////////////////////////////////////////////
            const moviesToShow = data.results.slice(0, 18);
            moviesToShow.forEach(movie => {
                const movieCard = createMovieCard(movie);
                movieContainer.appendChild(movieCard);
            });
            // /////////////////////////////////////////////////////////////////

            // 기존 20개 나오게 하기 ////////////////////////////////////////////
            // data.results.forEach(movie => {
            //     const movieCard = createMovieCard(movie);
            //     movieContainer.appendChild(movieCard);

            // });
            // /////////////////////////////////////////////////////////////////

            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
            // 에러 발생 시
            alert('영화를 불러오는데 실패했습니다. 콘솔을 확인해주세요.');
        });
}

// 초기 카테고리 로드
loadMovies('popular');


// 네비게이션 탭 메뉴 active 효과 주기
document.querySelectorAll('.tab-link').forEach(tab => {
    tab.addEventListener('click', function () {
        // 모든 탭에서 'active' 클래스 제거
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });

        // 클릭된 탭에 'active' 클래스 추가
        this.classList.add('active');
    });
});