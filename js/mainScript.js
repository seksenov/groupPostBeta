
var app = angular.module('postItApp', []);

var idNum = 0;

app.controller('PostItController', function($scope) {
  
});


var client = new WindowsAzure.MobileServiceClient(
"https://grouppostbetadb.azure-mobile.net/",
"hyCoAnJjoajhcntTKrzmnBPJaxKCiw45"
);

var testTable=null;
testTable=client.getTable("testTable");

//getPostIts();

//var item = { text: "1: This is Static" };
//client.getTable("Item").insert(item);

//Select the clicked canvas
function selectCanvas(canvasID)
{
  //console.log(canvasID);
  //var ctx = document.getElementById(canvasID).getContext("2d");

  var cvs = document.getElementById(canvasID); //The canvas
  var cvsBack = cvs.style.background; //The canvas background
  var ctx = cvs.getContext("2d");

  var color = $( canvasID ).css( "background" );

  console.log(color);

  if(cvsBack == '#FFFF00')
  {
    cvs.background = '#FFFF99';
  }
  else
  {
    cvs.style.background = '#FFFF00';  
  }

}

/*
$(document).on('click', 'div', function () {
    alert(this.id);
});
*/

function selectDiv(divID)
{
  var initialColor = 'rgb(255, 255, 153)';
  var div = document.getElementById(divID);
  var backColor = div.style.backgroundColor;

  console.log(backColor);
  console.log(initialColor);

  if (backColor == initialColor){
    div.style.backgroundColor = '#FFFF00';
  }
  else{
    div.style.backgroundColor = '#FFFF99';
  }
}

function addPostIt ()
{
  var postMessage = document.getElementById("someInput").value;
  
  /* Uncoment this to post to the database

  var item = { PostItNote: document.getElementById("someInput").value};
  testTable.insert(item);

  */

  var div = document.createElement('div');
  div.id = "div" + idNum;
  div.className = "col-centered col-fixed postIt";
  //div.width = 300;
  //div.height = 300;
  idNum++;
  //Log the id of the newly created div to the console
  console.log(div.id);
  console.log(div.className);

  div.style.backgroundColor = '#FFFF99';

  //Add the div to the body and within the parent canvas div
  //document.body.appendChild(div); // adds the canvas to the body element
  document.getElementById('postItNotes').appendChild(div);

  div.addEventListener("click", function (e) { selectDiv(div.id); });

  //div.innerHTML = div.innerHTML + postMessage;

  var t=document.createTextNode(postMessage);
  div.appendChild(t);

  //Clear the value of the input field
  document.getElementById("someInput").value = '';

}

function addItem(isInit, postText)
{


    if(!isInit) {
      var postMessage = document.getElementById("someInput").value;
      var item = { PostItNote: document.getElementById("someInput").value};
      testTable.insert(item);
    }
    else{
      var postMessage = postText;
    }

    var canvas = document.createElement('canvas');
    canvas.id = "canvasStyle" + idNum;
    canvas.width = 300;
    canvas.height = 300;
    idNum += 1;
    console.log(canvas.id);

    document.body.appendChild(canvas); // adds the canvas to the body element
    document.getElementById('postItNotes').appendChild(canvas);

    //add an event listener to every canvas
    canvas.addEventListener("click", function (e) { selectCanvas(canvas.id); });

    
    var context=canvas.getContext("2d");
    var maxWidth = 300;
    var lineHeight = 35;
    var x = 5;
    var y = 35;
    context.font = 'bold 30px Comic Sans MS';
    context.fillStyle = '#333';

    wrapText(context, postMessage, x, y, maxWidth, lineHeight);

    //Clear the value of the input field
    document.getElementById("someInput").value = '';

    //$('#postItNotes').append(canvas);
}

//This function supports multi line text wrap within canvas
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  console.log("WORDS: " + words);

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth) {

      if (n>0)
      {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight; 
      }
      else
      {
        line = testLine;
      }
       

      //This is the extra checker if for a single word that is too long
      if (context.measureText(line).width > maxWidth) // && line.split(' ').cou)
      {
        console.log("This word: " + line + "is too long!!!!");
        var letters = line.split("");
        //console.log(letters);
        var word = '';
        //Do work here to figure out where to split the word
        for(var i=0; i < letters.length; i++) {

          var testWord = word + letters[i];
          var wordWidth = context.measureText(testWord).width;

          //console.log("This is the testWord width: " + wordWidth);

          if (wordWidth > (maxWidth-16) && i > 0) {
            word += "-";
            context.fillText(word, x, y);
            word = letters[i];
            y+= lineHeight;
          }
          else
          {
            word = testWord;
          }
        }
        line = word;
      }
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

//Function to have the Enter key post as well as clicking the button
$("#someInput").keyup(function(event){
  if(event.keyCode == 13){
    $("#postButton").click();
  }
});


//Read the DB and pull old PostITs
function getPostIts(){ 
  var query = testTable; //Give it column name
  console.log("GOT POST PostITs");
  //console.log("type of element: "+element);
  query.read().then(function (postIts) {
    for (var i = 0; i < postIts.length; i++) {
    console.log(postIts[i].PostItNote);
    addItem(true, postIts[i].PostItNote);
    }
  });
}

