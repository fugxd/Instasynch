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

function loadBumpCommand(){
    commands.set('modCommands',"bump ",bump);
}

function bump(params){
    var user = params[1],
        bumpIndex = -1,
        i;
    
    if(!user){
        addMessage('','No user specified: \'bump [user]','','hashtext');
        return;
    }
    for (i = playlist.length - 1; i >= 0; i--) {
        if(playlist[i].addedby.toLowerCase() === user.toLowerCase()){
            bumpIndex = i;
            break;
        }
    }
    if (bumpIndex === -1){
        addMessage('',"The user didn't add any videos",'','hashtext');
    }else{
        sendcmd('move', {info: playlist[bumpIndex].info, position: getActiveVideoIndex()+1});
    }
}


beforeConnectFunctions.push(loadBumpCommand);