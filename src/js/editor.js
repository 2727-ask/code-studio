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

let currentLanguage = "";

var editor = ace.edit("editor", {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

let editorMobile = ace.edit("editor-mobile", {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true 
});


editor.setOptions({
    formatOnType: true,
});

editorMobile.setOptions({
    formatOnType: true,
})

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
