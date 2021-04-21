const express = require("express");
const ngrok = require("ngrok");
const config = require("../config");
const os = require("os");
const path = require("path");
const session = require("express-session");

const loginRoutes = require("./src/routes/login");

const HOST = "http://localhost";
const PORT = "<backend port>";
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "<session key>",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
);
app.use(loginRoutes);

(async () => {
  try {
    const url = config.url; //await ngrok.connect(PORT);
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
  } catch (e) {
    console.error(e);
    console.error("Проверьте подключение к интернету!");
  }
})();
