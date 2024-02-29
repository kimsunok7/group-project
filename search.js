const searchIcon = document.querySelector(".searchIcon");
const searchInput = document.querySelector(".searchInput");

searchIcon.addEventListener("click", () => {
  searchIcon.classList.add("active");
  searchInput.classList.add("active");
});

const getMoviesByKeyword = async () => {
  const keyword = searchInput.value;
  console.log("keyword", keyword);
  url = new URL(
    `https://api.themoviedb.org/3/search/movie?query=${keyword}&region=KR&api_key=${apiKey}`
  );

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("keyword", data);
    newsList = data.results;
    render();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

getMoviesByKeyword()

const menus = document.querySelectorAll(".menus button");

menus.forEach(menu => menu.addEventListener("click", (event) => movieCategory(event)));

const movieCategory = async (event) => {
    const category = event.target.id;
    let url;
    if (category === 'popular' || category === 'top_rated' || category === 'now_playing'  || category === 'upcoming') {
        url = new URL(`https://api.themoviedb.org/3/movie/${category}`);
    } else {
        console.error('Invalid category');
        return;
    }

    url.searchParams.append('api_key', apiKey);
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

movieCategory()