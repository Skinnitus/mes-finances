const CACHE='mes-finances-v40-release-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mes-finances-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try {
   const response=await fetch(request,{cache:'no-store'});
   if(response.ok)await cache.put(request,response.clone());
   return response;
  }catch(err){
   const cached=await cache.match(request);
   if(cached)return cached;
   if(request.mode==='navigate')return (await cache.match('./index.html'))||Response.error();
   return Response.error();
  }
 })());
});
