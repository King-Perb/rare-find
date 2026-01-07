const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

// 1. Find the project and workspace roots
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

// 2. Set environment variables that Expo/Metro look for
process.env.EXPO_USE_METRO_WORKSPACE_ROOT = '1';
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(projectRoot, './src/app');

const config = getDefaultConfig(projectRoot);

// 3. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];

// 4. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
];

// 5. Force Metro to resolve (order: node_modules/react -> ../../node_modules/react)
config.resolver.disableHierarchicalLookup = true;

// 6. [NEW] Ensure certain packages are always transformed by Babel
// This is critical for expo-router in monorepos
config.transformer.getTransformOptions = async () => ({
    transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
    },
});

module.exports = config;
