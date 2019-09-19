const path = require('path');

const isDevelopment = () => process.env.NODE_ENV === 'development';
const isProduction = () => !isDevelopment();

const BUILDS = {
    CHROME: {},
    FIREFOX: {},
    EDGE: {},
};

const getTargetBuildName = () => {
    const buildName = (process.env.BUILD || '').toUpperCase();

    return Object.keys(BUILDS)
            .find(name => name == buildName)
        || 'CHROME';
};

const targetBuildName = getTargetBuildName();
const getManifestFiles = (isLocalBuild = false) => {
  const files =  [
    './web-extension/manifest/base.manifest.json',
  ];

/*
  if (!isLocalBuild) {
    files.push(`./web-extension/manifest/${targetBuildName.toLowerCase()}.prod.manifest.json`);
  }

  if (isLocalBuild) {
    files.push('./web-extension/manifest/base.dev.manifest.json');
  }
*/

  return files;
};

module.exports = {
    targetBuildName: targetBuildName,
    manifestFiles: getManifestFiles,
    isProduction: isProduction(),
    DIST_DIR: path.join(__dirname, '../build', targetBuildName.toLowerCase()),
};
