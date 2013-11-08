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
function loadCommandLoader(){
    commands = new function() {
        var items = {};
        items['regularCommands'] = [
            "'skip",
            "'reload",
            "'resynch",
            "'toggleFilter",
            "'toggleAutosynch"
        ]; 
        items['modCommands'] = [
            "'togglePlaylistLock",
            "'ready",
            "'kick ",
            "'ban ",
            "'unban ",
            "'clean",
            "'remove ",
            "'purge ",
            "'move ",
            "'play ",
            "'pause",
            "'resume",
            "'seekto ",
            "'seekfrom ",
            "'setskip ",
            "'banlist",
            "'modlist",
            "'save",
            "'leaverban ",
            //commented those so you can't accidently use them
            //"'clearbans",
            //"'motd ",
            //"'mod ",
            //"'demod ",
            //"'description ",
            "'next"
        ];
        items['addOnSettings'] = [];
        items['commandFunctionMap'] = {};
        return {
            "set": function(arrayName, funcName, func) {
                items[arrayName].push(funcName);
                items['commandFunctionMap'][funcName.toLowerCase()] = func;
            },
            "get": function(arrayName) {
                return items[arrayName];
            },
            "getAll":function(){
                return items;
            },
            "execute":function(funcName, params){
                funcName = funcName.toLowerCase();
                if(items['commandFunctionMap'].hasOwnProperty(funcName)){
                    items['commandFunctionMap'][funcName](params);
                }
                funcName = funcName +' ';
                if(items['commandFunctionMap'].hasOwnProperty(funcName)){
                    items['commandFunctionMap'][funcName](params);
                }
            }
        }
    };    

    $("#chat input").bind("keypress", function(event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            var params = $(this).val().split(' ');
            commands.execute(params[0],params);
        }
    });
}
var commands;

beforeConnectFunctions.splice(0,0,loadCommandLoader);