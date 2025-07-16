const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
// Add resolver for react-native-css-interop if needed (optional, usually handled automatically)
config.resolver.sourceExts.push("css", "css.ts", "css.js");

module.exports = config;
