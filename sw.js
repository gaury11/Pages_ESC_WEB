/* 
    self : 서비스 워커 자체를 참조하므로 서비스 워커에 이벤트 리스너를 추가함
    -> 푸시 메시지가 수신되면 이벤트 리스너가 실행되고, 등록 시 showNotification() 호출하여 알림을 생성함
    -> event.waitUntil() : 프라미스를 취하며 브라우저는 전달된 프라미스가 확인될 때까지 서비스 워커를 홣성화 및 실행 상태로 유지할 것

*/

self.addEventListener('push', function(event) {
    
    var data = {};
    if (event.data) {
        data = event.data.json();
    }
    
    console.log('[Service Worker] Push Received.', data);
    
    const title = data.pushTitle;
    //const title = '웹푸시 테스트';
    const body = data.pushMsg;
    //const body = '웹푸시 내용';
    const options = {
      body: body,
      icon: 'panda_push_icon.jpeg',
      image: 'panda_push_icon.jpeg'
      //badge: 'image/badge.png'
    };
    
    self.clickTarget = data.pushValue;
    
    //event.waitUntil(self.registration.showNotification(title, options));
    const notificaionPromise = self.registration.showNotification(title, options);
    event.waitUntil(notificaionPromise);
})

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');
    
    event.notification.close();

    if(clients.openWindow){
        event.waitUntil(clients.openWindow(self.clickTarget));
    }
});
