// javascript (Spoontacular Food API)

var userPantry = [];    // array to hold food supplies in user's pantry
var userIngredients = [];    // array to hold ingredients inputed by user

function getPantry(addPantryItem) {
    userPantry.push(addPantryItem);
    console.log(userPantry);
}

$( document ).ready(function() {

    $("#submit").on("click", function(event){
        event.preventDefault();
        var newItem = $("#pantry-input").val().trim();
        getPantry(newItem);
    });


});