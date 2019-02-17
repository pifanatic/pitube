import PiTube from "./modules/pitube.js";

let piTube = new PiTube();

piTube.load().then(() => {
    let $content = document.getElementById("content");
    $content.appendChild(piTube.render());
});
