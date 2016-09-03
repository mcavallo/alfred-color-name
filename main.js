var fs = require('fs'),
    path = require('path'),
    alfred = require('./lib/alfred'),
    utils = require('./lib/utils'),
    sprintf = require("sprintf-js").sprintf,
    ntc = require('./lib/ntc'),
    iconBase = path.join(__dirname, 'assets', 'iconBase.png'),
    iconOutPath = path.join('/', 'tmp', 'alfred-color-name');


// Prompt for extension install to get all dependencies
if (!utils.dirExists(path.join(__dirname, 'node_modules'))) {
  alfred.return({
    title: 'Extension not yet installed',
    subtitle: 'Select to install now',
    arg: sprintf('install|%s', __dirname)
  });
}


// Prepare tmp dir
if (!utils.dirExists(iconOutPath)) {
  fs.mkdirSync(iconOutPath);
}


// Find a color
var color = ntc.name(process.argv[2]);


// Exit early if the color is not valid
if (!color) {
  alfred.return({
    valid: false,
    title: '?',
    subtitle: 'Invalid color',
    mods: {
      alt: {
        subtitle: 'Invalid color'
      },
      cmd: {
        subtitle: 'Invalid color'
      },
      ctrl: {
        subtitle: 'Invalid color'
      }
    }
  });
}


// Generate icon and return results
utils.generateIcon(iconBase, iconOutPath, color).then(function(icon) {
  alfred.return({
    title: sprintf('%s (%s)', color.name, color.hex),
    subtitle: sprintf('%s ~ Copy: %s', color.matchType, color.variableName),
    arg: color.variableName,
    icon: {
      path: icon
    },
    mods: {
      cmd: {
        arg: color.hex,
        subtitle: sprintf('%s ~ Copy: %s', color.matchType, color.hex)
      },
      alt: {
        arg: color.rgb,
        subtitle: sprintf('%s ~ Copy: %s', color.matchType, color.rgb)
      },
      ctrl: {
        arg: color.sassDefinition,
        subtitle: sprintf('%s ~ Copy: %s', color.matchType, color.sassDefinition)
      }
    }
  });
});
