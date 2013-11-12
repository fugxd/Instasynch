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


function loadAutocomplete() {
    $("#chat input").bind('keydown',function(event){
        
        if(event.keyCode == 9){//tab
            //prevent loosing focus from input
            event.preventDefault();
            //split the message
            var message = $(this).val().split(' '),
                //make a regex out of the last part 
                messagetags = message[message.length-1].match(/((\[.*?\])*\[?)([\w-]+)/),
                name,
                data,
                partToComplete = '',
                username,
                i,
                j,
                sub;
            if(!messagetags || !messagetags[3]){
                return;
            }
            if(!messagetags[1]){
                 messagetags[1] = '';
            }
            
            //make a regex out of the name
            name = new RegExp('^'+messagetags[3],'i');

            //find matching users
            for(i = 0; i< users.length;i++){
                username = users[i].username;
                if(username.match(name)){
                    if(partToComplete == ''){
                        partToComplete = username;
                    }else{
                        //check for partial matches with other found users
                        for(j = partToComplete.length; j>=0 ;j--){
                            sub = partToComplete.substring(0,j);
                            if(username.indexOf(sub) == 0){
                                partToComplete = sub;
                                break;
                            }
                        }
                    }
                }
            }
            if(partToComplete != ''){
                //put messagetags and the autocompleted name back into the message
                message[message.length-1] =messagetags[1] + partToComplete;
                $(this).val(message.join(' '));
            }

        }
    });

}

beforeConnectFunctions.push(loadAutocomplete);
