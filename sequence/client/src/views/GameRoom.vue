<template>
  <div>
    <div id="game-title">
      <h4 class="title-headers">TWO EYED JACKS ARE WILD</h4>
      <h3 class="title-headers">SEQUENCE</h3>
      <h4 class="title-headers">ONE EYED JACKS REMOVE</h4>
    </div>
    <GameManager />
  </div>
</template>

<script>
// @ is an alias to /src
import GameManager from "@/components/GameManager.vue";

export default {
  name: "GameRoom",
  components: {
    GameManager,
  },
};
</script>

<style scoped>
#game-title {
  padding-top: 0px;
  color: white;
  font-weight: bolder;
  font-size: larger;
  display: flex;
  justify-content: space-between;
}
.title-headers {
  margin-bottom: 0px;
  margin-top: 0px;
}
</style>