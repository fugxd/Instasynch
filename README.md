Instasynch
==========


Command List
------------

<pre>
<code>'togglePlayer</code>
<code>'printWallCounter</code>
<code>'mirrorPlayer</code>
<code>'clearChat</code>
<code>'printAddonSettings</code>
<code>'printMyWallCounter</code>
<code>'bump</code>
<code>:toggleAutocompleteTags</code>
<code>:toggleAutocompleteEmotes</code>
<code>:toggleAutocompleteCommands</code>
<code>:toggleAutocompleteAddOnSettings</code>
<code>:toggleAutomaticPlayerMirror</code>
<code>:toggleTags</code>
<code>:toggleNSFWEmotes</code>
<code>:toggleModSpy</code>
</pre>


Installing
----------

To use scripts install <a href=https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=de>tampermonkey(chrome)</a> or <a href="https://addons.mozilla.org/de/firefox/addon/greasemonkey/">greasemonkey(firefox)</a>.

Create a new userscript and copy the contents of <a href="https://github.com/Bibbytube/Instasynch/blob/master/loadAll.js">loadAll.js</a> in it.

<a href="/install.gif">Chrome Example</a>


Scripts
=======

Message Filter
--------------

The message filter brings back the old tags from synchtube, wordfilters and NSFWEmotes.

The command <code>:toggleTags</code> can be used to turn the tags on and off to reduce spam in the chat.

<code>:toggleNSFWEmotes</code> can be used to turn the NSFWEmotes on and off.

<a href="/Chat Additions/Messagefilter/messagefilterexample.gif">Example</a>


Autocomplete
------------

Autocomplete will assist the user in typing out commands, emotes, settings and tags.
By hitting tab or enter the selected item will be added to the input field. 
If it is an emote or a command that does not need additional input it will be automatically sent to the chat.

Each of those can be turned on and off.
<pre>
<code>:toggleAutocompleteTags</code>
<code>:toggleAutocompleteEmotes</code>
<code>:toggleAutocompleteCommands</code>
<code>:toggleAutocompleteAddOnSettings</code>
</pre>

<a href="Chat Additions/Autocomplete/autocompleteexample.gif">Example</a>


Name Autocomplete
-----------------

By starting to type a name and hitting the tab key the name will be autocompleted.

<a href="Chat Additions/Name Autocomplete/nameautocompleteexample.gif">Example</a>


OnClick Kick,Ban
----------------

A user can be kicked by holding ctrl and clicking on the username in the chat window.
He will be banned by holding ctrl + alt and clicking. If the user is not around anymore he will automatically be leaverbanned

<a href="Chat Additions/OnClickKickBan/onclickkickbanexample.gif">Example</a>


Input History
-------------

All the sent messages will be saved in a local history and can be accessed by using the up and down arrow keys

<a href="Chat Additions/Input History/inputhistoryexample.gif">Example</a>


Chat Autoscroll Fix
-------------------

Automatic scrolling in the chat can be turned off by scrolling up in the chat window now rather then hovering over the chat window with the mouse.
The maximum of messages will be increased while automatic scrolling is off to make sure it won't start scrolling again because messages get deleted.
To turn automatic scrolling back on simply scroll completely down.


Mod Spy
-------

The logs in the console can be redirected to the chat window. Clean commands will be filtered out
To turn it on and off use <code>:toggleModSpy</code>

<a href="Chat Additions/ModSpy/modspyexample.gif">Example</a>


Toggle Player
-------------

The player can be turned off by using the command <code>'togglePlayer</code>.

<a href="Player Additions/Toggle Player/toggleplayerexample.gif" >Example</a>


Mirror Player
-------------

The player can be mirrored by using the command <code>'mirrorPlayer</code>.
Videos containing words like 'Mirrored' or 'Mirror' in the title will be automatically be mirrored.
This can be turned off using <code>:toggleAutomaticPlayerMirror</code>


Mousewheel Volumecontrol
------------------------

The volume of the Youtube and Vimeo can be controlled by hovering over it with the mouse and scrolling up and down with the mousewheel.

<a href="Player Additions/Mousewheel Volumecontrol/mousewheelvolumecontrolexample.gif" >Example</a>


Wallcounter
-----------

The wall length of every user will be saved and updated if a video has been added/deleted.
The current wall length will be shown in the 'Video successfully added' message.
To print your own wall length use <code>'printMyWallCounter</code> and too see it from all the users use <code>'printWallCounter</code>


Bump Command
------------

To bump a users last added video simply use the command <code>'bump [user]</code>.
The video will be moved right under the active video.


Clear Chat Command
------------

To clear all the messages from the chat use the command <code>'clearChat</code>.


Settings
--------

All the settings will be saved in a cookie so they aren't lost when reloading the page.
To show all the current set values use <code>'printAddOnSettings</code>.
When changing a setting the new value will be shown in the chat.




Gifs made with <a href="http://blog.bahraniapps.com/?page_id=21">GifCam</a>

