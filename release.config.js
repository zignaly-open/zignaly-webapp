module.exports = {
  branches: [
    { name: "master" },
    { name: "develop", channel: "beta", prerelease: "beta" },
    { name: "staging", channel: "rc", prerelease: "rc" },
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { type: "refactor", release: "patch" },
          { type: "style", release: "patch" },
        ],
        // presetConfig: {
        //   issuePrefixes: ["ZIG-"],
        // },
      },
    ],
    // "@semantic-release/release-notes-generator",
    [
      "@semantic-release/github",
      {
        assets: "release.tar.gz",
        successComment: false,
      },
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          'rm -rf .semvernext && echo ${nextRelease.version} >> .semvernext && echo "\\"${nextRelease.version}\\"" > public/version.json && npm run build:package',
        publishCmd: "mv release.tar.gz zignaly-webapp2-${nextRelease.version}.tar.gz",
      },
    ],
  ],
};
