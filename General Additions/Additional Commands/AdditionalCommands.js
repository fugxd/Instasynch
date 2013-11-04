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
function loadAdditionalCommands(){
    $("#chat input").bind("keypress", function(event) {
        if (event.keyCode === $.ui.keyCode.ENTER) {
            switch($(this).val().toLowerCase()){
                case "'toggleplayer":togglePlayer(); settings.set('playerActive',playerActive);break;
                case "'printwallcounter":printWallCounter();break;
                case "'mirrorplayer":toggleMirrorPlayer();break;
                case "'printaddonsettings":printAddonSettings();break;
                case "'clearchat": $('#chat_list').empty();break;
                case ":toggleautocompletetags": autocompleteTags = !autocompleteTags; settings.set('autocompleteTags',autocompleteTags);break;
                case ":toggleautocompleteemotes": autocompleteEmotes = !autocompleteEmotes; settings.set('autocompleteEmotes',autocompleteEmotes);break;
                case ":toggleautocompletecommands": autocompleteCommands = !autocompleteCommands; settings.set('autocompleteCommands',autocompleteCommands);break;
                case ":toggleautocompleteaddonsettings": autocompleteAddonSettings = !autocompleteAddonSettings; settings.set('autocompleteAddonSettings',autocompleteAddonSettings);break;
                case ":toggleautomaticplayermirror": automaticMirror = !automaticMirror; settings.set('automaticMirror',automaticMirror);break;
                case ":toggletags": filterTags = !filterTags; settings.set('filterTags',filterTags);break;
                case ":togglensfwemotes": toggleNSFWEmotes(); settings.set('NSFWEmotes',NSFWEmotes);break;
                default: break;
            }
            
        }
    });
}

beforeConnectFunctions.push(loadAdditionalCommands);