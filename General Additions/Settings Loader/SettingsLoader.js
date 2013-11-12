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

function loadSettingsLoader(){
    var cookieName = 'InstaSynch Addons Settings',
        expire = { expires: 10*365 }; //settings expire in 10 years
    //slightly changed version of this: http://stackoverflow.com/a/1960049, so it saves a hashmap rather than just a array
    settings = new function() {
        var cookie = $.cookie(cookieName),
            array = cookie ? cookie.split(/,/):[],
            items = {},
            i;
    
        for(i = 0; i<array.length;i+=2){
            items[array[i]] = array[i+1];
        }
    
        return {
            "set": function(key, val) {
                if(!items.hasOwnProperty(key)){
                    array.push(key);
                    array.push(val);
                }else{
                    i = array.indexOf(key);
                    array[i+1] = val; 
                }
                items[key] = val;
                addMessage('', "["+key+": "+val+"] ", '', 'hashtext');
                $.cookie(cookieName, array.join(','),expire);
            },
            "remove": function (key) { 
    
                i = array.indexOf(key); 
                if(i!=-1) array.splice(i, 2); 
    
                delete items[key];
                $.cookie(cookieName, array.join(','),expire);        
            },
            "clear": function() {
                array = [];
                items = {};
                //clear the cookie.
                $.cookie(cookieName, null);
            },
            "get": function(key) {
                //Get all the array.
                return items[key];
            },
            "getAll": function() {
                return items;
            }
        }
    };
}
var settings;

function loadSettingsLoaderCommand(){
    commands.set('regularCommands',"printAddOnSettings",printAddonSettings);
}

function printAddonSettings(){
    var output ="";
    for(var key in settings.getAll()){
        output += "["+key+": "+settings.get(key)+"] ";
    }
    addMessage('', output, '', 'hashtext');
}
//settings need to be loaded first
beforeConnectFunctions.splice(0,0,loadSettingsLoader);
beforeConnectFunctions.push(loadSettingsLoaderCommand);
