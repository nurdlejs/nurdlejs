/*
*   The Nurdle guess-determining object
*/
var Nurdle = function(dtree){
	var self = this;
	this.dtree = dtree;         // the full decision tree
	this.currentNode = dtree;   // the current node (initially the full tree)
	this.currentGuess = "";     // the current guess
	this.patterns=0;
	this.candidates=2315;
	
	// recursively count remaining candidates
	this.countCandidates = function(workingNode){
		if (!workingNode) workingNode = self.currentNode;
		var candidates = 0;
		for (key in workingNode){
			if (key=="22222") candidates++;
			else candidates+=self.countCandidates(workingNode[key]);
		}
		return candidates;
	}
	
	// output candidate list to container or console
	this.dumpCandidates = function(container){
		var candidateWords = self.listCandidates(self.currentNode);
		var listed = candidateWords.join(", ");
		if (container) {
			container.innerHTML = "";
			var div = document.createElement("div");
			div.innerHTML = "<table><tr><td>"+listed+"</td></tr></table>";
			container.appendChild(div);
		}	
		else console.log(listed);
	}
	
	// Gets a sorted array of all possible candidates
	this.listCandidates = function(workingNode){
		if (!workingNode) workingNode = self.currentNode;
		var word = Object.keys(workingNode)[0];
		var candidates = new Array();
		if (workingNode[word].hasOwnProperty("22222")) candidates.push(word);  // only include solution words!
		for (key in workingNode[word]){
			if (key!=="22222"){
				var sublist = self.listCandidates(workingNode[word][key]);
				for (index in sublist){
					candidates.push(sublist[index]);
				}
			}
		}
		candidates = candidates.sort();
		return candidates;
	}
	
	// lists all possible words indexed by pattern
	this.listByPattern = function(workingNode){
		var byCode = new Object();
		if (!workingNode) workingNode = self.currentNode;
		var word = Object.keys(workingNode)[0];
		if (workingNode[word].hasOwnProperty("22222")) {
			byCode['22222']=new Array(word);
		}
		for (key in workingNode[word]){
			if (key!=="22222"){
				byCode[key] = self.listCandidates(workingNode[word][key]);
			}
		}
		return byCode;
	}
	
	// output candidate list by code to container or console
	this.dumpByPattern = function(container){
		var byPattern = self.listByPattern(self.currentNode);
		var s = "<table style='width: 100%'><tr><td>";
		var sep="";
		var keys = Object.keys(byPattern);
		keys = keys.sort();
		keys = keys.reverse();
		for (keyi in keys){
			key = keys[keyi];
			s += sep+"<td><span class='pattern'>"+getColourPattern(key)+"</span>&nbsp;&nbsp;";
			s += byPattern[key].join(", ");
			sep="</td></tr><tr><td>"; //"<hr/>";
		}
		s+="</td></tr></table>";
		if (container) {
			container.innerHTML = "";
			var div = document.createElement("div");
			div.innerHTML = s;
			container.appendChild(div);
		}	
		else console.log(byPattern);
	}
	
	// Gets the guess for the current node
	this.getGuess = function(){
		self.currentGuess = Object.keys(self.currentNode)[0];
		self.patterns = Object.keys(self.currentNode[self.currentGuess]).length;
		self.candidates = self.countCandidates();
		return self.currentGuess;
	}	
	
	// Gets the status : number of remaining candidates and number of pattern groups
	this.getStatus = function(){
		return self.candidates+" words / "+self.patterns+" patterns";
	}
	
	// Selects the next node for the guess/response pair and returns the next guess (or "WIN" if game complete)
	this.processResponse = function(guess, response){
		if (guess!=self.currentGuess){
			console.log("Error: wrong guess");
			return false;
		}
		if (!self.currentNode[guess].hasOwnProperty(response)){
			alert("No suitable guess found! Please check response pattern");
			return false;
		}
		self.currentNode = self.currentNode[guess][response];  // get the appropriate next node for the guess/response
		if (self.currentNode===null) return "WIN";             // catch game complete
		return self.getGuess();                                // return next guess word
	}
	
	// Restart the game. Reset the current node and guess
	this.restart = function(){
		self.currentNode = self.dtree;  // reset to full decision tree
		self.currentGuess = "";         // clear the guess
	}
}

// Test with a basic game
function basicTest(){
	myNurdle = new nurdle(dtree);
	nextGuess = myNurdle.getGuess();
	console.log(nextGuess);
	nextGuess = myNurdle.processResponse(nextGuess, "00110");
	console.log(nextGuess);
	nextGuess = myNurdle.processResponse(nextGuess, "12010");
	console.log(nextGuess);
	nextGuess = myNurdle.processResponse(nextGuess, "22222");
	console.log(nextGuess);
}