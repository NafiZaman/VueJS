<template>
  <div>
    <div id="logo">
      <h1>SEQUENCE</h1>
    </div>
    <button id="btn">Join Game</button>
    <div>
      <footer id="footer">
        <small
          >&copy; Not really a copyright claim. Just wanted the fancy &copy;
          symbol to show here 🤣
        </small>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainMenu",
};
</script>

<style scoped>
#btn {
  position: relative;
  left: 50%;
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}

#btn:hover {
  opacity: 80%;
}

#footer {
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  color: white;
  bottom: 0;
  position: fixed;
  width: 100%;
}

#logo {
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  color: white;
  font-size: xxx-large;
  transform: rotateY(0deg) rotate(-10deg);
  text-shadow: 5px 5px black;
}
</style>