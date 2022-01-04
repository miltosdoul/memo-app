const images = {
    "img1": {
        "id": 1,
        "url": "./images/img1.png" 
    },
    "img2":{
        "id": 2,
        "url": "./images/img2.png" 
    },
    "img3":{
        "id": 3,
        "url": "./images/img3.png" 
    },
    "img4":{
        "id": 4,
        "url": "./images/img4.png" 
    },
    "img5":{
        "id": 5,
        "url": "./images/img5.jpeg" 
    },
    "img6":{
        "id": 6,
        "url": "./images/img6.png" 
    },
    "img7":{
        "id": 7,
        "url": "./images/img7.png" 
    },
    "img8":{
        "id": 8,
        "url": "./images/img8.png" 
    },
    "img9":{
        "id": 9,
        "url": "./images/img9.png" 
    },
    "img10":{
        "id": 10,
        "url": "./images/img10.jpg" 
    },
    "img11":{
        "id": 11,
        "url": "./images/img11.jpg" 
    },
    "img12":{
        "id": 12,
        "url": "./images/img12.png" 
    },
    "img13":{
        "id": 13,
        "url": "./images/img13.jpg" 
    },
    "img14":{
        "id": 14,
        "url": "./images/img14.jpg" 
    },
    "img15":{
        "id": 15,
        "url": "./images/img15.jpg" 
    },
    "img16":{
        "id": 16,
        "url": "./images/img16.jpg" 
    },
    "img17":{
        "id": 17,
        "url": "./images/img17.png" 
    },
    "img18":{
        "id": 18,
        "url": "./images/img18.png" 
    }
};

const user = {
    "name" : "",
    "points": 0
}

const MAX_SQUARES = 36;
let activeElement = null;

let loginbutton = document.querySelector('.login');
let startGameButton = document.querySelector('#start-game');
let appEl = document.querySelector('#app');
let scoreEl = document.querySelector('#score');

let waiting = false;

scoreEl.append('user score');

const populateGrid = (n) => {
    let keys = Object.keys(images);

    for(let i = keys.length - ((n*n)/2); i > 0; i--) {
        const prop = keys[Math.floor(Math.random()*keys.length)];
        keys.splice(keys.indexOf(prop), 1);
    }

    keys = keys.map(str => ({
        name: str,
        uses: 2
    }));

    for(let i = n*n; i > 0; i--) {
        let squareEl = document.createElement('div');
        squareEl.classList.add('square');
        let squareInnerEl = document.createElement('div');
        squareInnerEl.classList.add('square-inner');
        let squareFrontEl = document.createElement('div');
        squareFrontEl.classList.add('square-front');
        let squareBackEl = document.createElement('div');
        squareBackEl.classList.add('square-back');
        let memoImgEl = document.createElement('img');
        memoImgEl.classList.add('memo_img');

        let randKey = keys[Math.floor(Math.random() * keys.length)];

        while(randKey.uses === 0) {
            keys.splice(keys.indexOf(randKey),1);
            randKey = keys[Math.floor(Math.random() * keys.length)];
        }

        memoImgEl.src = images[randKey.name].url;
        squareEl.id = randKey.name;
        randKey.uses -= 1;

        squareBackEl.appendChild(memoImgEl);
        squareInnerEl.appendChild(squareFrontEl);
        squareInnerEl.appendChild(squareBackEl);
        squareEl.appendChild(squareInnerEl);

        appEl.appendChild(squareEl);
    }
}

function checkIfCompleted() {
    let squares = document.querySelectorAll('.square');
    for(let i of squares) {
        if(!i.classList.contains('flipped')) {    
            return 0;
        }
    }
    return 1;
}

function handleCompleted() {
    if(checkIfCompleted() === 1)  {
        window.alert("congratulations!");
    }
    else return 0;
}

function clearGrid(el) {
    waiting = true;
    setTimeout(() => {
        el.classList.remove('flipped');
        if(activeElement !== null) {
            activeElement.classList.remove('flipped');
            activeElement = null;
        }
        waiting = false;
    }, 1000);   
}

function clearGridNoTimeout(el) {
    waiting = true;
    el.classList.remove('flipped');
    waiting = false;
}


const makeSquaresInteractive = () => {
    document.querySelectorAll('.square').forEach((el) => {
        el.addEventListener('click', event => {
            if(!waiting) {
                if(el.classList.contains('flipped')) {
                    return;
                }

                el.classList.add('flipped');

                if(activeElement !== null) {
                    if(el.id === activeElement.id) {
                        user.points += 1;
                        scoreEl.innerText = user.points;
                        activeElement = null;
                        handleCompleted();
                    }
                    else {
                        clearGrid(el);
                    }  
                }
                else {
                    activeElement = el;
                }
            }
        })
    });
}

const sizeGrid = (n) => {
    appEl.style.cssText += `grid-template-columns:repeat(${n},100px);grid-template-rows:repeat(${n},100px);`;
}

startGameButton.addEventListener('click', () => {
    let gridSizeString = prompt("enter grid side size (must be even number between 2 and 6");
    let gridSize = Number(gridSizeString);

    if(gridSize !== null) {
        if(gridSize === '' || gridSize < 2 || gridSize > 6 || gridSize % 2 !== 0) {
            window.alert("please enter a valid number");
            return;
        }
        else {
            startGameButton.style.display = "none";
            sizeGrid(gridSize);
            populateGrid(gridSize);
            addWindowEventListener();
            makeSquaresInteractive();
        }
    }
})

const addWindowEventListener = (() => {
    window.addEventListener('click', (e) => {
        if(!document.querySelector('#app').contains(e.target) && e.target !== loginbutton && activeElement) {
            clearGridNoTimeout(activeElement);
            activeElement = null;
        }
    })
});


loginbutton.addEventListener('click', () => {
    let usernameEl = document.querySelector('.username');
    if(loginbutton.id === 'logged-in') {
        if(window.confirm("Are you sure you want to log out?")) {
            loginbutton.id = '';
            loginbutton.innerText = 'Log in';
            usernameEl.innerText = '';
        }
        return;
    }
    let uname = window.prompt("Enter username", "username");
    if(!usernameEl.innerText) {
        if(uname === null) {
            return;
        }
        else if(uname === '') {
            usernameEl.append(document.createTextNode('anonymous'));
        }
        else {
            usernameEl.append(document.createTextNode(uname));
        }
    }
    else {
        alert("You are logged in already!");
    }
    loginbutton.innerText = 'Log out';
    loginbutton.id = 'logged-in';
});