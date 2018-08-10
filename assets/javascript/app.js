// javascript (Spoontacular Food API)

var database = firebase.database();   // variable for access firebase
var userPantry = [];    // array to hold food supplies in user's pantry

function getPantry() {
    var newFBitem;  // get newly added item from Firebas
    database.ref("/Pantry").on("child_added", function (snapshot) {
        newFBitem = snapshot.val().inventoryItem;
        userPantry.push(newFBitem);
        $("#pantry-list").append(newFBitem + "<br>");
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

$(document).ready(function () {
    getPantry();
});

$("#submit").click(addInvetory);

$("#pantry-input").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        addInvetory(event);
    }
});


/**
 * Find recipes based on inventory items
 */

function getInvetoryBasedRecipes() {
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
    var titleSpan = $("<span>").text(recipe.title);
    var ingredientsUsedSpan = $("<span>").text("Ingredients Used: " + recipe.usedIngredientCount);
    var missedIngredientsSpan = $("<span>").text("Missed Ingredients: " + recipe.missedIngredientCount);
    var likesSpan = $("<span>").text("Likes: " + recipe.likes);
    
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
    getInvetoryBasedRecipes()
        .then(populateRecipes);
});

$("#shopping-list").click(function() {
    getRecipeList(id)
        .then(populateList);
});
