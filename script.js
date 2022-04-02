/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

//Global const
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global var
var tonePlaying = false;
var volume = 0.5;
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0; 
var gamePlaying = false;
var guessCounter = 0;
var clueHoldTime = 1000;
var mistakes = 0;

function startGame(){
  clueHoldTime = 1000;
  progress = 0;
  mistakes = 0;
  gamePlaying = true;
  randomPattern();
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500,
  6: 600
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  context.resume()
  guessCounter= 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  clueHoldTime -=100;
}

function loseGame(){
  stopGame();
  alert("Game Over. You Lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You Won!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        winGame();
      }else{
        progress++;
        playClueSequence();
      }
    }else{
      guessCounter++;
    }
  }else{  
    if(mistakes >= 2){
      loseGame(); 
    }else{
      mistakes++;
      clueHoldTime += 100;//Reset fail
      playClueSequence();
    }
  }
}

function randomPattern(){
  for(let i = 0; i < pattern.length; i++){
    pattern[i] = Math.floor(Math.random() * 6) + 1
  }
}