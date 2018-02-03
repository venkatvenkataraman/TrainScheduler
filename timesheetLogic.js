// 1. Initialize Firebase

var config = {
  apiKey: "AIzaSyCqN-A8DvS-dEda8aWaiZrSs_nqHjDd7Cg",
  authDomain: "trainscheduler-5d8d5.firebaseapp.com",
  databaseURL: "https://trainscheduler-5d8d5.firebaseio.com",
  projectId: "trainscheduler-5d8d5",
  storageBucket: "trainscheduler-5d8d5.appspot.com",
  messagingSenderId: "608026654022"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button handler for adding Trains - then update the html + update the database

$("#addTrainBTN").on("click", function(event) {
  event.preventDefault();

  // Grabs user input from Train form
  var trainName = $("#trainNameInput").val().trim();
  var trainDestination = $("#trainDestinationInput").val().trim();
  var trainTimeFirst = moment($("#trainTimeFirstInput").val().trim(), "HH:mm").format("X");
  var trainFrequency = $("#trainFrequencyInput").val().trim();

  // Creates local "temporary" object for holding Train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainTimeFirst,
    frequency: trainFrequency
  };

  // Logs everything to console - DOESN'T SEEM TO HAVE ANY EFFECT - ALWAYS RETURNS UNDEFINED
  // console.log(newTrain.trainName);
  // console.log(newTrain.trainDestination);
  // console.log(newTrain.trainTimeFirst);
  // console.log(newTrain.trainFrequency);

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#trainNameInput").val("");
  $("#trainDestinationInput").val("");
  $("#trainTimeFirstInput").val("");
  $("#trainFrequencyInput").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the
// html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTimeFirst = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainTimeFirst);
  console.log(trainFrequency);

  // Prettify the train start
  // var trainStartPretty = moment.unix(firstTrainTime).format("HH:mm");

  // Calculate the next arrival using hardcore math
  // To calculate the next arrival time
  var currentTime = moment();
  var currentTimeInX = moment().format("X");
  var trainTimeFirstInX = parseInt(trainTimeFirst);
  console.log(currentTimeInX, trainTimeFirstInX);
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  var numberOfNextTrain = Math.ceil((currentTimeInX - trainTimeFirstInX)/(trainFrequency*60));
  var trainNextArrivalCompInX = (trainTimeFirstInX + (numberOfNextTrain*trainFrequency*60));
        // moment().diff(moment.unix(empStart, "X"), "months");
  var trainNextArrivalCompInHHMM =  moment.unix(trainNextArrivalCompInX).format("HH:mm");
  console.log(trainNextArrivalCompInHHMM);

  // Calculate the total billed rate
  var trainMinutesAwayComp = Math.round((trainNextArrivalCompInX - currentTimeInX)/60) ;
  console.log(trainMinutesAwayComp);

  // Add each train's data into the table
  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination +
    "</td><td>" + trainFrequency + "</td><td>" + trainNextArrivalCompInHHMM +
    "</td><td>" + trainMinutesAwayComp + "</td></tr>");
});

window.onload=function () {
  console.log("In window.onload:  ", moment().format("hh:mm") );
  $("#currentTimeDisplay").html("Current Time is: " + moment().format("hh:mm") + "");
};

var time = new Date().getTime();
$(document.body).bind("mousemove keypress", function(e) {
    time = new Date().getTime();
});

//code below for auto refresh. Alternative to using meta tag in index.html header
function refresh() {
    if(new Date().getTime() - time >= 60000)
        window.location.reload(true);
    else
        setTimeout(refresh, 10000);
}

setTimeout(refresh, 10000);

// "</td><td>" + trainStartPretty +
