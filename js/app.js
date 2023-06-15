/*----- constants -----*/
const COLORS = {
    '0': 'white',
    '1': 'green',
    '-1': 'pink',
}

/*----- state variables -----*/
let board;//array of 7 column arrays
let turn;//1 or -1
let winner;// null = no winner; 1 or -1 = winner; T = tie game

/*----- cached elements  -----*/
const messageEl = document.querySelector('h1'); //replace h1 message based on condition of game
const playAgainBtn = document.querySelector('button');
const markerEls = [...document.querySelectorAll('#markers > div')];
// const markerEls = document.querySelectorAll('#markers > div'); //selecting markers' children div


/*----- event listeners -----*/
document.getElementById('markers').addEventListener('click', handleDrop);
playAgainBtn.addEventListener('click', init);
/*----- functions -----*/
init()
function init() {
    board = [
        [0, 0, 0, 0, 0, 0], //0
        [0, 0, 0, 0, 0, 0], //1
        [0, 0, 0, 0, 0, 0], //2
        [0, 0, 0, 0, 0, 0], //3
        [0, 0, 0, 0, 0, 0], //4
        [0, 0, 0, 0, 0, 0], //5
        [0, 0, 0, 0, 0, 0], //6

    ];
    turn = 1;
    winner = null;
    render();
}
function handleDrop(evt) {
    const colIdx = markerEls.indexOf(evt.target);
    if (colIdx === -1) return;
    const colArr = board[colIdx];
    const rowIdx = colArr.indexOf(0);
    colArr[rowIdx] = turn;
    turn *= -1;
    // turn = turn * -1
    winner = getWinner(colIdx, rowIdx);
    // console.log(colIdx, rowIdx);
    render();
}

// Check for winner in board state and
// return null if no winner, 1/-1 if a player has won, 'T' if tie
function getWinner(colIdx, rowIdx) {
    return checkVerticalWin(colIdx, rowIdx) ||
      checkHorizontalWin(colIdx, rowIdx) ||
      checkDiagonalWinNESW(colIdx, rowIdx) ||
      checkDiagonalWinNWSE(colIdx, rowIdx);
  }

// Visualize all state in the DOM
function render() {
    renderBoard();
    renderMessage();
    // Hide/show UI elements (controls)
    renderControls();
  }
  
function renderBoard() {
    board.forEach(function (colArr, colIdx) {
        //iterate over each cell in colArr
        colArr.forEach(function (cellVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cellVal];// change color of cell depending on value of cell
        });
    });
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = "It's a Tie!!!";
    } else if (winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins!`;
    } else {
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`;
    }
}
function renderControls() {
    //Ternary expression is the go to when you want 1 of 2 values returned
    //<cond expression> ? <truthy expression> : <falsy expression>
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
    //iterate through marker elements to hide/show
    //according to the column being full (no 0s) or not
    markerEls.forEach(function (markerEl, colIdx) {
        const hideMarker = !board[colIdx].includes(0) || winner;
        markerEl.style.visibility = hideMarker ? 'hidden' : 'visible';
    });
}
//in response to user interaction, update all impacted
//state, then call render();


function handleDrop(event) {
    const colIdx = markerEls.indexOf(event.target);
    //setting guards
    if (colIdx === -1) return;
    //shortcut to the column array
    const colArr = board[colIdx];
    //index of first 0 in colArr
    const rowIdx = colArr.indexOf(0);

    //update the board state with the current player value (turn)
    colArr[rowIdx] = turn;

    //switch player turn
    turn *= -1;

    //check for winner
    winner = getWinner();

    render();
}

//check for winner in board state and
//return null if no winner, 1/-1 if a player has won, "T" if tie
function getWinner() {
    for (let colIdx = 0; colIdx < board.length; colIdx++) {
        for (let rowIdx = 0; rowIdx < board[colIdx].length; rowIdx++) {
            if (board[colIdx][rowIdx] !== 0) {
                const winner =
                    checkVerticalWin(colIdx, rowIdx) ||
                    checkHorizontalWin(colIdx, rowIdx) ||
                    checkDiagonalWinNESW(colIdx, rowIdx) ||
                    checkDiagonalWinNWSE(colIdx, rowIdx);
                if (winner) {
                    return winner;
                }
            }
        }
    }
    // if no winner, check if board is full (tie)
    if (board.every(column => column.every(cell => cell !== 0))) {
        return 'T';
    }
    return null; // no winner yet
}


function checkVerticalWin(colIdx, rowIdx) {
    return countAdjacent(colIdx, rowIdx, 0, -1) === 3 ? board[colIdx][rowIdx] : null;
}

function checkHorizontalWin(colIdx, rowIdx) {
    const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0);
    const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0);
    return (adjCountLeft + adjCountRight) >= 3 ? board[colIdx][rowIdx] : null;
}

function checkDiagonalWinNESW(colIdx, rowIdx) {
    const adjCountNE = countAdjacent(colIdx, rowIdx, 1, 1);
    const adjCountSW = countAdjacent(colIdx, rowIdx, -1, -1);
    return (adjCountNE + adjCountSW) >= 3 ? board[colIdx][rowIdx] : null;
}

function checkDiagonalWinNWSE(colIdx, rowIdx) {
    const adjCountNW = countAdjacent(colIdx, rowIdx, -1, 1);
    const adjCountSE = countAdjacent(colIdx, rowIdx, 1, -1);
    return (adjCountNW + adjCountSE) >= 3 ? board[colIdx][rowIdx] : null;
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    // Shortcut variable to the player value
    const player = board[colIdx][rowIdx];
    // Track count of adjancent cells with the same player value
    let count = 0;
    // Initialize new coordinates
    colIdx += colOffset;
    rowIdx += rowOffset;
    while (
        // Ensure colIdx and rowIdx are within bounds of the board array
        colIdx >= 0 &&
        rowIdx >= 0 &&
        colIdx < board.length &&
        rowIdx < board[0].length &&
        board[colIdx][rowIdx] === player
    ) {
        count++;
        colIdx += colOffset;
        rowIdx += rowOffset;
    }
    return count;

}
