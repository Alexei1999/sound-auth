const express = require("express");
const ngrok = require("ngrok");
const config = require("../config");
const os = require("os");

const loginRoutes = require("./routes/login");

const HOST = "http://localhost";
const PORT = "<backend port>";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(loginRoutes);

(async () => {
  const url = "ngrok"; //await ngrok.connect(PORT);
  console.log("public url: ", url);
  // @ts-ignore
  config.url = url;
  app.listen(PORT, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
    console.log(
      `On Your Network ${
        os.networkInterfaces()["Беспроводная сеть"][1].address
      }:${PORT}`
    );
  });
})();
