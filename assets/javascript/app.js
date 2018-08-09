// javascript (Spoontacular Food API)

var database = firebase.database();   // variable for access firebase
var userPantry = [];    // array to hold food supplies in user's pantry
var userIngredients = [];    // array to hold ingredients inputed by user

function getPantry() {
    var newFBitem;  // get newly added item from Firebas
    database.ref("/Pantry").on("child_added", function(snapshot) {
        newFBitem = snapshot.val().inventoryItem;
        userPantry.push(newFBitem);
        $("#inv-list").append(newFBitem + "<br>");
    });
    
    console.log(userPantry);
}

function addInvetory(event) {
    event.preventDefault();
    var addPantryItem = $("#pantry-input").val().trim();
    var validInput = /\w/.test(addPantryItem);
    if (validInput) {
        database.ref("/Pantry").push({
            inventoryItem: addPantryItem
        });
        $("#pantry-input").val(""); 
    }  
}

$( document ).ready(function() {
    getPantry();
});

$("#submit").click( addInvetory );
    
$("#pantry-input").keypress( function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        addInvetory(event);  
    }   
});