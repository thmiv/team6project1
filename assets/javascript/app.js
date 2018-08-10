// javascript (Spoontacular Food API)

var database = firebase.database();   // variable for access firebase
var userPantry = [];    // array to hold food supplies in user's pantry

function getPantry() {
    var newFBitem;  // get newly added item from Firebas
    database.ref("/Pantry").on("child_added", function (snapshot) {
        newFBitem = snapshot.val().inventoryItem;
        pantryItemId = snapshot.key;
        userPantry.push(newFBitem);
        $("#pantry-list").append("<p>" + newFBitem + "</p><br>");
    });

    console.log(userPantry);
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
}

$(document).ready(function () {
    getPantry();
});

$("#submit").click(addInventory);

$("#pantry-input").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        addInventory(event);
    }
});


/**
 * Find recipes based on inventory items
 */

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
    var recipeDiv = $("<div>")
        .attr("data-id", recipe.id)
        .attr("class", "recipe");
    
    var recipeImg = $("<img>").attr("src", recipe.image);
    var titleSpan = $("<p>").text(recipe.title);
    var ingredientsUsedSpan = $("<p>").text("Ingredients Used: " + recipe.usedIngredientCount);
    var missedIngredientsSpan = $("<p>").text("Missed Ingredients: " + recipe.missedIngredientCount);
    var likesSpan = $("<p>").text("Likes: " + recipe.likes);
    
    recipeDiv
        .append(recipeImg)
        .append(titleSpan)
        .append(ingredientsUsedSpan)
        .append(missedIngredientsSpan)
        .append(likesSpan);
    
    $("#recipes-list").append(recipeDiv);
}


function populateRecipes(response) {
    response.forEach(renderRecipe);
}

function populateList(response) {
    // Distinguish ingredients we have in our pantry
    // and items that we need to buy

    // Display the items you need to buy
}

$("#getRecipe").click(function() {
    getInventoryBasedRecipes()
        .then(populateRecipes);
});

$("#shopping-list").click(function() {
    getRecipeList(id)
        .then(populateList);
});
