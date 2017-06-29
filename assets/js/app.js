 var config = {
    apiKey: "AIzaSyDs-diVqFvFQTA2plc4cnOymgQNvpi59JA",
    authDomain: "chatbot-14388.firebaseapp.com",
    databaseURL: "https://chatbot-14388.firebaseio.com",
    projectId: "chatbot-14388",
    storageBucket: "chatbot-14388.appspot.com",
    messagingSenderId: "751128574046"
  };
  firebase.initializeApp(config);


  var database = firebase.database()

// var question = "Hi"

// var queryURL = "https://api.api.ai/api/query?v=20150910&query="+question+"&lang=en&sessionId=dd27efb8-2c15-4441-accf-2e1a3a8c18d2&timezone=2017-06-28T15:05:27-0700";

 
//         $.ajax({
//         	Authorization: Bearer ecb2965ee6da42df92c8ab68408dbb69
//           url: queryURL,
//           method: "GET"
//         }).done(function(response) {

//          var results = response.data;

//      })

var accessToken = "ecb2965ee6da42df92c8ab68408dbb69";
var baseUrl = "https://api.api.ai/api/";

$(document).ready(function() {
			$("#input").keypress(function(event) {
				console.log(event)
				if (event.which == 13) {
					event.preventDefault();
					send();
				}
			});
			
		});

function send() {
			var text = $("#input").val();
			$("#input").val("")
			$.ajax({
				type: "POST",
				url: baseUrl + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				data: JSON.stringify({
					query: text,
					lang: "en",
					sessionId: "testBot"
				}),
				success: function(data) {
					// setResponse(JSON.stringify(data, undefined, 2));
					setResponse(data.result.fulfillment.speech)
					console.log(data)
				},
				error: function() {
					setResponse("Internal Server Error");
				}
			});
			setResponse("Pondering...");
		}   
		function setResponse(val) {
			$("#response").text(val);
		}  
