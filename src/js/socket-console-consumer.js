var term = new Terminal({
    cursorBlink: "block",
    rows: 10,
    cols: 10,
    fontSize: 10
});

// term.terminalOptions = {

//     cursorBlink: true,
//     enableBold: true,
//     cols: 80,
//     rows: 40,
//     screenKeys: true
//   };

//Uncomment on Deployment
// const socket = io("http://154.26.154.29"); 

const socket = io();
console.log(socket);
var curr_line = "";
var entries = [];

var documentTerminal = document.getElementById('terminal');
term.open(documentTerminal);

//-------------------Write Data To Terminal-------------------------------//

// term.onData(e => {
//     term.write(e)
// })

//-------------------When Msg Comes from Backend-------------------------------//
socket.on('output', function (data) {
    let printLn = true;
    if(data.trim() === curr_line.trim()){
        printLn = false;
    }
    console.log(printLn);
    curr_line = "";
    console.log(data);
    if(printLn){
        term.write(data);
    }
    printLn = true;
});


term.onKey((key) => {
    console.log(key)
    if (key.key === "\r") {
        if (curr_line != "") {
            term.write("\n\r");
            socket.emit("input", curr_line);
        }
    } else if (key.key === "\u007f") {
        if (curr_line) {
            curr_line = curr_line.slice(0, curr_line.length - 1);
            term.write("\b \b");
        }
    } else {
        console.log("Else");
        curr_line += key.key;
        term.write(key.key);
    }
    console.log("This is curr line "+curr_line);
})

//-----------Code Runner ------------------




//--- tools -----

//clear the terminal 

function clearTerminal() {
    socket.emit("input", "clear");
}


//Keep track of device height and width


function terminalSizeAdjust(width) {
    const initWidth = width;
    let initFontSize;
    let intCols;
    let intRows;
    if (initWidth < 400) {
        initFontSize = 11;
        intCols = 40;
        intRows = 14        
    }
    else if (initWidth > 400 && initWidth < 500) {
        initFontSize = 11;
        intCols = 54;
        intRows = 12;
    }
    else if (initWidth > 500 && initWidth < 600) {
        initFontSize = 11;
        intCols = 63;
        intRows = 12;
    }
    else if (initWidth > 600 && initWidth < 700) {
        initFontSize = 11;
        intCols = 65;
        intRows = 12;

    }
    else if (initWidth > 700 && initWidth < 800) {
        initFontSize = 11;
        intCols = 75;
        intRows = 12;

    } else if (initWidth >= 800 && initWidth < 850) {
        initFontSize = 12;
        intCols = 75
        intRows = 12;

    } else {
        initFontSize = 14;
        intCols = 80;
        intRows = 12;
    }

    term._publicOptions.fontSize = initFontSize;
    term.resize(intCols, intRows)
    // console.log(term._publicOptions.set("cols"));
    // term._publicOptions.rows = rows;

}


terminalSizeAdjust(window.innerWidth);


window.addEventListener("resize", function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // do something with the updated width and height

    console.log(width, height);

    // term.fontSize = 10;

    console.log(term);

    terminalSizeAdjust(width);


    // term.terminalOptions = {
    //     fontSize: 20,
    // }

    // term.refresh(0, term.rows - 1);
});





