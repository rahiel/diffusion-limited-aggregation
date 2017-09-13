import * as PIXI from "pixi.js";

let color = require("tinycolor2");


let app;
let worker = new Worker("");
let workerPath = (<HTMLSpanElement>document.getElementById("workerPath")).textContent;
let button = document.getElementById("start");
button.onclick = start;


function start() {
    if (app != null) {
        app.destroy(true);
    }
    worker.terminate();
    worker = new Worker(workerPath);

    let config = (<HTMLInputElement>document.getElementById("config")).value;
    let latticeSize = parseInt((<HTMLInputElement>document.getElementById("latticeSize")).value);
    let clusterSize = parseInt((<HTMLInputElement>document.getElementById("clusterSize")).value);

    let scale = 2;
    let [width, height] = [latticeSize * scale, latticeSize * scale];

    app = new PIXI.Application(width, height, {
        backgroundColor : 0x000000,
        antialias: true
    });
    let div = document.getElementById("model");
    div.appendChild(app.view);

    worker.onmessage = function (e) {
        let data = e.data;
        let [x, y, hue] = data;
        app.stage.addChild(makeRect(x, y, hue, scale));
        render();
    }

    worker.postMessage([latticeSize, clusterSize, config]);
}


function makeRect(x: number, y: number, h: number, scale: number) {
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(getColor(h));
    rectangle.drawRect(x * scale, y * scale, scale, scale);
    rectangle.endFill();
    return rectangle;
}

function getColor(h: number) {
    return parseInt(color(`hsl(${h}, 100%, 50%)`).toHex(), 16);
}

function render() {
    app.renderer.render(app.stage);
}
