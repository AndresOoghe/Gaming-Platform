const tailwindcss = require('tailwindcss')
module.exports = {
  "plugins": [
    require('postcss-import'),
    require('tailwindcss')('tailwind.js'),
    require('autoprefixer')(),
  ]
}