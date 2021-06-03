const playerFactory = (name, playingAs) => {
    let wins = 0;
    return {name, wins, playingAs}
}

const winCounters = (() => {
    const player1 = document.querySelector('.playerOneWins');
    const player2 = document.querySelector('.playerTwoWins');

    return {player1, player2}
})();

const players = (() => {
    const gameChoice = document.querySelector('.gameType');
    const textInputs = document.querySelectorAll('.playerInput');
    const player1Input = document.getElementById('player1input');
    const player2Input = document.getElementById('player2input');
    const startGame =  document.querySelector('.startGame');

    //Choosing between playing against the computer or two player.
    let gameType = ''

    gameChoice.addEventListener('click', (e) => {
        if(e.target.dataset.type === 'vsComputer'){
            //Setting game type.
            gameType = 'vsComputer';
            //Adding/removing classes for animation.
            gameChoice.classList.add('hidden');
            gameChoice.classList.remove('visible');
            textInputs[0].classList.remove('hidden');
            textInputs[0].classList.add('visible');
            startGame.classList.remove('hidden');
            startGame.classList.add('visible');           
        } else if(e.target.dataset.type === 'twoPlayer'){
            //Setting game type.
            gameType = 'twoPlayer';
            //Adding/removing classes for animation.
            gameChoice.classList.add('hidden');
            gameChoice.classList.remove('visible');
            textInputs.forEach(input => {
                input.classList.remove('hidden');
                input.classList.add('visible');
            });
            startGame.classList.remove('hidden');
            startGame.classList.add('visible');
        }
        

    });

    //Setting up players.
    let player1 = playerFactory('', 'o');
    let player2 = playerFactory('', 'x');
    const player1Title = document.querySelector('.playerOneTitle');
    const player2Title = document.querySelector('.playerTwoTitle');
    startGame.addEventListener('click', () => {
        if(gameType === 'twoPlayer'){
            if(player1Input.value === '' || player2Input.value === '') return;
            player1.name = player1Input.value;
            player1Title.textContent = player1Input.value;
            player2.name = player2Input.value;
            player2Title.textContent = player2Input.value;

            //Changing classes to hide user inputs while playing.
            textInputs.forEach(input => {
                input.classList.add('hidden');
                input.classList.remove('visible');
            });
            startGame.classList.add('hidden');
            startGame.classList.remove('visible');
        } else if (gameType === 'vsComputer'){
            if(player1Input.value === '') return;
            player1.name = player1Input.value;
            player1Title.textContent = player1Input.value;
            player2.name = 'Computer';
            player2Title.textContent = 'Computer';

            //Changing classes to hide user inputs while playing.
            textInputs[0].classList.add('hidden');
            textInputs[0].classList.remove('visible');
            startGame.classList.add('hidden');
            startGame.classList.remove('visible');
        }
        winCounters.player1.textContent = 'Wins: 0';
        winCounters.player2.textContent = 'Wins: 0';
    });
    return {player1, player2}
})();

const gameBoard = (()=> {
    const board = [...document.querySelectorAll('td')];
    const boardValues = ['', '', '', '', '', '', '', '', ''];
    const populateBoard = () => {
        board.forEach(cell => {
            cell.textContent = boardValues[Number(cell.dataset.index)];
        })
    };                        

    return {boardValues, populateBoard}
})();
 
const gameLogic = (() => {
    let turn = players.player1;
    let turnsTaken = 0;
    let playingGame = true;
    const endMsg = document.querySelector('.endGameMsg');
    let playAgain = document.querySelector('.playAgain');

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

    const checkWin = () => {
        const checkX = winningConditions.some((combination) => {
            return combination.every((i) => {
                return gameBoard.boardValues[i] === 'x'
            });
        });
        const checkO = winningConditions.some((combination) => {
            return combination.every((i) => {
                return gameBoard.boardValues[i] === 'o'
            });
        });
        if(checkX || checkO){
            turn.wins++
            endMsg.textContent = `${turn.name} Wins!`;
            playingGame = false;
            playAgain.classList.remove('hidden');
            playAgain.classList.add('visible');
            endMsg.classList.remove('hidden');
            endMsg.classList.add('visible');
            if(turn === players.player1) {
                winCounters.player1.textContent = `Wins: ${turn.wins}`;
            } else {
                winCounters.player2.textContent = `Wins: ${turn.wins}`;
            }
        } 
        if(turnsTaken === 9 && checkX === false && checkO === false){
            endMsg.textContent = `It's a draw.`;
            endMsg.classList.remove('hidden');
            endMsg.classList.add('visible');
            playingGame = false;
            playAgain.classList.remove('hidden');
            playAgain.classList.add('visible');
        };
    }    
    
    const computerTurn = () => {
        let cell = Math.floor(Math.random() * 9);
        let playCell;

        if(gameBoard.boardValues[cell] === ''){
            playCell = document.querySelector(`[data-index = "${cell}"]`);
        } else {
           return computerTurn();
        }
        
        return playCell;
    }

    const takeTurn = (targetCell) => {
        if(!playingGame || gameBoard.boardValues[targetCell.dataset.index] !== '') return;
        if(turn === players.player1){
            if(turn.name === '') return;
            turnsTaken++;
            gameBoard.boardValues[targetCell.dataset.index] = turn.playingAs;
            gameBoard.populateBoard();
            checkWin(playingGame);
            turn = players.player2;
            if(turn.name === 'Computer' && turnsTaken < 9) {
                takeTurn(computerTurn());
            }
        } else {
            turnsTaken++;
            gameBoard.boardValues[targetCell.dataset.index] = turn.playingAs;
            gameBoard.populateBoard();
            checkWin(playingGame);
            turn = players.player1;
        }
    };

    playAgain.addEventListener('click', () => {
        playAgain.classList.add('hidden');
        playAgain.classList.remove('visible');
        turnsTaken = 0;
        playingGame = true;
        for(let i = 0; i < 9; i++) {
            gameBoard.boardValues[i] = '';
        }
        gameBoard.populateBoard();
        if(turn.name === 'Computer') {
                takeTurn(computerTurn());
        }
        endMsg.classList.remove('visible');
        endMsg.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if(e.target.dataset.index !== undefined){
            takeTurn(e.target);
        }
    });
})();