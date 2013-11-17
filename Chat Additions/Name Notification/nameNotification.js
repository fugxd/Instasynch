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

function loadNameNotification(){
    var oldAddMessage = addMessage;

    //overwrite InstaSynch's addMessage function
    addMessage = function addMessage(username, message, userstyle, textstyle) {
        //continue with InstaSynch's addMessage function
        oldAddMessage(username, message, userstyle, textstyle);
        if(!newMsg){
            return;
        }
        var possibleNames = [],
            exactMatches = [],
            nameStart = -1,
            name = '',
            end = false,
            i,
            j;
        
        while(!end){
            nameStart = message.indexOf('@',nameStart+1);
            if(nameStart == -1){
                end = true;
            }else{
                possibleNames = getUsernameArray(true);
                exactMatches = [];
                name = '';
                for(i = nameStart+1; i< message.length;i++){
                    name += message[i].toLowerCase();
    
                    for(j = 0; j < possibleNames.length;j++){
                        if(name.indexOf(possibleNames[j]) == 0 ){
                            exactMatches.push(possibleNames[j]);
                            possibleNames.splice(j,1);
                            j--;
                            continue;
                        }
                        if(possibleNames[j].indexOf(name) != 0){
                            possibleNames.splice(j,1);
                            j--;
                        }
                    }
                    if(possibleNames.length == 0){
                        break;
                    }
                }
                if(exactMatches.length != 0){
                    if(thisUsername === exactMatches[exactMatches.length-1]){
                        toggleNotify();
                    }
                }
                nameStart = i-1;
            }
        }
    };
   $('#cin')['focus'](function () {
        toggleNotify();
    });
}
var notified = false;

function toggleNotify(){
    if(window.newMsg && !notified){
        $('head > link:last-of-type')[0].href = 'https://dl.dropboxusercontent.com/s/38jrcrgn210jabq/notificationFavicon.ico?dl=1&token_hash=AAFeZfrZVaXt-L579mMmsmQ2wRpNhBIA8WdCGL200B77dA';
        $('#chat_list').scrollTop($('#chat_list').scrollTop()-5);
        notified = true;
    }else{
        $('head > link:last-of-type')[0].href = 'http://instasynch.com/favicon.ico';
        notified = false;
    }
}

beforeConnectFunctions.push(loadNameNotification);