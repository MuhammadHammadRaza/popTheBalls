// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});

const setupUI = doc => {
  if (doc) {
    // account info
    setAccountDetail(doc)
    toggleUIButtons("block", "none");
  } else {
    // account info
    setAccountDetail()
    // Toggle UI Elements
    toggleUIButtons("none", "block");
  }
}
// account detail modal
const levelsList = document.querySelector(".levels");
const setAccountDetail = doc => {
  const accountDetails = document.querySelector(".account-details");
  if (doc) {
    accountDetails.innerHTML = `<div>Logged in as: <b>${doc.data().username}</b></div>
      <div>Last Logged In: ${doc.data().lastLoggedIn}</div>`;
    levelsList.style.display = "block"
  } else {
    levelsList.style.display = "none"
    accountDetails.innerHTML = ``
  }
}

const toggleUIButtons = (login, logout) => {
  const loggedOutLinks = document.querySelectorAll(".logged-out");
  const loggedInLinks = document.querySelectorAll(".logged-in");
  loggedInLinks.forEach(item => item.style.display = login);
  loggedOutLinks.forEach(item => item.style.display = logout);
}

const setupLevels = (level, score) => {
  let html = '';
  for (let i = 1; i <= 10; i++) {
    if (level.levels[i]) {
      html += createUnlockedDivs(i, score);
    } else {
      html += createLockedDivs(i);
    }
  }
  levelsList.innerHTML = html;
}

const createLockedDivs = (i) => {
  html = `  <li>
    <div class="collapsible-header grey lighten-4">Level ${i}</div>
    <div class="collapsible-body white">
      <div class="d-flex justify-content-around">
        <div>
          <p class="fs-5">Locked<i class="ms-1 bi bi-lock-fill"></i></p>
        </div>
      </div>
    </div>
  </li>`
  return html
}

const createUnlockedDivs = (i, score) => {
  let html = `  <li>
    <div class="collapsible-header grey lighten-4">Level ${i}</div>
    <div class="collapsible-body white">
      <div class="d-flex justify-content-around">
        <div>
          <a href="./game.html" class="text-dark" onclick="startGame(${i})"><p class="fs-5">Play<i class="ms-1 bi bi-play-circle"></i></p></a>
        </div>
        <div>
          <p class="fs-5">Score: ${score.scores[i]}</p>
        </div>
      </div>
    </div>
  </li>`
return html
}

const startGame = level => {
  localStorage.setItem("level", level);
}