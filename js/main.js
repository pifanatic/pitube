import PiTube from "./modules/pitube.js";

let piTube = new PiTube({
    el: "#content"
}).render();

piTube.load();
