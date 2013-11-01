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


function loadAutoscrollFix(){

    //remove autoscroll stop on hover (for now by cloning the object and thus removing all events)
    //could not figure out how to delete an anonymous function from the events
    var old_element = document.getElementById("chat_list"),
        new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    //add a scrolling event to the chat
    $('#chat_list').on('scroll',function()
    {
        var div = document.getElementById("chat_list"), 
            scrollHeight = div.scrollHeight, 
            scrollTop = div.scrollTop,   
            height = $('#chat_list').height();
        //scrollHeight - scrollTop will be 290 when the scrollbar is at the bottom
        //height of the chat window is 280, not sure where the 10 is from
        if ((scrollHeight - scrollTop) === height + 10){
            autoscroll = true;
        }else{
            autoscroll = false;
        }
    });

    //overwrite cleanChat Function so it won't clean when autoscroll is off
    //,also clean all the messages until messages === MAXMESSAGES
    cleanChat = function cleanChat(){
        while(messages > MAXMESSAGES && autoscroll){
            $('#chat_list > :first-child').remove(); //span user
            $('#chat_list > :first-child').remove(); //span message
            $('#chat_list > :first-child').remove(); //<br>
            messages--;
        }
    };
}


afterConnectFunctions.push(loadAutoscrollFix);