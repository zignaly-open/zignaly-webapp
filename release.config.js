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
    [
      "@semantic-release/exec",
      {
        prepareCmd:
          'rm -rf .semvernext && echo ${nextRelease.version} >> .semvernext && echo "\\"${nextRelease.version}\\"" > public/version.json && npm run build:package',
        publishCmd: "mv release.tar.gz zignaly-webapp2-${nextRelease.version}.tar.gz",
      },
    ],
    [
      "semantic-release-jira-releases",
      {
        projectId: "ZIG",
        releaseNameTemplate: "webapp-${version}",
        jiraHost: "zignaly.atlassian.net",
        ticketPrefixes: ["ZIG"],
        released: true,
        setReleaseDate: true,
      },
    ],
    [
      "semantic-release-slack-bot",
      {
        notifyOnSuccess: true,
        notifyOnFail: true,
      },
    ],
  ],
};
