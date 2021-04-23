const express = require("express");
const ngrok = require("ngrok");
const config = require("../config");
const os = require("os");
const path = require("path");
const session = require("express-session");
const chalk = require("chalk");

const loginRoutes = require("./src/routes/login");
const appRoutes = require("./src/routes/app");
const deviceRoutes = require("./src/routes/device");

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

app.use(appRoutes);
app.use(deviceRoutes);
app.use(loginRoutes);

(async () => {
  const backUrl = await ngrok.connect({
    subdomain: config.back.subdomain,
    addr: config.back.port,
    authtoken: config.ngrok,
    // onLogEvent: (e) => console.log(chalk.blueBright(e)),
  });
  const frontUrl = await ngrok.connect({
    subdomain: config.front.subdomain,
    host_header: config.front.port,
    addr: config.front.port,
    authtoken: config.ngrok,
    onLogEvent: (e) => console.log(chalk.redBright(e)),
  });

  console.log("public be url: ", backUrl);
  console.log("public fe url: ", frontUrl);
  config.back.url = backUrl;
  config.front.url = frontUrl;

  app.listen(PORT, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
    try {
      console.log(
        `On Your Network ${
          os.networkInterfaces()["Беспроводная сеть"][1].address
        }:${PORT}`
      );
    } catch (e) {
      console.error(e);
      console.error("Проверьте подключение к интернету!");
    }
  });
})();
