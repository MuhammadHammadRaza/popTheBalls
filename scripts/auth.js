// time settings
const formatDate = (date, month, year) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
    month = monthNames[month];
    if (date == 1 || date == 21 || date == 31) { date = `${date}st` }
    else if (date == 2 || date == 22) { date = `${date}nd` }
    else if (date == 3 || date == 23) { date = `${date}rd` }
    else { date = `${date}th` }
    const formattedDate = `${date} ${month} ${year}`;
    return formattedDate;
}

const formatTime = (minutes, hours) => {
    if (minutes < 10) { minutes = `0${minutes}` }
    if (hours > 12) {
        hours -= 12
        minutes = `${minutes} PM`
    } else if (hours == 0) {
        hours = 12
        minutes = `${minutes} AM`
    } else { minutes = `${minutes} AM` }
    const formattedTime = `${hours}:${minutes}`;
    return formattedTime;
}

const currentTimeAndDate = () => {
    // setting display date
    let date = new Date().getDate();
    let month = new Date().getMonth();
    const year = new Date().getFullYear();
    let minutes = new Date().getMinutes();
    let hours = new Date().getHours();
    const showDate = formatDate(date, month, year);
    const showTime = formatTime(minutes, hours);
    let timeAndDate = `On ${showDate} At ${showTime}`;
    return timeAndDate;
}


// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        getUI(user)
        localStorage.setItem("currentUser", JSON.stringify(user));
        updateLastLoggedIn(user);
    } else {
        setupUI(false);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("level");
    }
});
// get UI values from firestore
const getUI = user => {
    db.collection('users').doc(user.uid).get()
        .then(doc => setupUI(doc))
        .catch(err => console.log(err.message))
    db.collection('levels').doc(user.uid).get()
        .then(levels => getScores(levels.data(), user))
        .catch(err => console.log(err.message))
}

// get user score from firestore
const getScores = (levels, user) => {
    db.collection('score').doc(user.uid).get()
        .then(score => setupLevels(levels, score.data()))
        .catch(err => console.log(err.message))
}

const updateLastLoggedIn = user => db.collection('users').doc(user.uid).update({ lastLoggedIn: currentTimeAndDate() })

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const username = signupForm['user-name'].value;
    const time = currentTimeAndDate();
    (password.length > 5) ? registerUser(email, password, username, time, signupForm) : showError("Password Should Be Six Character Long!", "#signup-error")
});

const googleSignInBtn = document.querySelector("#googleSignIn");
googleSignInBtn.addEventListener("click", () => signInWithGoogle())
const signInWithGoogle = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(googleProvider)
        .then(cred => {
            const time = currentTimeAndDate();
            setUserDB(cred, cred.user.displayName, time, signupForm)
        })
        .catch(error => console.log(error.message));
}
// show error in modal
const showError = (err, spanId) => {
    document.querySelector(spanId).textContent = err;
    setTimeout(() => document.querySelector(spanId).textContent = "", 2000);
}

// create level object to set in user firestore
const createLevelObj = () => {
    let levels = {};
    for (let i = 1; i <= 10; i++) {
        levels[i] = false
    }
    levels["1"] = true
    let level = { levels }
    return level;
}

// create score object to set in user firestore
const createScoreBoard = () => {
    let scores = {};
    for (let i = 1; i <= 10; i++) {
        scores[i] = 0
    }
    let score = { scores }
    return score;
}

// close signup/login modal
const closeModal = (modalId, type) => {
    // close the modal & reset form
    const modal = document.querySelector(modalId);
    type.reset();
    M.Modal.getInstance(modal).close();
}

// register user in firebase auth
const registerUser = (email, password, username, lastLoggedIn, signupForm) => {
    auth.createUserWithEmailAndPassword(email, password)
        .then(cred => setUserDB(cred, username, lastLoggedIn, signupForm))
        .catch(err => showError(err.message))
}

// set user info in firestore on registration
const setUserDB = (cred, username, lastLoggedIn, signupForm) => {
    db.collection('users').doc(cred.user.uid).set({ username, lastLoggedIn })
        .then(() => setCreateLevel(cred, signupForm))
        .catch(err => showError(err.message))
}

// set user level object in firestore on registration
const setCreateLevel = (cred, signupForm) => {
    db.collection('levels').doc(cred.user.uid).set(createLevelObj())
        .then(() => setCreateScore(cred, signupForm))
        .catch(err => showError(err.message))
}

// set user score object in firestore on registration
const setCreateScore = (cred, signupForm) => {
    db.collection('score').doc(cred.user.uid).set(createScoreBoard())
        .then(() => closeModal("#modal-signup", signupForm))
        .catch(err => showError(err.message))
}

const logout = document.querySelector('#logout');
logout.addEventListener('click', () => auth.signOut());

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    loginUser(email, password, loginForm);
});

const loginUser = (email, password, loginForm) => {
    auth.signInWithEmailAndPassword(email, password)
        .then(user => closeModal("#modal-login", loginForm))
        .catch(err => showError(err.message, "#login-error"));
}