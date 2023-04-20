const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const os = require("os");
const pty = require('node-pty-prebuilt-multiarch');
// const pty = require("node-pty");
const path = require('path');


const dependancy = require('./inject/dependancy');
const { runPython, runJava, runShell, runNode } = require("./runner/runner");
dependancy(app);



const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/ui/index.html");
});


io.on("connection", (socket) => {
    console.log("Connection Established");
    let ptyProcess = pty.spawn(shell, [], {
        cwd: process.env.HOME,
        env: process.env,
        // uid: process.getuid(),
        // gid: process.getgid(),
    });

    // Listen on the terminal for output and send it to the client
    ptyProcess.on('data', function (data) {
        socket.emit('output', data);
    });

    // Listen on the client and send any input to the terminal
    socket.on("disconnect", function () {
        ptyProcess.destroy();
        console.log("bye");
    });

    socket.on("start", (data) => {
        console.log("Started", data);
        ptyProcess.onData("data")
        ptyProcess.on("data", function (output) {
            socket.emit("output", output);
            console.log(ptyProcess);
        });
        ptyProcess.write("./result.out\n");
    });

    socket.on("input", (data) => {
        userInput = data;
        ptyProcess.write(data);
        ptyProcess.write('\n');
    });
    //Code Runner
    socket.on("code", (data) => {
        try {
            ptyProcess.write("clear")
            ptyProcess.write("\n");
            console.log(data.type);
            //Run Python
            if (data.type == "python") {
                runPython(data.code, ptyProcess, data.userId);
            } else if (data.type === "java") {
                runJava(data.code, ptyProcess, data.userId);
            } else if (data.type === "javascript") {
                runNode(data.code, ptyProcess, data.userId);
            } else if (data.type === "sh") {
                console.log("Shell Script");
                runShell(data.code, ptyProcess, data.userId);
            }
        } catch (error) {
            console.log(error);
        }
    })
});

server.listen(2727, () => {
    console.log("listening on *:2727");
});

