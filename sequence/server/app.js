const { get } = require("http");

const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

let deck = [
    '11_87', '18_45', '25_50', '32_36', '44_62', '58_98', '7_63', 'jc',
    '12_47', '19_46', '26_60', '34_52', '4_84', '59_61', '76_94', 'jd',
    '13_57', '20_33', '27_70', '35_42', '48_99', '64_82', '77_95', 'jh',
    '14_67', '21_88', '2_86', '3_85', '49_71', '6_73', '78_96', 'js',
    '15_66', '22_37', '28_80', '38_90', '51_69', '68_97', '8_53',
    '16_65', '23_30', '29_56', '39_81', '54_72', '74_92', '9_43',
    '17_55', '24_40', '31_89', '41_79', '5_83', '75_93',

    '_11_87', '_18_45', '_25_50', '_32_36', '_44_62', '_58_98', '_7_63', '_jc',
    '_12_47', '_19_46', '_26_60', '_34_52', '_4_84', '_59_61', '_76_94', '_jd',
    '_13_57', '_20_33', '_27_70', '_35_42', '_48_99', '_64_82', '_77_95', '_jh',
    '_14_67', '_21_88', '_2_86', '_3_85', '_49_71', '_6_73', '_78_96', '_js',
    '_15_66', '_22_37', '_28_80', '_38_90', '_51_69', '_68_97', '_8_53',
    '_16_65', '_23_30', '_29_56', '_39_81', '_54_72', '_74_92', '_9_43',
    '_17_55', '_24_40', '_31_89', '_41_79', '_5_83', '_75_93'
];

let gameBoard = [
    ['w', '-', '-', '-', '-', '-', '-', '-', '-', 'w'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['w', '-', '-', '-', '-', '-', '-', '-', '-', 'w'],
];

var maxRooms = 20;
var roomCap = 2; // change this >= 2
var rooms = {};
var players = [];

for (let i = 0; i < maxRooms; i++) {
    rooms["room" + (i + 1).toString()] = {
        currentCapacity: 0,
        maxCapacity: roomCap,
        deck: deck,
        playersInRoom: {},
        chips: ["yellow", "red", "green", "blue"],
        chippedCards: {},
        currentPlayer: 0,
        gameBoard: gameBoard,
        cardsInSequence: [],
        winner: "",
    }
}

Socketio.on("connection", socket => {

    socket.on("initialize", (data) => {
        if (data.roomId === null || data.playerId === null) {
            roomId = getAvailableRoom();
            playerId = generateNewPlayerId()


            createPlayer(roomId, playerId);

            rooms[roomId].currentCapacity += 1

            socket.emit("get-ids", { roomId: roomId, playerId: playerId });
            socket.join(roomId);

            if (isRoomFull(roomId)) {
                for (const playerId in rooms[roomId].playersInRoom) {
                    if (rooms[roomId].maxCapacity <= 2) {
                        dealCards(roomId, playerId, 7);
                        // cardsInHand[cardsInHand.length - 3] = '25_50';
                        // let cardsInHand = rooms[roomId].playersInRoom[playerId].cardsInHand;
                        // cardsInHand[0] = '_25_50';
                        // cardsInHand[1] = '25_50';
                        // cardsInHand[2] = '26_60';
                        // cardsInHand[3] = 'js';
                        // cardsInHand[4] = 'jd';
                        // rooms[roomId].chippedCards = {
                        //     2: "green",
                        //     3: "green",
                        //     4: "green",
                        //     5: "green",
                        //     12: "green",
                        //     26: "blue",
                        //     90: "blue",
                        //     80: "blue",
                        //     70: "blue",
                        //     59: "blue",
                        //     58: "blue",
                        //     57: "blue",
                        //     56: "blue",
                        // };

                        // rooms[roomId].gameBoard[0][1] = 'g';
                        // rooms[roomId].gameBoard[0][2] = 'g';
                        // rooms[roomId].gameBoard[0][3] = 'g';
                        // rooms[roomId].gameBoard[0][4] = 'g';
                        // rooms[roomId].gameBoard[2][5] = 'b';
                        // rooms[roomId].gameBoard[6][9] = 'b';
                        // rooms[roomId].gameBoard[7][9] = 'b';
                        // rooms[roomId].gameBoard[8][9] = 'b';
                        // rooms[roomId].gameBoard[5][5] = 'b';
                        // rooms[roomId].gameBoard[5][6] = 'b';
                        // rooms[roomId].gameBoard[5][7] = 'b';
                        // rooms[roomId].gameBoard[5][8] = 'b';
                        // rooms[roomId].cardsInSequence = [1, 2, 3, 4, 5];
                    }
                }

                setPlayerTurn(roomId);
                Socketio.in(roomId).emit('get-room-info', getRoomInfo(roomId));
            }
        }
        else {
            socket.join(roomId);
            socket.emit("get-room-info", getRoomInfo(roomId));
        }
    });

    socket.on("board-card-clicked", (data) => {
        roomId = data.roomId;
        playerId = data.playerId;
        boardCardId = data.boardCardId;
        cardPlayedId = data.cardPlayedId;
        unchipCard = data.unchipCard;
        playerChip = data.playerChip;

        // console.log("Board card clicked: " + boardCardId);

        if (unchipCard) {
            delete rooms[roomId].chippedCards[boardCardId];
        }
        else {
            rooms[roomId].chippedCards[boardCardId] = playerChip;
            checkForSequence(parseInt(boardCardId), rooms[roomId], playerChip[0], playerId);
        }

        const cardsInHand = rooms[roomId].playersInRoom[playerId].cardsInHand
        const index = cardsInHand.indexOf(cardPlayedId);
        cardsInHand.splice(index, 1);

        if (foundWinner(roomId)) {
            Socketio.in(roomId).emit('get-room-info', getRoomInfo(roomId));
            Socketio.in(roomId).emit('game-over', rooms[roomId].winner);
            resetRoom(roomId);
        }
        else {
            rooms[roomId].playersInRoom[playerId].moveInfo.canPlayCard = false;
            rooms[roomId].playersInRoom[playerId].moveInfo.canDrawFromDeck = true;
            Socketio.in(roomId).emit('get-room-info', getRoomInfo(roomId));
        }
    });

    socket.on("deck-clicked", (data) => {
        const roomId = data.roomId;
        const playerId = data.playerId;

        let roomDeck = rooms[roomId].deck;
        let playerCardsInHand = rooms[roomId].playersInRoom[playerId].cardsInHand;

        var index = Math.floor(Math.random() * roomDeck.length);

        playerCardsInHand.push(roomDeck[index]);
        roomDeck.splice(roomDeck.indexOf(roomDeck[index]), 1);

        rooms[roomId].playersInRoom[playerId].moveInfo.canDrawFromDeck = false;

        setPlayerTurn(roomId);
        Socketio.in(roomId).emit('get-room-info', getRoomInfo(roomId));
    });

    socket.on("change-player-name", (data) => {
        roomId = data.roomId;
        playerId = data.playerId;
        newName = data.newName;

        rooms[roomId].playersInRoom[playerId].playerName = newName;
        Socketio.in(roomId).emit('get-room-info', getRoomInfo(roomId));
    });
});

function resetRoom(roomId) {
    rooms[roomId].currentCapacity = 0;
    rooms[roomId].maxCapacity = roomCap;
    rooms[roomId].deck = deck;
    rooms[roomId].playersInRoom = {};
    rooms[roomId].chips = ["yellow", "red", "green", "blue"];
    rooms[roomId].currentPlayer = 0;
    rooms[roomId].gameBoard = gameBoard;
    rooms[roomId].cardsInSequence = [];
    rooms[roomId].chippedCards = {};
    rooms[roomId].winner = "";
}

function foundWinner(roomId) {
    let playersInRoom = rooms[roomId].playersInRoom;

    for (const playerId in playersInRoom) {
        if (playersInRoom[playerId].playerScore === 2) {
            rooms[roomId].winner = playersInRoom[playerId].playerName;
            return true;
        }
    }

    return false;
}

function checkForSequence(cardNumber, room, playerChip, playerId) {
    let row = -1;
    let col = -1;

    if (cardNumber % 10 === 0) {
        row = (cardNumber / 10) - 1;
        col = 9;
    }
    else {
        row = Math.floor(cardNumber / 10);
        col = (cardNumber % 10) - 1;
    }

    room.gameBoard[row][col] = playerChip;

    let info = getSequenceInfo(row, col, room.gameBoard, playerChip);

    let sequences = {
        horizontal: [],
        vertical: [],
        leftDiagonal: [],
        rightDiagonal: [],
    }

    sequences.horizontal = info.left.concat(info.right.filter((item) => info.left.indexOf(item) < 0));
    sequences.vertical = info.top.concat(info.bottom.filter((item) => info.top.indexOf(item) < 0));
    sequences.leftDiagonal = info.topLeft.concat(info.bottomRight.filter((item) => info.topLeft.indexOf(item) < 0));
    sequences.rightDiagonal = info.topRight.concat(info.bottomLeft.filter((item) => info.topRight.indexOf(item) < 0));

    // console.table(room.gameBoard);
    // console.log("cell: " + cardNumber + ", row: " + row + ", col: " + col);
    // console.log(sequences);

    for (const direction in sequences) {
        if (sequences[direction].length >= 5) {

            let newCells = 0;
            let oldCells = 0;

            for (let i = 0; i < sequences[direction].length; i++) {
                if (!room.cardsInSequence.includes(sequences[direction][i])) newCells += 1;
                else oldCells += 1;
            }

            if (oldCells === 0 && newCells >= 5) {
                let index = sequences[direction].indexOf(cardNumber);

                if (index < 4) sequences[direction] = sequences[direction].slice(index, sequences[direction].length);
                else if (index >= 4) sequences[direction] = sequences[direction].slice(0, index + 1);

                room.playersInRoom[playerId].playerScore += 1;
                room.cardsInSequence = room.cardsInSequence.concat(sequences[direction]);
                // console.log("No old cells found:");
                // console.log("card number: " + cardNumber);
                // console.log("index: " + index);
                // console.log(sequences[direction]);
                // console.log(room.cardsInSequence);
            }
            else if ((newCells + oldCells) % 5 === 0) {
                room.playersInRoom[playerId].playerScore += 1;
                room.cardsInSequence = room.cardsInSequence.concat(sequences[direction].filter((item) => room.cardsInSequence.indexOf(item) < 0))
            }
        }
    }

    // console.log(room.playersInRoom[playerId]);
}

function getSequenceInfo(row, col, gameBoard, playerChip) {

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

function dealCards(roomId, playerId, numCardsToDeal) {
    var playerCardsInHand = rooms[roomId].playersInRoom[playerId].cardsInHand;
    var roomDeck = rooms[roomId].deck;

    while (playerCardsInHand.length < numCardsToDeal) {
        var index = Math.floor(Math.random() * roomDeck.length);

        playerCardsInHand.push(roomDeck[index]);
        roomDeck.splice(roomDeck.indexOf(roomDeck[index]), 1);
    }
}

function setPlayerTurn(roomId) {
    let playersInRoom = rooms[roomId].playersInRoom;
    let currentPlayer = rooms[roomId].currentPlayer;
    let maxCapacity = rooms[roomId].maxCapacity;

    for (const playerId in playersInRoom) {
        let playerPosition = playersInRoom[playerId].playerPosition;

        if (playerPosition === (currentPlayer % maxCapacity) + 1) {
            playersInRoom[playerId].moveInfo.canPlayCard = true;
            rooms[roomId].currentPlayer = playerPosition;
            break;
        }
    }
}

function createPlayer(roomId, playerId) {

    const playerPosition = (rooms[roomId].currentCapacity % rooms[roomId].maxCapacity) + 1;

    rooms[roomId].playersInRoom[playerId] = {
        playerPosition: playerPosition,
        playerName: "Player_" + playerPosition.toString(),
        cardsInHand: [],
        chip: rooms[roomId].chips.pop(),
        moveInfo: { canPlayCard: false, canDrawFromDeck: false },
        playerScore: 0
    }
}

function generateNewPlayerId() {
    var playerId = "";
    var len = 4;

    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;

    do {
        for (let i = 0; i < len; i++) {
            playerId += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } while (players.includes(playerId));

    players.push(playerId);
    return playerId;
}

function isRoomFull(roomId) {
    if (rooms[roomId].currentCapacity === rooms[roomId].maxCapacity) return true;
    else return false;
}

function getAvailableRoom() {
    for (const roomId in rooms) {
        if (rooms[roomId].currentCapacity < rooms[roomId].maxCapacity) {
            return roomId;
        }
    }
}

function getRoomInfo(roomId) {
    var data = {
        roomId: roomId,
        playersInRoom: rooms[roomId].playersInRoom,
        chippedCards: rooms[roomId].chippedCards,
        cardsInSequence: rooms[roomId].cardsInSequence,
    }

    return data;
}

// Handle production
if (process.env.NODE_ENV === 'production') {
    Http.use(Express.static(__dirname + '/public'));
    Http.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}

Http.listen(3000, () => {
    console.log("Listening at 3000");
});