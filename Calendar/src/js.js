
/**
 * The array of month lengths excluding leap year
 * @global
 */
var monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * An empty 2d array to be filled in createCalendarYear. Used to fill in the numbers in the calendar div and a
 * zero for every blank spot on the grid
 * @global
 */
var currentYearArray = [[], [], [], [], [], [], [], [], [], [], [], []];


/**
 * The names of all months
 * @constant @global
 */
var monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * The names of all days
 * @constant @global
 */
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


// The date is pulled for the current day and the month, numerical date, and year variables are initialized
var d = new Date();
var month = d.getMonth();
var day = d.getDate();
var currentYear = d.getFullYear();

/**
 * Used to keep track of what year the calendar is supposed to display
 * @global
 */
var currentCalendarYear = currentYear;


// This is run when the website is first opened, it displays the current month
createCalendarYear();
updateMonth(0, false);

// Variable that keeps track of the length of the current month array in order to
// be used by the removeOld function as a parameter to remove the values of a certain
// number of date values
/**
 * Keeps track of the lenght of the current month array, used by removeOld to know
 * how many date values to remove
 * @global
 */
var howMany = 0;

/**
 * Array of all created events
 * @global
 */
var allEvents = [];

// Get the values to propogate the allEvents array
if (JSON.parse(localStorage.getItem("events"))) {
    allEvents = JSON.parse(localStorage.getItem("events"));
}

/**
 * The number to be displayed on the zoomed in day div
 * @global
 */
numToShow = 0;


/**
 * Determines the length of each month, essentially checking for leap year
*/
function calcMonthLength() {
    var tempYear = currentYear;
    if(tempYear % 4 == 0) {
        monthLengths[1] = 29;
    }
}

// initializes the currentYearArray based on the current year / day / date
/**
 * Fills in the currentYearArray with value for the grid to be used in each month.
 * All blank days will have a zero in their place in the array.
 */
function createCalendarYear() {
    calcMonthLength();
    var tempDate = day;
    // This is used to track the DOW so that when a month array is finished and the function moves onto
    // the next month it knows what day of the week to start the month on
    var tempDOW = d.getDay();
    var tempMonth = month;

    // Finds what day of the week the first day of the month is on
    // This is used to determine how many zeros are put at the start of each month array
    // If the month starts on a Tuesday there will be two zeros to start the array (for Sunday and Monday)
    while(tempDate > 0) {
        if (tempDOW == 0) {
            tempDOW = 6;
        } else {
            tempDOW--;
        }
        tempDate--;
    }


    // This makes the arrays for each month (remakes if the year is being changed)
    // These arrays are stored in currentYearArray and will de utilized to display the calendar every month
    for(var j = 0; j < 12; j++) {
        // Ensures there is not a blank top row in the display and fills in the zeros to begin the array
        for(var i = 0; i <= tempDOW; i++) {
            if(tempDOW != 6) {
                currentYearArray[tempMonth].push(0);
            }
        }
        // Adds the numerical values for dates
        for(var i = 1; i <= monthLengths[tempMonth]; i++){
            currentYearArray[tempMonth].push(i);
            // changes the DOW value, increasing by one everytime a date is added, goes to zero (Sunday) if at 6 (Saturday)
            if(tempDOW == 6) {
                tempDOW = 0;
            } else {
                tempDOW++;
            }
        }
        // Changes the month value by one at the end of the outer for loop, if the month is 11 (December) it goes back to 0 (January)
        if(tempMonth == 11) {
            tempMonth = 0;
        } else {
            tempMonth++;
        }
    }
}


/**
 * Deletes the old dates propogated in the calendar div and replaces them with the new month's
 * 
 * @param {number} plusMinus The change in month (up one, down one, the same)
 * @param {boolean} remove Determines if removeOld should be run
 */
function updateMonth(plusMinus, remove) {
    // Clears the numerical values from the old month if the remove parameter is true
    if(remove) {
        howMany = currentYearArray[month].length;
       	removeOld(howMany);
    }


    // Checks to see if the month plus the change would be out of bounds and adjusts for it
    // If it is out of bounds createYear is run in order to remake the currentYearArray
    if (month + plusMinus < 12 && month + plusMinus >= 0) {
        month = month + plusMinus;
    } else if (month + plusMinus < 0) {
        // Run with a false parameter because the year is decreased
        createYear(false);
        month = 11;
    } else {
        // Run with a true parameter because the year is increased
        createYear(true);
        month = 0;
    }

    // Changes the month header test to the new month
    var header = document.getElementById("header");
    header.innerText = monthNames[month];

    // Changes the year header text to the new year
    var year = document.getElementById("year");
    year.innerText = currentCalendarYear;

    // Changes the year header text for when a day is clicked on to the new year
    var year = document.getElementById("yearDayZoomed");
    year.innerText = currentCalendarYear;

    
    // Creates the new dates for the accurate month and puts them in correct boxes in the display
    howMany = 0;
	for(var i = 0; i < currentYearArray[month].length; i++) {
   		var element = document.createElement("p");
       	element.className = "date";
        element.id = "date" + i.toString();
        if(currentYearArray[month][i] === 0) {
        	element.appendChild(document.createTextNode(" "));
        } else {
        	element.appendChild(document.createTextNode(currentYearArray[month][i]));
        }
   		document.getElementById("overall" + i.toString()).appendChild(element); 
	}
    
    
    // Hides the bottom week if it is not used 
    if(document.getElementById("overall35").firstChild) {
    	document.getElementById("week6").style.display = "block";
    } else {
    	document.getElementById("week6").style.display = "none";
    }
    
    // Highlights the current day if the month displayed is the current month
    if(month === d.getMonth()) {
    	for(var i = 0; i < currentYearArray[month].length; i++) {
        	if(day == currentYearArray[month][i] && currentCalendarYear === currentYear) {
            	document.getElementById("overall" + i.toString()).classList.add("today");
            }
        }
    } else {
    	for(var i = 0; i < 42; i++) {
            document.getElementById("overall" + i.toString()).classList.remove("today");
        }
    }
}


/**
 * Erases the old dates by removing the elements created by the updateMonth method
 * 
 * @param {number} num The number of dates to be removed
 */
function removeOld(num) {
	for(var i = 0; i < num; i++) {
		document.getElementById("date" + parseInt(i.toString())).remove();
    }
}


/**
 * When you click on a box from the calendar the "zoomed in" day is brought up and the calendar div is hidden
 */
function getDay() {
    var clickedOn = event.target;
	// updates numToShow to the number of the box clicked on
	numToShow = parseInt(event.target.id.toString().substring(7));

	// makes sure the element clicked on has a date
    if(currentYearArray[month][numToShow] != undefined && currentYearArray[month][numToShow] != 0) {
		// hides the month calendar
		document.getElementById("month").style.display = "none";
        
    	// shows "zoomed in" day element
    	document.getElementById("dayZoomed").style.display = "block";
        
    	// changes date label to date clicked on
        document.getElementById("date").innerText = monthNames[month] + " " + currentYearArray[month][numToShow];

        // changes the day of the week
        var dayNumber = (parseInt(clickedOn.id.split("overall")[1]) + 7) % 7;
        var dayOfWeek = document.getElementById("days").children[dayNumber].children[0].innerHTML;
        document.getElementById("dayOfWeek").innerHTML = dayOfWeek;
        
        // removes the text from the month in preperation for return button
    	howMany = currentYearArray[month].length;
        removeOld(howMany);
        
        var dateClickedOn = monthNames[month] + ", " + currentYearArray[month][numToShow] + ", " + currentCalendarYear;
        showEvents(dateClickedOn);
    }
}


/**
 * Changes the date in a zoomed-in day div
 * 
 * @param {Number} num the number of days fo move the zoomed-in day forward or backward
 */
function updateDate(num) {
    deleteEventDivs();
    numToShow = numToShow + num;
    var dateToShow = currentYearArray[month][numToShow];


    var headingText = document.getElementById("date").innerText;
    // if it is december 31 or january 1 it goes to the next or previous year
    if (month === 11 && headingText.substring(headingText.length-2) === "31" && num === 1) {
        month = 0;
        var toPrintNum = 1;
        createYear(true);
        var year = document.getElementById("yearDayZoomed");
        year.innerText = currentCalendarYear;

        var j = 0;
        while(currentYearArray[month][j] == 0)
        {
        	j++;
        }
        numToShow = j;
    } else if (month === 0 && headingText.substring(headingText.length-2) === " 1"  && num === -1) {
        month = 11;
        var toPrintNum = 31;
        createYear(false);
        var year = document.getElementById("yearDayZoomed");
        year.innerText = currentCalendarYear;
        numToShow = currentYearArray[month].length - 1;
    } else {
        // changes the date plus or minus one including going forward of backward a month
        if(num == -1 && (dateToShow == 0 || dateToShow == undefined)) {
    	    month = month - 1;
            numToShow = currentYearArray[month].length - 1;
        } else if(num == 1 && dateToShow == undefined) {
    	    month = month + 1;
            var j = 0;
            while(currentYearArray[month][j] == 0)
            {
        	    j++;
            }
            numToShow = j;
        }
        var toPrintNum = currentYearArray[month][numToShow];
    } 


    // Sets up how to change the day of the week name displayed
    var previousDOW = document.getElementById("dayOfWeek").innerHTML;
    var dowNum;
    for (var i = 0; i < dayNames.length; i++) {
        if (previousDOW === dayNames[i]) {
            dowNum = i;
        }
    }
    dowNum += num;
    if (dowNum === 7) {
        dowNum = 0;
    } else if (dowNum === -1) {
        dowNum = 6;
    }
    var dayOfWeek = document.getElementById("days").children[dowNum].children[0].innerHTML;
    document.getElementById("dayOfWeek").innerHTML = dayOfWeek;

    
    document.getElementById("date").innerText = monthNames[month] + " " + toPrintNum;

    var dateClickedOn = monthNames[month] + ", " + currentYearArray[month][numToShow] + ", " + currentCalendarYear;
    showEvents(dateClickedOn);
}



/**
 * Displays the UI for the events for the day that is clicked on
 * 
 * @param {string} dateClickedOn The date that was clicked on when the zoomed-in day is displayed
 */
function showEvents(dateClickedOn) {
    // Get rid of the previous day's displayed events
    deleteEventDivs();

    // Creates an array of the events for the date clicked on
    var events = orderEvents(dateClickedOn);

    // For every event in the array they are displayed
    for (var i = 0; i < events.length; i++) {
        var element = document.createElement("div");
        element.classList.add("eventDiv");
        element.id = events[i][5].toString();
        console.log(events[i]);
        element.style.height = events[i][0] + "px";
        element.style.top = events[i][6];

        // A function that on click opens the edit event div
        element.onclick = function() {
            var clickedOn = event.target;
            newEvent();
            editEvent(clickedOn.children[0].innerHTML.split(" - ")[0], clickedOn.id);
            document.getElementById("createEventBtn").classList.add("right");
            document.getElementById("createEventBtn").innerHTML = "Update Event";
            document.getElementById("deleteBtn").classList.add("visible");
        };

        // The text of the event div (the name and the length)
        var text = document.createElement("p");
        text.classList.add("eventDivText");
        text.innerHTML = events[i][1] + " - " + events[i][0] + "min.";
        element.appendChild(text);
        document.getElementById("lines").appendChild(element);
    }
}


/**
 * Allows for events to be edited based on their name and unique id, fills in the previously set values
 * 
 * @param {string} name The name of the event
 * @param {number} id The unique id used to identify an event
 */
function editEvent(name, id) {
    var toEdit;
    // Finds event based on the id
    for (var i = 0; i < allEvents.length; i++) {
        if (allEvents[i][1][5].toString() === id) {
            toEdit = allEvents[i];
        }
    }

    // Finds the values to fill into the edit event div
    var startArray = toEdit[1][2].split(", ");
    var dueArray = toEdit[toEdit.length-1][2].split(", ");
    var totalDuration = 0;
    for (var i = 1; i < toEdit.length; i++) {
        totalDuration += parseInt(toEdit[i][0]);
    }

    // Fills in the values in the edit event div
    document.getElementById("titleIn").value = name;
    document.getElementById("monthInStart").value = startArray[0];
    dayAppear('Start');
    document.getElementById("StartDate").value = parseInt(startArray[1]);
    document.getElementById("yearInStart").value = startArray[2];
    document.getElementById("monthInDue").value = dueArray[0];
    dayAppear('Due');
    document.getElementById("DueDate").value = parseInt(dueArray[1]) + 1;
    document.getElementById("yearInDue").value = dueArray[2];
    document.getElementById("timeToComplete").value = Math.round(totalDuration/60);
    document.getElementById("typeOfEvent").value = toEdit[1][4];
    // Stars are checked
    for (var i = parseInt(toEdit[1][3]); i > 0; i--) {
        document.getElementById(i.toString()).classList.add("checked");
    }

    // Creates the hiddenId value
    var hiddenId = document.createElement("p");
    hiddenId.id = id;
    hiddenId.classList.add("hiddenId");
    document.getElementById("dialog").appendChild(hiddenId);
}


/**
 * Erases an event from the allEvents array and resets the showEvents method
 */
function deleteEvent() {
    // Finds the id of the event so that it can be deleted
    var id = document.querySelector(".hiddenId").id;
    for (var i = 0; i < allEvents.length; i++) {
        if (allEvents[i][1][5].toString() === id) {
            allEvents.splice(i, 1);
            localStorage.setItem("events", JSON.stringify(allEvents));
        }
    }
    var currentDayArray = document.getElementById("date").innerHTML.split(" ");
    var currentDay =  currentDayArray[0] + ", " + currentDayArray[1] + ", " + currentCalendarYear;
    // Update the events list and the shown events
    showEvents(currentDay);
    hideCreateEventDiv(true);
}


/**
 * Orders the events for a given day for the time they should be performed in the
 * day based on the user ordering preferences.
 * 
 * @param {string} dateClickedOn The date of the events to be ordered
 * @returns {Array} An array of events (in the form of string arrays)
 */
function orderEvents(dateClickedOn) {
    // Blank array of the events to be performed on a given day
    var eventsOnDay = [];

    // Fills the eventsOnDay array
    console.log(allEvents);
    for (var i = 0; i < allEvents.length; i++) {
        for (var j = 0; j < allEvents[i].length; j++) {
            if (dateClickedOn === allEvents[i][j][2]) {
                eventsOnDay.push(allEvents[i][j]);
            }
        }
    }

    // Order events based on priority
    for (var i = 1; i < eventsOnDay.length; i++) {
        if (parseInt(eventsOnDay[i][3]) < parseInt(eventsOnDay[i-1][3])) {
            var temp = eventsOnDay[i];
            eventsOnDay[i] = eventsOnDay[i-1];
            eventsOnDay[i-1] = temp;
        }
    }
    eventsOnDay.reverse();

    // Sets up the position of the events on the page
    var totalBefore = 0;
    for (var i = 0; i < eventsOnDay.length; i++) {
        var toPush = (997 + totalBefore + i*15) + 'px';
        totalBefore += parseInt(eventsOnDay[i][0]);
        if (eventsOnDay[i].length === 5) {
            eventsOnDay[i].push(toPush);
        } else {
            eventsOnDay[i][6] = toPush;
        }
    }

    return(eventsOnDay);
}


/**
 * Removes all events from the screen
 */
function deleteEventDivs() {
    var toDelete = document.getElementsByClassName("eventDiv");
    while (toDelete[0]) {
        toDelete[0].remove();
    }
}


/**
 * If the type of event is chunk more paramters are shown
 */
function showChunk() {
    if (document.getElementById("typeOfEvent").value === "chunks") {
        document.getElementById("minutes").style.visibility = "visible";
        document.getElementById("chunkLevel").style.visibility = "visible";
    } else {
        document.getElementById("minutes").style.visibility = "hidden";
        document.getElementById("chunkLevel").style.visibility = "hidden";
    }
}



/**
 * When the back button is pressed the zoomed in day is hidden and the calendar div is shown
 */
function returnToMonth() {
    // Hides the eventDivs
    deleteEventDivs();

	// hides the zoomed in day
	document.getElementById("dayZoomed").style.display = "none";
        
    // Shows month of the calendar
    document.getElementById("month").style.display = "block";
    
    // Updates the month to a new month if changed
    updateMonth(0, false);
}


/**
 * Opens the div for a new event to be created
 */
function newEvent() {
    // Resets the values incase the create event div was used to edit
    document.getElementById("deleteBtn").classList.remove("visible");
    document.getElementById("createEventBtn").classList.remove("right");

    // Hides the chunk level and minutes elements 
    document.getElementById("minutes").style.visibility = "hidden";
    document.getElementById("chunkLevel").style.visibility = "hidden";

    document.getElementById("createEventBtn").innerHTML = "Create Event";
	document.getElementById("dim").style.display="block";
	document.getElementById("dialog-wrapper").style.display = "block";
    document.getElementById("dialog").style.display="block";
    var currentDay = document.getElementById("date").innerHTML.split(" ");
    document.getElementById("monthInStart").value = currentDay[0];
    dayAppear('Start');
    document.getElementById("StartDate").value = parseInt(currentDay[1]);
    document.getElementById("yearInStart").value = currentYear;
    document.getElementById("yearInDue").value = currentYear;
}



/**
 * Changes the amount of days in the start or due date selectors of the create
 * new event div to the number of days in the given month
 * 
 * @param {string} name Either "Start" or "Due", the type of date in the createEvent div
 */
function dayAppear(name) {
    // Determines the position of the new elements based on whether it is a Start or Due Date
    var position;
    if (name == "Start") {
        position = 62;
    } else {
        position = 112;
    }

    // Removes the old date number element
    document.getElementById(name + "Date").remove();

    // Creates the new date number elements and positions it
	var element = document.createElement("select");
   	element.style.left = "280px";
    element.style.width = "50px";
    element.style.top = position + "px";
    element.id = name + "Date";
    document.getElementById("dialog").appendChild(element);

    // Finds the month and fills in the number of days based on the month + leap year
    var monthSel = document.getElementById("monthIn" + name).value;
    var yearSel = document.getElementById("yearIn" + name).value;
    if(monthSel == "Febuary" && yearSel%4 == 0) {
        for(var i = 1; i < 30; i++) {
        	var option = document.createElement("option");
            option.value = i.toString();
            option.innerText = i;
            element.appendChild(option);
        }
    } else if (monthSel == "Febuary") {
        for(var i = 1; i < 29; i++) {
        	var option = document.createElement("option");
            option.value = i.toString();
            option.innerText = i;
            element.appendChild(option);
        }
    } else if(monthSel == "September" || monthSel == "April" || monthSel == "June" || monthSel == "November") {
        for(var i = 1; i < 31; i++) {
        	var option = document.createElement("option");
            option.value = i.toString();
            option.innerText = i;
            element.appendChild(option);
        }
    } else if (monthSel === "Month"){
        var option = document.createElement("option");
        option.value = 1;
        option.innerText = 1;
        element.appendChild(option);
    } else {
        for(var i = 1; i < 32; i++) {
        	var option = document.createElement("option");
            option.value = i.toString();
            option.innerText = i;
            element.appendChild(option);
        }
    }
}
    

/**
 * Counts the number of stars for the priority and makes sure they are highlighted
 */
function countStars() {
    var howMany = event.target.id;
    	for(var i = 1; i < parseInt(howMany) + 1; i++) {
            var element = document.getElementById(i.toString());
            element.className = "fa fa-star checked";
        }
        for(var i = 5; i > parseInt(howMany); i--) {
            var element = document.getElementById(i.toString());
            element.className = "fa fa-star";
        }
}
    
    
    
/**
 * Checks of the amount of time in the time to complete estimate is within bounds
 */
function checkTimeToCompleteOutOfBounds() {
    var element = document.getElementById("timeToComplete");
    if(element.value > 99 || element.value <0.5) {
        element.style.borderBottom="2px solid red";
    	element.style.color="red";
    } else {
        element.style.borderBottom="2px solid black";
      	element.style.color="black";
    }
}


/**
 * Creates a calendar for the next year or previous year
 * 
 * @param {boolean} endOfYear Whether it is December and the next year should be created or the opposite
 * If it is December the next year is created starting at January, otherwise it starts at December
 */
function createYear(endOfYear) {
    if (endOfYear) {
        currentCalendarYear++;
        for (var i = 0; i < 12; i++) {
            calculateMonth(endOfYear, i);
        }
    } else {
        currentCalendarYear--;
        for (var i = 11; i >= 0; i--) {
            calculateMonth(endOfYear, i);
        }
    }
    
}

/**
 * Called every time a new year is entered either by the day zoomed-in div or the calendar div.
 * Recalculates the currentYearArray length of months and their blank spaces in the calendar div
 * 
 * @param {boolean} endOfYear True if the month just clicked from was December, false otherwise
 * @param {number} month The integer number of the month (0-11)
 */
function calculateMonth(endOfYear, month) {
    if (endOfYear) {
        var previousMonth;
        if (month > 0) {
            previousMonth = month - 1;
        } else {
            previousMonth = 11;
        }

        // Gets the previousMonth's array so that the day of the week values can be deduced
        // and used to calculate the number of blank spaces in the calendar div
        var temp = currentYearArray[previousMonth];
        var nextZeros = temp.length%7;
        var newMonth = [];
        var numDays;

        // Determine how many days in the month
        if (month === 3 || month === 5 || month === 8 || month === 10) {
            numDays = 30;
        } else if (month == 1) { // Leap Year
            if (currentCalendarYear%4 === 0) {
                numDays = 29;
            } else {
                numDays = 28;
            }
        } else {
            numDays = 31;
        }

        // Calculates the number of zeros to put in the front of the array
        for (var i = 0; i < numDays + nextZeros; i++) {
            if (i<nextZeros) {
                newMonth.push(0);
            } else {
                newMonth.push(i+1-nextZeros);
            }
        }
        currentYearArray[month] = newMonth;
    } else {
        // Does the same process as above but in reverse
        var nextMonth;
        if (month < 11) {
            nextMonth = month + 1;
        } else {
            nextMonth = 0;
        }
        var temp = currentYearArray[nextMonth];
        var lastRowLength = 0;
        for (var i = 0; i < 7; i++) {
            if (temp[i] === 0) {
                lastRowLength++;
            }
        }
        var newMonth = [];
        var numDays;

        // Determine how many days in the month
        if (month === 3 || month === 5 || month === 8 || month === 10) {
            numDays = 30;
        } else if (month == 1) {
            if (currentCalendarYear%4 === 0) { // Leap Year
                numDays = 29;
            } else {
                numDays = 28;
            }
        } else {
            numDays = 31;
        }

        // Calculate the number of zeros to add in the back of the array
        var nextZeros = 42 - (7-lastRowLength) - numDays;
        if (nextZeros > 6) {
            nextZeros -= 7;
        }

        // Adds new zeros to the beginning of the array
        for (var i = numDays+ nextZeros; i > 0 ; i--) {
            if (i<nextZeros) {
                newMonth.unshift(0);
            } else {
                newMonth.unshift(i-nextZeros);
            }
        }
        currentYearArray[month] = newMonth;
    }
    
}
    
/**
 * Gets rid of the create event div
 * 
 * @param {boolean} isEdited Used to determine if there is a hidden ID in the create event div
 */
function hideCreateEventDiv(isEdited) {
	document.getElementById("dim").style.display="none";
    document.getElementById("dialog-wrapper").style.display="none";
    document.getElementById("dialog").style.display="none";

    // Checks if the event was edited and removes the hiddenId if it was
    if (isEdited) {
        document.querySelector(".hiddenId").remove();
    }

    // Reset the values of the create event div
    resetValuesCreateEventDiv();
}

/**
 * Resets the values for the createEventDiv to their defaults
 */
function resetValuesCreateEventDiv() {
    // Array of all elements that need to be reset
    var toResetArray = document.getElementById("dialog").children;

    // Resets all to their original values
    for (var i = 0; i < toResetArray.length; i++) {
        if (toResetArray[i].id === "titleIn") {
            toResetArray[i].value = "New Event";
        }
        if (toResetArray[i].id === "monthInDue" || toResetArray[i].id === "monthInStart") {
            toResetArray[i].value = "Month";
        }        
        if (toResetArray[i].id === "yearInStart" || toResetArray[i].id === "yearInDue") {
            toResetArray[i].value = d.getFullYear();
        }
        if (toResetArray[i].id === "timeToComplete") {
            toResetArray[i].value = 1;
        }
        if (toResetArray[i].id === "typeOfEvent") {
            toResetArray[i].value = "earlyFinish";
        }
        if (toResetArray[i].id === "stars") {
            var starArray = toResetArray[i].children;
            for (var j = 0; j < starArray.length; j++) {
                if (starArray[j].id === "2" || starArray[j].id === "3" || starArray[j].id === "4" || starArray[j].id === "5") {
                    starArray[j].classList.remove("checked");
                }
            }
        }
    }
}

// creates a new Event with set start and stop date, time, priority and name
/**
 * 
 */
function createNewEvent() {
    // Create the uniqueId, ensuring that there are no duplicates
    var uniqueId = Math.floor(Math.random()*2048);
    for (var i = 0; i < allEvents.length; i++) {
        if (allEvents[i][1][5] === uniqueId) {
            uniqueId = Math.floor(Math.random()*2038);
            i = 0;
        }
    }

    // Collect all the data values
    var titleInput = document.getElementById("titleIn").value;
    var startMonthInput = document.getElementById("monthInStart").value;
    var startNumInput = document.getElementById("StartDate").value;
    var startYearInput = document.getElementById("yearInStart").value;
    var dueMonthInput = document.getElementById("monthInDue").value;
    var dueNumInput = document.getElementById("DueDate").value;
    var dueYearInput = document.getElementById("yearInDue").value;
    var duration = document.getElementById("timeToComplete").value;
    var type = document.getElementById("typeOfEvent").value;
    if (document.getElementById("typeOfEvent").value === "chunks") {
        type += ", " + document.getElementById("chunkLevel");
    }

    // Format the complete start and due dates
    var startDate =  startMonthInput + ", " + startNumInput + ", " + startYearInput;
    var dueDate = dueMonthInput + ", " + dueNumInput + ", " + dueYearInput;

    // Find the prioriy of the event and assign a value 1-5
    var priority = 0;
    for (var i = 1; i < 6; i++) {
        var star = document.getElementById(i.toString());
        var starClasses = star.classList;
        for (var j = 0; j < starClasses.length; j++) {
            if (starClasses[j] === "checked") {
                priority++;
            }
        }
    }

    // A blank array to be filled with every instance and duration of the event
    var newActivity = [];
    var durationDays = findTimes(duration, findDaysBetween(startDate, dueDate));

    // Finds the duration of each event and number of events
    var durationPerEvent = parseInt(durationDays.split(", ")[0]);
    var numberEvents = parseInt(durationDays.split(", ")[1]);

    // The first thing in the event is the title
    newActivity.push(titleInput);
    
    // Adds each instance of the event (each day it should be performed) to the newActvity array
    for (var i = 0; i < numberEvents; i++) {
        var newEvent = [];
        newEvent.push(durationPerEvent.toString(), titleInput, findDate(startDate, i), priority.toString(), type, uniqueId);
        newActivity.push(newEvent);
    }
    var duplicate = -1;

    // Finds if there is a duplicate event
    for (var i = 0; i < allEvents.length; i++) {
        if (newActivity[5] === allEvents[i][1][5]) {
            duplicate = i;
        }
    }

    // If there is no duplicate, add the event to the allEvents array, otherwise add replace the predeccesor
    if (duplicate === -1) {
        allEvents.push(newActivity);
    } else {
        allEvents[duplicate] = newActivity;
    }
    
    // Hide the create event div and update the local storage
    hideCreateEventDiv(false);
    localStorage.setItem("events", JSON.stringify(allEvents));

    // Show the current day and the events in it
    var currentDayArray = document.getElementById("date").innerHTML.split(" ");
    var currentDay =  currentDayArray[0] + ", " + currentDayArray[1] + ", " + currentCalendarYear;
    showEvents(currentDay);
}


/**
 * Takes the starting date of the event and a number of days sice, return the date
 * 
 * @param {string} startDate The date the event starts
 * @param {number} daysAfter The number of days since the start of the event
 * 
 * @returns A string for the date of the event segement to be performed in the form of month, date, year
 */
function findDate(startDate, daysAfter) {
    // Find the start date, mont, and year
    var startDateArray = startDate.split(", ");
    var currentMonth;
    var startNum = parseInt(startDateArray[1]);
    var startYear = parseInt(startDateArray[2]);
    
    // Translate the string for month to a number (0-11) 
    for (var i = 0; i < monthNames.length; i++) {
        if (monthNames[i] === startDateArray[0]) {
            currentMonth = i;
        }
    }

    // 
    var totalDays = startNum + daysAfter;
    var currentDate = startNum;
    for (var i = startNum; i < totalDays; i++) {
        if (currentMonth === 1 && startYear % 4 === 0 && currentDate === 29) {
            currentMonth++;
            currentDate = 0;
        } else if (currentMonth === 1 && startYear % 4 != 0 && currentDate === 28) {
            currentMonth++;
            currentDate = 0;
        } else if ((currentMonth === 3 || currentMonth === 5 || currentMonth === 8 || currentMonth === 10) && currentDate === 30) {
            currentMonth++;
            currentDate = 0;
        } else if (currentDate === 31) {
            currentMonth++;
            currentDate = 0;
        }
        if (currentMonth === 12) {
            currentMonth = 0;
            startYear++;
        }
        currentDate++;
    }
    var monthName = monthNames[currentMonth];
    return (monthName + ", " + currentDate + ", " + startYear);
}

/**
 * Takes a start and end date and returns how many days are between them
 * 
 * @param {string} start The start date of the event
 * @param {string} end The end date of the event
 * 
 * @returns The number of days between the two dates
 */
function findDaysBetween(start, end) {
    // Sets up all the variables needed to compute
    var days = 0;
    var startDateArray = start.split(", ");
    var endDateArray = end.split(", ");
    var startMonth;
    var endMonth;
    var startNum = parseInt(startDateArray[1]);
    var endNum = parseInt(endDateArray[1]);

    // Translates the name of the month to an integer 0-11
    for (var i = 0; i < monthNames.length; i++) {
        if (monthNames[i] === startDateArray[0]) {
            startMonth = i;
        }
        if (monthNames[i] === endDateArray[0]) {
            endMonth = i;
        }
    }

    // Finds how many days there are based on using the lengths of months and leap years
    if (startDateArray[0] === endDateArray[0] && startDateArray[2] === endDateArray[2]) { // Simpliest case, if the event is contained in one month
        days = endNum - startNum;
    } else if (startDateArray[2] === endDateArray[2]) { // If the start and end dates are contained in the same year
        // Takes the start date and start month and find howmany days occur in that month
        if (startDateArray[0] === "Febuary" && startDateArray[2]%4 === 0) { //Checks for leap year
            days += 29 - startNum;
        } else if (startDateArray[0] === "Febuary") {
            days += 28 - startNum;
        } else if (startDateArray[0] === "April" || startDateArray[0] === "June" || startDateArray[0] === "September" || startDateArray[0] === "November") {
            days += 30 - startNum;
        } else {
            days += 31 - startNum;
        }

        // Adds the number of days based on how many months pass between the start and end months
        for (var i = startMonth+1; i < endMonth; i++) {
            if (i === 1 && startDateArray[2]%4 === 0) {
                days += 29;
            } else if (i === 1) {
                days += 28;
            } else if (i === 3 || i === 5 || i === 8 || i === 10) {
                days += 30;
            } else {
                days += 31;
            }
        }

        // Add the number of days in the final month
        days += endNum;
    } else { // If the event occurs over multiple years
        yearInSim = startDateArray[2];
        if (startDateArray[0] === "Febuary" && startDateArray[2]%4 === 0) { // Check for leap year
            days += 29 - startNum;
        } else if (startDateArray[0] === "Febuary") {
            days += 28 - startNum;
        } else if (startDateArray[0] === "April" || startDateArray[0] === "June" || startDateArray[0] === "September" || startDateArray[0] === "November") {
            days += 30 - startNum;
        } else {
            days += 31 - startNum;
        }

        // Adds the number of days until the end of the year
        for (var i = startMonth+1; i < 12; i++) {
            if (i === 1 && yearInSim%4 === 0) {
                days += 29;
            } else if (i === 1) {
                days += 28;
            } else if (i === 3 || i === 5 || i === 8 || i === 10) {
                days += 30;
            } else {
                days += 31;
            }
            yearInSim++;
        }

        // Adds days if there are multiple years between the end and start date
        for (var i = 1; i < (endDateArray[2] - startDateArray[2]); i++) {
            if (yearInSim%4 === 0) {
                days += 366;
            } else {
                days += 365;
            }
        }
        
        // Adds the days contained in each month up to the end month
        for (var i = 0; i < endMonth; i++) {
            if (i === 1 && yearInSim%4 === 0) {
                days += 29;
            } else if (i === 1) {
                days += 28;
            } else if (i === 3 || i === 5 || i === 8 || i === 10) {
                days += 30;
            } else {
                days += 31;
            }
        }

        // Add the number of days in the end month
        days += endNum;
    }
    return (days);
}

/**
 * Finds the amount of time the event should be performed for any given day
 * 
 * @param {number} duration The number of hours that the event is expected to take
 * @param {number} days The number of days between the start and due dates
 */
function findTimes(duration, days) {
    // The number of total minutes required
    var minutes = duration * 60;
    var interval;
    var numDays;

    // Sets the minimum time to work on something as 15 minutes, otherwise find how long it must be worked on to be completed
    if (minutes/days >= 15) {
        interval = Math.round(minutes/days);
        numDays = days;
    } else {
        for (var i = days-1; i > 0; i--) {
            // Finds how many days the event must be performed at 15 minutes each
            if (minutes/i >=15) {
                interval = Math.round(minutes/i);
                numDays = i;
                i = 0;
            }
        }
    }
    // Return the how long the event should be perform and over how many days
    return (interval.toString() + ", " + numDays.toString());
}