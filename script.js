const playerFactory = (name, playingAs) => {
    let wins = 0;
    return {name, wins, playingAs}
}

const players = (() => {
    const player1Input = document.getElementById('player1input');
    const player2Input = document.getElementById('player2input');
    const startGame =  document.querySelector('.startGame');
    const player1Title = document.querySelector('.playerOne');
    const player2Title = document.querySelector('.playerTwo');
    let player1 = playerFactory('', 'o');
    let player2 = playerFactory('', 'x');
    startGame.addEventListener('click', () => {
        player1.name = player1Input.value;
        player1Title.textContent = player1Input.value;
        player2.name = player2Input.value;
        player2Title.textContent = player2Input.value;
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
    
    const takeTurn = (targetCell) => {
        if(!playingGame || gameBoard.boardValues[targetCell.dataset.index] !== '') return;
        if(turn === players.player1){
            gameBoard.boardValues[targetCell.dataset.index] = players.player1.playingAs;
            checkWin(playingGame);
            turn = players.player2;
        } else {
            gameBoard.boardValues[targetCell.dataset.index] = players.player2.playingAs;
            checkWin(playingGame);
            turn = players.player1;
        }

        gameBoard.populateBoard();
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