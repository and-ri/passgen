const { app, Tray, nativeImage, nativeTheme } = require('electron');
const { exec } = require('child_process');
const path = require("path");
const { clipboard } = require('electron');

let tray;

if (require('electron-squirrel-startup')) {
    app.quit();
}

app.on('ready', () => {
    app.dock.hide()
    checkTea();
    checkLib();

    const isDarkTheme = nativeTheme.shouldUseDarkColors;
    let iconPath = isDarkTheme ? path.join(__dirname, '../assets/icon', "dark-icon.png") : path.join(__dirname, '../assets/icon', "light-icon.png");
    let icon = nativeImage.createFromPath(iconPath);
    icon = icon.resize({
        height: 16,
        width: 16
    });

    tray = new Tray(icon);
    tray.addListener("click", () => {
        app.focus()
        // 2 - Play sound
        exec('afplay /System/Library/Sounds/Glass.aiff', (error, stdout, stderr) => {
            if (error) {
                console.error(`Command error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });
        // 1 - Password generator
        exec('tea pwgen --secure 16 1', (error, stdout) => {
            if (error) {
                console.error(`Script error: ${error}`)
                return
            }
            // 3 - Copy to clipboard
            clipboard.writeText(stdout.trim());
        });
    });
    tray.addListener("right-click", () => {
        app.quit();
    });
});

const checkTea = () => {
    exec('which tea', (err, stdout, stderr) => {
        if (err || stdout === '') {
            console.log('tea is not installed');
            exec('curl -s -o tea-script.sh https://tea.xyz && chmod +x tea-script.sh && ./tea-script.sh', (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`tea is installed: ${stdout}`);
            });
        } else {
            console.log(`tea is installed: ${stdout}`);
        }
    });
}

const checkLib = () => {
    exec('pwgen -secure 6 1', (err, stdout, stderr) => {
        if (err || stdout === '') {
            console.log('pwgen is not installed');
            exec('tea +pwgen.sourceforge.io', (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`pwgen is installed: ${stdout}`);
            });
        } else {
            console.log(`pwgen is installed: ${stdout}`);
        }
    });
}