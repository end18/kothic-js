var Kothic = require("./src/kothic");
var fs = require('fs');

var MapCSS = require("./src/style/mapcss");

const { createCanvas, loadImage } = require('canvas')

const canvas = createCanvas(1000, 1000)

const css = fs.readFileSync("./contours.mapcss").toString();

const mapcss = new MapCSS(css, {
  cache: {},
  locales: []
});

var kothic = new Kothic(mapcss, {
  //Synchronous mode for testing reasons
  getFrame: (callback) => callback()
});

console.time("Loading GeoJSON");
const geojson = JSON.parse(fs.readFileSync('../../sandbox/relief/contours-json/N52E086.json'));
geojson.bbox = [86, 52, 86.1, 52.1];
console.timeEnd("Loading GeoJSON");

console.time("Rendering")
kothic.render(canvas, geojson, 13, function() {
  console.timeEnd("Rendering")
  console.time("Saving PNG")
  const stream = canvas.createPNGStream();
  const file = fs.createWriteStream("./test.png");

  stream.pipe(file);
  stream.on('end', () => console.timeEnd("Saving PNG"))
});
