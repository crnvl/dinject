const S = require('./utils/AppStatic')
const listen = require("./CI/ConsoleInputHandler");
const execute = require("./utils/Exec");
const fs = require("fs");
const os = require("os");

function init() {
    console.log(`${S.APP_HEADER}running checks...`)

    let dir = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Dinject\\`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }

    dir = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Dinject\\scripts\\`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
    console.log(`${S.APP_HEADER}created all app directories`)

    execute('npm list -g', (stdout) => {
        console.log(`${S.APP_HEADER}trying to detect module: asar`)
        if (stdout.includes('asar')) {
            console.log(`${S.APP_HEADER}detected module: asar`)
        }else {
            console.log(`${S.APP_HEADER}could not detect module: asar`)
            console.log(`${S.APP_HEADER}installing module globally: asar`)
            execute('npm install --save -g asar', (res) => {
                console.log(`${S.APP_HEADER}installed module: asar`)
            })
        }
        listen()
    })
}

init()