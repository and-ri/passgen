module.exports = {
  packagerConfig: {
    icon: './assets/MacOS_Icon.icns'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './assets/MacOS_Icon.icns',
        background: './assets/DMG_Background.tiff',
        iconSize: 128,
        iconSizePadding: 32,
        format: 'ULFO',
        window: {
          size: { width: 544, height: 322 }
        },
        overwrite: true
      }
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};