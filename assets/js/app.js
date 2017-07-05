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

var text; // user's input
var name; // user's name
var firstVisit = true;

var connected = database.ref(".info/connected")

// Check database for user
function setFirebaseUser(name) {

  var time = moment().format('MMM D YYYY, h:mm:ss a');

  database.ref().child(name).once('value').then(function(snapshot) {
    if (snapshot.val()) {
      setResponse("Welcome back, " + text + "! Your last visit was " + 
        snapshot.val().time + ". How can I help you?");
      database.ref().child(name).set({
        name: name,
        time: time
      });
    }
    else {
      database.ref().child(name).set({
        name: name,
        time: time
      });
      setResponse("Hello, " + text + "! How can I help you?");
    }
  });
}

// Welcome user on page load
if (firstVisit) {
	var welcome = "Welcome, what is your name?";
  setResponse(welcome);
}

$("#message-submit").on("click", function() {
	event.preventDefault();

	text = $("#input").val();
  if (text) {
  	$("#input").val("");

  	if (firstVisit) {
  		firstVisit = false;
  		name = text;
      setFirebaseUser(name);
  	}
  	else {
  		console.log(text);
  		setResponse(text, name);
  		send();
  	}
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
			var dataResult = data.result.fulfillment.speech;
			if (dataResult === "") {
				console.log(data.result)
				if (data.result.action === "weather") {
  				keyWord = data.result.parameters.address.city;
  				getWeather();
				}
				else if (data.result.action === "web.search") {
  				keyWord = data.result.parameters.q;
  				getAnswers();
				}
        else if (data.result.action === "delivery.search") {
          keyWord = data.result.parameters.product.toString();
          getCooking();
        }
			}

			else {
				setResponse(dataResult);
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

  // We put the repsonse div in a jquery object. Scrollheight is pure Javascript, so in order to call it, 
  // we have to extract the pure Javascript html element by using [0]. We then call scrollHeight on it. 
  // This returns the height of the scroll track. 
  var scrollHeight = $("#response")[0].scrollHeight;
  // We then put respoonse div in a jquery object and set it's scroll top to be the scroll Height. 
  $("#response").scrollTop(scrollHeight);
}  

function getWeather() {
	if (!keyWord) {
		keyWord = "San Francisco";
	}
	var results;
	var weatherApiKey = "7c82af881ec1e1081a5cd2d5a1c75e03";
	var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" + keyWord +
		"&units=imperial&appid=" + weatherApiKey;
	$.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
		results = response.main.temp;
		// console.log(results);
		setResponse("The current weather in " + keyWord + " is " + results + " &deg;F");
	});
}

function getAnswers() {
	var APIKey = "3TVWEP-L6J4Y652JG";
  // console.log(keyWord);
  var queryURL = "https://cors-anywhere.herokuapp.com/https://api.wolframalpha.com/v1/result?i=" + keyWord + "%3F&appid=" + APIKey;
 
  $.ajax({
    url: queryURL,
    method: "GET",
  }).done(function(response) {
    // console.log(queryURL);
    setResponse(response);
  }).fail(function(response) {
    // console.log(response);
    if (response.status === 501) {
      setResponse("I'm sorry. I don't have a response for that.");
    }
  });
}

function getCooking () {
  // Spoonacular API
  // $.ajax({
  //   type: "GET",
  //   url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients="+keyWord+"limitLicense=false&number=1&ranking=1",
  //   dataType: "json",
  //   headers: {
  //     'X-Mashape-Key': 'm4zJZuWJy2mshhO2dtF7o0KquTb2p1qmP3cjsndgXgNyhJsj9a' 
  //     // 'Accept: application/json' 
  //   }
  // }).done(function(response) {
  //   results = response;
  //   // console.log(results[0].title);
  //   setResponse("With: " + keyWord + ". you can make: " + results[0].title);
  // }).fail(function() {
  //   setResponse("Ouch. I broke :(");
  // })

  // Food2Fork
  var APIKey = "19a0bca9edabde12480e958093bbad7a";
  var queryURL = "https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=" + APIKey +
    "&q=" + keyWord;

  $.ajax({
    type: "GET",
    url: queryURL,
    dataType: "json" 
  }).done(function(response) {
    console.log(response);
    setResponse("With: " + keyWord + ", you can make:");
    for (var i = 0; i < 3; i++) {
      var recipeLink = "<a href=" + response.recipes[i].source_url + 
      " target='_blank'>" + response.recipes[i].source_url + "</a>";
      console.log(recipeLink);
      setResponse(response.recipes[i].title + "<br>Recipe link: " + recipeLink);
    }
  }).fail(function() {
    setResponse("I think I understood you, but can you please repeat that?");
  })
}  