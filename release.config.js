{
  "plugins": [
    ["@semantic-release/commit-analyzer", {
      "preset": "angular",
      "releaseRules": [
        {"type": "refactor", "release": "patch"},
        {"type": "style", "release": "patch"}
      ],
      "parserOpts": {
        "noteKeywords": ["BREAKING"]
      }
    }],
    "@semantic-release/release-notes-generator",
    ["@semantic-release/github", {
      "assets": [
        {"path": "public/*", "label": "Zignaly webapp distribution"},
      ]
    }]
  ]
}
