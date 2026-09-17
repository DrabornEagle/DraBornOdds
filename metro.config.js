const { getDefaultConfig } = require('expo/metro-config');

const dkd_config = getDefaultConfig(__dirname);

// React Native 0.88 RC used by the Expo SDK 58 beta still contains internal
// packages that deep-import ReactNativeFeatureFlags. Metro's package-exports
// validation warns about that React Native-owned private import even though it
// can resolve the file. Until the upstream RC exports are aligned, keep Metro
// on its legacy file resolver so the same Expo Go bundle resolves cleanly.
dkd_config.resolver.unstable_enablePackageExports = false;

module.exports = dkd_config;
