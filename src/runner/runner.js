const fse = require('fs-extra');


module.exports.runPython = function runPython(code, ptyProcess, userId) {
    try {
        let filePath = `${process.env.HOME}/${userId}/codes/main.py`;
        let script = `python3 ${filePath}`
        fse.outputFileSync(filePath, code)
        ptyProcess.write(script);
        ptyProcess.write("\n");
    } catch (error) {
        console.log("Error", error);
    }
};


module.exports.runNode = function runNode(code, ptyProcess, userId) {
    try {
        let filePath = `${process.env.HOME}/${userId}/codes/main.js`;
        let script = `node ${filePath}`
        fse.outputFileSync(filePath, code)
        ptyProcess.write(script);
        ptyProcess.write("\n");
    } catch (error) {
        console.log(error);
    }

};

module.exports.runJava = function runJava(code, ptyProcess, userId) {
    try {
        let filePath = `${process.env.HOME}/${userId}/codes/Main.java`;
        let compileScript = `javac ${filePath}`;
        let runScript = `java ${filePath}`;
        fse.outputFileSync(filePath, code)
        ptyProcess.write(compileScript);
        ptyProcess.write("\n");
        ptyProcess.write(runScript);
        ptyProcess.write("\n");
    } catch (error) {
        console.log(error);
    }

}



module.exports.runShell = function runShell(code, ptyProcess, userId) {
    try {
        let filePath = `${process.env.HOME}/${userId}/codes/main.sh`;
        fse.outputFileSync(filePath, code)
        let runScript = `sh ${filePath}`;
        ptyProcess.write(runScript);
        ptyProcess.write("\n");
    } catch (error) {
        console.log(error);
    }

}