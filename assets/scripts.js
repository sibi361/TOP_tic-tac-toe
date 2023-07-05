const TOTAL_CELL_COUNT = 9;

const headerPoints = document.querySelector(".header-points");
const infoPanel = document.querySelector("#info-panel-text");
const infoPanelResetBtn = document.querySelector("#resetBtn");
const gameRoot = document.querySelector(".game");
const gameCells = Array.from(gameRoot.children);

const game = (() => {
    // utility functions

    const setGameHeightEqualToWidth = () =>
        (gameRoot.style.height = `${gameRoot.clientWidth}px`);

    const setHeaderPoints = () =>
        (headerPoints.innerHTML = `You: ${pointsX}&nbsp;&nbsp;|&nbsp;&nbsp;Computer: ${pointsY}`);

    const setInfoText = (text) => (infoPanel.textContent = text);

    const getCellIndex = (cell) => Number(cell.dataset["index"]);

    const getEmptyCells = () =>
        gameCells.filter((cell) => cell.textContent === "");

    const nextMoveIsByWho = () => (move === "O" ? "X" : "O");

    // global vars
    let gameBoard;
    let gameOverState = false;
    let move = "X";
    let pointsX = 0;
    let pointsY = 0;

    const init = () => {
        setGameHeightEqualToWidth();
        window.addEventListener("resize", setGameHeightEqualToWidth);

        window.addEventListener("keydown", (e) =>
            e.key === "Escape" ? resetGame(0) : {}
        );

        gameCells.forEach((cell) => {
            cell.addEventListener("click", (e) => playGame(e.target));
        });

        infoPanelResetBtn.addEventListener("click", () => {
            setInfoText("All the best!");
            resetGame();
        });

        resetGame();
    };

    const resetGame = () => {
        gameBoard = Array(TOTAL_CELL_COUNT).fill("");
        setBoard();
        gameOverState = false;
        gameRoot.style.opacity = "1";

        infoPanelResetBtn.classList.add("hidden");

        move = "X";
    };

    const setBoard = () => {
        gameCells.forEach((cell, index) => {
            cell.textContent = gameBoard[index];
            cell.classList.remove("highlighted-cell-x");
            cell.classList.remove("highlighted-cell-o");
        });
    };

    const playGame = (cell) => {
        if (gameOverState) return;

        // cannot select a spot that's already taken
        if (cell.textContent.length) return;

        gameBoard[getCellIndex(cell)] = move;
        setBoard();

        const winner = checkWin();
        if (winner) gameOver(winner);

        const filledCellsCount = gameCells.reduce(
            (count, cell) => count + Number(cell.textContent.length),
            0
        );
        if (filledCellsCount === TOTAL_CELL_COUNT) gameOver();

        move = nextMoveIsByWho();
        if (move === "O") aiPlay();
    };

    const aiPlay = () => {
        const possiblePlays = getEmptyCells();
        possiblePlays[Math.floor(Math.random() * possiblePlays.length)].click();
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
        const winSets = winSetsOneIndexed.map((set) => set.map((i) => i - 1));

        let winStat = false;
        winSets.forEach((set) => {
            if (
                gameBoard[set[0]] === gameBoard[set[1]] &&
                gameBoard[set[1]] === gameBoard[set[2]] &&
                gameBoard[set[0]] !== null &&
                gameBoard[set[0]] !== ""
            ) {
                winStat = { winner: gameBoard[set[0]], set };
            }
        });
        return winStat;
    };

    const gameOver = (winnerObj = false) => {
        gameOverState = true;
        gameRoot.style.opacity = "0.5";

        if (winnerObj) {
            const winner = winnerObj.winner;
            if (winner === "X") setInfoText(`YOU won the game!!!`);
            else setInfoText(`Computer won :)`);

            const set = winnerObj.set;
            winner === "X"
                ? set.forEach((i) =>
                      gameCells[i].classList.add("highlighted-cell-x")
                  )
                : set.forEach((i) =>
                      gameCells[i].classList.add("highlighted-cell-o")
                  );

            winner === "X" ? ++pointsX : ++pointsY;
            setHeaderPoints();
        } else setInfoText("It's a TIE!");

        infoPanelResetBtn.classList.remove("hidden");
    };

    init();
})();
