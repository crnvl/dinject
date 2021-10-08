const execute = require("../utils/Exec");
const os = require("os");
const S = require("../utils/AppStatic");
const fs = require("fs");
const ps = require('ps-node');


async function inject(client) {
    console.log(`${S.APP_HEADER}starting injector...`)

    let clientToMod;
    switch (client) {
        case "main": {
            clientToMod = 'Discord'
            break
        }
        case "canary": {
            clientToMod = 'DiscordCanary'
            break
        }
        case "ptb": {
            clientToMod = 'DiscordPTB'
            break
        }
        default: {
            clientToMod = 'Discord'
            break
        }
    }

    console.log(`${S.APP_HEADER}looking up process...`)
    execute(`taskkill /f /t /im ${clientToMod}.exe`, (r) => {
        console.log(`${S.APP_HEADER}killed task ${clientToMod}.exe`)

        console.log(`${S.APP_HEADER}injecting into ` + clientToMod)
        console.log(`${S.APP_HEADER}trying to extract client files...`)

        const dirPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\${clientToMod}\\`;
        const result = fs.readdirSync(dirPath)

        let version;
        for (let i = 0; i < result.length; i++) {
            if(result[i].startsWith('app-')) {
                version = result[i]
            }
        }
        console.log(`${S.APP_HEADER}detected version ${version}`)

        const appdataPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\${clientToMod}\\${version}\\modules\\discord_desktop_core-1\\discord_desktop_core\\core.asar`
        const appdataBackup = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\${clientToMod}\\${version}\\modules\\discord_desktop_core-1\\discord_desktop_core\\coreBackup.asar`
        const unzipPath = `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Dinject\\unpacked`

        execute(`asar extract ${appdataPath} ${unzipPath}`, (listr) => {
            console.log(`${S.APP_HEADER}successfully extracted client files`)

            fs.copyFile('./injections/mainScreen.js', `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Dinject\\unpacked\\app\\mainScreen.js`, (err) => {
                if (err) throw err;
                console.log(`${S.APP_HEADER}injected modded files`)
            });

            fs.copyFile('./scripts/loader.js', `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Dinject\\scripts\\loader.js`, (err) => {
                if (err) throw err;
                console.log(`${S.APP_HEADER}copied script loader`)

                console.log(`${S.APP_HEADER}trying to pack files for client...`)
                console.log(`${S.APP_HEADER}creating core backup...`)
                fs.copyFile(appdataPath, appdataBackup, (err) => {
                    if (err) throw err;
                    console.log(`${S.APP_HEADER}created core backup`)

                    execute(`asar pack ${unzipPath} ${appdataPath}`, (res) => {
                        console.log(`${S.APP_HEADER}packed all files into modded core`)
                        console.log(`${S.APP_HEADER}starting ${clientToMod}...`)
                        execute(`start C:\\Users\\${os.userInfo().username}\\AppData\\Local\\${clientToMod}\\${version}\\${clientToMod}.exe`)
                        console.log(`${S.APP_HEADER}done.`)
                    })
                });
            });
        })
    })
}

module.exports = inject