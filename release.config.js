module.exports = {
  branches: [{ name: "master" }, { name: "develop", channel: "beta", prerelease: "beta" }],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { type: "refactor", release: "patch" },
          { type: "style", release: "patch" },
        ],
        presetConfig: {
          issuePrefixes: ["ZIG-"],
        },
      },
    ],
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/github",
      {
        assets: "release.tar.gz",
      },
    ],
  ],
};
