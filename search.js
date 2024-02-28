const searchIcon = document.querySelector(".searchIcon");
const searchInput = document.querySelector(".searchInput");

searchIcon.addEventListener("click", () => {
  searchIcon.classList.add("active");
  searchInput.classList.add("active");
});
