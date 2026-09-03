/* Recibe la carta de porte cuando la comparten desde WhatsApp u otra app. */
var CACHE = "compartido-v1";
var CLAVE = "archivo-compartido";

self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener("fetch", function(e){
  var url = new URL(e.request.url);
  if(e.request.method !== "POST" || !/\/compartir\/?$/.test(url.pathname)) return;

  e.respondWith((async function(){
    try{
      var datos = await e.request.formData();
      var archivo = datos.get("archivo");
      if(archivo && archivo.size){
        var cache = await caches.open(CACHE);
        await cache.put(CLAVE, new Response(archivo, {
          headers: {
            "content-type": archivo.type || "application/octet-stream",
            "x-nombre": encodeURIComponent(archivo.name || "carta-de-porte.pdf")
          }
        }));
      }
    }catch(err){}
    return Response.redirect(self.registration.scope + "?compartido=1", 303);
  })());
});
