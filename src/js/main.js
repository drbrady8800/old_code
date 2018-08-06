'use strict';


jwplayer("playerContainer").setup({
    playlist: "data.json"
});

// player instance
var playerInstance = jwplayer();

// interval variable
var interval;

playerInstance.once("ready", createPlaylist);
function createPlaylist() {
    var scaleFactor = getScaleFactor();
    var playlistContainer = document.getElementById("playlistContainer");
    if (scaleFactor != 1) {
        playlistContainer.style.height = (90 * scaleFactor + 100)*4+ "px";
    }
    var playlist = playerInstance.getPlaylist();

    // hide the playlist button once a video is played
    playerInstance.once("play", function() {
        document.querySelector(".jw-playlist-btn").style = "display: none";
    });

    window.addEventListener("resize", function() {
        var thumbnailContainers = document.getElementsByClassName("thumbnailContainer");
        var playlistItemContainers = document.getElementsByClassName("playlistItemContainer");
        var scaleFactor = getScaleFactor();

        for (var i = 0; i < thumbnailContainers.length; i++) {
            thumbnailContainers[i].style.height = 90 * scaleFactor + "px";
            if (scaleFactor != 1) {
                playlistItemContainers[i].style.height = (90 * scaleFactor + 100) + "px";
            } else {
                playlistItemContainers[i].style.height = "130px"
            }
        }
        var playlistContainer = document.getElementById("playlistContainer");
        if (scaleFactor != 1) {
            playlistContainer.style.height = (90 * scaleFactor + 100)*4+ "px";
        } else {
            playlistContainer.style.height = "150px"
        }
        
    });

    
    for (var i = 0; i < playlist.length; i++) {
        // create the playlist item container, containing the image, title, dividingLine, tags, and duration
        var playlistItem = document.createElement("div");
        playlistItem.id = "playlistItemContainer" + i.toString();
        playlistItem.classList.add("playlistItemContainer");
        if (scaleFactor != 1) {
            playlistItem.style.height = (90 * scaleFactor + 100) + "px";
        }
        playlistContainer.appendChild(playlistItem);

        // create the title element and assign it the title of the image
        var title = document.createElement("p");
        title.id = "playlistItemTitle" + i.toString();
        title.classList.add("playlistItemTitle");
        title.innerHTML = playlist[i].title;
        playlistItem.appendChild(title);

        // create a container div for the image
        var thumbnailContainer = document.createElement("div");
        thumbnailContainer.id = "thumbnailContainer" + i.toString();
        thumbnailContainer.classList.add("thumbnailContainer");
        thumbnailContainer.style.height = 90 * scaleFactor + "px";
        playlistItem.appendChild(thumbnailContainer);
        
        //create div eventListener
        var eventListener = document.createElement("div");
        eventListener.id = "eventListener" + i.toString();
        eventListener.classList.add("eventListener");
        eventListener.addEventListener("mouseleave", hideVideoInfo);
        eventListener.addEventListener("mouseover", showVideoInfo);
        eventListener.addEventListener("click", playSelection);
        thumbnailContainer.appendChild(eventListener);
        
        // create the artwork image element
        var artworkThumbnail = document.createElement("img");
        artworkThumbnail.id = "artworkThumbnail" + i.toString();
        artworkThumbnail.classList.add("artworkThumbnail");
        artworkThumbnail.src = playlist[i].image;
        thumbnailContainer.appendChild(artworkThumbnail);

        // create the keyframe image element
        var spriteThumbnail = document.createElement("img");
        spriteThumbnail.id = "spriteThumbnail" + i.toString();
        spriteThumbnail.classList.add("spriteThumbnail");
        spriteThumbnail.src = playlist[i].previewSprite;
        spriteThumbnail.style.width = spriteThumbnail.naturalWidth*.5 + 'px';
        spriteThumbnail.style.height = spriteThumbnail.naturalHeight*.5 + 'px';
        thumbnailContainer.appendChild(spriteThumbnail);

        //create the heading of the playlist container
        if (i === 0) {
            var playlistHeading = document.createElement("p");
            playlistHeading.id = "playlistHeading" + i.toString();
            playlistHeading.classList.add("playlistHeading");
            playlistHeading.innerHTML = "New Releases";
            thumbnailContainer.appendChild(playlistHeading);
        }

        //create the info container (duration, dividingLine, and tags)
        var infoContainer = document.createElement("div");
        infoContainer.id = "infoContainer" + i.toString();
        infoContainer.classList.add("infoContainer");
        playlistItem.appendChild(infoContainer);

        // create the dividing line, hidden until hover
        var dividingLine = document.createElement("hr");
        dividingLine.id = "dividingLine" + i.toString();
        dividingLine.classList.add("dividingLine");
        infoContainer.appendChild(dividingLine);

        // create duration element, hidden until hover
        var duration = document.createElement("p");
        duration.id = "playlistItemDuration" + i.toString();
        duration.classList.add("playlistItemDuration");
        infoContainer.appendChild(duration);

        // create tags element, hidden until hover
        var tags = document.createElement("p");
        tags.id = "playlistItemTags" + i.toString();
        tags.classList.add("playlistItemTags");
        infoContainer.appendChild(tags);
    }
}

function showVideoInfo(event) {
    var playlist = playerInstance.getConfig().playlist;
    // find which playlist item is being hovered on
    var index = event.target.id.substring(event.target.id.length-1);

    // calls the animateSprite method with the scale factor according to the screen size
    animateSprite(index);

    // hides the original thumbnail so that the sprite can be seen
    document.getElementById("artworkThumbnail" + index.toString()).style.visibility = "hidden";

    // makes the sprite, video info and dividing line visible assigns innerHTML hear, after player has loaded
    document.getElementById("spriteThumbnail" + index.toString()).style.visibility = "visible";
    document.getElementById("infoContainer" + index.toString()).style.visibility = "visible";


    var duration = document.getElementById("playlistItemDuration" + index.toString());
    duration.innerHTML = playlist[index].duration;

    var tags = document.getElementById("playlistItemTags" + index.toString());
    tags.innerHTML = "";
    var tagsArray = playlist[index].tags.split(",");
    for (var i = 0; i < tagsArray.length - 1; i++) {
        tags.innerHTML += tagsArray[i] + " ";
    }
    tags.innerHTML += tagsArray[tagsArray.length-1];
}

function hideVideoInfo(event) {
    // find which playlist item is being hovered on
    var index = event.target.id.substring(event.target.id.length-1);

    // cancel the interval that creates the animation of the sprite
    cancelKeyframeAnimation(index);

    // make the original thumbnail visible
    document.getElementById("artworkThumbnail" + index.toString()).style.visibility = "visible";

    // hiding the movie info and dividing line
    document.getElementById("infoContainer" + index.toString()).style.visibility = "hidden";
}

// plays the video the user clicks on in the external playlist
function playSelection(event) {
    var index = event.target.id.substring(event.target.id.length-1);
    playerInstance.playlistItem(index);
}

// moves the sprite around so that the user can see various frames from the video
// index is the playlist index in which the hovered thumbnail is in
// factor is the scale factor, 1 for screens larger than 760px and smaller than 480px
// 2 is for screens between 480px and 760px
function animateSprite(index) {
    // original x and y positions of the sprite, start on third row
    var scaleFactor = getScaleFactor();
    var xPosition = 160 * scaleFactor;
    var yPosition = 272.5 * scaleFactor;
    
    // gets the sprite that will be moved around
    var spriteThumbnail = document.getElementById("spriteThumbnail" + index.toString());

    // puts the sprite in its original position before interval starts
    spriteThumbnail.style = `width: ${spriteThumbnail.naturalWidth*(.5*scaleFactor)}px; height: ${spriteThumbnail.naturalHeight*(.5*scaleFactor)}px; top: -${272.5 * scaleFactor}px; left: ${0 * scaleFactor}px; visibility: visible`
    interval = setInterval ( () => {

        // moves the sprite
        spriteThumbnail.style = `width: ${spriteThumbnail.naturalWidth*(.5*scaleFactor)}px; height: ${spriteThumbnail.naturalHeight*(.5*scaleFactor)}px; top: -${yPosition}px; left: -${xPosition}px; visibility: visible`; 
        if (xPosition <= 160 * scaleFactor){
            xPosition = xPosition + 320 * scaleFactor;
        } else {
            xPosition = 0;
            if (yPosition + 180 * scaleFactor >= spriteThumbnail.style.height.split("px")[0]) {
                yPosition = 272.5 * scaleFactor;
            }
            yPosition += 89.5 * scaleFactor;
        }
    }, 500);
}


//cancels the interval that animates the sprite
function cancelKeyframeAnimation(index) {
    // gets the sprite element
    var spriteThumbnail = document.getElementById("spriteThumbnail" + index.toString());

    // puts sprite back in original position and sizes it to the correct size
    if (window.matchMedia("only screen and (min-width: 480px) and (max-width: 760px)").matches) {
        spriteThumbnail.style = `width: ${spriteThumbnail.naturalWidth}px; height: ${spriteThumbnail.naturalHeight}px; top: -545px; left: 0px; visibility: hidden`
    } else {
        spriteThumbnail.style = `width: ${spriteThumbnail.naturalWidth*.5}px; height: ${spriteThumbnail.naturalHeight*.5}px; top: -272.5px; left: 0px; visibility: hidden`
    }
    clearInterval(interval);
}


//resizes the sprite
function getScaleFactor() {
    if (window.matchMedia("only screen and (max-width: 499px)").matches) {
        return((window.innerWidth / 459)*2.58);
    } else if (window.matchMedia("only screen and (min-width: 760px)").matches) {
        return(1);
    } else {
        return(2.81);
    }
}








// 'use strict';


// jwplayer("playerContainer").setup({
//     playlist: "data.json"
// });

// // player instance
// var playerInstance = jwplayer();

// // interval variable
// var interval;

// playerInstance.once("ready", createPlaylist);
// function createPlaylist() {
//     //hide the playlist button once a video is played
//     playerInstance.once("play", function() {
//         document.querySelector(".jw-playlist-btn").style = "display: none";
//     });


//     var playlistContainer = document.getElementById("playlistContainer");
//     var playlist = playerInstance.getPlaylist();
//     for (var i = 0; i < playlist.length; i++) {
//         // create the playlist item container, containing the image, title, dividingLine, tags, and duration
//         var playlistItem = document.createElement("div");
//         playlistItem.id = "playlistItemContainer" + i.toString();
//         playlistItem.classList.add("playlistItemContainer");
//         playlistContainer.appendChild(playlistItem);

//         // create a container div for the image
//         var thumbnailContainer = document.createElement("div");
//         thumbnailContainer.id = "thumbnailContainer" + i.toString();
//         thumbnailContainer.classList.add("thumbnailContainer");
//         playlistItem.appendChild(thumbnailContainer);
        
//         //create div eventListener
//         var eventListener = document.createElement("div");
//         eventListener.id = "eventListener" + i.toString();
//         eventListener.classList.add("eventListener");
//         eventListener.addEventListener("mouseleave", hideVideoInfo);
//         eventListener.addEventListener("mouseover", showVideoInfo);
//         eventListener.addEventListener("click", playSelection);
//         thumbnailContainer.appendChild(eventListener);
        
//         // create the artwork image element
//         var artworkThumbnail = document.createElement("img");
//         artworkThumbnail.id = "artworkThumbnail" + i.toString();
//         artworkThumbnail.classList.add("artworkThumbnail");
//         artworkThumbnail.src = playlist[i].image;
//         thumbnailContainer.appendChild(artworkThumbnail);

//         // create the keyframe image element
//         var previewGif = document.createElement("img");
//         previewGif.id = "previewGif" + i.toString();
//         previewGif.classList.add("previewGif");
//         previewGif.src = "http://se.jwplayer.com/~amcneil/POCs/videoToGif/" + i.toString() + ".gif";
//         thumbnailContainer.appendChild(previewGif);

//         //create the heading of the playlist container
//         if (i === 0) {
//             var playlistHeading = document.createElement("p");
//             playlistHeading.id = "playlistHeading" + i.toString();
//             playlistHeading.classList.add("playlistHeading");
//             playlistHeading.innerHTML = "New Releases";
//             thumbnailContainer.appendChild(playlistHeading);
//         }

//         // create the title element and assign it the title of the image
//         var title = document.createElement("p");
//         title.id = "playlistItemTitle" + i.toString();
//         title.classList.add("playlistItemTitle");
//         title.innerHTML = playlist[i].title;
//         playlistItem.appendChild(title);

//         // create the dividing line, hidden until hover
//         var dividingLine = document.createElement("hr");
//         dividingLine.id = "dividingLine" + i.toString();
//         dividingLine.classList.add("dividingLine");
//         playlistItem.appendChild(dividingLine);

//         // create duration element, hidden until hover
//         var duration = document.createElement("p");
//         duration.id = "playlistItemDuration" + i.toString();
//         duration.classList.add("playlistItemDuration");
//         playlistItem.appendChild(duration);

//         // create tags element, hidden until hover
//         var tags = document.createElement("p");
//         tags.id = "playlistItemTags" + i.toString();
//         tags.classList.add("playlistItemTags");
//         playlistItem.appendChild(tags);

//         // create the large info container for the smaller screen
//         var smallScreenInfoContainer = document.createElement("div");
//         smallScreenInfoContainer.id = "smallScreenInfoContainer" + i.toString();
//         smallScreenInfoContainer.classList.add("smallScreenInfoContainer");
//         playlistItem.appendChild(smallScreenInfoContainer);

//         // create the large info text for the smaller screen
//         var smallScreenInfoText = document.createElement("p");
//         smallScreenInfoText.id = "smallScreenInfoText" + i.toString();
//         smallScreenInfoText.classList.add("smallScreenInfoText");
//         smallScreenInfoContainer.appendChild(smallScreenInfoText);
//     }
// }

// function showVideoInfo(event) {
//     var playlist = playerInstance.getConfig().playlist;
//     // find which playlist item is being hovered on
//     var index = event.target.id.substring(event.target.id.length-1);
//     var previewGif =  document.getElementById("previewGif" + index.toString());

//     //reset the gif animation
//     previewGif.src = "http://se.jwplayer.com/~amcneil/POCs/videoToGif/" + index.toString() + ".gif";

//     // hides the original thumbnail so that the sprite can be seen
//     document.getElementById("artworkThumbnail" + index.toString()).style.visibility = "hidden";

//     // makes the sprite, video info and dividing line visible assigns innerHTML hear, after player has loaded
//     previewGif.style.visibility = "visible";
//     document.getElementById("dividingLine" + index.toString()).style.visibility = "visible";

//     var duration = document.getElementById("playlistItemDuration" + index.toString());
//     duration.innerHTML = playlist[index].duration;
//     duration.style.visibility = "visible";

//     var tags = document.getElementById("playlistItemTags" + index.toString());
//     tags.innerHTML = playlist[index].tags;
//     tags.style.visibility = "visible";

//     // sets up the video info formatted for the screen smaller than 760px
//     var smallScreenInfoText = document.getElementById("smallScreenInfoText" + index.toString());
//     var tags = playlist[index].tags.split(",");
//     smallScreenInfoText.innerHTML = "";
//     for (var i = 0; i < tags.length - 1; i++) {
//         smallScreenInfoText.innerHTML += tags[i] + ", ";
//     }
//     smallScreenInfoText.innerHTML +=tags[tags.length-1];
//     smallScreenInfoText.innerHTML +="\n\n" + playlist[index].duration;
//     smallScreenInfoText.style.visibility = "visible";
// }

// function hideVideoInfo(event) {
//     // find which playlist item is being hovered on
//     var index = event.target.id.substring(event.target.id.length-1);

//     // make the original thumbnail visible
//     document.getElementById("artworkThumbnail" + index.toString()).style.visibility = "visible";
    

//     // hiding the movie info and dividing line
//     document.getElementById("dividingLine" + index.toString()).style.visibility = "hidden";
//     document.getElementById("previewGif" + index.toString()).style.visibility = "hidden";
//     document.getElementById("playlistItemDuration" + index.toString()).style.visibility = "hidden";
//     document.getElementById("playlistItemTags" + index.toString()).style.visibility = "hidden";
//     document.getElementById("smallScreenInfoText" + index.toString()).style.visibility = "hidden";
// }

// // plays the video the user clicks on in the external playlist
// function playSelection(event) {
//     var index = event.target.id.substring(event.target.id.length-1);
//     playerInstance.playlistItem(index);
// }