const playerFactory = (name, playingAs) => {
    let wins = 0;
    return {name, wins, playingAs}
}

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
            gameChoice.classList.remove('topVisible');
            textInputs[0].classList.remove('hidden');
            textInputs[0].classList.add('topVisible');
            startGame.classList.remove('hidden');
            startGame.classList.add('topVisible');           
        } else if(e.target.dataset.type === 'twoPlayer'){
            //Setting game type.
            gameType = 'twoPlayer';
            //Adding/removing classes for animation.
            gameChoice.classList.add('hidden');
            gameChoice.classList.remove('topVisible');
            textInputs.forEach(input => {
                input.classList.remove('hidden');
                input.classList.add('topVisible');
            });
            startGame.classList.remove('hidden');
            startGame.classList.add('topVisible');
        }
    });

    //Setting up players.
    let player1 = playerFactory('', 'o');
    let player2 = playerFactory('', 'x');
    const player1Title = document.querySelector('.playerOne');
    const player2Title = document.querySelector('.playerTwo');
    startGame.addEventListener('click', () => {
        if(gameType === 'twoPlayer'){
            player1.name = player1Input.value;
            player1Title.textContent = player1Input.value;
            player2.name = player2Input.value;
            player2Title.textContent = player2Input.value;

            //Changing classes to hide user inputs while playing.
            textInputs.forEach(input => {
                input.classList.add('hidden');
                input.classList.remove('topVisible');
            });
            startGame.classList.add('hidden');
            startGame.classList.remove('topVisible');
        } else if (gameType === 'vsComputer'){
            player1.name = player1Input.value;
            player1Title.textContent = player1Input.value;
            player2.name = 'Computer';
            player2Title.textContent = 'Computer';

            //Changing classes to hide user inputs while playing.
            textInputs[0].classList.add('hidden');
            textInputs[0].classList.remove('topVisible');
            startGame.classList.add('hidden');
            startGame.classList.remove('topVisible');
        }
    })
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
            gameBoard.boardValues[targetCell.dataset.index] = turn.playingAs;
            gameBoard.populateBoard();
            checkWin(playingGame);
            turn = players.player2;
            if(turn.name = 'Computer') {
                takeTurn(computerTurn());
            }
        } else {
            gameBoard.boardValues[targetCell.dataset.index] = turn.playingAs;
            gameBoard.populateBoard();
            checkWin(playingGame);
            turn = players.player1;
        }
    };

    playAgain.addEventListener('click', () => {
        playingGame = true;
        for(let i = 0; i < 9; i++) {
            gameBoard.boardValues[i] = '';
        }
        gameBoard.populateBoard()
    });

    return {takeTurn}
})()



window.addEventListener('click', (e) => {
    if(e.target.dataset.index !== undefined){
        gameLogic.takeTurn(e.target);
    }
});