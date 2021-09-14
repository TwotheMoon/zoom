import http from "http";
import SocketIO from "socket.io"; // WebSocket 프레임워크
import express from "express";


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public") );
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_,res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    
    socket.on("enter_room", (roomName, nickname, done) => {
        socket["nickname"] = nickname;
        socket.join(roomName);     // socket 그룹 만드는 함수
        socket.to(roomName).emit("welcome", socket.nickname);
        done();
    }); 

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
    })

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    })
    
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});



//const wss = new WebSocket.Server({ server });    // express 로 만든 http 서버에 ws 서버 올리기 (같이 사용)
// const sockets = [];
// wss.on("connection", (socket) => {
    //     sockets.push(socket);
    //     socket["nickname"] = "Stranger";  // socket 은 일반적으로 객체라 데이터 저장 가능
    //     console.log("Connected to Browser");
    //     socket.on("close", () => console.log("Disconnected from the Browser"));
    //     socket.on("message", (msg) => {
        //         const message = JSON.parse(msg);
        //         switch(message.type){
            //             case "new_message":
            //                 sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
            //                 break;
            //             case "nickname":
            //                socket["nickname"] = message.payload;
            //                break;
            //         }
            //     });
            // });    // js btn.addEventListner("click", fn); 유사함
            

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);      // server변수로 만든 ws 리스닝
            
            