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


function loadInputHistory(){

    $("#chat input").bind('keypress',function(event){
        if(event.keyCode === 13){
            if($(this).val() != ""){
                if(inputHistoryIndex != 0){
                    //remove the string from the array
                    inputHistory.splice(inputHistoryIndex,1);
                }
                //add the string to the array at position 1
                inputHistory.splice(1,0,$(this).val());

                //50 messages limit (for now)
                if(inputHistory.length === 50){
                    //delete the last
                    inputHistory.splice(inputHistory.length-1,1);
                }
                inputHistoryIndex = 0;
            }
        }
    });    

    $("#chat input").bind('keydown',function(event){
        if(isAutocompleteMenuActive){
            return ;
        }
<<<<<<< HEAD
        if(event.keyCode == 38){//upkey
=======
        if(event.keyCode === 38){//upkey
>>>>>>> origin/test
            if(inputHistoryIndex < inputHistory.length){
                inputHistoryIndex++;
            }else{
                inputHistoryIndex = 0;
            }   
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);         

        }else if(event.keyCode === 40){//downkey
            if(inputHistoryIndex > 0){
                inputHistoryIndex--;
            }else{
                inputHistoryIndex = inputHistory.length-1;
            }            
            //insert the string into the text field
            $(this).val(inputHistory[inputHistoryIndex]);
        }
    });
}
var inputHistory = [""],
    inputHistoryIndex = 0;

beforeConnectFunctions.push(loadInputHistory);
