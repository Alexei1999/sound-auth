const path = require("path");
const { generatePitch } = require("./pitch-generator/pitch-generator");
const { recognisePitches } = require("./pitch-recognition");
const { isPitchesEqual } = require("./is-pitch-equal");

const initalPithes = generatePitch();
console.log("Cгенерированные тона: ", initalPithes);
recognisePitches(path.resolve(__dirname, "../../public/song.wav")).then(
  (recognizedPitches) => {
    console.log("Распознанные тона: ", recognizedPitches);
    console.log("Результат: ", isPitchesEqual(recognizedPitches, initalPithes));
  }
);
