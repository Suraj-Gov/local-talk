module.exports = {
  target: "serverless",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
    config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/))
    return config
};
