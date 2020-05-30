
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


/**
 * Keeps track of the length of the current month array, used by removeOld to know
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
var numToShow = 0;


/**
 * The miminum length of an event in minutes, set by user preferences
 * @global
 */
var minEventLength = 30;

/**
 * The maximim length of an event in minutes, set by user preferences
 * @global
 */
var maxEventLength = 180;

/**
 * The length of breaks in minutes, set by user preferences
 * @global
 */
var breakLength = 30;

/**
 * How long it should be between breaks in minutes, set by user preferences
 */
var breakInterval = 90;


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
	numToShow = parseInt(clickedOn.id.toString().substring(7));

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
        element.id = events[i].ID;
        element.style.height = events[i].duration.toString() + "px";
        element.style.top = events[i].toPush;

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
        text.innerHTML = events[i].eventTitle + " - " + events[i].duration + "min.";
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
        if (allEvents[i].ID == parseInt(id)) {
            toEdit = allEvents[i];
        }
    }

    // Finds the values to fill into the edit event div
    var startArray = toEdit.startDate.split(", ");
    var dueArray = toEdit.dueDate.split(", ");

    // Fills in the values in the edit event div
    dayAppear('Start');
    document.getElementById("titleIn").value = name;
    document.getElementById("monthInStart").value = startArray[0];
    document.getElementById("StartDate").value = parseInt(startArray[1]);
    document.getElementById("yearInStart").value = startArray[2];
    
    dayAppear('Due');
    document.getElementById("monthInDue").value = dueArray[0];
    document.getElementById("DueDate").value = parseInt(dueArray[1]);
    document.getElementById("yearInDue").value = dueArray[2];
    document.getElementById("timeToComplete").value = toEdit.totalDuration;
    document.getElementById("typeOfEvent").value = toEdit.eventSchedulingType;

    // Stars are checked
    for (var i = parseInt(toEdit.priority); i > 0; i--) {
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
        if (allEvents[i].ID == id) {
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
 * @returns {Array} An array of events (in the form of objects)
 */
function orderEvents(dateClickedOn) {
    // Blank array of the events to be performed on a given day
    var eventsOnDay = [];

    // Fills the eventsOnDay array
    var dateClickedOnArray;
    var dateNumberClickedOn;
    var yearClickedOn;
    var eventToAdd;
    for (var i = 0; i < allEvents.length; i++) {
        for (var j = 0; j < allEvents[i].dates.length; j++) {
            dateClickedOnArray = dateClickedOn.split(", ");
            dateNumberClickedOn = parseInt(dateClickedOnArray[1]);
            yearClickedOn = parseInt(dateClickedOnArray[2]);
            // Check to see if the date clicked on contains a dayEvent in the given event
            if (dateNumberClickedOn == allEvents[i].dates[j].date && yearClickedOn == allEvents[i].dates[j].year && dateClickedOnArray[0] == monthNames[allEvents[i].dates[j].month]) {
                // Create an object of relevant data
                eventToAdd = {
                    eventTitle: allEvents[i].eventTitle,
                    priority: allEvents[i].priority,
                    duration: allEvents[i].dates[j].duration,
                    ID: allEvents[i].ID,
                    // To be used later to determine where to put the event on the page
                    toPush: -1
                }
                eventsOnDay.push(eventToAdd);
            }
        }
    }

    // Order events based on priority
    determinePriority(dateClickedOn, eventsOnDay);

    // Sets up the position of the events on the page
    determineBreaks(eventsOnDay);

    return(eventsOnDay);
}

/**
 * Determines the true priority of an event based on user input and the time left in the event
 * Then orders the events for the day based on this new priority
 * 
 * @param {string} currentDate In the form of Month, Date, Year it is the day that the events should be performed on
 * @param {Array<Object>} eventsOnDay An array of event objects to be performed on a given day
 */
function determinePriority(currentDate, eventsOnDay) {
    // An array of the weighted priorities based on due date, time left, and user input
    var priorityArray = new Array(eventsOnDay.length);

    for(var i = 0; i < eventsOnDay.length; i++) {
        var timeLeft = 0.0;

        // Find the matching full event in allEvents to get the total time left
        for(var j = 0; j < allEvents.length; j++) {
            if (allEvents[j].ID == eventsOnDay[i].ID) {
                var daysLeft = findDaysBetween(currentDate, allEvents[j].dueDate);

                // Find the total time left in minutes
                for (var k = allEvents[j].dates.length-1; (k > allEvents[j].dates.length-1-daysLeft && k > 0); k--) {
                    timeLeft += allEvents[j].dates[k].duration;
                }

                // Find the average time left in minutes
                timeLeft /= daysLeft;
                
                // Translate the time to hours
                timeLeft = Math.floor(timeLeft / 60);
            }
        }
        priorityArray[i] = eventsOnDay[i].priority + timeLeft*2.5;
    }

    // Actually order the events
    var temp;
    for (var i = 1; i < eventsOnDay.length; i++) {
        if (priorityArray[i] > priorityArray[i-1]) {
            // Reorder the actual event
            temp = eventsOnDay[i];
            eventsOnDay[i] = eventsOnDay[i-1];
            eventsOnDay[i-1] = temp;

            // Reorder the priority Array
            temp = priorityArray[i];
            priorityArray[i] = priorityArray[i-1];
            priorityArray[i-1] = temp;
        }
    }
}

/**
 * Determines the spacing of each event for a given day based on when the breaks should be (based on user preferences)
 * 
 * @param {Array<Object>} eventsOnDay An array of event objects, pre-ordered in their priority for the day
 */
function determineBreaks(eventsOnDay) {
    // A varaible that will iterate through events to place breaks
    var timeIterator = 0;

    // Number of breaks taken
    var numBreaks = 0;

    // An object that is created to make a new event in case an event is split by a break 
    var eventToAdd;

    // Creates the spaceing for the events
    for (var i = 0; i < eventsOnDay.length; i++) {
        var iteratedEventLength = eventsOnDay[i].duration;
        timeIterator += iteratedEventLength;
        var secondBreakEventTime = timeIterator - (numBreaks+1)*breakInterval;

        // Finds if a break is deserved
        if (secondBreakEventTime > 15) { // Need a break
            var firstBreakEventTime = eventsOnDay[i].duration - secondBreakEventTime;
            // Make the original event's length shorter
            eventsOnDay[i].duration = firstBreakEventTime;
            
            // Create a new event for after the break
            eventToAdd = {
                eventTitle: eventsOnDay[i].eventTitle,
                priority: eventsOnDay[i].priority,
                duration: secondBreakEventTime,
                ID: eventsOnDay[i].ID,
                // To be used later to determine where to put the event on the page
                toPush: -1
            }

            // Add the new event to eventsOnDay
            eventsOnDay.splice(i+1, 0, eventToAdd);

            // Increment the number of breaks
            numBreaks ++;

            // Reset timeIterator
            timeIterator -= secondBreakEventTime;

            // Set the location where the event is to be displayed
            eventsOnDay[i].toPush = 998 + timeIterator - firstBreakEventTime + (numBreaks-1)*breakLength + 'px';
        } else if (secondBreakEventTime == 0) {
            numBreaks ++;
            // Set the location where the event is to be displayed
            eventsOnDay[i].toPush = 998 + timeIterator - iteratedEventLength + (numBreaks-1)*breakLength + 'px';
        } else {
            // Set the location where the event is to be displayed
            eventsOnDay[i].toPush = 998 + timeIterator - iteratedEventLength + (numBreaks)*breakLength + 'px';
        }
    }

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
    // Resets the values in case the create event div was used to edit
    document.getElementById("deleteBtn").classList.remove("visible");
    document.getElementById("createEventBtn").classList.remove("right");

    // Hides the chunk level and minutes elements 
    document.getElementById("minutes").style.visibility = "hidden";
    document.getElementById("chunkLevel").style.visibility = "hidden";

    // Reset the Create Event button
    document.getElementById("createEventBtn").innerHTML = "Create Event";

    // Reset the background
	document.getElementById("dim").style.display="block";
	document.getElementById("dialog-wrapper").style.display = "block";
    document.getElementById("dialog").style.display="block";

    // Get the date from the date element in the day zoomed in div
    var currentDay = document.getElementById("date").innerHTML.split(" ");

    // Set the start date values to the current day
    document.getElementById("monthInStart").value = currentDay[0];
    document.getElementById("StartDate").value = parseInt(currentDay[1]);
    document.getElementById("yearInStart").value = currentYear;
    dayAppear('Start');

    // Set the due date value to the next day
    var nextDay = findDate((currentDay[0] + ", " + currentDay[1] + ", " + currentYear), 1);
    document.getElementById("monthInDue").value = monthNames[nextDay[0]];
    document.getElementById("DueDate").value = nextDay[1];
    document.getElementById("yearInDue").value = nextDay[2];
    dayAppear('Due');

    // Make all the previously red elements black again
    var redElements = document.getElementsByClassName('ineligibleDataEntry');
    while (redElements.length > 0) {
        redElements[0].classList.remove('ineligibleDataEntry');
    }

    // Get rid of all the error messages
    var errorMessages = document.getElementById("errorMessageContainer").children;
    while (errorMessages.length > 0) {
        errorMessages[0].remove();
    }

    // Get rid of all previous hidden ids
    var hiddenIds = document.getElementsByClassName('hiddenId');
    while (hiddenIds.length > 0) {
        hiddenIds[0].remove();
    } 
}



/**
 * Changes the amount of days in the start or due date selectors of the create
 * new event div to the number of days in the given month
 * 
 * @param {string} name Either "Start" or "Due", the type of date in the createEvent div
 */
function dayAppear(name) {
    // Reset the appearance of the elements
    resetToNormalFormatting();

    // Determines the which date Select to modify
    var dateSelect;
    if (name == "Start") {
        dateSelect = document.getElementById("StartDate");
    } else {
        dateSelect = document.getElementById("DueDate");
    }

    // Finds the month and fills in the number of days based on the month + leap year
    var monthSel = document.getElementById("monthIn" + name).value;
    var yearSel = document.getElementById("yearIn" + name).value;

    // Gets the amount of options down to the minimum number(28)
    for(var i = dateSelect.options.length; i > 27; i--) {
        dateSelect.remove(i);
    }

    // Adds options depending on how many should be present
    if(monthSel == "Febuary" && yearSel%4 == 0) { // 29
        let newOption = new Option(29, 29);
        dateSelect.add(newOption, undefined);
        
    } else if (monthSel == "September" || monthSel == "April" || monthSel == "June" || monthSel == "November") { // 30
        for(var i = 29; i <= 30; i++) {
            let newOption = new Option(i, i);
            dateSelect.add(newOption, undefined);
        }
    } else if (monthSel != "Febuary") { // 31
        for(var i = 29; i <= 31; i++) {
            let newOption = new Option(i, i);
            dateSelect.add(newOption, undefined);
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
 * Reset the input formatting of the input being changed to the normal black, if one of the date inputs is changed, all get reset
 */
function resetToNormalFormatting() {
    // Fetch the error messages
    var errorMessages = document.getElementsByClassName('errorMessage');

    // The changed element
    var changedElement = event.target;
    
    // If the changed element is one of the date elements change all of them back to blank
    if (changedElement.id === "monthInStart" || changedElement.id === "yearInStart" || changedElement.id === "StartDate" || 
    changedElement.id === "monthInDue" || changedElement.id === "yearInDue" || changedElement.id === "DueDate") {
        document.getElementById("monthInStart").classList.remove('ineligibleDataEntry');
        document.getElementById("StartDate").classList.remove('ineligibleDataEntry');
        document.getElementById("yearInStart").classList.remove('ineligibleDataEntry');

        document.getElementById("monthInDue").classList.remove('ineligibleDataEntry');
        document.getElementById("DueDate").classList.remove('ineligibleDataEntry');
        document.getElementById("yearInDue").classList.remove('ineligibleDataEntry');

        // Get rid of the error message for the date
        for (var i = 0; i < errorMessages.length; i++) {
            if (errorMessages[i].innerHTML === "Make sure the due date is after the start date") {
                errorMessages[i].remove();
            }
        }
    } else if (changedElement.id === "titleIn"){
        // Get rid of the class that makes the element red
        changedElement.classList.remove('ineligibleDataEntry');

        // Get rid of the error message for the title
        for (var i = 0; i < errorMessages.length; i++) {
            if (errorMessages[i].innerHTML === "Create a non-blank title") {
                errorMessages[i].remove();
            }
        }
    } else{
        // Get rid of the class that makes the element red
        changedElement.classList.remove('ineligibleDataEntry');

        // Get rid of the error message for the title
        for (var i = 0; i < errorMessages.length; i++) {
            if (errorMessages[i].innerHTML === "The duration must be between 0.5 hours and 100 hours") {
                errorMessages[i].remove();
            }
        }
    }
}


/**
 * Check to see the time is within bounds, the start date isn't before the due date, and the title is not blank
 */
function checkNewEventEligibility() {
    // The variable to return, true if the input is ok, false otherwise
    var canCreateEvent = true;

    // Fetch the error message container so that paragraphs can be added to it
    var errorMessageContainer = document.getElementById('errorMessageContainer');
    var errorMessage;


    // Check to make sure the title is not blank or full of spaces
    var titleSpaceSeperated = document.getElementById("titleIn").value.split(" ");
    var tempInt = 0;
    while (titleSpaceSeperated[tempInt] === "") {
        if (tempInt === (titleSpaceSeperated.length-1)) {
            document.getElementById("titleIn").classList.add('ineligibleDataEntry');

            // Create the error message
            errorMessage = document.createElement('p');
            errorMessage.innerHTML = "Create a non-blank title";
            errorMessage.classList.add('errorMessage');
            errorMessageContainer.appendChild(errorMessage);


            canCreateEvent = false;
        }
        tempInt++;
    }


    // Get the values for the start and due dates
    var startMonthInput = document.getElementById("monthInStart");
    var startDateInput = document.getElementById("StartDate");
    var startYearInput = document.getElementById("yearInStart");

    var dueMonthInput = document.getElementById("monthInDue");
    var dueDateInput = document.getElementById("DueDate");
    var dueYearInput = document.getElementById("yearInDue");

    // Make the array of the integer values
    var startDateArray = [0, startDateInput.value, startYearInput.value];
    var dueDateArray = [0, dueDateInput.value, dueYearInput.value];

    // Translate the month names to integer value
    for (var i = 0; i < monthNames.length; i++) {
        if (monthNames[i] == startMonthInput.value) {
            startDateArray[0] = i;
        }
        if (monthNames[i] == dueMonthInput.value) {
            dueDateArray[0] = i;
        }
    }

    // Check the actual values when compared to each other
    if ((parseInt(startDateArray[2]) > parseInt(dueDateArray[2])) || (parseInt(startDateArray[2]) == parseInt(dueDateArray[2])
        && startDateArray[0] > dueDateArray[0]) || (parseInt(startDateArray[2]) == parseInt(dueDateArray[2])
        && startDateArray[0] == dueDateArray[0] && parseInt(startDateArray[1]) >= parseInt(dueDateArray[1]))) {
        // Color the selects red
        startMonthInput.classList.add('ineligibleDataEntry');
        startDateInput.classList.add('ineligibleDataEntry');
        startYearInput.classList.add('ineligibleDataEntry');
        dueMonthInput.classList.add('ineligibleDataEntry');
        dueDateInput.classList.add('ineligibleDataEntry');
        dueYearInput.classList.add('ineligibleDataEntry');

        // Create the error message
        errorMessage = document.createElement('p');
        errorMessage.innerHTML = "Make sure the due date is after the start date";
        errorMessage.classList.add('errorMessage');
        errorMessageContainer.appendChild(errorMessage);

        canCreateEvent = false;
    }

    // Check to make sure the amount of time is within bounds
    var element = document.getElementById("timeToComplete");
    if (element.value > 99 || element.value <0.5) {
        element.classList.add("ineligibleDataEntry");

        // Create the error message
        errorMessage = document.createElement('p');
        errorMessage.innerHTML = "The duration must be between 0.5 hours and 100 hours";
        errorMessage.classList.add('errorMessage');
        errorMessageContainer.appendChild(errorMessage);

        canCreateEvent = false;
    }

    return(canCreateEvent);
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
 * @param {boolean} isEdited Used to determine if there is a hidden Id in the create event div
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


/**
 * Creates a new event with set start and stop date, time, priority and name
 */
function createNewEvent() {
    // Make sure the data presented makes sense
    if (!checkNewEventEligibility()) {
        return;
    }

    // Create the uniqueId, ensuring that there are no duplicates, if the event is being edited use its id
    var uniqueId;
    if (document.getElementsByClassName('hiddenId').length === 0) {
        // Create the uniqueId, ensuring that there are no duplicates
        uniqueId = Math.floor(Math.random()*2048);
        for (var i = 0; i < allEvents.length; i++) {
            if (allEvents[i].ID === uniqueId) {
                uniqueId = Math.floor(Math.random()*2048);
                i = 0;
            }
        }
    } else {
        uniqueId = document.getElementsByClassName('hiddenId')[0].id;
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
    var typeInput = document.getElementById("typeOfEvent").value;
    if (document.getElementById("typeOfEvent").value === "chunks") {
        typeInput += ", " + document.getElementById("chunkLevel");
    }

    // Format the complete start and due dates
    var completeStartDate =  startMonthInput + ", " + startNumInput + ", " + startYearInput;
    var completeDueDate = dueMonthInput + ", " + dueNumInput + ", " + dueYearInput;

    // Find the prioriy of the event and assign a value 1-5
    var priorityInput = 0;
    for (var i = 1; i < 6; i++) {
        var star = document.getElementById(i.toString());
        var starClasses = star.classList;
        for (var j = 0; j < starClasses.length; j++) {
            if (starClasses[j] === "checked") {
                priorityInput++;
            }
        }
    }

    // An array of the duration of each daily event, the length of the days between
    var durationDays = findTimes(duration, typeInput, findDaysBetween(completeStartDate, completeDueDate));
    
    // Creates a dayEvent object with duration, month, date, and year (all integer values) and then adds it to the dayEventArray
    var dateArray = [];
    var dayEventArray = [];
    for (var i = 0; i < durationDays.length; i++) {
        if (durationDays[i] > 0) {
            dateArray = findDate(completeStartDate, i);
            var dayEvent = {
                duration: Math.round(durationDays[i]),
                month: dateArray[0],
                date: dateArray[1],
                year: dateArray[2]
            };
            dayEventArray.push(dayEvent);
        }
    }

    // Creates an object full of all data for the event
    var newEvent = {
        eventTitle: titleInput,
        startDate: completeStartDate,
        dueDate: completeDueDate,
        eventSchedulingType: typeInput,
        priority: priorityInput,
        ID: uniqueId,
        totalDuration: duration,
        dates: dayEventArray
    };

    var duplicate = -1;
    // Finds if there is a duplicate event
    for (var i = 0; i < allEvents.length; i++) {
        if (newEvent.ID == allEvents[i].ID) {
            duplicate = i;
        }
    }

    // If there is no duplicate, add the event to the allEvents array, otherwise add replace the predeccesor
    if (duplicate === -1) {
        allEvents.push(newEvent);
    } else {
        allEvents[duplicate] = newEvent;
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
 * Takes the starting date of the event and a number of days since, return the date
 * 
 * @param {string} startDate The date the event starts
 * @param {number} daysAfter The number of days since the start of the event
 * 
 * @returns An array of integers for the date of the event segement to be performed in the form of month, date, year
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
    return ([currentMonth, currentDate, startYear]);
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
 * @param {string} typeEvent the type of event to be performed
 * @param {nudurationmber} days The number of days between the start and due dates
 */
function findTimes(duration, typeEvent, days) {
    if (typeEvent == "earlyFinish") {
        return (finishEarly(duration*60, days));
    } else if (typeEvent == "lateFinish") {
        return (finishLate(duration*60, days));
    } else if (typeEvent == "spaceOut") {
        return (finishEarly(duration*60, days));
    } else {
        return (chunks(duration*60, days, typeEvent.split(", ")[1]));
    }
}

/**
 * Finds the day-by-day breakdown of an event if it is scheduled to finish early
 * 
 * @param {number} duration The number of hours that the event is expected to take
 * @param {number} days The number of days between the start and due dates
 * 
 * @returns An array of each day of the event's performance length (0 if the event should not be performed on a day)
 */
function finishEarly(duration, days) {
    var toRet = new Array(days);
 
    // Sets the minimum time to work on something as the user's preference, otherwise find how long it must be worked on to be completed
     if (duration/days >= minEventLength) {
         for (var i = 0; i < days; i++) {
            // If the event needs more than the min amount of time everyday make it do so
            toRet[i] = duration/days;
         }
    } else {
    for (var i = 0; i < days; i++) {
            if (duration - i*minEventLength > 2*minEventLength) {
                // If the event still has more than 2 * the minimum event length just set the length to the min value
               toRet[i] = minEventLength;
            } else if (duration - i*minEventLength > minEventLength) {
                // Swap the first day for the longest the event has to be performed
                toRet[0] = duration - i*minEventLength;
                toRet[i] = minEventLength;
            } else {
                // At this point the event has been fully completed, all future days should not perform the event
                toRet[i] = 0;
            }
        }
    }

    // Return the an array of how long each event should be perfomed for a given day
    return (toRet);
}


/**
 * Finds the day-by-day breakdown of an event if it is scheduled to finish late
 * 
 * @param {number} duration The number of hours that the event is expected to take
 * @param {number} days The number of days between the start and due dates
 * 
 * @returns An array of the durations of the event on a day by day basis
 */
function finishLate(duration, days) {
    var toRet = new Array(days);
 
    // Sets the minimum time to work on something as the user's preference, otherwise find how long it must be worked on to be completed
     if (duration/days >= minEventLength) {
         for (var i = 0; i < days; i++) {
            // If the event needs more than the min amount of time everyday make it do so
            toRet[i] = duration/days;
         }
    } else {
    for (var i = days-1; i >= 0; i--) {
            if (duration - (days-1-i)*minEventLength > 2*minEventLength) {
                // If the event still has more than 2 * the minimum event length just set the length to the min value
               toRet[i] = minEventLength;
            } else if (duration - (days-1-i)*minEventLength > minEventLength) {
                // Swap the first day for the longest the event has to be performed
                toRet[days-1] = duration - (days-1-i)*minEventLength;
                toRet[i] = minEventLength;
            } else {
                // At this point the event has been fully completed, all future days should not perform the event
                toRet[i] = 0;
            }
        }
    }

    // Return the an array of how long each event should be perfomed for a given day
    return (toRet);
}

/**
 * Finds the day-by-day breakdown of an event if it is scheduled to finish late
 * 
 * @param {number} duration The number of hours that the event is expected to take
 * @param {number} days The number of days between the start and due dates
 * 
 * @returns An array of the durations of the event on a day by day basis
 */
function staggered(duration, days) {
    var toRet = new Array(days);
 
    // Sets the minimum time to work on something as the user's preference, otherwise find how long it must be worked on to be completed
     if (duration/days >= minEventLength) {
         for (var i = 0; i < days; i++) {
            // If the event needs more than the min amount of time everyday make it do so
            toRet[i] = duration/days;
         }
    } else {
    for (var i = days-1; i >= 0; i--) {
            if (duration - (days-1-i)*minEventLength > 2*minEventLength) {
                // If the event still has more than 2 * the minimum event length just set the length to the min value
               toRet[i] = minEventLength;
            } else if (duration - (days-1-i)*minEventLength > minEventLength) {
                // Swap the first day for the longest the event has to be performed
                toRet[days-1] = duration - (days-1-i)*minEventLength;
                toRet[i] = minEventLength;
            } else {
                // At this point the event has been fully completed, all future days should not perform the event
                toRet[i] = 0;
            }
        }
    }

    // Return the an array of how long each event should be perfomed for a given day
    return (toRet);
}

/**
 * Finds the day-by-day breakdown of an event if it is scheduled be chunks
 * 
 * @param {number} duration The number of hours that the event is expected to take
 * @param {number} days The number of days between the start and due dates
 * @param {number} chunkLength The length of the chunk, assuming the chunks are long enough
 * 
 * @returns An array of the durations of the event on a day by day basis
 */
function chunks(duration, days, chunkLength) {
    // The number of total minutes required
    var minutes = duration * 60;
    var toRet = new Array(days);
 
    // Sets the minimum time to work on something as the user's preference, otherwise find how long it must be worked on to be completed
     if (minutes/days >= minEventLength) {
         for (var i = 0; i < days; i++) {
            // If the event needs more than the min amount of time everyday make it do so
            toRet[i] = minutes/days;
         }
    } else {
    for (var i = days-1; i >= 0; i--) {
            if (minutes - (days-1-i)*minEventLength > 2*minEventLength) {
                // If the event still has more than 2 * the minimum event length just set the length to the min value
               toRet[i] = minEventLength;
            } else if (minutes - (days-1-i)*minEventLength > minEventLength) {
                // Swap the first day for the longest the event has to be performed
                toRet[days-1] = minutes - (days-1-i)*minEventLength;
                toRet[i] = minEventLength;
            } else {
                // At this point the event has been fully completed, all future days should not perform the event
                toRet[i] = 0;
            }
        }
    }

    // Return the an array of how long each event should be perfomed for a given day
    return (toRet);
}