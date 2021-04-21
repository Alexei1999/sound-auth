const fs = require("fs");
const { WaveFile } = require("wavefile");
const Pitchfinder = require("pitchfinder");
const noteStrings = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// see below for optional constructor parameters.
const detectPitch = new Pitchfinder.YIN({ sampleRate: 48000 });

function noteFromPitch(frequency) {
  if (!frequency || frequency > 1000) return;
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const octerNote = Math.round(noteNum) + 69;
  return noteStrings[octerNote % 12] + Math.round((octerNote - 33) / 12 + 1);
}

module.exports.recognisePitches = async (path) => {
  console.log("to recognise -> ", path);
  const file = fs.readFileSync(path);
  const wav = new WaveFile(file);

  const float32Array = wav.getSamples()[0];

  const frequencies = Pitchfinder.default.frequencies(
    detectPitch,
    float32Array,
    {
      tempo: 100,
      quantization: 4,
    }
  );

  return frequencies.map(noteFromPitch).filter((s) => s);
};
