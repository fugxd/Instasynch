var indexOfSearch;
var entries;

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


// Setting event "TAB" on the URL input
$("#URLinput").bind("keydown", function(event) {
 //    if (event.keyCode === $.ui.keyCode.TAB){    
 //     event.preventDefault();  // prevents lost of focus
 //     closeResults();
 //        search();
 //    }
    if(event.keyCode === $.ui.keyCode.ESCAPE){
        closeResults();
    }else{
        if(searchTimeout){
            clearInterval(searchTimeout);
        }
        searchTimeout = setTimeout(startSearch,500);  
    }
});
var searchTimeout;
function startSearch(){
    searchTimeout = null;
    closeResults();
    search();
}
// Retrieve data from the search query
function search(){
    var query,
        url;
    
    query = document.getElementById('URLinput').value;
    if(!query || parseUrl(query)){
    	return;
    }

    url = "https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&format=5&max-results=45&q=" + query;
    indexOfSearch = 0;
    $.getJSON(url, function(data){showResults(data)});
}

// Parse data and display it
function showResults(data) {
  var feed = data.feed;
  entries = feed.entry || [];
  var html = new Array();
  
  for (var i = 0; i < 9; i++) {
    var entry = entries[i];
    var thumbnailUrl = entries[i].media$group.media$thumbnail[0].url;
    var thumbnail = "<img onmouseover='showTitle(this)' onmouseout='hideTitle(this)' src='" + thumbnailUrl + "'>";
    var title = entry.title.$t;
    var idtag = new Array();
    idtag = entry.id.$t.split(':');
    var id = idtag[3];
    var link = "http://www.youtube.com/watch?v=" + id;
    
    html.push("<div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px'  onClick='addLinkToPl(this)'>" + thumbnail + "<p  style='position:absolute;top:10px;visibility:hidden'><span style='background:rgba(0, 0, 0, 0.7);color:white'>" + title +  "</span></p><p style='display:none'>" + link + "</p> </div>");
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
    }
    else{
        indexOfSearch = indexOfSearch + 9;
    }
    $("#searchResults").empty();
    var max = Math.min(indexOfSearch+9 , entries.length);
    var html = new Array();
    for (var i = indexOfSearch; i < max; i++) {
        var entry = entries[i];
        var thumbnailUrl = entries[i].media$group.media$thumbnail[0].url;
        var thumbnail = "<img onmouseover='showTitle(this)' onmouseout='hideTitle(this)' src='" + thumbnailUrl + "'>";
        var title = entry.title.$t;
        var idtag = new Array();
        idtag = entry.id.$t.split(':');
        var id = idtag[3];
        var link = "http://www.youtube.com/watch?v=" + id;
        
        html.push("<div style='overflow:hidden;position:relative;float:left;height:90px;width:120px;margin:1px'  onClick='addLinkToPl(this)'>" + thumbnail + "<p  style='position:absolute;top:10px;visibility:hidden'><span style='background:rgba(0, 0, 0, 0.7);color:white'>" + title +  "</span></p><p style='display:none'>" + link + "</p> </div>");
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
    var titleToShow = e.parentNode.childNodes[1];
    titleToShow.style.visibility='visible';
}

// hide the video title on mouse out
function hideTitle(e){
    var titleToHide = e.parentNode.childNodes[1];
    titleToHide.style.visibility='hidden';
}
    
// Paste the title clicked in the add bar
function addLinkToPl(e) {
    var linkToPaste = e.childNodes[2].innerHTML;
    
    var addbox = document.getElementById("URLinput");
    addbox.value = linkToPaste;
}

// closes the results and empties it
function closeResults()
{
    $("#searchResults").empty();
    divresults.style.display = "none";
    divremove.style.display = "none";
}

// css thingies
function applyStyle(e)
{
    if (e.id === "searchResults")
    {
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
    if (e.id === "divclosesearch")
    {
        divremove.innerHTML = "<img onClick=closeResults() src='http://www.instasynch.com/images/close.png'>";
        divremove.style.cssFloat = "right"; // All but IE
        divremove.style.styleFloat = "right"; //IE
        divremove.style.cursor = "pointer";
        divremove.style.display = "none";
        divremove.style.position = "absolute";
        divremove.style.left = "375px";
        divremove.style.top = "0px";    
    }
    if (e.id === "divmore")
    {
        if (indexOfSearch === 0)
        {
            divmore.innerHTML = "<a onClick=getMoreResults('next')> Next &gt&gt </a>";
        }
        else 
        {
            if (indexOfSearch >= 36)
            {
                divmore.innerHTML = "<a onClick=getMoreResults('prev')>  &lt&lt Prev </a> ";
            }
            else
            {
                divmore.innerHTML = "<a onClick=getMoreResults('prev')> &lt&lt Prev </a> <a onClick=getMoreResults('next')> Next &gt&gt </a>";
            }
        }
        divmore.style.textAlign="center";
        divmore.style.cursor="pointer";
    }
}
        
    