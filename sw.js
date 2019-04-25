
self.addEventListener('test', function(event){
	console.log("test");
})

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const title = 'Push Soon Test';
    const body = event.data.text();
    const options = {
      //body: 'Yay it works.',
      body: body,
      icon: 'images/icon.png',
      badge: 'images/badge.png'
    };
    //event.waitUntil(self.registration.showNotification(title, options));
    const notificaionPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificaionPromise);
})