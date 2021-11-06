<template>
  <div ref="wrapper" class="board-hand-wrapper">
    <Board @clicked-card-on-board="clickedCardOnBoard" />
    <Player
      @clicked-card-in-hand="clickedCardInHand"
      @change-player-name="changePlayerName"
      @deck-clicked="deckClicked"
    />
  </div>
</template>

<script>
import Board from "./Board.vue";
import Player from "./Player.vue";

export default {
  name: "GameManager",

  components: {
    Player,
    Board,
  },

  data() {
    return {
      cardPlayed: "",
    };
  },

  created: function () {
    this.$store.state.socket.emit("initialize", {
      roomId: sessionStorage.getItem("roomId"),
      playerId: sessionStorage.getItem("playerId"),
    });

    this.$store.state.socket.on("get-ids", (data) => {
      sessionStorage.setItem("roomId", data.roomId);
      sessionStorage.setItem("playerId", data.playerId);
    });

    this.$store.state.socket.on("get-room-info", (data) => {
      const roomId = sessionStorage.getItem("roomId");
      const playerId = sessionStorage.getItem("playerId");

      this.$store.commit("setPlayerInfo", {
        roomId: roomId,
        playerId: playerId,
        name: data.playersInRoom[playerId].playerName,
        chip: data.playersInRoom[playerId].chip,
        cardsInHand: data.playersInRoom[playerId].cardsInHand,
        moveInfo: data.playersInRoom[playerId].moveInfo,
        score: data.playersInRoom[playerId].playerScore,
      });

      for (const id in data.playersInRoom) {
        if (id !== playerId) {
          this.$store.commit("setOtherPlayersInfo", {
            name: data.playersInRoom[id].playerName,
            score: data.playersInRoom[id].playerScore,
            numberOfCardsInHand: data.playersInRoom[id].cardsInHand.length,
          });
        }
      }

      this.$store.commit("setChippedCards", data.chippedCards);
      this.$store.commit("setCardsInSequence", data.cardsInSequence);

      console.log(this.$store.state.playerInfo.moveInfo);
    });

    this.$store.state.socket.on("game-over", (winnerName) => {
      alert(winnerName + "has won the game");
      this.$router.push("/");
      sessionStorage.removeItem("roomId");
      sessionStorage.removeItem("playerId");
    });
  },

  methods: {
    clickedCardInHand(cardId) {
      this.cardPlayed = cardId;
      this.$store.state.mutableCardIds = [];

      if (cardId.includes("jc") || cardId.includes("jd")) {
        for (let i = 0; i < 100; i++) {
          if (
            !Object.hasOwnProperty.call(this.$store.state.chippedCards, i + 1)
          ) {
            this.$store.state.mutableCardIds.push(i + 1);
          }
        }
      } else if (cardId.includes("jh") || cardId.includes("js")) {
        for (const cardId in this.$store.state.chippedCards) {
          if (
            this.$store.state.chippedCards[cardId] !==
              this.$store.state.playerInfo.chip &&
            !this.$store.state.cardsInSequence.includes(parseInt(cardId))
          ) {
            this.$store.state.mutableCardIds.push(parseInt(cardId));
          }
        }
      } else {
        this.$store.state.mutableCardIds = cardId.split("_").map(Number);

        if (this.$store.state.mutableCardIds.length === 3)
          this.$store.state.mutableCardIds.shift();

        for (const cardId in this.$store.state.chippedCards) {
          if (this.$store.state.mutableCardIds.includes(parseInt(cardId))) {
            this.$store.state.mutableCardIds.splice(
              this.$store.state.mutableCardIds.indexOf(parseInt(cardId)),
              1
            );
          }
        }
      }

      // console.log(this.$store.state.mutableCardIds);
    },

    clickedCardOnBoard(boardCardId) {
      const chippedCards = this.$store.state.chippedCards;
      let unchipCard = false;

      if (Object.prototype.hasOwnProperty.call(chippedCards, boardCardId)) {
        unchipCard = true;
        console.log("Going to unchip");
      }

      let data = {
        roomId: this.$store.state.playerInfo.roomId,
        playerId: this.$store.state.playerInfo.playerId,
        boardCardId: boardCardId,
        cardPlayedId: this.cardPlayed,
        unchipCard: unchipCard,
        playerChip: this.$store.state.playerInfo.chip,
      };

      this.$store.state.mutableCardIds = [];
      this.$store.state.socket.emit("board-card-clicked", data);
    },

    deckClicked() {
      this.$store.state.socket.emit("deck-clicked", {
        roomId: this.$store.state.playerInfo.roomId,
        playerId: this.$store.state.playerInfo.playerId,
      });
    },

    changePlayerName() {
      let text = this.$store.state.playerInfo.name;
      let newNamePrompt = prompt("Enter your name:", text);

      if (newNamePrompt !== null && newNamePrompt !== "") {
        this.$store.state.socket.emit("change-player-name", {
          roomId: this.$store.state.playerInfo.roomId,
          playerId: this.$store.state.playerInfo.playerId,
          newName: newNamePrompt,
        });
      }
    },
  },
};
</script>

<style scoped>
.board-hand-wrapper {
  display: grid;
  grid-template-columns: 75vw 23vw;
}

#inputForm {
  position: absolute;
  /* top: 10px;
  left: 100px;
  width: 300px;
  height: 200ps; */
}
</style>