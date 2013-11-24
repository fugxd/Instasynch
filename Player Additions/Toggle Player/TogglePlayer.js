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


function loadTogglePlayer(){
    //load settings
    playerActive = settings.get('playerActive','true');
    
    //add the command
    commands.set('regularCommands',"togglePlayer",togglePlayer);

    //toggle the player once if the stored setting was false
    if(!playerActive){
        playerActive = true;
        //adding a little delay because it won't reload when destroying it immediately
        setTimeout(togglePlayer,1500);
    }

    var oldPlayVideo = playVideo;
    playVideo = function playVideo(vidinfo, time, playing){
        if(playerActive){
            oldPlayVideo(vidinfo, time, playing);
        }else{
            //copied from InstaSynch's playVideo
            var addedby = '',
                title = '',
                indexOfVid = getVideoIndex(vidinfo);
            if (indexOfVid > -1) {
                title = playlist[indexOfVid].title;
                addedby = playlist[indexOfVid].addedby;
                $('.active').removeClass('active');
                $($('#ulPlay').children('li')[indexOfVid]).addClass('active');
                $('#vidTitle').html(title + '<div class=\'via\'> via ' + addedby + '</div>');
            }
        }
    };
}


function togglePlayer(){
    if(playerActive){
        destroyPlayer();
    }else{
        sendcmd('reload', null);
    }
    playerActive = !playerActive;
    settings.set('playerActive',playerActive);
}

var playerActive = true;

afterConnectFunctions.push(loadTogglePlayer);
