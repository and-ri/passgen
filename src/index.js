const { app, Tray, nativeImage, nativeTheme, clipboard, BrowserWindow } = require('electron');
const { exec } = require('child_process');
const path = require("path");
import('fix-path').then(({default: fixPath}) => {
    fixPath();
});

const run = (command, callback) => {
    exec(command, (error, output) => {
        if (callback && typeof callback === 'function') {
            if (error) {
                callback(null);
                return;
            }
            console.log('output: ' + output)
            callback(output.trim());
        }
    });
}

let tray;

if (require('electron-squirrel-startup')) {
    app.quit();
}

app.on('ready', () => {
    const mainWindow = new BrowserWindow({ show: false });

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

        // Password generate
        run('tea pwgen --secure 16 1', (password) => {
            if (password) {
              clipboard.writeText(password);
              return;
            }
        });
        // Play sound
        run('afplay /System/Library/Sounds/Glass.aiff');
    });
    tray.addListener("right-click", () => {
        app.quit();
    });
});

const checkTea = () => {
    run('which tea', (output) => {
        if (!output) {
            run('curl -s -o tea-script.sh https://tea.xyz && chmod +x tea-script.sh && ./tea-script.sh', () => {});
            return;
        }
    });
    return;
}

const checkLib = () => {
    run('tea pwgen -secure 6 1', (output) => {
        if (!output) {
            run('tea +pwgen.sourceforge.io', () => {});
            return;
        }
    });
    return;
}