self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('p2pVideoChat-cache')
            .then(cache => cache.addAll([
                '/p2pVideoChat/',
                'index.html',
                'style.css',
                'app.js',
                'bundle.js',
                'manifest.webmanifest',
                'icons/android-chrome-192x192.png',
                'icons/apple-touch.png',
                'icons/browserconfig.xml',
                'icons/favicon-16x16.png',
                'icons/favicon-32x32.png',
                'icons/favicon.ico',
                'icons/mstile-150x150.png',
                'icons/safari-pinned-tab.svg'
            ]))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open('p2pVideoChat-cache')
            .then(cache => cache.match(event.request))
    );
});