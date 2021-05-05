dpi_x = prompt("Please enter your device DPI: ")
document.getElementById('testdiv').innerHTML = "DPI: " + dpi_x.toString()

DPIofYourDeviceScreen = dpi_x; //you will need to measure or look up the DPI or PPI of your device/browser to make sure you get the right scale!!
createCanvasOfInputArea = DPIofYourDeviceScreen*1; //aka, 1.0 inches square!

let totalTrialNum = 2; //the total number of phrases to be tested - set this low for testing. Might be ~10 for the real bakeoff!
let currTrialNum = 0; // the current trial number (indexes leto trials array above)
let startTime = 0; // time starts when the first letter is entered
let finishTime = 0; // records the time of when the final trial ends
let lastTime = 0; //the timestamp of when the last trial was completed
let lettersEnteredTotal = 0; //a running total of the number of letters the user has entered (need this for final WPM computation)
let lettersExpectedTotal = 0; //a running total of the number of letters expected (correct phrases)
let errorsTotal = 0; //a running total of the number of errors (when hitting next)
let currentPhrase = ""; //the current target phrase
let currentTyped = ""; //what the user has typed so far

let lastWord = "";
let predicts = [];

const topHundo = ["the","of","to","and","a","in","is","it","you","that","he","was","for","on","are","with","as","I","his","they","be","at","one","have","this","from","or","had","by","hot","but","some","what","there","we","can","out","other","were","all","your","when","up","use","word","how","said","an","each","she","which","do","their","time","if","will","way","about","many","then","them","would","write","like","so","these","her","long","make","thing","see","him","two","has","look","more","day","could","go","come","did","my","sound","no","most","number","who","over","know","water","than","call","first","people","may","down","side","been","now","find","any","new","work","part","take","get","place","made","live","where","after","back","little","only","round","man","year","came","show","every","good","me","give","our","under","name","very","through","just","form","much","great","think","say","help","low","line","before","turn","cause","same","mean","differ","move","right","boy","old","too","does","tell","sentence","set","three","want","air","well","also","play","small","end","put","home","read","hand","port","large","spell","add","even","land","here","must","big","high","such","follow","act","why","ask","men","change","went","light","kind","off","need","house","picture","try","us","again","animal","point","mother","world","near","build","self","earth","father","head","stand","own","page","should","country","found","answer","school","grow","study","still","learn","plant","cover","food","sun","four","thought","let","keep","eye","never","last","door","between","city","tree","cross","since","hard","start","might","story","saw","far","sea","draw","left","late","run","don't","while","press","close","night","real","life","few","stop","open","seem","together","next","white","children","begin","got","walk","example","ease","paper","often","always","music","those","both","mark","book","letter","until","mile","river","car","feet","care","second","group","carry","took","rain","eat","room","friend","began","idea","fish","mountain","north","once","base","hear","horse","cut","sure","watch","color","face","wood","main","enough","plain","girl","usual","young","ready","above","ever","red","list","though","feel","talk","bird","soon","body","dog","family","direct","pose","leave","song","measure","state","product","black","short","numeral","class","wind","question","happen","complete","ship","area","half","rock","order","fire","south","problem","piece","told","knew","pass","farm","top","whole","king","size","heard","best","hour","better","TRUE","during","hundred","am","remember","step","early","hold","west","ground","interest","reach","fast","five","sing","listen","six","table","travel","less","morning","ten","simple","several","vowel","toward","war","lay","against","pattern","slow","center","love","person","money","serve","appear","road","map","science","rule","govern","pull","cold","notice","voice","fall","power","town","fine","certain","fly","unit","lead","cry","dark","machine","note","wait","plan","figure","star","box","noun","field","rest","correct","able","pound","done","beauty","drive","stood","contain","front","teach","week","final","gave","green","oh","quick","develop","sleep","warm","free","minute","strong","special","mind","behind","clear","tail","produce","fact","street","inch","lot","nothing","course","stay","wheel","full","force","blue","object","decide","surface","deep","moon","island","foot","yet","busy","test","record","boat","common","gold","possible","plane","age","dry","wonder","laugh","thousand","ago","ran","check","game","shape","yes","hot","miss","brought","heat","snow","bed","bring","sit","perhaps","fill","east","weight","language","among"]

//Variables for my silly implementation. You can delete this:
var currentLetter = 'a';

const scaleFactor = DPIofYourDeviceScreen/110;

let predictionary = Predictionary.instance();

//You can add stuff in here. This is just a basic implementation.
function setup()
{
  predictionary.addWords(topHundo);
  textSize(12*scaleFactor);
  createCanvas(828,1792); //Sets the createCanvas of the app. You should modify this to your device's native createCanvas. Many phones today are 1080 wide by 1920 tall.
  noStroke(); //my code doesn't use any strokes.

  phrases = shuffle(phrases);
}

//You can modify stuff in here. This is just a basic implementation.
function draw()
{
  background(255); //clear background

  //check to see if the user finished. You can't change the score computation.
  if (finishTime!=0)
  {
    fill(0);
    textAlign(CENTER);
    text("Trials complete!",400,200); //output
    text("Total time taken: " + (finishTime - startTime),400,200+20*scaleFactor); //output
    text("Total letters entered: " + lettersEnteredTotal,400,200+40*scaleFactor); //output
    text("Total letters expected: " + lettersExpectedTotal,400,200+60*scaleFactor); //output
    text("Total errors entered: " + errorsTotal,400,200+80*scaleFactor); //output
    let wpm = (lettersEnteredTotal/5.0)/((finishTime - startTime)/60000); //FYI - 60K is number of milliseconds in minute
    text("Raw WPM: " + wpm,400,200+100*scaleFactor); //output
    let freebieErrors = lettersExpectedTotal*.05; //no penalty if errors are under 5% of chars
    text("Freebie errors: " + nf(freebieErrors,1,3),400,200+120*scaleFactor); //output
    let penalty = max(errorsTotal-freebieErrors, 0) * .5;
    text("Penalty: " + penalty,400,200+140*scaleFactor);
    text("WPM w/ penalty: " + (wpm-penalty),400,200+160*scaleFactor); //yes, minus, because higher WPM is better

    return;
  }


  //draw 1" watch area
  fill(100);
  rect(width/2-createCanvasOfInputArea/2, height/2-createCanvasOfInputArea/2, createCanvasOfInputArea, createCanvasOfInputArea); //input area should be 1" by 1"

  //check to see if the user hasn't started yet
  if (startTime==0 & !mouseIsPressed)
  {
    fill(128);
    textAlign(CENTER);
    text("Click to start time!", 280, 150); //display this message until the user clicks!
  }

  if (startTime==0 & mouseIsPressed)
  {
    nextTrial(); //start the trials!
  }

  //if start time does not equal zero, it means we must be in the trials
  if (startTime!=0)
  {
    //you can very slightly adjust the position of the target/entered phrases and next button
    textAlign(LEFT); //align the text left
    fill(128);
    text("Phrase " + (currTrialNum+1) + " of " + totalTrialNum, 70, 50); //draw the trial count
    fill(128);
    text("Target:   " + currentPhrase, 70, 100); //draw the target string
    text("Entered:  " + currentTyped + "|", 70, 140); //draw what the user has entered thus far 
    //draw very basic next button
    fill(255, 0, 0);
    rect(600, 600, 200, 200); //draw next button
    fill(255);
    text("NEXT > ", 650, 650); //draw next label

    //my draw code that you should replace.
    fill(255, 0, 0); //red button
    rect(width/2-createCanvasOfInputArea/2, height/2-createCanvasOfInputArea/2+createCanvasOfInputArea/2, createCanvasOfInputArea/2, createCanvasOfInputArea/4); //draw left red button
    fill(0, 255, 0); //green button
    rect(width/2-createCanvasOfInputArea/2+createCanvasOfInputArea/2, height/2-createCanvasOfInputArea/2+createCanvasOfInputArea/2, createCanvasOfInputArea/2, createCanvasOfInputArea/4); //draw right green button
    textAlign(CENTER);
    fill(200);
    text(currentLetter, width/2, height/2-createCanvasOfInputArea/4); //draw current letter

    lastWord = currentTyped.split(" ")[currentTyped.split(" ").length - 1];
    text(predictionary.predict(lastWord)[0], width/2-createCanvasOfInputArea/4, height/2+createCanvasOfInputArea/2.5);
    textAlign(CENTER);

  }
}

function didMouseClick(x, y, w, h) //simple function to do hit testing
{
  return (mouseX > x && mouseX<x+w && mouseY>y && mouseY<y+h); //check to see if it is in button bounds
}


//you can replace all of this logic.
function singleTap()
{
  console.log(startTime)
  if (millis()-startTime<=100) {
    return;
  }
  if(didMouseClick(width/2-createCanvasOfInputArea/2, height/2+createCanvasOfInputArea/4, createCanvasOfInputArea, createCanvasOfInputArea/4)) {

    currentTyped = shorten(currentTyped.split(" ")).join(" ") + " " + predictionary.predict(lastWord)[0] + String(" ");
  } else if (didMouseClick(width/2-createCanvasOfInputArea/2, height/2-createCanvasOfInputArea/2+createCanvasOfInputArea/2, createCanvasOfInputArea/2, createCanvasOfInputArea/2)) //check if click in left button
  {
    if (currentLetter == '_' ) //wrap around to z
      currentLetter = 'z';
   else
    currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) - 1);
  }

  if (didMouseClick(width/2-createCanvasOfInputArea/2+createCanvasOfInputArea/2, height/2-createCanvasOfInputArea/2+createCanvasOfInputArea/2, createCanvasOfInputArea/2, createCanvasOfInputArea/2)) //check if click in right button
  {

    if (currentLetter== 'z') //wrap back to space (aka underscore)
      currentLetter = '_';
   else
    currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
  }

  if (didMouseClick(width/2-createCanvasOfInputArea/2, height/2-createCanvasOfInputArea/2, createCanvasOfInputArea, createCanvasOfInputArea/2)) //check if click occured in letter area
  {
    if (currentLetter=='_') //if underscore, consider that a space bar
      currentTyped = currentTyped + " ";
    else if (currentLetter=='`' & currentTyped.length>0) //if `, treat that as a delete command
      currentTyped = currentTyped.substring(0, currentTyped.length-1);
    else if (currentLetter!='`') //if not any of the above cases, add the current letter to the typed string
      currentTyped = currentTyped + currentLetter;
  }

  //You are allowed to have a next button outside the 1" area
  if (didMouseClick(600, 600, 200, 200)) //check if click is in next button
  {
    nextTrial(); //if so, advance to next trial
  }

}


function nextTrial()
{
  if (currTrialNum >= totalTrialNum) //check to see if experiment is done
    return; //if so, just return

  if (startTime!=0 && finishTime==0) //in the middle of trials
  {
    console.log("==================");
    console.log("Phrase " + (currTrialNum+1) + " of " + totalTrialNum); //output
    console.log("Target phrase: " + currentPhrase); //output
    console.log("Phrase length: " + currentPhrase.length); //output
    console.log("User typed: " + currentTyped); //output
    console.log("User typed length: " + currentTyped.length); //output
    console.log("Number of errors: " + computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim())); //trim whitespace and compute errors
    console.log("Time taken on this trial: " + (millis()-lastTime)); //output
    console.log("Time taken since beginning: " + (millis()-startTime)); //output
    console.log("==================");
    lettersExpectedTotal+=currentPhrase.length;
    lettersEnteredTotal+=currentTyped.length;
    errorsTotal+=computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim());
  }

  //probably shouldn't need to modify any of this output / penalty code.
  if (currTrialNum == totalTrialNum-1) //check to see if experiment just finished
  {
    finishTime = millis();
    console.log("==================");
    console.log("Trials complete!"); //output
    console.log("Total time taken: " + (finishTime - startTime)); //output
    console.log("Total letters entered: " + lettersEnteredTotal); //output
    console.log("Total letters expected: " + lettersExpectedTotal); //output
    console.log("Total errors entered: " + errorsTotal); //output
    let wpm = (lettersEnteredTotal/5.0)/((finishTime - startTime)/60000); //FYI - 60K is number of milliseconds in minute
    console.log("Raw WPM: " + wpm); //output
    let freebieErrors = lettersExpectedTotal*.05; //no penalty if errors are under 5% of chars
    console.log("Freebie errors: " + nf(freebieErrors,1,3)); //output
    let penalty = max(errorsTotal-freebieErrors, 0) * .5;
    console.log("Penalty: " + penalty,0,3);
    console.log("WPM w/ penalty: " + (wpm-penalty)); //yes, minus, becuase higher WPM is better
    console.log("==================");
    currTrialNum++; //increment by one so this message only appears once when all trials are done
    return;
  }

  if (startTime==0) //first trial starting now
  {
    console.log("Trials beginning! Starting timer..."); //output we're done
    startTime = millis(); //start the timer!
  } 
  else
  {
    currTrialNum++; //increment trial number
  }

  lastTime = millis(); //record the time of when this trial ended
  currentTyped = ""; //clear what is currently typed preparing for next trial
  currentPhrase = phrases[currTrialNum]; // load the next phrase!
  //currentPhrase = "abc"; // uncomment this to override the test phrase (useful for debugging)
}




