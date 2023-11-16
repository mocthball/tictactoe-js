// const prompt = require('prompt-sync')();

function Player(name, marker) {
    this.name = name;
    this.marker = marker;

    return {
        name,
        marker
    }
}

// GameBoard constructor controls gameboard creation, adding moves and checking wins
let GameBoard = (() => {

    let gameboard = Array.from(Array(3), () => Array(3));

    const add_move = (token, x, y) => {
        // let move = PlayerInput.get_move();
        // let { x, y } = move;
        console.log(x, y);
        while (gameboard[x][y] != null) {
            move = PlayerInput.get_move();
            ({ x, y } = move);
        }
    
        gameboard[x][y] = token;
        display_on_page(token, x, y);
    };

    const checkWin = (marker) => {
        console.log("check");
        let WINNING_COMBOS = [
            // Rows
            [gameboard[0][0], gameboard[0][1], gameboard[0][2]],
            [gameboard[1][0], gameboard[1][1], gameboard[1][2]],
            [gameboard[2][0], gameboard[2][1], gameboard[2][2]],
            // Columns
            [gameboard[0][0], gameboard[1][0], gameboard[2][0]],
            [gameboard[0][1], gameboard[1][1], gameboard[2][1]],
            [gameboard[0][2], gameboard[1][2], gameboard[2][2]],
            // Diagonals
            [gameboard[0][0], gameboard[1][1], gameboard[2][2]],
            [gameboard[0][2], gameboard[1][1], gameboard[2][0]]
        ];

        for (const combo of WINNING_COMBOS) {
            let isWinningCombo = true;
        
            for (const cell of combo) {
                if (cell === null || cell !== marker) {
                    isWinningCombo = false;
                    break;
                }
            }
        
            if (isWinningCombo) {
                console.log("Winner!");
                return true; // Break early if a winning combination is found
            }
        }
        
        // No winning combination found
        return false;
    }

    function display_on_page(token, x, y) {
        // Convert x and y to strings and concatenate them with a comma
        const id = `${x},${y}`;
        const e = document.getElementById(id);
    
        if (e) {
            if (token === 'X') {
                e.style.backgroundColor = "white";
                e.textContent = token;
            } else if (token === 'O') {
                e.style.backgroundColor = "yellow";
                e.textContent = token;
            } else {
                console.error(`Invalid token: ${token}`);
            }
        } else {
            console.error(`Element with id ${id} not found.`);
        }
    }

    function reset() {
        // Assuming gameboard is a 2D array
        gameboard.forEach(row => {
            row.forEach((cell, columnIndex) => {
                row[columnIndex] = null;
            });
        });
    }


    return {
        gameboard,
        add_move,
        checkWin,
        reset
    }
})();

const Game = (() => {

    let round = 0;
    let round_over = false;
    let player1 = Player('player1', 'X');
    let player2 = Player('player2', 'O');
    let current_player = player2; // initalised with player 2 as switch_player() runs before turn

    let gameboard = GameBoard;

    const switch_player = () => {
        if (current_player === null || current_player === player2) {
            current_player = player1;
        } else {
            current_player = player2;
        }
    }

    /* const current_game = () => {
        while (!GameBoard.checkWin(current_player.marker)) {
            switch_player();
            GameBoard.add_move(current_player.marker);
            console.log(gameboard);
        }

        console.log(current_player.name + " is the winner!!!");
    }; */

    const game_action = ( e ) => {
        if (round_over == false) {
            const [x, y] = e;
            switch_player();
            GameBoard.add_move(current_player.marker, x, y);
            if (GameBoard.checkWin(current_player.marker)){
                alert(current_player.marker + " is the winner!");
                round++;
                round_over = true;
            }
        } else {
            alert("Reset Game")
            reset_game()
            round_over = false;
            initialise_game();
        }

    }

    function reset_game() {
        // wipe elements from previois game
        const grid = document.getElementById('grid');

        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }

        gameboard.reset();
    }

    function initialise_game() {
        // Assuming you have a grid element in your HTML with id="grid"
        const grid = document.getElementById("grid");
        grid.style.cssText = "grid-template-columns: repeat(" + 3 + ", 1fr);";
    
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                let div = document.createElement('div');
                div.className = "grid_child";
                div.setAttribute("id", [x, y]);
                div.addEventListener("click", () => game_action([x, y]));
                grid.appendChild(div);
            }
        }
    }

    initialise_game();

});

const PlayerInput = (() => {

    const get_move = () => {
        let x = prompt("Enter x:");
        let y = prompt("Enter y:");

        return {
            x,
            y
        };
    };

    return {
        get_move
    };
})();

Game()