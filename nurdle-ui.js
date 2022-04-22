function playAgain(){
	document.getElementById("game").innerHTML = "";
	window.myNurdle = new Nurdle(dtree);
	window.ntable = new NurdleTable(window.myNurdle);
	window.ntable.addToContainer(document.getElementById("game"));
	window.statusline = document.createElement("h3");
	window.statusline.appendChild(document.createTextNode("status"));
	document.getElementById("game").appendChild(window.statusline);
	window.statusline.addEventListener("click", function(evt){ window.togglePossibilities(); })
	window.ntable.nextRow();
	document.getElementById("possibilities").innerHTML="";
}

function togglePossibilities(){
	if (!window.hasOwnProperty('possState')) window.possState = 0;
	// if (!window.hasOwnProperty("possVisibility")) window.possVisibility = false;
	// window.possVisibility = !window.possVisibility;
	// document.getElementById("possibilities").style.display = (window.possVisibility)? "block" : "none";
	window.possState = (window.possState+1)%3;
	document.getElementById("possibilities").style.display = (window.possState>0)? "block" : "none";
	window.showPatterns = (window.possState==2);
	if (window.myNurdle.candidates<250){
		if (window.possState==1){
			window.myNurdle.dumpCandidates(document.getElementById("possibilities"));
		}
		else if (window.possState==2){
			window.myNurdle.dumpByPattern(document.getElementById("possibilities"));
		}
	}
}

function showStatus(statusText){
	window.statusline.innerHTML = statusText;
}

function showPlayAgain(){
	var playButton = document.createElement("button");
	playButton.appendChild(document.createTextNode("PLAY AGAIN?"));
	playButton.addEventListener("click", function(){ window.playAgain(); });
	playButton.className = "playagain";
	document.getElementById("game").removeChild(window.statusline);
	document.getElementById("game").appendChild(playButton);
	showStatus("Solved in "+window.ntable.rows.length+" guesses.");
	document.getElementById("game").appendChild(window.statusline);
	document.getElementById("possibilities").innerHTML="";
	document.getElementById("possibilities").style.display="none";
	window.possVisibility = false;
}

NurdleTable = function(nurdle){
	var self = this;
	this.nurdle = nurdle;
	this.activeRow=null;
	this.rows = new Array();
	this.element = document.createElement("table");
	
	this.addToContainer = function(container){
		container.appendChild(self.element);
	}
	
	this.addRow = function(guess){
		self.activeRow = new NurdleRow(guess, self);
		self.activeRow.addToContainer(self.element);
		self.rows.push(self.activeRow);
	}
	
	this.nextRow = function(response){
		if (response=="22222"){
			self.activeRow.setEnabled(false);
			window.showPlayAgain();
			return;
		}
		if (self.activeRow!==null){
			self.activeRow.setEnabled(false);
			var nextGuess = myNurdle.processResponse(self.nurdle.getGuess(), self.activeRow.getResponse());
			if (nextGuess===false){  // invalid pattern
				self.activeRow.setEnabled(true);
				return;
			}
			showStatus(self.nurdle.getStatus());
			self.addRow(nextGuess);
			if (myNurdle.patterns==1){
				self.activeRow.markWon();
				window.showPlayAgain();
				return;
			}
		}	
		else {
			self.addRow(self.nurdle.getGuess());
			showStatus(self.nurdle.getStatus());
		}
	}
}

NurdleRow = function(guess, table){
	var self = this;
	this.table = table;
	this.guess = guess;
	this.element = document.createElement("tr");
	this.cell = document.createElement("td");
	this.element.appendChild(this.cell);
	this.nbuttons = new Array();
	
	for(var i=0; i<5; i++){
		var letter = guess.substr(i, 1).toUpperCase();
		var nbutton = new NurdleButton(letter);
		nbutton.addToContainer(self.cell);
		self.nbuttons.push(nbutton);
	}
	
	this.onClick = function(evt){
		self.table.nextRow(self.getResponse());
		if (self.table.nurdle.candidates<250){
			if (!window.hasOwnProperty('showPatterns')) window.showPatterns = false;
			if (window.showPatterns){
				self.table.nurdle.dumpByPattern(document.getElementById("possibilities"));
			}
			else {
				self.table.nurdle.dumpCandidates(document.getElementById("possibilities"));
			}
		}
		else {
			document.getElementById("possibilities").innerHTML = "";
		}
	}
	this.okButton = document.createElement("button");
	this.okButton.appendChild(document.createTextNode("OK"));
	this.okButton.addEventListener("click", self.onClick);
	this.cell.appendChild(this.okButton);
	
	this.setEnabled = function(enabled){
		for(var i=0; i<5; i++){
			self.nbuttons[i].setEnabled(enabled);
		}
		var vis = (enabled)? "visible" : "hidden";
		self.okButton.style.visibility=vis;
	}
	
	this.markWon = function(){
		self.setEnabled(false);
		for(var i=0; i<5; i++){
			self.nbuttons[i].setState(2);
		}
	}
	
	this.addToContainer = function(container){
		container.appendChild(self.element);
	}
	
	this.getResponse = function(){
		var pattern = "";
		for(var i=0; i<5; i++){
			pattern += self.nbuttons[i].state;
		}
		return pattern;
	}
	
}

// A Nurdle letter button
NurdleButton = function(letter){
	var self = this;
	self.isEnabled = true;
	self.colors = new Array("#ffffff", "#ffff00", "#00ff00");
	self.state = 0;
	
	self.button = document.createElement("button");
	self.button.class="nbutton";
	self.button.appendChild(document.createTextNode(letter));
	self.button.style.backgroundColor = "#ffffff";
	
	this.setEnabled = function(enabled){
		self.isEnabled = enabled
	}
	
	this.addToContainer = function(container){
		container.appendChild(self.button);
	}
	
	// Sets the colour state and updates the colour accordingly. 
	// Touchend removes the background image and should be set true for mouse-click calls
	this.setState = function(state, touchend){
		state = state % 3;
		self.state = state;
		self.button.style.backgroundColor=self.colors[self.state];
		if (!touchend && self.state==0){
				self.button.style.backgroundImage = "url(button-touch-bg.png)";
				self.button.style.backgroundSize = "cover";
		}
		else {
			self.button.style.backgroundImage = "none";
		}
	}
	
	// Handles colour change from touch/drag event
	this.scrollState = function(yOffset){
		var offset=0;              // (touch) white
		if (yOffset>10) offset=1;   // (down) yellow
		if (yOffset<-10) offset=2;  // (up) green
		self.setState(offset);
	}
	
	// Handle letter clicks (mouse device)
	this.onClick = function(evt){
		if (!self.isEnabled) return;
		var nextState = (self.state+1) % 3;
		self.setState(nextState, true);
	}
	self.button.addEventListener("click", self.onClick);
	
	// Handle touch start (touchscreens)
	this.onTouch = function(evt){
		self.touchStatus = "started";
		evt.preventDefault();
		if (!self.isEnabled) return;
		self.startY = evt.touches[0].screenY;
		self.button.style.backgroundImage = "url(button-touch-bg.png)";
		self.button.style.backgroundSize = "cover";
	}
	self.button.addEventListener("touchstart", self.onTouch);
	
	// Handle end of touch gesture (touchscreens)
	this.touchEnd = function(evt){
		if (self.touchStatus=="started") self.scrollState(0);
		self.setState(self.state, true);
		self.touchStatus="ended";
	}
	self.button.addEventListener("touchend", self.touchEnd);

	// Handle touch drag (touchscreens)
	this.onDrag = function(evt){
		self.touchStatus = "moving";
		evt.preventDefault();
		if (!self.isEnabled) return;
		var currentY = evt.touches[0].screenY;
		var yOffset = currentY-self.startY;
		self.scrollState(yOffset);
	}
	self.button.addEventListener("touchmove", self.onDrag);
	
}

// Gets the unicode emoji representation of the colour code
function getColourPattern(code){
	var colours = '\u2B1C \uD83D\uDFE8\uD83D\uDFE9'; // white, yellow, green
	var build = "";
	for (i=0; i<code.length; i++){
		var j=parseInt(code.substr(i,1));
		var len = (j==0)? 1 : 2;
		build += colours.substr(j*2,len);
	}
	return build;
}
