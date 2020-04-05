const tailwindcss = require('tailwindcss')
module.exports = {
  "plugins": [
    require('postcss-import'),
    require('tailwindcss')('./config/tailwind.js'),
    require('autoprefixer')(),
  ]
}