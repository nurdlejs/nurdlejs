NURDLE JS
=========

Nurdle JS is a Javascript-based Wordle solver, written by Mike Alexander.

How To Use
==========
Submit Nurdle JS's suggested guess to Wordle, then colour in the tiles according to Wordle's response.
<ul><li>Mobile devices: Swipe up for green, down for yellow. Tap to clear.</li>
<li>PCs: Click to cycle through yellow, green, clear.</li></ul>
Once you have coloured the tiles correctly, click OK. Nurdle JS will suggest the next best guess.
<br />If only one solution is possible, Nurdle JS will advise you that you've won!

View Info
=========
If you click on the red text that shows how many words remain, and how many colour patterns 
they make, the list of all possible words will be shown (unless this exceeds 250 words).

How It Works
============
Nurdle JS uses a decision tree generated by Nurdle, the Java Wordle companion app. Because it is
based on a decision tree, the guesses are hard-wired in, determined by all previous guesses and colour
response patterns. If you want to explore different guesses, maybe to analyse your own game-play,
then you will need to use the Nurdle Java app. This allows you to override its suggestions with any
permitted guess.

Nurdle Java app
===============
The Nurdle Java app can be downloaded from https://nurdling.wordpress.com/download/
On the same site you will find various blog posts, technical and otherwise, including explanations of
how Nurdle works, discussions of Wordle theory and strategies, and descriptions of several
experiments that have been undertaken using Nurdle.

Mike Alexander, April 2022

Dictionary Updates
==================
The original Nurdle dictionary has been updated several times since the New York Times appointed a Wordle
editor in November 2022. Unfortunately, this means the nurdlejs decision tree can only be updated reactively
as new solutions emerge. The latest update is as of 19/06/2023.
