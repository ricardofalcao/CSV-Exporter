module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
      ? '/csv-exporter/'
      : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
