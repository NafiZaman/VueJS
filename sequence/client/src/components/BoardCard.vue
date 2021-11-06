<template>
  <div :id="id" :style="getStyle()" @click="onClick"></div>
</template>

<script>
export default {
  name: "BoardCard",

  props: {
    id: {
      type: Number,
      default: -1,
    },
  },

  data() {
    return {
      style: "",
      // isChipped: false,
      // isChippable: true,
    };
  },

  mounted() {
    if (this.id === 1 || this.id === 10 || this.id === 91 || this.id === 100) {
      this.placeChip("white");
    }
  },

  methods: {
    getStyle() {
      var style = {
        backgroundImage:
          "url(" + require("../assets/cards/board_cards/" + this.id + ".png"),
        display: "flex",
        justifyContent: "center",
        backgroundSize: "100%" + " 100%",
        opacity: "",
      };

      if (
        Object.prototype.hasOwnProperty.call(
          this.$store.state.chippedCards,
          this.id
        )
      ) {
        this.placeChip(this.$store.state.chippedCards[this.id]);
      } else {
        this.removeChip();
      }

      if (this.$store.state.mutableCardIds.includes(this.id))
        style.opacity = "50%";
      else if (this.$store.state.cardsInSequence.includes(this.id))
        style.opacity = "10%";
      else style.opacity = "100%";

      return style;
    },

    placeChip(chip) {
      var card = document.getElementById(this.id);

      if (card !== null && !card.hasChildNodes()) {
        var img = document.createElement("img");
        img.src = require("../assets/" + chip + ".png");
        card.appendChild(img);
      }
    },

    removeChip() {
      var card = document.getElementById(this.id);

      if (
        this.id !== 1 &&
        this.id !== 10 &&
        this.id !== 91 &&
        this.id !== 100 &&
        card !== null &&
        card.hasChildNodes()
      ) {
        card.removeChild(card.childNodes[0]);
      }
    },

    onClick() {
      if (this.$store.state.mutableCardIds.includes(this.id)) {
        this.$emit("clicked-card-on-board", this.id);
      }
    },
  },
};
</script>

<style scoped>
</style>