const TOTAL_CELL_COUNT = 9; // duh

const infoPanel = document.querySelector(".info-panel");
const infoPanelBtn1 = document.querySelector("#button1");
const infoPanelBtn2 = document.querySelector("#button2");
const gameRoot = document.querySelector(".game");
const gameCells = Array.from(gameRoot.children);

const game = (() => {
    // util functions

    const setGameHeightEqualToWidth = () =>
        (gameRoot.style.height = `${gameRoot.clientWidth}px`);

    const getCellIndex = (cell) => Number(cell.dataset["index"]);

    const playerMove = () => (lastMove = lastMove === "X" ? "O" : "X");

    const setInfoText = (text) => (infoPanel.textContent = text);

    // globar vars
    let gameBoard;
    let gameOverState = false;
    let lastMove = "O";

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
        gameRoot.style.opacity = "1";
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

        gameBoard[getCellIndex(cell)] = playerMove();
        setBoard();
        setInfoText(`It's ${lastMove === "O" ? "X" : "O"}'s turn now!`);

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
            setInfoText(`${winner} WINS the game!!!`);
        } else setInfoText("It's a TIE!");
        gameOverState = true;
        gameRoot.style.opacity = "0.5";
    };

    init();

    return { resetGame };
})();

// console.log(game);
