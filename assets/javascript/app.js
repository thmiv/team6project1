// Firebase setup
var database = firebase.database();   // variable for access firebase
var userPantry = [];    // array to hold food supplies in user's pantry


/*****************************************
 * Pantry Section
 ****************************************/

function getPantry() {
    $("#pantry-list").empty();
    userPantry = [];
    var newFBitem;  // get newly added item from Firebase

    database.ref("/Pantry").on("child_added", function (snapshot) {
        var itemAppend = ""; // variable to hold item's HTML
        newFBitem = snapshot.val().inventoryItem;
        pantryItemId = snapshot.key;
        //console.log(pantryItemId);
        userPantry.push(newFBitem);
        itemAppend += "<div class='pantry-entry'>" + newFBitem + "&nbsp;";
        itemAppend += "<button type='button' class='btn btn-danger btn-sm' id='" + pantryItemId + "'>X</button></div><br>";
        $("#pantry-list").append(itemAppend);
    });

    console.log(userPantry);
}

function removePantryItem() {
    //console.log("Click");
    var foodItemID = $(this).attr("id");
    //console.log(foodItemID);
    database.ref("/Pantry").child(foodItemID).remove();
    getPantry();
}

function addInventory(event) {
    event.preventDefault();
    var addPantryItem = $("#pantry-input").val().trim();
    var validInput = /\w/.test(addPantryItem);
    if (validInput) {
        database.ref("/Pantry").push({
            inventoryItem: addPantryItem
        });
        $("#pantry-input").val("");
    }
    getPantry();
}

/*****************************************
 * End Pantry Section
 ****************************************/


/*****************************************
 * Recipes Section
 ****************************************/

 // Get recipes based on your kitchen inventory
function getInventoryBasedRecipes() {
    var ingredientsList = userPantry.join(",");
    console.log(ingredientsList);

    var queryUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?";
    
    queryUrl += $.param({
        fillIngredients: false,
        ingredients: ingredientsList,
        limitLicense: false,
        number: 5,
        ranking: 1
    });
    
    return $.ajax({
        method: "GET",
        url: queryUrl,
        headers: {
            "X-Mashape-Key": mashapeKey,
            "Accept": "application/json"
        }
    });
}

function populateRecipes(response) {
    response.forEach(renderRecipe);
}

function renderRecipe(recipe) {
    /**
    * <div data-id="recipe id">
    *  <img src="image url">
    *  <span>"Recipe Title"</span>
    *  <span>"Ingredients Used"</span>
    *  <span>"Missed Ingredients"</span>
    *  <span>"Likes"</span>
    * </div>
    */

   var recipeDiv= $("<div>")
       .attr("class", "recipeBox");

   var recipeImg = $("<img>")
       .attr("data-id", recipe.id)
       .attr("src", recipe.image)
       .attr("alt", "Recipe Image")
       .attr("class", "recipeImage");

   var recipeInfoDiv = $("<div>")
       .attr("class", "recipeInfo");

   var titleSpan = $("<h5>")
        .text(recipe.title)
        .attr("class", "text-center"); // Centers the title font
   var ingredientsUsedSpan = $("<p>").text("Ingredients Used: " + recipe.usedIngredientCount);
   var missedIngredientsSpan = $("<p>").text("Missed Ingredients: " + recipe.missedIngredientCount);
   var likesSpan = $("<p>").text("Likes: " + recipe.likes);
   

   recipeInfoDiv
       .append(titleSpan)
       .append(ingredientsUsedSpan)
       .append(missedIngredientsSpan)
       .append(likesSpan);
   
   recipeDiv
       .append(recipeImg)
       .append(recipeInfoDiv);

   $("#recipes-list").append(recipeDiv);
}

/*****************************************
 * End Recipes Section
 ****************************************/

/*****************************************
 * Shopping List Section
 ****************************************/

// Generate a list from a given recipe id
function getShoppingListFromRecipe(id){
    console.log(id);
    var queryUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + id + "/information?includeNutrition=false";

    return $.ajax({
        url: queryUrl,
        method: "GET",
        headers: {
            "X-Mashape-Key": mashapeKey,
            "Accept": "application/json"
        }
    });
}

function populateShoppingList(response){
    $("#shopping-list").empty();
    response.extendedIngredients.forEach(renderListItem);
}

function renderListItem(item){
    var ingredientDiv = $("<div>");
    var ingredientP = $("<p>").text(item.name);
    
    ingredientDiv.append(ingredientP);
    $("#shopping-list").append(ingredientDiv);
}

/****************************************
 * End Shopping List Section
 ***************************************/


 /****************************************
 * Listeners Section
 ***************************************/

// When the document loads, get the kitchen inventory items
// from firebase and display them on the pantry section
$(document).ready(function () {
    getPantry();
});

// Add item to pantry via submit button
$("#submit").click(addInventory);

// removes pantry item on click of its button
$("#pantry-list").on("click", ".btn", removePantryItem);    

// Add inventory item by pressing enter on the text area
$("#pantry-input").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        addInventory(event);
    }
});

// Return a mocked API response from Spoonacular
// (For testing purposes and not exceeding quotas)
$("#get-fake-recipe").click(function() {
    mockRecipes.forEach(renderRecipe);
});

// Get recipes based on inventory items
// by clicking on the Add Pantry Item button
$("#getRecipe").click(function() {
    getInvetoryBasedRecipes()
        .then(populateRecipes);
});

// Generate a shopping list when you click on a recipe
$(document).on("click", ".recipeImage", function(){
    console.log("recipeClicked");
    var id = $(this).attr("data-id");
    getShoppingListFromRecipe(id)
        .then(populateShoppingList);
});

/****************************************
 * End Listeners Section
 ***************************************/
