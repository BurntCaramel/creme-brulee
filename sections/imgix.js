const Imgix = require('imgix-core-js')

const imgix = new Imgix({
  host: 'royalicing.imgix.net',
  secureURLToken: process.env.IMGIX_TOKEN
})

module.exports = imgix
