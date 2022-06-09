var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/view", (req, res) => {
  res.sendFile(__dirname + "/display.html");
});

io.on("connection", (socket) => {
  socket.on("join-message", (roomId) => {
    //user will be added to room
    socket.join(roomId);
    console.log("User joined in room id: " + roomId);
  });

  socket.on("screen-data", (data) => {
    data = JSON.parse(data);
    var room = data.room;
    var imgStr = data.image;
    //broadcast image data from screen share to specific room so users can see
    socket.broadcast.to(room).emit("screen-data", imgStr);
  });
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;

http.listen(server_port, () => {
  console.log("Started on : " + server_port);
});
