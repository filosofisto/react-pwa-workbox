# Intro

Esse projeto é um exemplo de utilização do workbox-webpack-plugin para implementação de PWA em projetos React que foram criados com o comando create-react-app. As configurações padrão do React são sobreescritas para a implementação do PWA e utilização do workbox (biblioteca que facilita a utilização do Service Worker).

# Install e Build

Para instalar as dependência execute o comando:

``` bash
npm install
```

Para realizar o build execute o comando:

``` bash
npm run build
```

# Alterações para implementação do Service Worker customizado com Wordbox

1. Habilitar o Service Worker no arquivo principal do projeto 'index.js' que fica em /src.

``` javascritp
serviceWorker.register();
```

2. Instalar a biblioteca que possibilita sobreescrever as configurações do webpack definido pelo create-react-app.

``` bash
npm i react-app-rewired
```
2.1 Substituir o atributo 'scripts' do arquivo package.json pelo valor logo abaixo:

``` javascript

 "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test"
  }
  ```

3. Criar o arquivo config-overrides.js que customiza o webpack do react no diretório raiz do projeto.

``` javascript

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
      importWorkboxFrom: 'cdn'
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
```
4. Criar o arquivo custom-service-worker.js no diretório /srv.

``` javascript

// See https://developers.google.com/web/tools/workbox/guides/configure-workbox
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// We need this in Webpack plugin (refer to swSrc option): https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config
workbox.precaching.precacheAndRoute(self.__precacheManifest);

// app-shell
workbox.routing.registerRoute("/", workbox.strategies.networkFirst());

// Exemplo de cache de requisição no qual tenta recuperar a resposta no 
// backend primeiro e caso falhe ele recupera no cache.
workbox.routing.registerRoute(
    'http://localhost:8000/todos',
    workbox.strategies.networkFirst()
  )

```
