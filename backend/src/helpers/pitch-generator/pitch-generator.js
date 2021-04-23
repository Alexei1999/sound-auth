const { WaveFile } = require("wavefile");
const fs = require("fs");
const path = require("path");

module.exports.generatePitch = () => {
  const wav = new WaveFile();

  let samples = [[], []];
  const files = fs
    .readdirSync(path.resolve(__dirname, "./notes"))
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  files.forEach((name) => {
    let file = fs.readFileSync(__dirname + "/notes/" + name);

    wav.fromBuffer(file);
    wav.getSamples().forEach((sample, i) => {
      samples[i] = [...samples[i], ...sample];
    });
  });

  wav.fromScratch(
    wav.fmt.numChannels,
    wav.fmt.sampleRate,
    wav.bitDepth,
    samples
  );

  fs.writeFileSync(
    path.resolve(__dirname, "../../../public/song.wav"),
    wav.toBuffer()
  );

  return files.map((name) => name.replace(".wav", ""));
};
