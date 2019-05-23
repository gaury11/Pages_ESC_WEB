
// 공용키 
const applicationServerPublicKey = 'BBYnIeG7C7vmgF897LraqWvzrHTMGBeXypUEz4INiZ37pzcSYmAcofwIiEpr54SMahxcCrQRNYXaEzJ_-B37Vqk';

const API_URL = 'https://dev-api.pushpia.com/esc';

let isSubscribed = false;
let swRegistration = null;

// 서비스 워커 등록 
if('serviceWorker' in navigator && 'PushManager' in window){
    console.log('Service Workder and Push is supported');

    navigator.serviceWorker.register('sw.js')
    .then(function(swReg){
        console.log('Service Worker is registered', swReg);
        swRegistration = swReg;
        initSubscription();
    })
    .catch(function(error){
        console.error('Service Worker Error', error);
    });
}else{
    console.warn('Push messaging is not supported');
}

$(document).ready(function () {
	$('#subscrptionBtn').click(function(){
		subscribeUser();
	});
	
	$('#unsubscrptionBtn').click(function(){
		unsubscribeUser();
	});
	
	$('#pushSendBtn').click(function(){
		pushSend();
	});
});

// 푸시 발송 요청
function pushSend(){
	$.ajax({
        url: 'https://dev-api.pushpia.com/esc/push/test-all',
        type: 'GET',
        success: function(data){
            console.log(data);
        }
    });
}

// 구독여부 확인
function initSubscription(){
    // 구독 정보 get
    swRegistration.pushManager.getSubscription()
    .then(function(subscription){
        isSubscribed = !(subscription === null);

        if(isSubscribed){
            console.log('User is subscribed. : ', JSON.stringify(subscription));
        }else{
            console.log('User is Not subscribed. : ', JSON.stringify(subscription));
            subscribeUser();
        }
    })
    
}

// 구독 요청
function subscribeUser(){
	// 구독 하기 
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
    .then(function(subscription){
        console.log('User id subscribed1 : ', subscription);
        console.log('User id subscribed2 : ', JSON.stringify(subscription));

        isSubscribed = true;
        
        setPushResponse(subscription);
        
        var endpoint = subscription.endpoint;
        var key = subscription.getKey('p256dh');
        var auth = subscription.getKey('auth');
        
        subscribeServer(endpoint, key, auth);
        
    })
    .catch(function(err){
        console.log('Failed to subscribe the user: ', err);
    })
}

// 구독 정보 서버로 요청
function subscribeServer(endpoint, publicKey, auth){
	var encodedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(publicKey)));
    var encodedAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));
	
    var data = {
    	pushId: '',
        endpoint: endpoint,
        publicKey: encodedKey,
        auth: encodedAuth,
        subscribe: 'Y'
    };
    
    console.log("data : " + JSON.stringify(data));
    
    $.ajax({
        url: 'https://dev-api.pushpia.com/esc/push-user/subscribe',
        type: 'POST',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function(data){
            console.log("data : " + JSON.stringify(data));
        }
    });
    
}

// 구독 취소하기
function unsubscribeUser(){
	// 구독 취소하기
    swRegistration.pushManager.getSubscription()
    .then(function(subscription){
        if(subscription){
        	console.log('User is unsubscribed1.');
            return subscription.unsubscribe();
        }
    })
    .catch(function(err){
        console.log('Error unsubscribing', err);
    })
    .then(function(){
        console.log('User is unsubscribed2.');
        isSubscribed = false;
    });
}

function unsubscribeServer(endpoint){
    var data = {
        endpoint: endpoint
    };

    $.ajax({
        url: API_URL + '/unsubscribe',
        type: 'POST',
        contentType: 'applicaton/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(data),
        success: function(data){
            console.log(data);
        }
    });
}

// 공용키 변환 메소드
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function setPushResponse(data){
	var json = "<h4>Api Response</h4><pre>"
		+ JSON.stringify(data, null, '\t') + "</pre>";
	$("#pushResponse").html(json);
}