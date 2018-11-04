const workboxPlugin = require('workbox-webpack-plugin')
const path = require('path')

module.exports = {
  webpack: function (config, env) {
    config = removePluginGenerateSW(config)
    adicionarCustomSW(config,env)
    return config
  }
}

//adicionar o workboxPlugin que utiliza o custom-service-worker.js 
//definido no diretório /src para implementar o PWA.
function adicionarCustomSW (config, env) {
  if (env === 'production') {
    const workboxConfigProd = {
      swSrc: path.join(__dirname, 'src', 'custom-service-worker.js'),
      swDest: 'service-worker.js',
      importWorkboxFrom: 'disabled'
    } 
    config.plugins.push(new workboxPlugin.InjectManifest(workboxConfigProd))
  }
  return config
}

//Remove o plugin que gerar o Service Worker padrão do React.
function removePluginGenerateSW (config) {
  const generateSW = config.plugins.findIndex((element) => {
    console.log(element.constructor.name);
    return element.constructor.name === 'GenerateSW'
  })
  if (generateSW !== -1) {
    config.plugins.splice(generateSW, 1);
  }
  return config
}