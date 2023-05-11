const { app, Tray, nativeImage, nativeTheme } = require('electron');
const { exec } = require('child_process');
const path = require("path");

let tray;

if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => {
  checkTea();
  checkLib();

  const isDarkTheme = nativeTheme.shouldUseDarkColors;
  let iconPath = isDarkTheme ? path.join(__dirname, 'icon', "dark-icon.png") : path.join(__dirname, 'icon', "light-icon.png");
  let icon = nativeImage.createFromPath(iconPath);
  icon = icon.resize({
    height: 16,
    width: 16
  });

  tray = new Tray(icon);
  tray.addListener("mouse-up", () => {
    // 2 - Play sound
    exec('afplay /System/Library/Sounds/Glass.aiff', (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка выполнения команды: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
    // 1 - Password generator
    exec('tea pwgen --secure 16 1', (error, stdout) => {
      if (error) {
        console.error(`Ошибка выполнения скрипта: ${error}`)
        return
      }
      // 3 - Copy to clipboard
      const { clipboard } = require('electron')
      clipboard.writeText(stdout.trim());
    });
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