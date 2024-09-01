import express from "express";
import colores from "colors";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

// express init
const app = express();
const __dirname = path.resolve();

// create http server
const httpServer = createServer(app);

// io init
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`Client connected succesfully`.bgGreen.black);

  socket.send("I love JS");

  socket.on("message", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected!`.bgRed.white);
  });
});

// load our client
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// listen
httpServer.listen(5050, () => {
  console.log(`Server is running on port 5050`.bgBlue.black);
});
