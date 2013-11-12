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

function loadLogInOffMessages(){
    //load settings
    var setting = settings.get('logInOffMessages');
    if(setting){
        logInOffMessages = setting ==='false'?false:true;
    }else{
        settings.set('logInOffMessages',false);
    }
    //add the command
    commands.set('addOnSettings',"LogInOffMessages",toggleLogInOffMessages);
    
    // Overwriting Adduser
    var oldAddUser = addUser;

    addUser = function(user, css, sort) {
        // Only if blackname or mod
        if (user.loggedin && logInOffMessages){
            addMessage('', user.username + ' logged on.', '','hashtext');
        }
        oldAddUser(user,css,sort);
    }

    // Overwriting removeUser
    var oldRemoveUser = removeUser;

    removeUser = function(id) {
        var user = users[getIndexOfUser(id)];
        if (user.loggedin && logInOffMessages){
            addMessage('',user.username + ' logged off.', '','hashtext');
            if (user.username === 'JustPassingBy'){
                addMessage('','Wish him a happy birthday !', '', 'hastext');
            }
        }
        oldRemoveUser(id);
    }
}

var logInOffMessages = false;

function toggleLogInOffMessages(){
    logInOffMessages = !logInOffMessages;
    settings.set('logInOffMessages',logInOffMessages);
}

afterConnectFunctions.push(loadLogInOffMessages);


