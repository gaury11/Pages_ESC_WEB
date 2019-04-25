
//var SERVER_URL = "http://localhost:8090/api";
var userList = null;

function buySend(){
	
	var SERVER_URL = $("#input_url").val();
	
	if(SERVER_URL == "" || SERVER_URL == null){
		SERVER_URL = "http://localhost:8090/api/bca";
	}
	
	const nameVal = $("#input_name").val();
	const amountVal = $("#input_amount").val();
	const payVal = $("#input_pay").val();
	
	console.log("name : " + nameVal + " / amount : " + amountVal + " / pay : " + payVal);
	
	const data = {
		name: nameVal,
		amount: amountVal,
		pay: payVal
	};
	
	$.ajax({
		url: SERVER_URL,
		type: "POST",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: JSON.stringify(data),
		success: function(data){
			setResponse(data);			
			console.log(data);			
			setUserList();
			buyClear();
		},
		error: function(error){
			setResponse(error);
			console.log(error);
			buyClear();			
		}
	});
}

function setResponse(data){
	var json = "<h4>Api Response</h4><pre>"
		+ JSON.stringify(data, null, '\t') + "</pre>";
	$("#response").html(json);
}

function setUserList(){
	
	console.log("setUserList");	
	
	var SERVER_URL = $("#input_url").val();
	
	if(SERVER_URL == "" || SERVER_URL == null){
		SERVER_URL = "http://localhost:8090/api/bca";
	}
	
	$.ajax({
		url: SERVER_URL,
		type: "GET",
		success: function(data){
						
			console.log(data);			
			
			var json = "";
			
			$.each(data, function(i, item){
				json += "<tr>";
				json +=	"<td>" + item.name + "</td>";
				json +=	"<td>" + item.amount + " 잔 </td>";
				json += "<td>" + item.pay + " 원 </td>";
				json += "<td>" + item.regDate + "</td>";
				json += "</tr>";
			})
			
			$("#bcaList").html(json);
		},
		error: function(error){
			setResponse(error);
			console.log(error);				
		}
	});
}

function notifyAll(){
	
	console.log("notify-all start");
	
	
}

/*
function getUserList(){
	$.ajax({
		url: SERVER_URL + "/user",
		type: "GET",
		success: function(data){
			console.log(data);
			userList = data;

		},
		error: function(error){
			console.log(error);
		}
	});
}
*/

function buyClear(){
	$("#input_name").val("test");
	$("#input_amount").val("");
	$("#input_pay").val("");
}

$(document).ready(function () {	
	
	setUserList();
	
	$("#buyBtn").click(function(){
		buySend(); 
	});
	
	$("#refreshBtn").click(function(){
		setUserList();
	});
});

