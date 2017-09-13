/* **********************************
 March 2017
 Koku KUSIAKU

***************************************/

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template:__dirname+'/index.html',
  filename:'index.html',
  inject:'body',
});

module.exports ={
  entry:[
    './index.js',
  ],
  module: {
    /* to be changed to bale later */
  /*loaders: [
    {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
    {test: /\.css$/, exclude: /node_modules/, use: [ 'style-loader', 'css-loader' ]},

  ]*/
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    },
   {
     test: /\.css$/,
     use: [

       {loader:'style-loader'},
       {loader:'css-loader'},
     ]
   }
 ]
},
output: {
  filename: "bundle.js",
  path: __dirname + '/docs'
},

plugins:[HtmlWebpackPluginConfig]

}
