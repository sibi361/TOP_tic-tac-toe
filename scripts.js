const TOTAL_CELL_COUNT = 9; // duh

const gameRoot = document.querySelector(".game");
const gameCells = Array.from(gameRoot.children);

const game = (() => {
    // util functions

    const setGameHeightEqualToWidth = () =>
        (gameRoot.style.height = `${gameRoot.clientWidth}px`);

    const getCellIndex = (cell) => {
        return Number(cell.dataset["index"]);
    };

    // globar vars
    let gameBoard;
    // let gameBoard = ["", "", "", "", "", "", "", "X", "X"];
    let gameOverState = false;

    // const Playor factory

    const init = () => {
        setGameHeightEqualToWidth();
        window.addEventListener("resize", setGameHeightEqualToWidth);

        gameCells.forEach((cell) => {
            cell.addEventListener("click", (e) => playGame(e.target));
        });

        resetGame();
    };

    const resetGame = () => {
        gameBoard = Array(TOTAL_CELL_COUNT).fill("");
        setBoard();
        gameOverState = false;
    };

    const setBoard = () => {
        gameCells.forEach((cell, index) => {
            cell.textContent = gameBoard[index];
        });
    };

    const playGame = (cell) => {
        if (gameOverState) return;

        // cannot select a spot that's already taken
        if (cell.textContent.length) return;

        const player = { move: "X" };
        gameBoard[getCellIndex(cell)] = player.move;
        setBoard();

        const winStat = checkWin();
        if (winStat) gameOver(winStat);

        const filledCellsCount = gameCells.reduce(
            (count, cell) => count + Number(cell.textContent.length),
            0
        );
        if (filledCellsCount === TOTAL_CELL_COUNT) gameOver();
    };

    const checkWin = () => {
        const winSetsOneIndexed = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7],
        ];
        const winSetsZeroIndexed = winSetsOneIndexed.map((set) =>
            set.map((i) => i - 1)
        );

        let winPlayer = false;
        winSetsZeroIndexed.forEach((set) => {
            if (
                gameBoard[set[0]] === gameBoard[set[1]] &&
                gameBoard[set[1]] === gameBoard[set[2]] &&
                gameBoard[set[0]] !== null &&
                gameBoard[set[0]] !== ""
            )
                winPlayer = gameBoard[set[0]];
        });
        return winPlayer;
    };

    const gameOver = (winner = false) => {
        if (winner) {
            console.log(`${winner} WINS !!!`);
        } else console.log("It's a tieeee.");
        gameOverState = true;
    };

    init();

    return { resetGame };
})();

// console.log(game);
