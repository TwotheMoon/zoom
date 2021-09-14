import http from "http";
import WebSocket from "ws"; // 임포트 WebSocket
import express from "express";
import { parse } from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public") );
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });    // express 로 만든 http 서버에 ws 서버 올리기 (같이 사용)

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Stranger";  // socket 은 일반적으로 객체라 데이터 저장 가능
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconnected from the Browser"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname":
               socket["nickname"] = message.payload;
               break;
        }
    });
});    // js btn.addEventListner("click", fn); 유사함

server.listen(3000, handleListen);      // server변수로 만든 ws 리스닝

