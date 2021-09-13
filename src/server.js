import http from "http";
import WebSocket from "ws"; // 임포트 WebSocket
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public") );
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_,res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });    // express 로 만든 http 서버에 ws 서버 올리기 (같이 사용)

//function handleConnection(socket){  // socket: 서버와 클라이언트가 특정 포트를 통해 양방향 실시간 통신을 할 수 있게 만드는 그릇
//    console.log(socket);
//}

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconnected from the Browser"));
    socket.on("message", (message) => {
        sockets.forEach((aSocket) => aSocket.send(message.toString()));
    });
});    // js btn.addEventListner("click", fn); 유사함

server.listen(3000, handleListen);      // server변수로 만든 ws 리스닝

