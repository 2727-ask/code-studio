const languageMap = {
    0: "cpp",
    1: "java",
    2: "python",
    3: "javascript"
}

const technologyIcnMap = {
    0: 'C++',
    1: 'Java',
    2: 'Python',
    3: 'Node.js'
}

const themeMap = {
    0: "monokai",
    1: "dracula",
    2: "twilight",
    3: "solarized_dark",
    4: "solarized_light"
}



let currentLanguage = "";

var editor = ace.edit("editor", {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

// let editorMobile = ace.edit("editor-mobile", {
//     enableBasicAutocompletion: true,
//     enableSnippets: true,
//     enableLiveAutocompletion: true 
// });


editor.setOptions({
    formatOnType: true,
});

// editorMobile.setOptions({
//     formatOnType: true,
// })

function selectLanguage(params) {
    var language = document.getElementById("language");
    var languageMobile = document.getElementById("language-mobile");
    language.innerHTML = technologyIcnMap[params];
    languageMobile.innerHTML = technologyIcnMap[params];
    currentLanguage = params
    editor.session.setMode(`ace/mode/${languageMap[params]}`);
    editorMobile.session.setMode(`ace/mode/${languageMap[params]}`);

    currentLanguage = languageMap[params];
}


function runCode() {
    var code = editor.getValue();
    socket.emit("code", {
        type: languageMap[currentLanguage],
        code: code
    })
}


function changeFontSize(value) {
    let currentFontSize = 15 + "px";
    if(value!=null && value!=undefined){
        localStorage.setItem("fontSize", value.value);
    }
    let fontSize = localStorage.getItem("fontSize");
    if(fontSize!=null && fontSize!=undefined){
        console.log("if triggered");
        currentFontSize = fontSize + "px";
        editor.setOption("fontSize", currentFontSize);
        document.getElementById("fontSizeValue").innerText = `${currentFontSize}`;
    }else{
        console.log("else triggered");

        localStorage.setItem("fontSize", 15);
        currentFontSize = 15 + "px";
        editor.setOption("fontSize", currentFontSize);
        document.getElementById("fontSizeValue").innerText = '15px';
    } 
}

changeFontSize()


function changeTheme(params){
    if(params!=null && params!=undefined){
        localStorage.setItem('theme',params);
        editor.setTheme(`ace/theme/${themeMap[params]}`);
    }else{
        let theme = localStorage.getItem('theme');
        if(theme!=null && theme!=undefined){
            editor.setTheme(`ace/theme/${themeMap[theme]}`);
        }else{
            editor.setTheme(`ace/theme/${themeMap[0]}`); 
            localStorage.setItem('theme',0);
        }
    }
}

changeTheme();


