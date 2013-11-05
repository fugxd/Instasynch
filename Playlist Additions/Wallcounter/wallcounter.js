/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Faqqq- Modified InstaSynch client code>
    Copyright (C) 2013  Faqqq, Rollermiam

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


function loadWallCounter(){

    var oldAddVideo = addVideo,
        oldRemoveVideo = removeVideo,
        oldAddMessage = addMessage,
        i,
        video,
        value;


    for(i = 0; i < playlist.length;i++){
        video = playlist[i];
        value = wallCounter[video.addedby];
        value =((value)?value:0) + video.duration;
        wallCounter[video.addedby] = value;
    }
    //overwrite InstaSynch's addVideo
    addVideo = function addVideo(vidinfo) {

        value = wallCounter[vidinfo.addedby];
        value =((value)?value:0) + vidinfo.duration;
        wallCounter[vidinfo.addedby] = value;
        if (value >= 3600){
            var output = "Watch out " + thisUsername + " ! You're being a faggot by more than 1 hour of videos !";
            addMessage('',output,'','hashtext');
        }
        oldAddVideo(vidinfo);
    };

    //overwrite InstaSynch's removeVideo
    removeVideo = function removeVideo(vidinfo){
        var indexOfVid = getVideoIndex(vidinfo);
        video = playlist[indexOfVid];
        value = wallCounter[video.addedby];
        value -= video.duration;

        if(value > 0){
            wallCounter[video.addedby] = value;
        }else{
            delete wallCounter[video.addedby];
        }

        oldRemoveVideo(vidinfo);
    };    

    addMessage = function addMessage(username, message, userstyle, textstyle) {
        if(username === '' && message === 'Video added succesfully.'){
            message +='WallCounter: ['+secondsToTime(wallCounter[thisUsername])+']';
        }
        oldAddMessage(username, message, userstyle, textstyle);
    };

}
var wallCounter = {};

function printWallCounter(){
    var output = "",
        key;
    for(key in wallCounter){
        output += "["+key + ": "+secondsToTime(wallCounter[key])+"] ";
    }
    addMessage('', output, '', 'hashtext');
}

function printMyWallCounter()
{   
    var output = "";
    if(wallCounter[thisUsername]){
        output = "["+ thisUsername +" : "+ secondsToTime(wallCounter[thisUsername])+"]";
    }else{
        output = "["+ thisUsername +" : 00:00]";
    }
    addMessage('', output, '', 'hashtext');
}

afterConnectFunctions.push(loadWallCounter);
