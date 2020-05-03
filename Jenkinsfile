PipelineReact {
  slackChannel = '#ci-gatsby-starter-internationalized'
  buildCommand = [
    master: 'npm install && npm run build',
    development: 'npm install && npm run build',
  ]
  baseURL = 'gatsby-starter-internationalized'
  buildDir = 'public'
  bucketURL = [
    master: "gs://${baseURL}.ack.ee/",
    development: "gs://${baseURL}-development.ack.ee/",
  ]
  nodeEnv = '-e NODE_PATH=./app:./config'
  nodeImage = 'node:8'
  excludeDir = '.git'
}
