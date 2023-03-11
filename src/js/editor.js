const languageMap = {
    0: "java",
    1: "python",
    2: "javascript"
}

const technologyIcnMap = {
    0: 'Java',
    1: 'Python',
    2: 'Node.js'
}

const themeMap = {
    0: "monokai",
    1: "dracula",
    2: "twilight",
    3: "solarized_dark",
    4: "solarized_light"
}

const themeBtnMap = {
    0: "monokai-btn",
    1: "dracula-btn",
    2: "twilight-btn",
    3: "solarized-dark-btn",
    4: "solarized-light-btn"
}



let currentLanguage = 0;
let currentLanguageCode = 0;

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
    // var languageMobile = document.getElementById("language-mobile");
    language.innerHTML = technologyIcnMap[params];
    // languageMobile.innerHTML = technologyIcnMap[params];
    currentLanguage = params;
    currentLanguageCode = params;
    editor.session.setMode(`ace/mode/${languageMap[params]}`);
    // editorMobile.session.setMode(`ace/mode/${languageMap[params]}`);
    currentLanguage = languageMap[params];
}


function runCode() {
    var code = editor.getValue();
    socket.emit("code", {
        type: currentLanguage,
        code: code
    })
}


function changeFontSize(value) {
    let currentFontSize = 15 + "px";
    if (value != null && value != undefined) {
        localStorage.setItem("fontSize", value.value);
    }
    let fontSize = localStorage.getItem("fontSize");
    if (fontSize != null && fontSize != undefined) {
        console.log("if triggered");
        currentFontSize = fontSize + "px";
        editor.setOption("fontSize", currentFontSize);
        document.getElementById("fontSizeValue").innerText = `${currentFontSize}`;
    } else {
        console.log("else triggered");

        localStorage.setItem("fontSize", 15);
        currentFontSize = 15 + "px";
        editor.setOption("fontSize", currentFontSize);
        document.getElementById("fontSizeValue").innerText = '15px';
    }
}

changeFontSize()

function changeTheme(params) {

    if (params != null && params != undefined) {
        localStorage.setItem('theme', params);
        editor.setTheme(`ace/theme/${themeMap[params]}`);
        removeClassAndAddTheme(params);
    } else {
        let theme = localStorage.getItem('theme');
        if (theme != null && theme != undefined) {
            editor.setTheme(`ace/theme/${themeMap[theme]}`);
            removeClassAndAddTheme(theme)
        } else {
            editor.setTheme(`ace/theme/${themeMap[0]}`);
            localStorage.setItem('theme', 0);
            removeClassAndAddTheme(0)
        }
    }
}

changeTheme();


function removeClassAndAddTheme(themeId) {
    let toolbar = document.getElementById("upper-toolbar");
    let sidebar = document.getElementById("my-side-bar");
    let ps = document.getElementById("ps");


    sidebar.classList.forEach(function (className) { // Loop through all class names
        sidebar.classList.remove(className); // Remove each class name
    });
    toolbar.classList.forEach(function (className) { // Loop through all class names
        toolbar.classList.remove(className); // Remove each class name
    });

    toolbar.classList.add("nav");
    toolbar.classList.add(themeBtnMap[themeId]);


    sidebar.classList.add("col-3");
    sidebar.classList.add("no-scrollbar");
    sidebar.classList.add(themeBtnMap[themeId]);
}


function beautifyCode() {
    const beautify = js_beautify(editor.getValue());
    editor.setValue(beautify);
}


function downloadCode() {
    let content = editor.getValue();
    let extension = ".txt"
    if (currentLanguageCode === 0) {
        extension = ".java";
    } else if (currentLanguageCode === 1) {
        extension = ".py"
    } else if (currentLanguageCode === 2) {
        extension = ".js"
    } else {
        extension = ".txt"
    }
    console.log(extension);
    let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    let name = prompt("Save file as");
    if (name != null && name != "") {
        saveAs(blob, name + extension);
    } else {
        alert("You did not enter a name.");
    }
}

