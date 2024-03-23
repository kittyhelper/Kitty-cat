import express from "express";
import http from "node:http";
import path from "path";
import ejs from "ejs";
import { createBareServer }  from "@tomphttp/bare-server-node"

const port = process.env.PORT || 3000
const app = express();
const __dirname = process.cwd();
const server = http.createServer();
const bareServer = createBareServer("/bare/");

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render("index", { title: "Home" });
});

app.get('/gxmes', (req, res) => {
  res.render("gxmes", { title: "Geometry" });
});

app.get('/apps', (req, res) => {
  res.render("apps", { title: "Algebra" });
});

app.get('/settings', (req, res) => {
  res.render("settings", { title: "Settings" });
});

app.get('/textbook', (req, res) => {
  res.render('loader',  { title: "Textbook" });
});

app.use((req, res) => {
  res.statusCode = 404;
  res.render("404");
});

app.get('/learning', (req, res) => {
  res.render('learning');
});

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(`Kitty is running on: http://localhost:${port}`);
});

server.listen({
  port: 3000,
});


