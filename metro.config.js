const path = require('path')

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const starlingLib = path.resolve(__dirname + '/../starling-lib/');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        nodeModulesPaths: [starlingLib],
    },
    watchFolders: [starlingLib]
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
