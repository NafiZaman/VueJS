<template>
  <div class="hand-section">
    <div ref="hand" id="cards-in-hand" :style="getCardsInHandSectionStyle()">
      <div
        class="PlayerCard"
        v-for="(cardId, idx) in this.$store.state.playerInfo.cardsInHand"
        :key="idx"
        :style="getPlayerCardStyle(cardId)"
        :id="cardId"
        @click="onCardClick(cardId)"
      ></div>
    </div>
    <div :style="getDeckStyle()" @click="onDeckClick()"></div>
    <div class="player-info-section">
      <div class="player-info">
        <div class="player-name" @click="onNameClicked()">
          {{ this.$store.state.playerInfo.name }}
          <span class="tool-tip">Click To Change Name</span>
        </div>
        <div>
          x{{ this.$store.state.playerInfo.score
          }}<img src="../assets/chip-icon.png" alt="" />
        </div>
        <div>
          x{{ this.$store.state.playerInfo.cardsInHand.length
          }}<img src="../assets/cih.png" alt="" />
        </div>
      </div>
      <div
        class="player-info"
        v-for="(otherPlayer, idx) in this.$store.state.otherPlayersInfo"
        :key="idx"
      >
        <label for="otherPlayerName">{{ otherPlayer.name }}</label>
        <div>
          x{{ otherPlayer.score }}<img src="../assets/chip-icon.png" alt="" />
        </div>
        <div>
          x{{ otherPlayer.numberOfCardsInHand
          }}<img src="../assets/cih.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Player",

  data() {
    return {
      deckStyle: "",
    };
  },

  methods: {
    onCardClick(cardId) {
      if (this.$store.state.playerInfo.moveInfo.canPlayCard) {
        this.$emit("clicked-card-in-hand", cardId);
      }
    },

    onDeckClick() {
      if (this.$store.state.playerInfo.moveInfo.canDrawFromDeck) {
        this.$emit("deck-clicked");
      }
    },

    getCardsInHandSectionStyle() {
      let cardInHandStyle = {};
      if (this.$store.state.playerInfo.moveInfo.canPlayCard) {
        cardInHandStyle = {
          border: "solid yellow 5px",
          boxShadow: "0 0 5px 5px yellow",
          display: "grid",
          gridTemplateColumns: "repeat(104, 0)",
          gridColumnGap: "2vw",
          overflowX: "scroll",
        };
      } else {
        cardInHandStyle = {
          border: "solid",
          display: "grid",
          gridTemplateColumns: "repeat(104, 0)",
          gridColumnGap: "2vw",
          overflowX: "scroll",
        };
      }

      return cardInHandStyle;
    },

    getDeckStyle() {
      let deckStyle = {};
      if (this.$store.state.playerInfo.moveInfo.canDrawFromDeck) {
        deckStyle = {
          backgroundImage: "url(" + require("../assets/deck.png"),
          backgroundSize: "100% 100%",
          width: "8vw",
          height: "auto",
          border: "solid yellow 5px",
          boxShadow: "0 0 5px 5px yellow",
        };
      } else {
        deckStyle = {
          backgroundImage: "url(" + require("../assets/deck.png"),
          backgroundSize: "100% 100%",
          width: "10vw",
          height: "auto",
          border: "",
        };
      }

      return deckStyle;
    },

    getPlayerCardStyle(cardId) {
      if (cardId[0] === "_") cardId = cardId.substring(1);

      var style = {
        backgroundImage:
          "url(" + require("../assets/cards/hand_cards/" + cardId + ".png"),
        backgroundSize: "100%" + " 100%",
        width: "9vw",
        height: "auto",
      };

      return style;
    },

    onNameClicked() {
      this.$emit("change-player-name");
    },
  },
};
</script>

<style scoped>
.hand-section {
  border-style: dashed;
  display: grid;
  grid-template-rows: 33% 33% 33%;
  grid-row-gap: 2vh;
}

.player-info-section {
  color: black;
  font-size: 150%;
  display: grid;
  grid-template-rows: repeat(4, 0);
  row-gap: 3vw;
}

.player-info {
  display: flex;
  justify-content: space-between;
}

.player-name .tool-tip {
  position: absolute;
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  font-size: small;

  z-index: 1;
}

.player-name:hover .tool-tip {
  visibility: visible;
}
</style>