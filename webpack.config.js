const path = require('path');

module.exports = {
  entry: './src/webRunner.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'webrunner2',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          'html-loader',
          {
            loader: 'posthtml-loader',
            options: {
              ident: 'posthtml',
              plugins: [
                /* PostHTML Plugins */
                require('posthtml-inline-assets')()
              ]
            }
          }
        ]
      }

    ],
  },
};