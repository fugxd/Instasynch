Instasynch
==========


Command List
------------

<pre>
<code>//Commands
'togglePlayer
'printWallCounter
'mirrorPlayer
'clearChat
'printAddonSettings
'printMyWallCounter
'bump [user]
'removeLast [user]
'exportPlaylist

//Settings
:toggleAutocompleteTags
:toggleAutocompleteEmotes
:toggleAutocompleteCommands
:toggleAutocompleteAddOnSettings
:toggleAutomaticPlayerMirror
:toggleTags
:toggleNSFWEmotes
:toggleModSpy</code>
</pre>


Installing
----------

To use scripts install <a href=https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=de>tampermonkey(chrome)</a> or <a href="https://addons.mozilla.org/de/firefox/addon/greasemonkey/">greasemonkey(firefox)</a>.

Create a new userscript and copy the contents of <a href="https://github.com/Bibbytube/Instasynch/blob/master/loadAll.js">loadAll.js</a> in it.

Click <a href="/install.gif">here</a> for Chrome example.

Newest Stuff
------------

<a href="#remove-last-command">Remove last Command</a><br>
<a href="#export-playlist-command">Export Playlist Command</a><br>
<a href="#bump-command">Bump Command</a><br>
<a href="#mod-spy">Mod Spy</a><br>
<a href="#clear-chat-command">Clear Chat Command</a><br>
<a href="#mirror-player">Mirror Player</a><br>

Just send a <a href="mailto:megafaqqq@gmail.com">mail</a> if you got suggestions or found a bug.

Scripts
=======

Message Filter
--------------

The message filter brings back the old tags from synchtube, wordfilters and NSFWEmotes.

The command <code>:toggleTags</code> can be used to turn the tags on and off to reduce spam in the chat.

<code>:toggleNSFWEmotes</code> can be used to turn the NSFWEmotes on and off.

Click <a href="/Chat Additions/Messagefilter/messagefilterexample.gif">here</a> for the example.


Autocomplete
------------

Autocomplete will assist the user in typing out commands, emotes, settings and tags.
By hitting tab or enter the selected item will be added to the input field. 
If it is an emote or a command that does not need additional input it will be automatically sent to the chat.

Each of those can be turned on and off.
<pre>
<code>:toggleAutocompleteTags
:toggleAutocompleteEmotes
:toggleAutocompleteCommands
:toggleAutocompleteAddOnSettings</code>
</pre>

Click <a href="Chat Additions/Autocomplete/autocompleteexample.gif">here</a> for the example.

Name Autocomplete
-----------------

By starting to type a name and hitting the tab key the name will be autocompleted.

Click <a href="Chat Additions/Name Autocomplete/nameautocompleteexample.gif">here</a> for the example.

OnClick Kick,Ban
----------------

A user can be kicked by holding ctrl and clicking on the username in the chat window.
He will be banned by holding ctrl + alt and clicking. If the user is not around anymore he will automatically be leaverbanned

Click <a href="Chat Additions/OnClickKickBan/onclickkickbanexample.gif">here</a> for the example.


Input History
-------------

All the sent messages will be saved in a local history and can be accessed by using the up and down arrow keys
 
Click <a href="Chat Additions/Input History/inputhistoryexample.gif">here</a> for the example.


Chat Autoscroll Fix
-------------------

Automatic scrolling in the chat can be turned off by scrolling up in the chat window now rather then hovering over the chat window with the mouse.
The maximum of messages will be increased while automatic scrolling is off to make sure it won't start scrolling again because messages get deleted.
To turn automatic scrolling back on simply scroll down completely.


Mod Spy
-------

The logs in the console can be redirected to the chat window. Clean commands will be filtered out
To turn it on and off use <code>:toggleModSpy</code>

Click <a href="Chat Additions/ModSpy/modspyexample.gif">here</a> for the example.


Toggle Player
-------------

The player can be turned off by using the command <code>'togglePlayer</code>.

Click <a href="Player Additions/Toggle Player/toggleplayerexample.gif">here</a> for the example.


Mirror Player
-------------

The player can be mirrored by using the command <code>'mirrorPlayer</code>.
Videos containing words like 'Mirrored' or 'Mirror' in the title will be automatically mirrored.
This can be turned off using <code>:toggleAutomaticPlayerMirror</code>


Mousewheel Volumecontrol
------------------------

The volume of the Youtube and Vimeo can be controlled by hovering over it with the mouse and scrolling up and down with the mousewheel.

Click <a href="Player Additions/Mousewheel Volumecontrol/mousewheelvolumecontrolexample.gif">here</a> for the example.


Wallcounter
-----------

The wall length of every user will be saved and updated if a video has been added/deleted.
The current wall length will be shown in the 'Video successfully added' message.
To print your own wall length use <code>'printMyWallCounter</code> and too see it from all the users use <code>'printWallCounter</code>


Bump Command
------------

To bump a users last added video simply use the command <code>'bump [user]</code>.
The video will be moved right under the active video.


Remove Last Command
------------

To remove the last video of a user use the command <code>'removeLast [user]</code>.

Clear Chat Command
------------

To clear all the messages from the chat use the command <code>'clearChat</code>.

Export Playlist Command
------------

To export all the videos in the playlist use the command <code>'exportPlaylist</code>.
A popup with all the links will open. Just copy them and close it.


Settings
--------

All the settings will be saved in a cookie so they aren't lost when reloading the page.
To show all the current set values use <code>'printAddOnSettings</code>.
When changing a setting the new value will be shown in the chat.




Gifs made with <a href="http://blog.bahraniapps.com/?page_id=21">GifCam</a>

