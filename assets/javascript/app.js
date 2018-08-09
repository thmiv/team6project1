// javascript (Spoontacular Food API)

var database = firebase.database();   // variable for access firebase
var userPantry = [];    // array to hold food supplies in user's pantry
var userIngredients = [];    // array to hold ingredients inputed by user

function getPantry() {
    var newFBitem;  // get newly added item from Firebas
    database.ref("/Pantry").on("child_added", function(snapshot) {
        newFBitem = snapshot.val().addPantryItem;
        userPantry.push(newFBitem);
        $("#inv-list").append(newFBitem + "<br>");
    });
    
    console.log(userPantry);
}

$( document ).ready(function() {

    getPantry();

    $("#submit").on("click", function(event){
        event.preventDefault();
        var addPantryItem = $("#pantry-input").val().trim();
        database.ref("/Pantry").push({addPantryItem});
    });


});