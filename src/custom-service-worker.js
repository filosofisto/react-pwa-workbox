// See https://developers.google.com/web/tools/workbox/guides/configure-workbox
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// We need this in Webpack plugin (refer to swSrc option): https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config
workbox.precaching.precacheAndRoute(self.__precacheManifest);

// app-shell
//workbox.routing.registerRoute("/", workbox.strategies.networkFirst());

workbox.routing.registerRoute(
    'http://localhost:8000/todos',
    workbox.strategies.networkFirst()
  )

  const showNotification = () => {
    self.registration.showNotification('Background sync success!', {
      body: '🎉`🎉`🎉`'
    });
  };

  const bgSyncPlugin = new workbox.backgroundSync.Plugin('todoQueue', {
    maxRetentionTime: 24 * 60,
    callbacks: {
      queueDidReplay: showNotification
      // other types of callbacks could go here
    }
  });
  
workbox.routing.registerRoute(
    'http://localhost:8000/todos',
    workbox.strategies.networkOnly({
      plugins: [bgSyncPlugin]
    }),
    'POST'
  )  