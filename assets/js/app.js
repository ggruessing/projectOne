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

var keyWord = "none";

var accessToken = "ecb2965ee6da42df92c8ab68408dbb69";
var baseUrl = "https://api.api.ai/api/";

var text;
var name;
var intro = true;

function getIntro() {
	var welcome = "Welcome, what is your name?";
	setResponse(welcome);
}

if (intro) {
	getIntro();
}

$("#message-submit").on("click", function() {
	event.preventDefault();
	text = $("#input").val();
	$("#input").val("");

	if (intro) {
		intro = false;
		name = text;
		setResponse("Hello, " + text + "! How can I help you?");
	}
	else {
		console.log(text);
		setResponse(text, name);
		send();
	}
});

function send() {
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
			var dataResult = data.result.fulfillment.speech;
			if (dataResult === "") {
				var city = data.result.parameters.address.city;
				getWeather(city);
			}
			else {
				setResponse(dataResult, "Cathy");
				console.log(data);
			}
		},
		error: function() {
			setResponse("Ouch. I broke :(");
		}
	});
	// setResponse("Pondering...");
}   

function setResponse(val, name) {
	if (!name) {
		name = "Cathy";
	}
	$("#response").append("<strong>" + name + ":</strong> " + val + "<br>");
}  

function getWeather(city) {
	if (!city) {
		city = "San Francisco";
	}
	var results;
	var weatherApiKey = "7c82af881ec1e1081a5cd2d5a1c75e03";
	var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city +
		"&units=imperial&appid=" + weatherApiKey;
	$.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
		results = response.main.temp;
		// console.log(results);
		setResponse("The current weather in " + city + " is " + results + " &deg;F");
	});
}