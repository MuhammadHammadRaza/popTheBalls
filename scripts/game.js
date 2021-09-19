const checkLevel = () => {
    let level = localStorage.getItem("level");
    return level
}

let level = checkLevel();

const row = document.querySelectorAll(".row")
const container = document.querySelector(".container")
const balls = document.querySelectorAll(".ball")

const swapX = () => {
    setInterval(() => {
        row.forEach(element => {
            element.style.flexDirection = "row"
        });
    }, 500);
}
const swapXR = () => {
    setInterval(() => {
        row.forEach(element => {
            element.style.flexDirection = "row-reverse"
        });
    }, 1000);
}
const swapY = () => setInterval(() => container.style.flexDirection = "column", 500);
const swapYR = () => setInterval(() => container.style.flexDirection = "column-reverse", 1000);

const moveX = () => {
    let left = 0, movingRight = true
    setInterval(() => {
        if (movingRight) {
            ++left; if (left == 440) { movingRight = false }
        } else {
            --left; if (left == 0) { movingRight = true }
        }
        container.style.left = `${left}px`
    }, 5);
}

const moveY = () => {
    let top = 0, movingBottom = true
    setInterval(() => {
        if (movingBottom) {
            ++top; if (top == 220) { movingBottom = false }
        } else {
            --top; if (top == 0) { movingBottom = true }
        }
        container.style.top = `${top}px`
    }, 5);
}

const size = () => {
    setInterval(() => {
        balls.forEach(element => {
            element.style.height = "130px"
            element.style.width = "130px"
        });
    }, 2000);
}

const sizeR = () => {
    setInterval(() => {
        balls.forEach(element => {
            element.style.height = "90px"
            element.style.width = "90px"
        });
    }, 3000);
}

const setDifficulty = () => {
    if (level != 1 && level != 5 && level != 8) {
        moveX();
    } if (level != 1 && level != 2 && level != 4) {
        swapX(); swapXR();
    } if (level != 1 && level != 2 && level != 3) {
        swapY(); swapYR();
    } if (level == 5 || level == 7 || level == 8 || level == 10) {
        moveY();
    } if (level >= 8) {
        size(); sizeR();
    }
}

let colorToPop, ballsToPop, life;

const coloringBalls = (balls, levelColors) => {
    // coloring balls
    for (let i = 0; i < balls.length; i++) {
        const color = (Math.ceil(Math.random() * levelColors.length)) - 1;
        balls[i].style.backgroundColor = levelColors[color];
        balls[i].style.color = levelColors[color];
        balls[i].classList.add(levelColors[color]);
    }
}

const setHeader = (tellColor, ballsToPop, colorToPop, tellLives, tellLevel) => {
    life = 30
    tellColor.style.color = colorToPop;
    tellColor.textContent = `Pop ${ballsToPop} ${colorToPop} balls to win!`;
    tellLives.textContent = `Lives: ${life}`;
    tellLevel.textContent = `Level: ${level}`;
}

const statusDiv = document.querySelector(".status-div");
const setupGameUI = () => {
    setDifficulty();
    // total colors of ball to be set according to level of user
    let totalColors = ["red", "green", "blue", "yellow", "orange", "purple", "black", "teal", "brown"], levelColors = Math.ceil(level / 2) + 4, tellColor = document.querySelector(".tell-color"), tellLives = document.querySelector(".tell-lives"), tellLevel = document.querySelector(".tell-level");
    levelColors = totalColors.slice(0, levelColors);
    coloringBalls(balls, levelColors)
    colorToPop = levelColors[(Math.ceil(Math.random() * (levelColors.length - 1)))];
    ballsToPop = document.querySelectorAll(`.${colorToPop}`).length;
    setHeader(tellColor, ballsToPop, colorToPop, tellLives, tellLevel);
    if (ballsToPop < 2) { setupGameUI() }
    startGame();
}

const startGame = () => {
    statusDiv.style.display = "block"
    statusDiv.style.backgroundColor = "blanchedalmond"
    statusDiv.innerHTML = '<img src="./img/Curve-Loading.gif" alt="loading"><br>'
    setTimeout(() => {
        statusDiv.style.display = "none"
        statusDiv.innerHTML = '';
    }, 2000);
}

const body = document.getElementsByTagName("body")[0]
body.addEventListener("load", setupGameUI())
const checkElementColor = element => {
    const tellLives = document.querySelector(".tell-lives"), tellColor = document.querySelector(".tell-color");
    if (element.classList.contains(colorToPop) && !element.classList.contains("checked")) { ballsToPop--; }
    else if (!element.classList.contains("checked")) { life--; }
    if (life < 0) { gameFailed(tellLives, statusDiv, body); }
    else if (ballsToPop == 0) { gameWon(tellLives, statusDiv, body, tellColor); }
    else { afterBallPopped(element, tellColor, tellLives); }
}

const unPopBall = element => {
    setTimeout(() => {
        element.className = "ball"
        let totalColors = ["red", "green", "blue", "yellow", "orange", "purple", "black", "teal", "brown"], levelColors = Math.ceil(level / 2) + 4, tellColor = document.querySelector(".tell-color");
        levelColors = totalColors.slice(0, levelColors);
        const colorIdx = (Math.floor(Math.random() * (levelColors.length)));
        element.classList.add(levelColors[colorIdx])
        element.style.color = levelColors[colorIdx]
        element.style.backgroundColor = levelColors[colorIdx]
        if (colorToPop == levelColors[colorIdx]) { ballsToPop++ }
        tellColor.textContent = `Pop ${ballsToPop} ${colorToPop} balls to win!`;
    }, 1000);
}

balls.forEach(ball => ball.addEventListener("mouseenter", e => checkElementColor(e.target)))


const gameFailed = (tellLives, statusDiv, body) => {
    tellLives.textContent = `Failed`;
    statusDiv.style.display = "block";
    statusDiv.innerHTML = 'Game Over!<br><a href="./game.html">Retry <i class="bi bi-arrow-counterclockwise"></i></a>'
    body.style.height = "100vh";
    body.style.overflow = "hidden";
}

const gameWon = (tellLives, statusDiv, body, tellColor) => {
    let score = 5 + (life * 5);
    tellLives.textContent = `Congratulations!`;
    tellColor.textContent = "You Won!"
    statusDiv.style.display = "block";
    statusDiv.innerHTML = `You Won!<br><img src="./img/preview.gif" alt="" id="loadingGif"><br><br>Your Score: ${score}`
    body.style.height = "100vh";
    body.style.overflow = "hidden";
    updateScorenLevel(score)
}

const afterBallPopped = (element, tellColor, tellLives) => {
    element.classList.add("checked");
    unPopBall(element);
    tellColor.textContent = `Pop ${ballsToPop} ${colorToPop} balls to win`;
    tellLives.textContent = `Lives: ${life}`;
}


const updateScorenLevel = (score) => {
    level++
    setScorenLevel(score, level);
    checkFinalLevel(level);
}

const setScorenLevel = (score, userlevel) => {
    if (userlevel <= 10) {
        localStorage.setItem("level", userlevel);
        let user = JSON.parse(localStorage.getItem("currentUser")), passedLevel = userlevel - 1;
        db.collection('levels').doc(user.uid).get()
            .then(doc => setDataBase(doc.data(), userlevel, passedLevel, score, user.uid))
            .catch(err => console.log(err.message));
    }
}

const setDataBase = (doc, userlevel, passedLevel, score, userUid) => {
    // unlock new level
    let userObj = doc;
    if (userlevel <= 10) {
        userObj.levels[userlevel] = true;
        db.collection("levels").doc(userUid).update(userObj)
            .then(() => updateLastScore(passedLevel, score, userUid))
            .catch(err => console.log(err.message));
    } else { updateLastScore(passedLevel, score, userUid) }
}

const updateLastScore = (passedLevel, score, userUid) => {
    db.collection('score').doc(userUid).get()
        .then(doc => updateScoreDB(doc.data(), passedLevel, score, userUid))
        .catch(err => console.log(err.message));
}

const updateScoreDB = (doc, passedLevel, score, userUid) => {
    let scoreObj = doc;
    scoreObj.scores[passedLevel] = score;
    db.collection('score').doc(userUid).update(scoreObj)
        .then(() => {
            statusDiv.innerHTML = `You Won!<br><a href="./game.html">Next <i class="bi bi-arrow-right"></i></a><br><br>Your Score: ${score}`
        })
        .catch(err => console.log(err.message));
}

const checkFinalLevel = level => {
    if (level > 10) {
        document.querySelector(".congrats-div").style.display = "block";
        document.querySelector(".main").style.display = "none";
        body.style.height = "100vh";
        body.style.overflow = "hidden";
    }
}