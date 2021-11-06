<template>
  <div id="layout">
    <BoardCard
      v-for="index in 100"
      :key="index"
      :id="index"
      @clicked-card-on-board="clickedCardOnBoard"
    />
  </div>
</template>

<script>
import BoardCard from "./BoardCard.vue";

export default {
  name: "Board",

  props: {
    boardCards: Array,
  },

  components: {
    BoardCard,
  },

  methods: {
    clickedCardOnBoard(cardId) {
      this.$emit("clicked-card-on-board", cardId);
    },
  },
};
</script>

<style scoped>
#layout {
  border-style: dashed;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(10, 7vw);
  grid-template-rows: repeat(10, 9vh);
  grid-row-gap: 0.5vh;
  grid-column-gap: 0.25vw;
}
</style>