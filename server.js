import express, { json } from "express";
import colores from "colors";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { readFileSync, writeFileSync } from "fs";

// express init
const app = express();
const __dirname = path.resolve();

// create http server
const httpServer = createServer(app);

// io init
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`Client connected succesfully`.bgGreen.black);
  const recentData = JSON.parse(
    readFileSync(path.join(__dirname, "db/data.json")).toString()
  );

  io.sockets.emit("latest-msg", recentData);

  socket.on("chat", ({ name, photo, message }) => {
    const recentData = JSON.parse(
      readFileSync(path.join(__dirname, "db/data.json")).toString()
    );
    recentData.push({ name, photo, message });

    writeFileSync(
      path.join(__dirname, "db/data.json"),
      JSON.stringify(recentData)
    );

    io.sockets.emit("latest-msg", recentData);
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
