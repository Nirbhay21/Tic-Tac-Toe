const selectGameModeWindow = document.querySelector(".select-game-mode-window");
const settingsWindow = document.querySelector(".settings-window");
const matchStatusWindow = document.querySelector(".match-status-window");

const gameModeButtonGroup = document.querySelector(".button-group");
const startBtn = document.querySelector(".start-btn");
const overlay = document.querySelector("#overlay");
const settingsIcon = document.querySelector(".settings-icon");
const closeSettingsBtn = document.querySelector(".settings-window>.close-icon");

const inputPlayer1Name = document.querySelector(".input-player1-name");
const inputPlayer2Name = document.querySelector(".input-player2-name");
const settingsModesBox = document.querySelector(".settings-window .mode-box");
const settingsSoundBox = document.querySelector(".settings-window .sound-box");
const cancelSettingsBtn = document.querySelector(".settings-window .cancel-btn");
const saveSettingsBtn = document.querySelector(".settings-window .save-btn");

const gameBoard = document.querySelector(".game-container .game-grid");

const xMarkerAudio = new Audio("./audio/x_marker_audio.mp3");
const oMarkerAudio = new Audio("./audio/o_marker_audio.mp3");

const SINGLE_PLAYER = "Single Player";
const DUAL_PLAYER = "Dual Player";

const DEFAULT_DATA = {
    settings: {
        player1Name: "Player 1",
        player2Name: "Player 2",
        player1Marker: "X",
        player2Marker: "O",
        gameMode: DUAL_PLAYER,
        soundEnable: true
    }
}

const gameData = {
    settings: {}
};


Object.assign(gameData, JSON.parse(localStorage.getItem("gameData")) || DEFAULT_DATA);

let gameMode = gameData.settings.gameMode;

const showSelectGameModeWindow = () => {
    selectGameModeWindow.classList.remove("hide");

    const selectGameMode = (event) => {
        if (event.target !== gameModeButtonGroup) {
            for (const modeBtn of gameModeButtonGroup.children) {
                modeBtn.classList.remove("mode-selected");
            }
            event.target.closest(".mode-btn").classList.add("mode-selected");
        }
    }

    const setGameMode = () => {
        if (gameModeButtonGroup.querySelector(".mode-selected")) {
            gameMode = gameModeButtonGroup.querySelector(".mode-selected").getAttribute("name");
            if (gameMode === SINGLE_PLAYER) {
                gameData.settings.player1Name = "User";
                gameData.settings.player2Name = "Bot";
                gameData.settings.soundEnable = true;
                gameData.settings.gameMode = gameMode;
            } else if (gameMode === DUAL_PLAYER) {
                gameData.settings.player1Name = "Player 1";
                gameData.settings.player2Name = "Player 2";
                gameData.settings.soundEnable = true;
                gameData.settings.gameMode = gameMode;
            }
            localStorage.setItem("gameData", JSON.stringify(gameData));
            updateGameStatusFooter();
            hideSelectModeWindow();
        }
    }

    gameModeButtonGroup.addEventListener("click", selectGameMode);
    startBtn.addEventListener("click", setGameMode);

    const removeEventListeners = () => {
        gameModeButtonGroup.removeEventListener("click", selectGameMode);
        startBtn.removeEventListener("click", setGameMode);
    }

    const hideSelectModeWindow = () => {
        selectGameModeWindow.classList.add("hide");
        overlay.classList.remove("overlay");
        removeEventListeners();
    }
}

const openSettingsWindow = () => {
    let settingsModeName = gameData.settings.gameMode;
    let settingsSoundEnable = gameData.settings.soundEnable;

    const restoreLabels = () => {
        if (settingsModeName === SINGLE_PLAYER) {
            document.querySelector(".setting1 .setting-label").innerText = "Player Name:";
            inputPlayer1Name.setAttribute("placeholder", "Your name");
            document.querySelector(".setting2 .setting-label").innerText = "Bot Name:";
            inputPlayer2Name.setAttribute("placeholder", "computer name");
        } else if (settingsModeName === DUAL_PLAYER) {
            document.querySelector(".setting1 .setting-label").innerText = "Player 1 Name:";
            inputPlayer1Name.setAttribute("placeholder", "First player name");
            document.querySelector(".setting2 .setting-label").innerText = "Player 2 Name:";
            inputPlayer2Name.setAttribute("placeholder", "Second player name");
        }
    }

    const restoreSettings = () => {
        [...settingsModesBox.children].forEach((mode) => mode.classList.remove("mode-selected"));
        [...settingsSoundBox.children].forEach((mode) => mode.classList.remove("mode-selected"));

        inputPlayer1Name.value = gameData.settings.player1Name;
        inputPlayer2Name.value = gameData.settings.player2Name;

        if (gameData.settings.gameMode === SINGLE_PLAYER) {
            settingsModesBox.firstElementChild.classList.add("mode-selected");
        } else if (gameData.settings.gameMode === DUAL_PLAYER) {
            settingsModesBox.lastElementChild.classList.add("mode-selected");
        }

        if (gameData.settings.soundEnable) {
            settingsSoundBox.firstElementChild.classList.add("mode-selected");
            settingsSoundBox.lastElementChild.firstElementChild.innerText = "Enable";
        } else {
            settingsSoundBox.firstElementChild.nextElementSibling.classList.add("mode-selected");
            settingsSoundBox.lastElementChild.firstElementChild.innerText = "Disable";
        }

        restoreLabels();
    }

    const openSettings = () => {
        settingsIcon.style.transform = "rotate(-50deg)"
        settingsWindow.classList.add("settings-opened");
        overlay.classList.add("overlay");
        setTimeout(() => {
            settingsIcon.style.transform = "rotate(0deg)"
        }, 200);
        restoreSettings();
    }
    openSettings();

    const selectMode = (event) => {
        if (event.target !== settingsModesBox) {
            [...settingsModesBox.children].forEach((mode) => mode.classList.remove("mode-selected"));
            const mode = event.target.closest(".mode");
            mode.classList.add("mode-selected");
            settingsModeName = mode.querySelector(".mode-name").innerText;
            restoreLabels();
        }
    }

    const selectSoundMode = (event) => {
        const soundMode = event.target;
        if (soundMode.classList.contains("sound-icon")) {
            [...settingsSoundBox.children].forEach((mode) => mode.classList.remove("mode-selected"));
            soundMode.classList.add("mode-selected")
            if (soundMode.getAttribute("alt") === "sound_enable_icon") {
                document.querySelector(".sound-status span").innerText = "Enable";
                settingsSoundEnable = true;
            } else if (soundMode.getAttribute("alt") === "sound_disable_icon") {
                document.querySelector(".sound-status span").innerText = "Disable";
                settingsSoundEnable = false;
            }
        }
    }

    const saveSettings = () => {
        if (settingsModeName !== gameMode) {
            activePlayer = PLAYER_1;
            activePlayerMarker = "x";

            for (let box of gameBoard.children) {
                box.innerHTML = "";
                boardPositions[box.getAttribute("name")] = null;
            }
        }

        gameData.settings = {
            player1Name: inputPlayer1Name.value.trim(),
            player2Name: inputPlayer2Name.value.trim(),
            player1Marker: DEFAULT_DATA.settings.player1Marker,
            player2Marker: DEFAULT_DATA.settings.player2Marker,
            gameMode: settingsModeName,
            soundEnable: settingsSoundEnable
        }
        gameMode = settingsModeName;

        updateGameStatusFooter();

        localStorage.setItem("gameData", JSON.stringify(gameData));
        closeSettingsWindow();
    }

    settingsModesBox.addEventListener("click", selectMode);
    settingsSoundBox.addEventListener("click", selectSoundMode);
    saveSettingsBtn.addEventListener("click", saveSettings);

    const closeSettingsWindow = () => {
        settingsWindow.classList.remove("settings-opened");
        overlay.classList.remove("overlay");

        settingsModesBox.removeEventListener("click", selectMode);
        settingsSoundBox.removeEventListener("click", selectSoundMode);
        saveSettingsBtn.removeEventListener("click", saveSettings);
        cancelSettingsBtn.removeEventListener("click", closeSettingsWindow);
        closeSettingsBtn.removeEventListener("click", closeSettingsWindow);
    }

    restoreSettings();
    closeSettingsBtn.addEventListener("click", closeSettingsWindow);
    cancelSettingsBtn.addEventListener("click", closeSettingsWindow);
}

const updateGameStatusFooter = () => {
    if (gameData.settings.gameMode === SINGLE_PLAYER) {
        document.querySelector(".player-info>#player1-icon").src = "icons/user_icon.svg";
        document.querySelector(".player-info>#player2-icon").src = "icons/bot_icon.svg";
        document.querySelector(".player-info>#player1-name").innerText = `${gameData.settings.player1Name} - ${gameData.settings.player1Marker}`;
        document.querySelector(".player-info>#player2-name").innerText = `${gameData.settings.player2Name} - ${gameData.settings.player2Marker}`;
    } else if (gameData.settings.gameMode === DUAL_PLAYER) {
        document.querySelector(".player-info>#player1-icon").src = "icons/player1_icon.svg";
        document.querySelector(".player-info>#player2-icon").src = "icons/player2_icon.svg";
        document.querySelector(".player-info>#player1-name").innerText = `${gameData.settings.player1Name} - ${gameData.settings.player1Marker}`;
        document.querySelector(".player-info>#player2-name").innerText = `${gameData.settings.player2Name} - ${gameData.settings.player2Marker}`;
    }
}

const PLAYER_1 = "player1";
const PLAYER_2 = "player2";

let activePlayer = PLAYER_1;
let activePlayerMarker = "x";

const boardPositions = {
    box1: null, box2: null, box3: null, box4: null, box5: null, box6: null, box7: null, box8: null, box9: null
};

const startGame = () => {

    const getMarker = (markerName) => {
        if (markerName === "x") {
            return `
                <svg class="player-marker" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" name="x">
                    <path class="marker-x-color" d="M 7 7 L 25 25 M 25 7 L 7 25" stroke="black" stroke-width="4" stroke-linecap="round"/>
                </svg>
            `;
        } else if (markerName === "o") {
            return `
                <svg class="player-marker" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" name="o">
                    <circle class="marker-o-color" cx="16" cy="16" r="12" stroke="black" stroke-width="4"/>
                </svg>
            `;
        }
    }

    const swapPlayerTurn = () => {
        if (activePlayer === PLAYER_1) {
            activePlayer = PLAYER_2;
            activePlayerMarker = "o";
        } else if (activePlayer === PLAYER_2) {
            activePlayer = PLAYER_1;
            activePlayerMarker = "x";
        }
    }

    let previousAnimIntervalId = null;

    const highLightPlayerIcon = (activePlayerIcon) => {
        if (previousAnimIntervalId) {
            clearInterval(previousAnimIntervalId);
        }

        previousAnimIntervalId = setInterval(() => {
            activePlayerIcon.classList.add("fade-element");
            setTimeout(() => {
                activePlayerIcon.classList.remove("fade-element");
            }, 300)
        }, 600);
    }

    const highLightActivePlayer = () => {
        let activePlayerIcon;

        if (activePlayer === PLAYER_1) {
            activePlayerIcon = document.querySelector("#player1-icon");
        } else if (activePlayer === PLAYER_2) {
            activePlayerIcon = document.querySelector("#player2-icon");
        }

        highLightPlayerIcon(activePlayerIcon);
    }

    const findWinner = () => {
        for (let box of gameBoard.children) {
            if (box.firstElementChild) {
                boardPositions[box.getAttribute("name")] = box.firstElementChild.getAttribute("name");
            }
        }

        const isMatchTie = () => {
            return [...gameBoard.children].every((box) => box.firstElementChild);
        }

        const showMatchResults = (winnerName) => {
            matchStatusWindow.classList.remove("hide");
            if (winnerName === undefined) {
                matchStatusWindow.querySelector(".win-msg").innerText = `Match is Draw`;
            } else if (gameMode === DUAL_PLAYER) {
                matchStatusWindow.querySelector(".win-msg").innerText = `Congratulations, ${winnerName} you win the match.`;
            } else if (gameMode === SINGLE_PLAYER) {
                if (winnerName === gameData.settings.player1Name) {
                    matchStatusWindow.querySelector(".win-msg").innerText = `Congratulations, ${winnerName} you win the match.`;
                } else {
                    matchStatusWindow.querySelector(".win-msg").innerText = `You loose the match.`;
                }
            }
            matchStatusWindow.querySelector("button").addEventListener("click", () => {
                matchStatusWindow.classList.add("hide");
                restartGame();
            });

            clearTimeout(boatMoveTimeoutId);
        }

        const detectWinner = (boardBoxes) => {
            const { box1, box2, box3, box4, box5, box6, box7, box8, box9 } = { ...boardBoxes };

            let winner = "";

            if (box1 === box2 && box2 === box3 && box1 !== null) {
                winner = (box1 === "x") ? PLAYER_1 : PLAYER_2;
            } else if (box4 === box5 && box5 === box6 && box4 !== null) {
                winner = (box4 === "x") ? PLAYER_1 : PLAYER_2;
            } else if (box7 === box8 && box8 === box9 && box7 !== null) {
                winner = (box7 === "x") ? PLAYER_1 : PLAYER_2;
            } else if (box1 === box4 && box4 === box7 && box1 !== null) {
                winner = (box1 === "x") ? PLAYER_1 : PLAYER_2;
            } else if (box2 === box5 && box5 === box8 && box2 !== null) {
                winner = (box2 === "x") ? PLAYER_1 : PLAYER_2;
            } else if (box3 === box6 && box6 === box9 && box3 !== null) {
                winner = (box3 === "x") ? PLAYER_1 : PLAYER_2;
            } else if (box1 === box5 && box5 === box9 && box1 !== null) {
                winner = (box1 === "x") ? PLAYER_1 : PLAYER_2;
            } else if (box3 === box5 && box5 === box7 && box3 !== null) {
                winner = (box3 === "x") ? PLAYER_1 : PLAYER_2;
            }

            setTimeout(() => {
                if (winner !== "") {
                    if (winner === PLAYER_1) {
                        winner = gameData.settings.player1Name;
                    } else if (winner === PLAYER_2) {
                        winner = gameData.settings.player2Name;
                    }
                    showMatchResults(winner)
                }
            }, 10);
        }

        detectWinner(boardPositions);
        if (isMatchTie()) {
            showMatchResults();
        }
    }

    let boatMoveTimeoutId = null;

    const playBotMove = () => {
        highLightActivePlayer();
        for (let box of gameBoard.children) {
            if (box.firstElementChild) {
                boardPositions[box.getAttribute("name")] = box.firstElementChild.getAttribute("name");
            }
        }

        const availablePositions = Object.keys(boardPositions).filter((key) => {
            return boardPositions[key] === null;
        });

        const randPos = Math.floor(Math.random() * availablePositions.length);

        boatMoveTimeoutId = setTimeout(() => {
            if (gameBoard.querySelector(`[name="${availablePositions[randPos]}"]`)) {
                gameBoard.querySelector(`[name="${availablePositions[randPos]}"]`).innerHTML = getMarker("o");
                if (gameData.settings.soundEnable) {
                    oMarkerAudio.play();
                }
            }
            swapPlayerTurn();
            highLightActivePlayer();
            findWinner();
        }, 2000);

    }

    const playMarkerAudio = () => {
        if (gameData.settings.soundEnable) {
            if (activePlayerMarker === "x") {
                xMarkerAudio.play();
            } else if (activePlayerMarker === "o") {
                oMarkerAudio.play();
            }
        }
    }

    const placeMove = (event) => {
        const clickedBox = event.target.closest(".grid-box");

        if (clickedBox && !clickedBox.querySelector(".player-marker")) {
            if (gameMode === DUAL_PLAYER) {
                clickedBox.innerHTML = getMarker(activePlayerMarker);
                playMarkerAudio();
                swapPlayerTurn();
                highLightActivePlayer();
                findWinner();
            } else if (gameMode === SINGLE_PLAYER) {
                if (activePlayer === PLAYER_1) {
                    clickedBox.innerHTML = getMarker(activePlayerMarker);
                    playMarkerAudio();
                    swapPlayerTurn();
                    playBotMove();
                    findWinner();
                }
            }
        }
    }

    if (gameMode === DUAL_PLAYER) {
        gameBoard.addEventListener("click", placeMove);

    } else if (gameMode === SINGLE_PLAYER) {
        gameBoard.addEventListener("click", placeMove);
    }

    const restartGame = () => {
        activePlayer = PLAYER_1;
        activePlayerMarker = "x";

        for (let box of gameBoard.children) {
            box.innerHTML = "";
            boardPositions[box.getAttribute("name")] = null;
        }

        clearTimeout(boatMoveTimeoutId);
        highLightActivePlayer();
    }

    highLightActivePlayer();
}

if (!localStorage.length) {
    showSelectGameModeWindow();
}

settingsIcon.addEventListener("click", () => {
    openSettingsWindow();
});

updateGameStatusFooter();

startGame();