function doStuff() {
    let board = [];

    for (let i = 0; i < 10; i++) {
        board[i] = [];
        for (let j = 0; j < 10; j++) {
            board[i][j] = ' ';
            if (i == 0 || i == 9) {
                if (j == 0 || j == 9) board[i][j] = 'w';
            }
        }
    }

    console.table(board);

    const prompt = require('prompt-sync')();

    let sequenceInfo = {
        horizontal: [],
        vertical: [],
        leftDiagonal: [],
        rightDiagonal: [],
    }

    while (true) {
        let number = prompt('Enter a number: ');

        if (number === "-1") break;

        if (number !== "0" && number !== "10" && number !== "91" && number !== "100") {
            let row = -1;
            let col = -1;

            if (number % 10 === 0) {
                row = (number / 10) - 1
                col = 9
            }
            else {
                row = Math.floor(number / 10);
                col = (number % 10) - 1
            }

            board[row][col] = 'b';
            console.table(board);
            console.log("cell: " + number + ", row: " + row + ", col: " + col);
            let info = getSequence(row, col, board, 'b');

            sequenceInfo.horizontal = info.left.concat(info.right.filter((item) => info.left.indexOf(item) < 0));
            sequenceInfo.vertical = info.top.concat(info.bottom.filter((item) => info.top.indexOf(item) < 0));
            sequenceInfo.leftDiagonal = info.topLeft.concat(info.bottomRight.filter((item) => info.topLeft.indexOf(item) < 0));
            sequenceInfo.rightDiagonal = info.topRight.concat(info.bottomLeft.filter((item) => info.topRight.indexOf(item) < 0));

            console.log(sequenceInfo);
        }
    }
}

function getSequence(row, col, gameBoard, playerChip) {

    let r = -1;
    let c = -1;
    let sequences = {
        left: [],
        right: [],
        top: [],
        bottom: [],
        topLeft: [],
        bottomRight: [],
        topRight: [],
        bottomLeft: [],
    };

    /*Left*/
    for (let j = col; j >= 0; j--) {
        if (gameBoard[row][j] === playerChip || gameBoard[row][j] === 'w') sequences.left.unshift((row * 10) + (j + 1));
        else break;
    }

    /*Right*/
    for (let j = col; j < 10; j++) {
        if (j > 9) break;
        else {
            if (gameBoard[row][j] === playerChip || gameBoard[row][j] === 'w') sequences.right.push((row * 10) + (j + 1));
            else break;
        }
    }

    /*Top*/
    for (let i = row; i >= 0; i--) {
        if (gameBoard[i][col] === playerChip || gameBoard[i][col] === 'w') sequences.top.unshift((i * 10) + (col + 1));
        else break;
    }

    /*Bottom*/
    for (let i = row; i < 10; i++) {
        if (i > 9) break;
        else {
            if (gameBoard[i][col] === playerChip || gameBoard[i][col] === 'w') sequences.bottom.push((i * 10) + (col + 1));
            else break;
        }
    }

    /*Top left*/
    r = row;
    c = col;
    for (let i = 0; i < 10; i++) {
        if (r < 0 || c < 0 || (gameBoard[r][c] !== playerChip && gameBoard[r][c] !== 'w')) break;
        else sequences.topLeft.unshift((r * 10) + (c + 1));

        r--;
        c--;
    }

    /*Bottom right*/
    r = row;
    c = col;
    for (let i = 0; i < 10; i++) {
        if (r > 9 || c > 9 || (gameBoard[r][c] !== playerChip && gameBoard[r][c] !== 'w')) break;
        else sequences.bottomRight.push((r * 10) + (c + 1));

        r++;
        c++;
    }

    /*Top right*/
    r = row;
    c = col;
    for (let i = 0; i < 10; i++) {
        if (r < 0 || c > 9 || (gameBoard[r][c] !== playerChip && gameBoard[r][c] !== 'w')) break;
        else sequences.topRight.unshift((r * 10) + (c + 1));

        r--;
        c++;
    }

    /*Bottom left*/
    r = row;
    c = col;
    for (let i = 0; i < 10; i++) {
        if (r > 9 || c < 0 || (gameBoard[r][c] !== playerChip && gameBoard[r][c] !== 'w')) break;
        else sequences.bottomLeft.push((r * 10) + (c + 1));

        r++;
        c--;
    }

    return sequences;
}

doStuff();