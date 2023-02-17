const languageMap = {
    0: "cpp",
    1: "java",
    2: "python",
    3: "javascript"
}

const technologyIcnMap = {
    0: '<img class="technology-icn" src="https://img.icons8.com/color/48/null/c-plus-plus-logo.png" alt="C++"/>',
    1: '<img class="technology-icn" src="https://img.icons8.com/color/48/null/java-coffee-cup-logo--v1.png" alt="Java"/>',
    2: '<img class="technology-icn" src="https://img.icons8.com/color/48/null/python--v1.png" alt="Python"/>',
    3: '<img class="technology-icn" src="https://img.icons8.com/fluency/48/null/node-js.png" alt="Node.js"/>'
}

var editor = ace.edit("editor", {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});


editor.setOptions({
    formatOnType: true,
});


function selectLanguage(params) {
    var language = document.getElementById("language");
    language.innerHTML = technologyIcnMap[params];
    currentLanguage = params
    editor.session.setMode(`ace/mode/${languageMap[params]}`);
    editor.session.setValue(scriptMap[params]);
}
