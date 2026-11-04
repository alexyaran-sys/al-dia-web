// Al Día – service worker
// La página se pide primero a la red (así las actualizaciones llegan al momento)
// y, sin conexión, se sirve la copia guardada. El resto de archivos, desde la caché.
const CACHE='aldia-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./vendor/pdf.min.js','./vendor/capacitor.js','./vendor/pdf.worker.min.js','./vendor/fonts/inter-latin-wght-normal.woff2','./vendor/fonts/inter-latin-ext-wght-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return res})
      .catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
    if(res.ok&&new URL(e.request.url).origin===location.origin){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return res})))});
