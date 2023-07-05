const TOTAL_CELL_COUNT = 9;

const infoPanel = document.querySelector("#info-panel-text");
const infoPanelBtn1 = document.querySelector("#playerChoiceBtn1");
const infoPanelBtn2 = document.querySelector("#playerChoiceBtn2");
const infoPanelResetBtn = document.querySelector("#resetBtn");
const gameRoot = document.querySelector(".game");
const gameCells = Array.from(gameRoot.children);

const game = (() => {
    // util functions
    const setGameHeightEqualToWidth = () =>
        (gameRoot.style.height = `${gameRoot.clientWidth}px`);

    const setInfoText = (text) => (infoPanel.textContent = text);

    const getCellIndex = (cell) => Number(cell.dataset["index"]);

    const nextMoveIsByWho = () => (move === "O" ? "X" : "O");

    // global vars
    let gameBoard;
    let gameOverState = false;
    let move = "X";

    const init = () => {
        setGameHeightEqualToWidth();
        window.addEventListener("resize", setGameHeightEqualToWidth);

        gameCells.forEach((cell) => {
            cell.addEventListener("click", (e) => playGame(e.target));
        });

        infoPanelBtn1.addEventListener("click", (e) =>
            handleXoChooserClick(e.target)
        );
        infoPanelBtn2.addEventListener("click", (e) =>
            handleXoChooserClick(e.target)
        );
        infoPanelResetBtn.addEventListener("click", resetGame);

        resetGame();
    };

    const handleXoChooserClick = (btn = false) => {
        if (!btn) {
            move = document.querySelector(".selected").textContent;
            return;
        }

        move = btn.textContent;
        infoPanelBtn1.classList.toggle("selected");
        infoPanelBtn2.classList.toggle("selected");
    };

    const resetGame = () => {
        gameBoard = Array(TOTAL_CELL_COUNT).fill("");
        setBoard();
        gameOverState = false;
        gameRoot.style.opacity = "1";

        setInfoText("Who goes first?");
        infoPanelBtn1.classList.remove("hidden");
        infoPanelBtn2.classList.remove("hidden");
        infoPanelResetBtn.classList.add("hidden");
        handleXoChooserClick();
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

        gameBoard[getCellIndex(cell)] = move;
        setBoard();

        move = nextMoveIsByWho();
        setInfoText(`It's ${move}'s turn now!`);

        const winner = checkWin();
        if (winner) gameOver(winner);

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
        const winSets = winSetsOneIndexed.map((set) => set.map((i) => i - 1));

        let wonPlayer = false;
        winSets.forEach((set) => {
            if (
                gameBoard[set[0]] === gameBoard[set[1]] &&
                gameBoard[set[1]] === gameBoard[set[2]] &&
                gameBoard[set[0]] !== null &&
                gameBoard[set[0]] !== ""
            )
                wonPlayer = gameBoard[set[0]];
        });
        return wonPlayer;
    };

    const gameOver = (winner = false) => {
        gameOverState = true;
        gameRoot.style.opacity = "0.5";

        if (winner) {
            setInfoText(`${winner} WINS the game!!!`);
        } else setInfoText("It's a TIE!");

        infoPanelBtn1.classList.add("hidden");
        infoPanelBtn2.classList.add("hidden");
        infoPanelResetBtn.classList.remove("hidden");
    };

    init();
})();
