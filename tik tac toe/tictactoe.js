document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#table-js tbody');
    const buttons = document.querySelectorAll('.buttons-js');
    let currentPlayer = 'X';
    let gameActive = true;
    let boardSize = 0;
    let board = [];
    let winCondition = 0;

    if (!tableBody) {
        console.error("Table body element not found");
        return;
    }

    if (buttons.length === 0) {
        console.error("No buttons found");
        return;
    }

    buttons.forEach(button => {
        // creates board size (size) based on button value (boardSize)
        button.addEventListener('click', event => {
            boardSize = parseInt(event.target.value, 10);
            setWinCondition(boardSize);
            initializeBoard(boardSize);
        });
    });

    function setWinCondition(size) {
        // specific win condition for every board size
        if (size === 3) {
            winCondition = 3;
        } else if (size === 5) {
            winCondition = 4;
        }   else if (size === 10) {
            winCondition = 5;
        }
    }

    function initializeBoard(size) {
        // Clear existing rows in the table body
        tableBody.innerHTML = '';
        board = Array(size).fill().map(() => Array(size).fill(''));
        currentPlayer = 'X';
        gameActive = true;

        for (let i = 0; i < size; i++) {
            const newRow = document.createElement('tr');
            for (let j = 0; j < size; j++) {
                const newTd = document.createElement('td');
                newTd.classList.add('empty');
                newTd.dataset.row = i;
                newTd.dataset.col = j;
                newTd.addEventListener('click', handleCellClick);
                newRow.appendChild(newTd);
            }
            tableBody.appendChild(newRow);
        }
    }

    function handleCellClick(event) {
        const row = event.target.dataset.row;
        const col = event.target.dataset.col;

        if (board[row][col] !== '' || !gameActive) {
            return;
        }

        board[row][col] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.remove('empty');
        event.target.classList.add('taken');

        if (checkWin(currentPlayer)) {
            gameActive = false;
            setTimeout(() => {
                alert(`${currentPlayer} wins!`);
                resetGame();
            }, 10);
        } else if (board.flat().every(cell => cell !== '')) {
            gameActive = false;
            setTimeout(() => {
                alert(`It's a draw!`);
                resetGame();
            }, 10);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    function checkWin(player) {
        // Check rows
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col <= boardSize - winCondition; col++) {
                if (board[row].slice(col, col + winCondition).every(cell => cell === player)) {
                    return true;
                }
            }
        }

        // Check columns
        for (let col = 0; col < boardSize; col++) {
            for (let row = 0; row <= boardSize - winCondition; row++) {
                const columnSlice = board.slice(row, row + winCondition).map(r => r[col]);
                if (columnSlice.every(cell => cell === player)) {
                    return true;
                }
            }
        }

        // Check diagonals (top-left to bottom-right)
        for (let row = 0; row <= boardSize - winCondition; row++) {
            for (let col = 0; col <= boardSize - winCondition; col++) {
                const diagonalSlice = [];
                for (let i = 0; i < winCondition; i++) {
                    diagonalSlice.push(board[row + i][col + i]);
                }
                if (diagonalSlice.every(cell => cell === player)) {
                    return true;
                }
            }
        }

        // Check diagonals (top-right to bottom-left)
        for (let row = 0; row <= boardSize - winCondition; row++) {
            for (let col = winCondition - 1; col < boardSize; col++) {
                const diagonalSlice = [];
                for (let i = 0; i < winCondition; i++) {
                    diagonalSlice.push(board[row + i][col - i]);
                }
                if (diagonalSlice.every(cell => cell === player)) {
                    return true;
                }
            }
        }

        return false;
    }

    function resetGame() {
        initializeBoard(boardSize);
    }
});