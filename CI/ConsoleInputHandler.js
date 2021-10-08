const readline = require('readline');
const S = require("../utils/AppStatic");
const inject = require("./Injector");

function listen() {
    console.log(S.APP_LOGO)
    console.log(S.DESC)

    const rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt(`${S.APP_NAME}/>`);
    rl.prompt();
    rl.on('line', function (line) {

        if (line.startsWith('inject')) {
            const args = line.split(" ")
            inject(args[1])
        }

    }).on('close', function () {
        process.exit(0);
    });
}

module.exports = listen