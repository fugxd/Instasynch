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
            var message = $(this).val().split(' ');
            //make a regex out of the last part 
            var tags = message[message.length-1].match(/((\[.*?\])*)(.*)/);
            //save tags if there were any
            tags[1] = (tags[1])?tags[1]:'';
            if(!tags[3]){
                return;
            }   
            
            //make a regex out of the name
            var name = new RegExp('^'+tags[3],'i');
            var data;
            var autocomplete ='';
            //find matching users
            for(var i = 0; i< users.length;i++){
                var username = users[i]['username'];
                if(username.match(name)){
                    if(autocomplete == ''){
                        autocomplete = username;
                    }else{
                        //check for partial matches with other found users
                        for(var j = autocomplete.length; j>=0 ;j--){
                            var sub = autocomplete.substring(0,j);
                            if(username.indexOf(sub) == 0){
                                autocomplete = sub;
                                break;
                            }
                        }
                    }
                }
            }
            if(autocomplete != ''){
                //put tags and the autocompleted name back into the message
                message[message.length-1] =tags[1] + autocomplete;
                $(this).val(message.join(' '));
            }

        }
    });

}

loadAutocomplete();
