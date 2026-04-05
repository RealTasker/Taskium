const params = new URLSearchParams(window.location.search);
const game = params.get("game") || "Game";

document.getElementById("gameName").textContent = `${game} is In Development`;