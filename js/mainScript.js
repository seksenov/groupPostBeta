
var app = angular.module('postItApp', []);

var idNum = 0;

app.controller('PostItController', function($scope) {
  
});


var client = new WindowsAzure.MobileServiceClient(
"https://grouppostbetadb.azure-mobile.net/",
"hyCoAnJjoajhcntTKrzmnBPJaxKCiw45"
);

var userTable=null;
userTable=client.getTable("userTable");

//Get all the post it's from the DB and display them on the page
getPostIts();

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

function selectDiv(divID, buttonID)
{
  var initialColor = 'rgb(255, 255, 153)';
  var div = document.getElementById(divID);
  var backColor = div.style.backgroundColor;
  var button = document.getElementById(buttonID);

  console.log(backColor);
  console.log(initialColor);
  console.log(div.contentEditable);

  if (div.contentEditable === 'false'){
    div.style.backgroundColor = '#FFFF00';
    div.contentEditable = 'true';
    cursorManager.setEndOfContenteditable(div);
    div.focus();
    button.innerHTML = 'Post';
  }
  //This is what gets executed when the post button is hit
  else{
    console.log(div.innerHTML);
    //console.log(divID);
    var query = userTable;


    query.where({ PID: divID }).read().then(function (postIts) {
    //for (var i = 0; i < postIts.length; i++) {
    console.log(postIts[0].PostItNote);
    postIts[0].PostItNote = div.innerHTML;
    userTable.update(postIts[0]);
    //request.respond(200, postIts[0]);
    //console.log('updated position ok');
    //saddPostIt(true, postIts[i].PostItNote);
    
    });

    //userTable.select('PID')
    //.read({ success: function(results) { console.log(results) }});

    //userTable.where({ PID: divID})
    //.read({ success: function(results) { console.log("here got the right PID") }});

    //userTable.read

    /*
  userTable.where({PID: divID}).read({
    success: function(results) {
      console.log('here');
      console.log(results[0]);
      if (results.length > 0) {
        //We found a record, update some values in it
        results[0].PostItNote = div.innerHTML;
        //Update it in the DB
        userTable.update(results[0]);
        //Respond to the client
        request.respond(200, results[0]);
        console.log('updated position ok');

      } //else {
        //Perform the insert in the DB
        //request.execute();
        //console.log('Added New Entry',user.userId);
        //Reply with 201 (created) and the updated item
        //request.respond(201, item);
      //}
    }
  });
*/

    div.style.backgroundColor = '#FFFF99';
    div.contentEditable = 'false'; 
    button.innerHTML = 'Edit';
  }
}

function addPostIt (isInit, postText)
{

  if(!isInit) {
      var postMessage = document.getElementById("someInput").value
      var pid = "div" + idNum;
      var item = { PostItNote: document.getElementById("someInput").value, PID: pid};
      userTable.insert(item);
    }
    else{
      var postMessage = postText;
    }
  
  /* Uncoment this to post to the database

  var item = { PostItNote: document.getElementById("someInput").value};
  userTable.insert(item);

  */
  var dContainer = document.createElement('div');
  dContainer.id = "dc" + idNum;
  var dcID = "dc" + idNum;
  dContainer.className = "col-centered col-fixed postIt";

  //document.getElementById('postItNotes').appendChild(dContainer);

  //Insert the container as the first child of the div
  document.getElementById('postItNotes').insertBefore(dContainer, document.getElementById('postItNotes').firstChild);

  var div = document.createElement('div');
  div.id = "div" + idNum;
  div.className = "col-centered col-fixed postIt";
  div.contentEditable = 'false';

  //div.width = 300;
  //div.height = 300;
  
  //Log the id of the newly created div to the console
  console.log(div.id);
  console.log(div.className);

  div.style.backgroundColor = '#FFFF99';

  //Add the div to the body and within the parent canvas div
  //document.body.appendChild(div); // adds the canvas to the body element
  document.getElementById(dcID).appendChild(div);

  //div.addEventListener("click", function (e) { selectDiv(div.id); });



  //div.innerHTML = div.innerHTML + postMessage;

  var t=document.createTextNode(postMessage);
  div.appendChild(t);

  var button=document.createElement('button');
  //var bt=document.createTextNode("Edit");
  button.id = "editB" + idNum;
  button.className = 'editButton';
  //button.appendChild(bt);

  button.innerHTML ='Edit';

  button.addEventListener("click", function (e) { selectDiv(div.id, button.id); });

  dContainer.appendChild(button);

  //Clear the value of the input field
  document.getElementById("someInput").value = '';

  idNum++;

}

function addItem(isInit, postText)
{


    if(!isInit) {
      var postMessage = document.getElementById("someInput").value;
      var item = { PostItNote: document.getElementById("someInput").value};
      userTable.insert(item);
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
  var query = userTable; //Give it column name
  console.log("GOT POST PostITs");
  //console.log("type of element: "+element);
  //Retrieve the post it's in LIFO order
  query.read().then(function (postIts) {
    for (var i = 0; i < postIts.length; i++) {
    console.log(postIts[i].PostItNote);
    addPostIt(true, postIts[i].PostItNote);
    }
  });
}

//Namespace management idea from http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
(function( cursorManager ) {

    //From: http://www.w3.org/TR/html-markup/syntax.html#syntax-elements
    var voidNodeTags = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'KEYGEN', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR', 'BASEFONT', 'BGSOUND', 'FRAME', 'ISINDEX'];

    //From: http://stackoverflow.com/questions/237104/array-containsobj-in-javascript
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }

    //Basic idea from: http://stackoverflow.com/questions/19790442/test-if-an-element-can-contain-text
    function canContainText(node) {
        if(node.nodeType == 1) { //is an element node
            return !voidNodeTags.contains(node.nodeName);
        } else { //is not an element node
            return false;
        }
    };

    function getLastChildElement(el){
        var lc = el.lastChild;
        while(lc.nodeType != 1) {
            if(lc.previousSibling)
                lc = lc.previousSibling;
            else
                break;
        }
        return lc;
    }

    //Based on Nico Burns's answer
    cursorManager.setEndOfContenteditable = function(contentEditableElement)
    {

        while(getLastChildElement(contentEditableElement) &&
              canContainText(getLastChildElement(contentEditableElement))) {
            contentEditableElement = getLastChildElement(contentEditableElement);
        }

        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {    
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        { 
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }

}( window.cursorManager = window.cursorManager || {}));


