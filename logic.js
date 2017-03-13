$(document).ready(function() {

    // Declare the set of global variables to be used
    var name = "";
    var destination = "";

    var trainTime = "";
    var trainTimeConverted = "";
    var frequency = 0;
    var currentTime = 0;
    var nextArrival = "";
    var minsAway = 0;
    var diffTime = "";
    var tRemaining = "";

    var keys = "";

    // Create a variable to reference the database
    var database = firebase.database();

    $("#submitButton").on("click", function() {
        event.preventDefault();
        console.log("click registered");

        name = $("#inputTrainName").val().trim();
        destination = $("#inputDestination").val().trim();
        trainTime = $("#inputTrainTime").val().trim();
        frequency = $("#inputFrequency").val().trim();

        // Write this information to the Firebase database
        database.ref().push({
            name: name,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("#myForm")[0].reset();
    });

    // Load the last five train entries to the screen
    database.ref().limitToLast(5).on("child_added", function(childSnapshot) {
      // Code below converts the time into various variabled needed to populate the table
      var childValue = childSnapshot.val();
      currentTime = moment();
      frequency = childValue.frequency;
      trainTimeConverted = moment(childValue.trainTime, "HH:mm").subtract(1, "years");
      diffTime = moment().diff(moment(trainTimeConverted), "minutes");
      tRemaining = diffTime % frequency;
      minsAway = frequency - tRemaining;
      nextArrival = moment().add(minsAway, "minutes");

      // Write the content to the on screen table
      $("#inputRow").append(
        "<tr><td>" + childValue.name + "</td>"
        + "<td>" + childValue.destination + "</td>"
        + "<td>" + childValue.frequency + "</td>"
        + "<td>" + moment(nextArrival).format("HH:mm") + "</td>"
        + "<td>" + minsAway + "</td></tr>"
      )
    });

    // Capture the current time for display and calculations
    currentTime = moment();
    console.log("The current time is " + moment(currentTime).format("HH:mm"));
    $("#displayTime").html("(as of " + moment(currentTime).format("HH:mm") + ")");




});
