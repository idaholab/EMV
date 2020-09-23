module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
  module: {
    rules: require('./webpack.rules'),
  },
};
