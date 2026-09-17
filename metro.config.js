const dkd_path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const dkd_config = getDefaultConfig(__dirname);
const dkd_reactNativeRoot = dkd_path.dirname(require.resolve('react-native/package.json'));
const dkd_featureFlagsModule = 'react-native/src/private/featureflags/ReactNativeFeatureFlags';
const dkd_featureFlagsPath = dkd_path.join(
  dkd_reactNativeRoot,
  'src/private/featureflags/ReactNativeFeatureFlags.js'
);

// Expo SDK 58 beta currently targets React Native 0.88 RC. One React Native
// package still deep-imports this RN-owned feature-flags file without exposing
// that subpath through package.json exports. Resolve only that known RC import
// explicitly; package exports remain enabled for Expo Router and expo/dom.
dkd_config.resolver.resolveRequest = (dkd_context, dkd_moduleName, dkd_platform) => {
  if (dkd_moduleName === dkd_featureFlagsModule) {
    return { filePath: dkd_featureFlagsPath, type: 'sourceFile' };
  }
  return dkd_context.resolveRequest(dkd_context, dkd_moduleName, dkd_platform);
};

module.exports = dkd_config;
