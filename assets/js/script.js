"use strict";

// click event for search button
var searchBtn = $("#pure-button").on("click", function (event) {
  event.preventDefault();
  //create variable to hold user input
  var inputVal = $("#pure-input-rounded").val();
  //create variable to hold API end-point and inputValue
  var wikiApi =
    "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" +
    inputVal +
    " space" +
    "&origin=*";
  //fetch request using stored API variable
  fetch(wikiApi)
    .then(function (wikiResponse) {
      return wikiResponse.json();
    })
    .then(function (wikiResponse) {
      console.log(wikiResponse);
      //create variable to hold array of title names returned from fetch
      var titles = wikiResponse.query.search;
      //display wiki titles returned from search as clickable links to wiki page
      var loadWikiOptions = function () {
        //reference html title-div
        var titleDiv = $("#title-div");
        //clear branch to erase previous search (reset)
        titleDiv.empty();
        //loop through titles array returned from search
        for (let i = 0; i < titles.length; i++) {
          //create anchor element
          var titleAnchor = $("<a></a>")
            .attr(
              "href",
              "http://en.wikipedia.org/?curid=" +
              //reference object "pageid" at position "i"
              wikiResponse.query.search[i].pageid
            )
            //target _blank to open new tab when clicked
            .attr("target", "_blank");
          //create nested text element
          var titleEl = $("<h3></h3>")
            .text(titles[i].title)
            .addClass("wiki-title (wiki-title" + i + ")");
          //append anchor element to parent element
          titleAnchor.append(titleEl);

          //append text element to anchor element
          titleDiv.append(titleAnchor);
        }
      };
      //call function
      loadWikiOptions();
    });
});

//-------------NASA CODE STARTS HERE---------------//
//mars photos from perseverance rover (most recent was 2 days ago)
var currentDate = moment().subtract(2, "days").format("YYYY-MM-DD");

var marsRoverAPI =
  "https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?earth_date=" +
  currentDate +
  "&api_key=eBc5E7OlXwmDVp6ickMUuJ4CFFJowISz8pb6HMnp";
//fetch request using stored API variable
fetch(marsRoverAPI)
  .then(function (nasaResponse) {
    return nasaResponse.json();
  })
  .then(function (nasaResponse) {
    console.log(nasaResponse);
    //variable to hold array of pictures
    var picArray = nasaResponse.photos;
    //reference parent DIV from HTML file
    var parentDiv = $("#parent3");
    //pick from most recent set of pictures at random (perseverance)
    var randomPic = picArray[Math.floor(Math.random() * picArray.length)];
    console.log(randomPic);
    //create img element to hold picture
    var curiosityPic = $("<img></img>").attr("src", randomPic.img_src);

    //JL- Adding title for section
    let curTitle = $("<div></div>").attr("id", "roverTitle");
    $(curTitle).html("<h1>Mars Rover Photos</h1>");

    //create div that will hold the description
    var divForText = $("<div></div>").attr("id", "extra3").addClass("hidden");

    //append img div to parent el //append div to parentDiv                                         -JL Appended title infront
    parentDiv.append(curTitle, curiosityPic, divForText);

    var cameraName = $("<h3></h3>").text(
      "Camera Name: " + randomPic.camera.full_name
    );
    var pictureDate = $("<h3></h3>").text(
      "Earth Date: " + randomPic.earth_date
    );

    var roverName = $("<h3></h3>").text("Rover Name: " + randomPic.rover.name);

    var roverLandDate = $("<h3></h3>").text(
      "Date Landed: " + randomPic.rover.landing_date
    );
    divForText.append(cameraName, pictureDate, roverName, roverLandDate);
  });

//---------------people in space API--------------

var peopleInSpace = function () {
  var peopleInSpaceAPI = "https://api.open-notify.org/astros.json";

  //fetch request using stored API variable
  fetch(peopleInSpaceAPI)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      //reference parent4 DIV from HTML file
      var parentDiv = $("#parent4");
      //display total people
      var divForTotal = $("<div></div>");
      //text for total people in space
      var totalPeople = $("<h2></h2>").text(
        "Number of People in Space: " + response.number
      );
      //append text to new div
      divForTotal.append(totalPeople);

      //append new div to parent el
      parentDiv.append(divForTotal);

      //create div to hold information
      var extraDiv = $("<div></div>").attr("id", "extra4").addClass("hidden");
      //append new div to parent el
      parentDiv.append(divForTotal, extraDiv);

      //store array of people in space to iterate through later
      var peopleArray = response.people;
      //title for ISS
      var issTitle = $("<h2></h2>").text(
        "Craft: International Space Station (ISS)"
      );
      //unordered list for all ISS astronauts
      var ulISS = $("<ul></ul>");
      //append ul to issTitle
      issTitle.append(ulISS);
      //title for tiangong space station
      var tiangongTitle = $("<h2></h2>").text("Craft: Tiangong Space Station");
      //unordered list for all tiangong astronauts
      var ulTiangong = $("<ul></ul>");
      //append ul to tiangongTitle
      tiangongTitle.append(ulTiangong);

      for (let i = 0; i < peopleArray.length; i++) {
        //if statement --- if craft === to ISS // if statement --- if craft === to Tiangong to place astronauts in correct list
        if (response.people[i].craft === "ISS") {
          var listText = $("<li></li>").text(response.people[i].name);
        }
        if (response.people[i].craft === "Tiangong") {
          var listText2 = $("<li></li>").text(response.people[i].name);
        }
        //append li elements to corresponding ul element
        ulISS.append(listText);
        ulTiangong.append(listText2);
      }
      //append titles to parent div
      extraDiv.append(issTitle, tiangongTitle);
    });
};

peopleInSpace();


// --- ASTRONOMY PICTURE OF THE DAY ---
//NASA API
const nasaKEY = "eBc5E7OlXwmDVp6ickMUuJ4CFFJowISz8pb6HMnp";
//Picture of the day api link
const apodHTTPS = "https://api.nasa.gov/planetary/apod";
fetchPOD();

function fetchPOD() {
  let fetchLink = `${apodHTTPS}?api_key=${nasaKEY}`

  fetch(fetchLink)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let apodObj = data;
      displayAPOD(apodObj);
    });
}
function displayAPOD(object) {
  console.log("APOD", object);
  let imgURL = object.url;
  let imgDesc = object.explanation;
  var imgTitle = $("<h3></h3>").text(object.title);

  var parentDiv = $("#parent2");
  var apodIMG = $("<img></img>").attr("src", imgURL);

  let curTitle = $("<div></div>").attr("id", "apodTitle");
  $(curTitle).html("<h1>Astronomy Picture of the Day</h1>");
  var divForText = $("<div></div>").attr("id", "extra2").addClass("hidden");

  divForText.append(imgTitle, imgDesc);
  parentDiv.append(curTitle, apodIMG, divForText);
}


displayAbout();

function displayAbout() {
  var aboutText = $("<h6></h6>").text("We are a 4-man group of student developers who created this website in hopes of sparking education and fun space fact seeking. This website uses multiple open NASA APIs to give you various forms of live space media, as well as some facts like who and how many people are currently in space.");
  var parentDiv = $("#parent1");

  let curTitle = $("<div></div>").attr("id", "aboutTitle");
  $(curTitle).html("<h1>About Us</h1>");
  var divForText = $("<div></div>").attr("id", "extra1").addClass("hidden");

  divForText.append(aboutText);
  parentDiv.append(curTitle, divForText);
}







//Description Div

//set to not visible to start
var isVisible = false;
//when clicked, more information is loaded in parent element 1
var hideAndVisible1 = function () {
  $(".parent1").on("click", function () {
    //if element is visible, hide if hidden, make visible
    if (isVisible === true) {
      var extraDiv = $("#extra1");
      extraDiv.addClass("hidden");
      return (isVisible = false);
    } else {
      var extraDiv = $("#extra1");
      extraDiv.removeClass("hidden");
      return (isVisible = true);
    }
  });
};

//show and hide mars rover information
hideAndVisible1();

//set to not visible to start
var isVisible = false;
//when clicked, more information is loaded in parent el 2
var hideAndVisible2 = function () {
  $(".parent2").on("click", function () {
    //if element is visible, hide if hidden, make visible
    if (isVisible === true) {
      var extraDiv = $("#extra2");
      extraDiv.addClass("hidden");
      return (isVisible = false);
    } else {
      var extraDiv = $("#extra2");
      extraDiv.removeClass("hidden");
      return (isVisible = true);
    }
  });
};

//show and hide number of people in space information
hideAndVisible2();

//set to not visible to start
var isVisible = false;
//when clicked, more information is loaded in parent el 4
var hideAndVisible3 = function () {
  $(".parent3").on("click", function () {
    //if element is visible, hide if hidden, make visible
    if (isVisible === true) {
      var extraDiv = $("#extra3");
      extraDiv.addClass("hidden");
      return (isVisible = false);
    } else {
      var extraDiv = $("#extra3");
      extraDiv.removeClass("hidden");
      return (isVisible = true);
    }
  });
};

//show and hide number of people in space information
hideAndVisible3();

//set to not visible to start
var isVisible = false;
//when clicked, more information is loaded in parent el 4
var hideAndVisible4 = function () {
  $(".parent4").on("click", function () {
    //if element is visible, hide if hidden, make visible
    if (isVisible === true) {
      var extraDiv = $("#extra4");
      extraDiv.addClass("hidden");
      return (isVisible = false);
    } else {
      var extraDiv = $("#extra4");
      extraDiv.removeClass("hidden");
      return (isVisible = true);
    }
  });
};

//show and hide number of people in space information
hideAndVisible4();
