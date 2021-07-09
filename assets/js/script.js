"use strict";

var searchHistory = [];
var distinctHistory = {};
// click event for search button
var searchBtn = $("#pure-button").on("click", function (event) {
  event.preventDefault();
  var inputVal = $("#pure-input-rounded").val();
  var lowerCaseInput = inputVal.toLowerCase();

  //input value history -- push // if empty string, let it equal space
  if (lowerCaseInput === "") {
    let lowerCaseInput = "space";
    searchHistory.push(lowerCaseInput);
  } else {
    searchHistory.push(lowerCaseInput);
  }
  //only unique seaches
  for (let i of searchHistory) {
    distinctHistory[i] = true;
  }
  //load wiki links
  loadWiki();
  //save search result to localStorage
  saveSearches();
});
//loads all wiki links(buttons)
var loadWiki = function () {
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
            .addClass(
              "wiki-title (wiki-title" + i + ") pure-button wiki-button"
            );
          //append anchor element to parent element
          titleAnchor.append(titleEl);

          //append text element to anchor element
          titleDiv.append(titleAnchor);
        }
      };
      //call function
      loadWikiOptions();
    });
};

//save wikipedia searches
var saveSearches = function () {
  let searchOnce = Object.keys(distinctHistory);
  for (let i = 0; i < searchOnce.length; i++) {
    localStorage.setItem(searchOnce[i], i);
  }
};

//load search history as clickable buttons
var loadHistory = function () {
  //access stored keys
  var searchInputUsed = Object.keys(localStorage);
  //generate all history buttons
  for (let i = 0; i < searchInputUsed.length; i++) {
    //CAPITALIZE FIRST LETTER OF STORED NAME
    var searchFirstLetterUpper = searchInputUsed[i].charAt(0).toUpperCase();
    //REMOVE FIRST LETTER OF STORED NAME
    var searchNoFirstLetter = searchInputUsed[i].slice(1);
    //CONCATENATE FOR COMPLETE SEARCH INPUT
    var newSearchName = searchFirstLetterUpper + searchNoFirstLetter;
    // reference HTML div
    var historyEl = $("#history");
    // create button element for search history
    var historyBtn = $("<button></button>")
      .text(newSearchName + " ")
      .addClass("pure-button history-btn")
      .attr("id", "history-btn" + i)
      .on("click", function () {
        //set inputVal to desired button text
        var inputVal = $("#pure-input-rounded").val(searchInputUsed[i]);
        loadWiki();
      });
    //span to hold "X" to remove from search history
    var xIcon = $("<i></i>")
      .addClass("fas fa-window-close")
      .on("click", function () {
        //remove from current screen
        $("#history-btn" + i).remove();
        //remove from localStorage
        localStorage.removeItem(searchInputUsed[i]);
      });

    historyBtn.append(xIcon);
    // append history button to HTML div
    historyEl.append(historyBtn);
  }
};
loadHistory();

/*------------------------
WIKIPEDIA API SECTION ENDS
------------------------*/
/*-----------------
PARENT 1 - ABOUT US
-----------------*/
function displayAbout() {
  //reference parent1 div from HTML file
  var parentDiv = $("#parent1");
  //create title <h1> element
  let curTitle = $("<div></div>").attr("id", "aboutTitle");
  $(curTitle).html("<h1>About Us</h1>");
  //create div for text with hidden class to expand and retract
  var divForText = $("<div></div>").attr("id", "extra1").addClass("hidden");

  //INTRODUCTION TO THE GROUP - Create text block
  var aboutText = $("<h6></h6>").text(
    "We are a 5-man group of student developers who created this website in hopes of sparking education and fun space fact seeking. This website uses multiple open NASA APIs to give you various forms of live space media. With a lot of room for expansion, expect to see updates in the near future!"
  );
  //append text to div for text
  divForText.append(aboutText);
  //append title and div for text to parent div
  parentDiv.append(curTitle, divForText);
}

displayAbout();
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
//show and hide about us
hideAndVisible1();

/*-------------------------------------
PARENT 2 - ASTRONOMY PICTURE OF THE DAY
-------------------------------------*/
// --- ASTRONOMY PICTURE OF THE DAY ---
//NASA API
const nasaKEY = "eBc5E7OlXwmDVp6ickMUuJ4CFFJowISz8pb6HMnp";
//Picture of the day api link
const apodHTTPS = "https://api.nasa.gov/planetary/apod";
fetchPOD();

function fetchPOD() {
  let fetchLink = `${apodHTTPS}?api_key=${nasaKEY}`;

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
  //create variables to show returned data from fetch request
  let objURL = object.url;
  let objType = object.media_type;

  //var apodIMG; // if statement to accept videos
  if (objType == "video") {
    //create iframe element if ObjType is video
    var apodIMG = $("<iframe></iframe>")
      .attr("src", objURL)
      .attr("height", "720")
      .attr("width", "1080");
  } else {
    //create img if objtype is picture
    var apodIMG = $("<img></img>").attr("src", objURL);
  }

  //variable that holds hidden picture description
  let objDesc = object.explanation;
  //create variable to hold title
  var imgTitle = $("<h3></h3>").text(object.title);
  //create variable to hold subtitle
  var imgSubtitle = $("<h6></h6>").text("And sometimes videos..");

  //reference parentDiv 2 from HTML
  var parentDiv = $("#parent2");

  //create title div
  let curTitle = $("<div></div>").attr("id", "apodTitle");
  $(curTitle).html("<h1>Astronomy Picture of the Day</h1>");
  //create div for hidden text
  var divForText = $("<div></div>").attr("id", "extra2").addClass("hidden");

  //append img title and picture description to hidden div
  divForText.append(imgTitle, objDesc);
  //append title, subtitle, img and hidden div to parent div
  parentDiv.append(curTitle, imgSubtitle, apodIMG, divForText);
}

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

//show and hide APOD description
hideAndVisible2();

/*-------------------
PARENT 3 - MARS ROVER
-------------------*/
//mars photos from perseverance rover (most recent was 2 days ago)
var currentDate = moment().subtract(2, "days").format("YYYY-MM-DD");

var perseveranceFetch = function () {
  var persRoverAPI =
    "https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?earth_date=" +
    currentDate +
    "&api_key=eBc5E7OlXwmDVp6ickMUuJ4CFFJowISz8pb6HMnp";
  //fetch request using stored API variable
  fetch(persRoverAPI)
    .then(function (persResponse) {
      return persResponse.json();
    })
    .then(function (persResponse) {
      perseveranceDisplay(persResponse);
    });
};

//function to display perseverance picture
var perseveranceDisplay = function (persResponse) {
  //variable to hold array of pictures
  var picArray = persResponse.photos;
  //reference parent DIV from HTML file
  var parentDiv = $("#parent3");
  //pick from most recent set of pictures at random (perseverance)
  var randomPic = picArray[Math.floor(Math.random() * picArray.length)];

  //create img element to hold picture
  var perPic = $("<img></img>").attr("src", randomPic.img_src);

  //JL- Adding title for section
  var perTitle = $("<div></div>").attr("id", "roverTitle");
  $(perTitle).html("<h1>Mars Rover Photo</h1>");

  //create div that will hold the description
  var divForText = $("<div></div>").attr("id", "extra3").addClass("hidden");

  //append img div to parent el //append div to parentDiv                                         -JL Appended title infront
  parentDiv.append(perTitle);
  perTitle.append(perPic, divForText);

  //display camera name
  var cameraName = $("<h3></h3>").text(
    "Camera Name: " + randomPic.camera.full_name
  );
  //display date picture taken
  var pictureDate = $("<h3></h3>").text("Earth Date: " + randomPic.earth_date);

  //display rover name
  var roverName = $("<h3></h3>").text("Rover Name: " + randomPic.rover.name);

  //display date rover landed
  var roverLandDate = $("<h3></h3>").text(
    "Date Landed: " + randomPic.rover.landing_date
  );
  //append text to hideable div
  divForText.append(cameraName, pictureDate, roverName, roverLandDate);
};

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

//show and hide mars rover picture information
hideAndVisible3();
//fetch perseverance picture
perseveranceFetch();
// /*----------------------------
// PARENT 4 - PEOPLE IN SPACE API
// ----------------------------*/

// var peopleInSpace = function () {
//   var peopleInSpaceAPI = "http://api.open-notify.org/astros.json";

//   //fetch request using stored API variable
//   fetch(peopleInSpaceAPI)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (response) {
//       //reference parent4 DIV from HTML file
//       var parentDiv = $("#parent4");
//       //display total people
//       var divForTotal = $("<div></div>");
//       //text for total people in space
//       var totalPeople = $("<h2></h2>").text(
//         "Number of People in Space: " + response.number
//       );
//       //append text to new div
//       divForTotal.append(totalPeople);

//       //append new div to parent el
//       parentDiv.append(divForTotal);

//       //create div to hold information
//       var extraDiv = $("<div></div>").attr("id", "extra4").addClass("hidden");
//       //append new div to parent el
//       parentDiv.append(divForTotal, extraDiv);

//       //store array of people in space to iterate through later
//       var peopleArray = response.people;
//       //title for ISS
//       var issTitle = $("<h2></h2>").text(
//         "Craft: International Space Station (ISS)"
//       );
//       //unordered list for all ISS astronauts
//       var ulISS = $("<ul></ul>");
//       //append ul to issTitle
//       issTitle.append(ulISS);
//       //title for tiangong space station
//       var tiangongTitle = $("<h2></h2>").text("Craft: Tiangong Space Station");
//       //unordered list for all tiangong astronauts
//       var ulTiangong = $("<ul></ul>");
//       //append ul to tiangongTitle
//       tiangongTitle.append(ulTiangong);

//       for (let i = 0; i < peopleArray.length; i++) {
//         //if statement --- if craft === to ISS // if statement --- if craft === to Tiangong to place astronauts in correct list
//         if (response.people[i].craft === "ISS") {
//           var listText = $("<li></li>").text(response.people[i].name);
//         }
//         if (response.people[i].craft === "Tiangong") {
//           var listText2 = $("<li></li>").text(response.people[i].name);
//         }
//         //append li elements to corresponding ul element
//         ulISS.append(listText);
//         ulTiangong.append(listText2);
//       }
//       //append titles to parent div
//       extraDiv.append(issTitle, tiangongTitle);
//     });
// };

// peopleInSpace();

// //set to not visible to start
// var isVisible = false;
// //when clicked, more information is loaded in parent el 4
// var hideAndVisible4 = function () {
//   $(".parent4").on("click", function () {
//     //if element is visible, hide if hidden, make visible
//     if (isVisible === true) {
//       var extraDiv = $("#extra4");
//       extraDiv.addClass("hidden");
//       return (isVisible = false);
//     } else {
//       var extraDiv = $("#extra4");
//       extraDiv.removeClass("hidden");
//       return (isVisible = true);
//     }
//   });
// };

// //show and hide mars rover picture information
// hideAndVisible4();
