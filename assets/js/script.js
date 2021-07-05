"use strict";

// click event for search button
var searchBtn = $("#pure-button").on("click", function (event) {
  event.preventDefault();
  //create variable to hold user input
  var inputVal = $("#pure-input-rounded").val();
  //create variable to hold API end-point and inputValue
  var wikiApi =
    "http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" +
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
    var parentDiv = $("#parent1");
    //pick from most recent set of pictures at random (perseverance)
    var randomPic = picArray[Math.floor(Math.random() * picArray.length)];
    console.log(randomPic);
    //create img element to hold picture
    var curiosityPic = $("<img></img>").attr("src", randomPic.img_src);
    //append img div to parent el
    parentDiv.append(curiosityPic);
  });

//---------------people in space API--------------
var peopleInSpaceAPI = "http://api.open-notify.org/astros.json";

//fetch request using stored API variable
fetch(peopleInSpaceAPI)
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    console.log(response);
    //reference parent2 DIV from HTML file
    var parentDiv = $("#parent2");
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
    parentDiv.append(issTitle, tiangongTitle);
  });
