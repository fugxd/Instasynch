/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Bibbytube - Modified InstaSynch client code>
    Copyright (C) 2013  Bibbytube

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    http://opensource.org/licenses/GPL-3.0
*/


var indexOfSearch,
    entries = [],
    partialEntries = [],
    isPlaylist,
    numberOfVids,
    startIndex = 1,
    searchTimeout;

// Search results container
var divresults = document.createElement("div");
divresults.id = "searchResults";
applyStyle(divresults);

// Close button container
var divremove = document.createElement("div");
divremove.id = "divclosesearch";
applyStyle(divremove);

// "Moar" link container
var divmore = document.createElement("div");
divmore.id = "divmore";

// Getting poll container's parent to insert search result container
var divpolls = document.getElementsByClassName("poll-container")[0];
var divpollparent = divpolls.parentNode;
divpollparent.insertBefore(divresults,divpolls);


// Setting events on the URL input
$("#URLinput").bind("keydown", function(event) {
    if(event.keyCode === $.ui.keyCode.ESCAPE){
        closeResults();
    }else{
        if(searchTimeout){
            clearInterval(searchTimeout);
        }
        searchTimeout = setTimeout(startSearch,500);  
    }
});

function startSearch(){
    searchTimeout = null;
    closeResults();
    search();
}
// Retrieve data from the search query
function search(){
    var query,
        url,
        urlInfo;
    
    query = document.getElementById('URLinput').value;
    if(!query){  // if empty
        return;
    }else{  // is not empty
        urlInfo = parseUrl(query);
        if (!urlInfo){ // is not a link
            isPlaylist = false;
            url = "https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&format=5&max-results=45&q=" + query;
            $.getJSON(url, function(data){showResults(data);});
        }else{ // is a link
            if (!urlInfo.playlistId){ // not a playlist
                return;
            }else{ // is a playlist
                var buildMoreEntries = true;
                startIndex = 1;
                isPlaylist = true;
                while (buildMoreEntries){
                    url = "http://gdata.youtube.com/feeds/api/playlists/" + urlInfo.playlistId + "?v=2&alt=json&max-results=50&start-index=" + startIndex;
                    $.ajax({
                        async: false,
                        url: url,
                        dataType: "json",
                        success: function(data){
                            var feed = data.feed;
                            partialEntries = feed.entry;
                            
                            if (entries.length === 0){
                                entries = partialEntries;
                            }else{
                                entries = entries.concat(partialEntries);
                            }
                            
                            if (partialEntries.length >= 49){
                                startIndex = startIndex + 50;
                            }else{
                                buildMoreEntries = false;
                            }
                        },
                        error: function(){
                            buildMoreEntries = false;
                        }
                    });
                }
                showResults();
            }
        }
    }
}
    
// Parse data and display it
function showResults(data) {
    indexOfSearch = 0; 
    if (!isPlaylist){
      var feed = data.feed;
      entries = feed.entry;
    }
    var html = [],
        i,
        entry;
  
    numberOfVids = (isPlaylist) ? entries.length : 45;
  
    for (i = 0; i < 9; i++) {
        entry = entries[i];
        if (entries[i].media$group.media$thumbnail !== undefined){ // won't do shit if the video was removed by youtube.
            var thumbnailUrl = entries[i].media$group.media$thumbnail[0].url,
                thumbnail = "<img src='" + thumbnailUrl + "'>",
                title = entry.title.$t,
                id,
                link = "http://www.youtube.com/watch?v="; 
            if (!isPlaylist){
                var idtag = [];
                idtag = entry.id.$t.split(':');
                id = idtag[3];
            }else{       
                var feedURL = entry.link[1].href,
                    infoURL = parseUrl(feedURL);
                id = infoURL.id;
            }
            link += id;
            
            html.push("<div onmouseover='showTitle(this)' onmouseout='hideTitle(this)'><div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px;z-index:2;cursor:pointer;'  onClick='addLinkToPl(this)'>" + thumbnail + "<p  style='position:absolute;top:10px;visibility:hidden'><span style='background:rgba(0, 0, 0, 0.7);color:white'>" + title +  "</span></p><p style='display:none'>" + link + "</p> </div></div>");
        }else{
            html.push("<div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px'> Video Removed By Youtube </div>");
    }
  }
  $(html.join('')).appendTo("#searchResults");
  
  applyStyle(divmore);
  divresults.insertBefore(divremove,divresults.firstChild); // Somehow adding it before won't work
  divresults.appendChild(divmore);
  divresults.style.display = "block";
  divremove.style.display = "block";
} 

function getMoreResults(param){
    if (param === "prev"){
        indexOfSearch = indexOfSearch - 9;
    }else{
        indexOfSearch = indexOfSearch + 9;
    }
    $("#searchResults").empty();
    var max = Math.min(indexOfSearch+9 , entries.length),
        html = [],
        entry,
        i;
    for (i = indexOfSearch; i < max; i++) {
        entry = entries[i];
        if (entry.media$group.media$thumbnail !== undefined){ // check if video was removed by youtube
            var thumbnailUrl = entry.media$group.media$thumbnail[0].url,
                thumbnail = "<img src='" + thumbnailUrl + "'>",
                title = entry.title.$t,
                id,
                link = "http://www.youtube.com/watch?v="; 
            if (!isPlaylist){
                var idtag = [];
                idtag = entry.id.$t.split(':');
                id = idtag[3];
            }else{   
                var feedURL = entry.link[1].href,   
                    infoURL = parseUrl(feedURL);
                id = infoURL.id;
            }
            link += id;
            html.push("<div onmouseover='showTitle(this)' onmouseout='hideTitle(this)'><div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px;z-index:2;cursor:pointer;'  onClick='addLinkToPl(this)'>" + thumbnail + "<p  style='position:absolute;top:10px;visibility:hidden'><span style='background:rgba(0, 0, 0, 0.7);color:white'>" + title +  "</span></p><p style='display:none'>" + link + "</p> </div></div>");
        }else{
            html.push("<div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px'> Video Removed By Youtube </div>");
        }
  }
  $(html.join('')).appendTo("#searchResults");
  applyStyle(divmore);
  divresults.insertBefore(divremove,divresults.firstChild); // Somehow adding it before won't work
  divresults.appendChild(divmore);
  divresults.style.display = "block";
  divremove.style.display = "block";
    
}
// shows the video title on hover
function showTitle(e){
    var titleToShow = e.firstChild.childNodes[1];
    titleToShow.style.visibility='visible';
}

// hide the video title on mouse out
function hideTitle(e){
    var titleToHide = e.firstChild.childNodes[1];
    titleToHide.style.visibility='hidden';
}
    
// Paste the title clicked in the add bar
function addLinkToPl(e) {
    var linkToPaste = e.childNodes[2].innerHTML,
        addbox = document.getElementById("URLinput");
    addbox.value = linkToPaste;
}

// closes the results and empties it
function closeResults(){
    $("#searchResults").empty();
    entries = [];
    partialEntries = [];
    divresults.style.display = "none";
    divremove.style.display = "none";
}

// css thingies
function applyStyle(e){
    if (e.id === "searchResults"){
        divresults.style.cssFloat = "right"; // All but IE
        divresults.style.styleFloat = "right"; //IE
        divresults.style.width = "380px"; 
        divresults.style.marginTop = "10px";
        divresults.style.backgroundColor = "#DFDFDF";
        divresults.style.opacity = "0.9";
        divresults.style.padding = "5px";
        divresults.style.display = "none";
        divresults.style.position = "relative";
    }
    if (e.id === "divclosesearch"){
        divremove.innerHTML = "<img onClick=closeResults() src='http://www.instasynch.com/images/close.png'>";
        divremove.style.cssFloat = "right"; // All but IE
        divremove.style.styleFloat = "right"; //IE
        divremove.style.cursor = "pointer";
        divremove.style.display = "none";
        divremove.style.position = "absolute";
        divremove.style.left = "375px";
        divremove.style.top = "0px";    
    }
    if (e.id === "divmore"){
        if (indexOfSearch === 0){
            divmore.innerHTML = "<input type='button' style='cursor:pointer' onClick=getMoreResults('next') value='Next &gt&gt'/>";
        }else{
            if (indexOfSearch >= numberOfVids - 9){
                divmore.innerHTML = "<input type='button' style='cursor:pointer' onClick=getMoreResults('prev') value='&lt&lt Prev'/> </span>";
            }else{
                divmore.innerHTML = "<input type='button' style='cursor:pointer' onClick=getMoreResults('prev') value='&lt&lt Prev' /> <input type='button' style='cursor:pointer' onClick=getMoreResults('next') value='Next &gt&gt' />";
            }
        }
        divmore.style.textAlign="center";
        //divmore.style.cursor="pointer";
        divmore.style.height="300px";
        divmore.style.width = "380px"; 
        divmore.style.position="relative";
        divmore.style.zIndex="1";
    }
}