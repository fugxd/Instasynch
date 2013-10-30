/*
    <InstaSynch - Watch Videos with friends.>
    Copyright (C) 2013  InstaSynch

    <Faqqq- Modified InstaSynch client code>
    Copyright (C) 2013  Faqqq

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
<<<<<<< HEAD
            var message = $(this).val().split(' ');
            //make a regex out of the last part 
            var tags = message[message.length-1].match(/(((&gt;)|>)?(\[.*?\])*\[?)(.*)/);
            //save tags if there were any
            tags[1] = (tags[1])?tags[1]:'';
            if(!tags[5]){
=======
            var message = $(this).val().split(' '),
                //make a regex out of the last part 
                messagetags = message[message.length-1].match(/((\[.*?\])*\[?)(.*)/),
                name,
                data,
                autocomplete = '',
                username,
                i,
                j,
                sub;
            if(!messagetags[1]){
                 messagetags[1] = '';
            }
            if(!messagetags[3]){
>>>>>>> origin/test
                return;
            }   
            
            //make a regex out of the name
<<<<<<< HEAD
            var name = new RegExp('^'+tags[5],'i');
            var data;
            var autocomplete ='';
=======
            name = new RegExp('^'+messagetags[3],'i');

>>>>>>> origin/test
            //find matching users
            for(i = 0; i< users.length;i++){
                username = users[i].username;
                if(username.match(name)){
                    if(autocomplete == ''){
                        autocomplete = username;
                    }else{
                        //check for partial matches with other found users
                        for(j = autocomplete.length; j>=0 ;j--){
                            sub = autocomplete.substring(0,j);
                            if(username.indexOf(sub) == 0){
                                autocomplete = sub;
                                break;
                            }
                        }
                    }
                }
            }
            if(autocomplete != ''){
                //put messagetags and the autocompleted name back into the message
                message[message.length-1] =messagetags[1] + autocomplete;
                $(this).val(message.join(' '));
            }

        }
    });

}

beforeConnectFunctions.push(loadAutocomplete);
