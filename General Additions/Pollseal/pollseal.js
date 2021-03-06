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

function loadPollSeal(){
	//$(".st-poll").css( "background", "url(https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Pollseal/RegularSeal.png) 0 0 #DFDFDF" );
    //$(".st-poll").css( "background", "url(https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Pollseal/ChristmasSeal.png) 0 0 #DFDFDF" );
    $(".st-poll").css( "background", "url(https://raw.github.com/Bibbytube/Instasynch/master/General%20Additions/Pollseal/NewYearSeal.png) 0 0 #DFDFDF" );

	$(".st-poll").css( "background-size", "auto 100%");
	$(".st-poll").css( "background-repeat", "no-repeat");
	$(".st-poll").css( "background-position", "center");
}

preConnectFunctions.push(loadPollSeal);
