// Firebase setup
var database = firebase.database();   // variable for access firebase
var userPantry = [];    // array to hold food supplies in user's pantry
var shoppingList = [];
var recipeSearchItems = [];

/*****************************************
 * Pantry Section
 ****************************************/

function addInventory(event) {
    event.preventDefault();
    var addPantryItem = $("#pantry-input").val().trim();
    var itemQuantity = $("#add-quantity-input").val().trim();
    
    var validName = /\w/.test(addPantryItem);
    var validQuantity= /\d/.test(itemQuantity);
    
    if (!validName){
        $("#pantry-input").val("");
        $("#pantry-input").css({border: "1px solid red"});
        $("#pantry-input").attr("placeholder", "Please enter an item");
    }
    
    if (!validQuantity){
        $("#add-quantity-input").val("");
        $("#add-quantity-input").css({border: "1px solid red"});
        $("#add-quantity-input").attr("placeholder", "enter a number");
    }
    
    if (validName && validQuantity) {
        $("#add-quantity-input").val("");
        $("#pantry-input").val("");
        
        database.ref("/Pantry").push({
            inventoryItem: addPantryItem,
            itemQuantity: itemQuantity
        });
        $("#pantry-input").val("");
    } 
}

function removePantryItem(snapshot) {
    console.log("remove pantry item");
    var foodItemID = $(this).attr("data-item");
    //console.log(foodItemID);
    database.ref("/Pantry").child(foodItemID).remove();
}

function renderPantryList(item, key) {
    /**
    * <tr>
        <td id=pantryItem>carrots</td>
        <td id=itemQuantity>2</td>
        <td id=removeButton>TEST</td>
      </tr>
    */

    var trEl = $("<tr>").attr("class", "pantry-item");

    var nameTd = $("<td>")
        .text(item.inventoryItem)
        .attr("class", "item");
    var quantityTd = $("<td>")
        .text(item.itemQuantity)
        .attr("class", "text-center");
    var removeTd = $("<td>")
        .attr("class", "text-right");

    var removeBtn = $("<button>")
        .attr("data-item", key)
        .attr("class", "delete-pantry-item");

    var fontawesomeTrash = $("<i>").attr("class", "fas fa-trash-alt");
    removeBtn.append(fontawesomeTrash);
    removeTd.append(removeBtn);


    trEl
        .append(nameTd)
        .append(quantityTd)
        .append(removeTd);

    $("#pantryList").append(trEl);
}

// If there is any changes to items on firebase,
// render the updated pantry list
database.ref("/Pantry").on("value", function(snapshot) {
    $("#pantryList").empty();
    userPantry = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        var key = childSnapshot.key;

        userPantry.push(item);
        renderPantryList(item, key);
    });
});

/*****************************************
 * End Pantry Section
 ****************************************/


/*****************************************
 * Recipes Section
 ****************************************/

 // Get recipes based on your kitchen inventory
function getInventoryBasedRecipes() {
    var ingredientsList = userPantry.map((item) => item.inventoryItem).join(",");
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

// search recipes by user manual input ---------------------
function addRecipeSearchItem(event) {
    event.preventDefault();
    $('#search-ingredients-list').empty();
    var addSearchItem = $("#recipe-input").val().trim();
    
    var validName = /\w/.test(addSearchItem);
    
    if (!validName){
        $("#recipe-input").val("");
        $("#recipe-input").css({border: "1px solid red"});
        $("#recipe-input").attr("placeholder", "Please enter an item");
    } else {
        $("#recipe-input").val("");
        recipeSearchItems.push(addSearchItem);
        console.log(recipeSearchItems);
    }
    for (i = 0; i < recipeSearchItems.length; i++){
        renderManualList(recipeSearchItems[i], i)
    }
}

function getInputBasedRecipes() {
    var ingredientsList2 = "";
    for (i = 0; i < recipeSearchItems.length; i++){
        ingredientsList2 += recipeSearchItems[i] + ","
    }
    console.log(ingredientsList2);

    var queryUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?";
    
    queryUrl += $.param({
        fillIngredients: false,
        ingredients: ingredientsList2,
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

// Manual search list generation --------------------------------------
function renderManualList(item, key) {

    var trEl = $("<tr>").attr("class", "search-item").attr("id", key);

    var nameTd = $("<td>")
        .text(item)
        .attr("class", "is-item")
        .attr("data-item", key);

    var removeBtn = $("<button>")
        .attr("data-item", key)
        .attr("class", "delete-search-item");

    var fontawesomeTrash = $("<i>").attr("class", "fas fa-trash-alt");
    removeBtn.append(fontawesomeTrash);


    trEl
        .append(nameTd)
        .append(removeBtn)

    $('#search-ingredients-list').append(trEl);
}

// Removal of item in manual search list -----------------------------
function removeSearchItem() {
    var searchItemID = $(this).attr("data-item");
    console.log(searchItemID);
    $("#"+searchItemID).remove();
    recipeSearchItems.splice(searchItemID, 1);
}

// Search for ingredient sub -------------------------------------------------------------
function getIngredientSub(ingredientFS) {

    var queryUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/substitutes?";
    
    queryUrl += $.param({
        ingredientName: ingredientFS
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

// Display substitution ingredients -------------------------------
function addSubSearchList(event) {
    event.preventDefault();
    $('#alternate-ingredients-list').empty();
    var addSubItem = $("#sub-input").val().trim();
    var validSubName = /\w/.test(addSubItem);
    
    if (!validSubName){
        $("#sub-input").val("");
        $("#sub-input").css({border: "1px solid red"});
        $("#sub-input").attr("placeholder", "Please enter an item");
    } else {
        $("#sub-input").val("");
        getIngredientSub(addSubItem)
            .then(function(response){
                console.log(response);
                console.log(response.status);
                if (response.status == "failure"){
                    $("#alternate-ingredients-list").append("Coud not find a substitute for that item.");
                } else {
                    response.substitutes.forEach(function(substitute){
                        var subTREL = $("<tr>").attr("class", "alternates");
                        var subTDEL = $("<td>").text(substitute);                 
                        subTREL
                            .append(subTDEL);
                        $("#alternate-ingredients-list").append(subTREL);
                    });
                }
            })
    }
}
// ---------------------------------------------------------------------------------------------------------

function populateRecipes(response) {
    response.forEach(renderRecipe);
}

function renderRecipe(recipe) {
    
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
        .attr("class", "text-center title"); // Centers the title font
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
    $("#shoppingList").empty();
    response.extendedIngredients.forEach(renderListItem);
}

function renderListItem(item){
    /**
    * <tr>
        <td id=pantryItem>carrots</td>
        <td id=itemQuantity>2</td>
        <td id=removeButton>TEST</td>
      </tr>
    */

   var amount = item.measures.us.amount;
   var measure = item.measures.us.unitShort;

   var trEl = $("<tr>").attr("class", "shopping-list-item");

   var nameTd = $("<td>")
        .text(item.name)
        .attr("class", "item");

   var quantityTd = $("<td>")
        .text(parseInt(amount) + " " + measure)
        .attr("class", "text-center");

   var removeTd = $("<td>")
        .attr("class", "text-right");

   var removeBtn = $("<button>")
       .attr("class", "delete-shopping-list-item");

   var fontawesomeTrash = $("<i>").attr("class", "fas fa-trash-alt");
   removeBtn.append(fontawesomeTrash);
   removeTd.append(removeBtn);


   trEl
       .append(nameTd)
       .append(quantityTd)
       .append(removeTd);

   $("#shoppingList").append(trEl);
}

/****************************************
 * End Shopping List Section
 ***************************************/

 /****************************************
 * Get Ingredient Images Section
 ***************************************/
/*
function getIngredientParse(ingredientItem) {

    var queryUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/parseIngredients?";
    
    queryUrl += $.param({
        includeNutrition: false,
        ingredientList: ingredientItem,
        servings: "1"
    });
        console.log("URL: " + queryUrl);
    return $.ajax({
        method: "POST",
        url: queryUrl,
        headers: {
            "X-Mashape-Key": mashapeKey,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }
    });
}
function getIngredientImage(response){
    console.log(response);
    console.log(response.image);
    var imageName = "iceberg-lettuce";
    var imageUrl = "https://spoonacular.com/cdn/ingredients_100x100/" + imageName + ".jpg";
    //console.log(imageUrl);
}
getIngredientImage(getIngredientParse("1 head of lettuce"));
*/
 /****************************************
 * End Ingredient Images Section
 ***************************************/

 /****************************************
 * Listeners Section
 ***************************************/

// When the document loads, get the kitchen inventory items
// from firebase and display them on the pantry section

// Add item to pantry via submit button
$("#addPantryItem").click(addInventory);

// removes pantry item on click of its button
$(document).on("click", ".delete-pantry-item", removePantryItem);    

// Add inventory item by pressing enter on the text area
$("#pantry-input").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        addInventory(event);
    }
});

$("#add-quantity-input").keypress(function (event) {
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
    getInventoryBasedRecipes()
        .then(populateRecipes);
});

// Generate a shopping list when you click on a recipe
$(document).on("click", ".recipeImage", function(){
    console.log("recipeClicked");
    var id = $(this).attr("data-id");
    getShoppingListFromRecipe(id)
        .then(populateShoppingList);
});

// Add recipe ingredient item by pressing enter on the text area
$("#recipe-input").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        addRecipeSearchItem(event);
    }
});

// Add recipe ingredient item by click
$(document).on("click", "#addRecipeItem", function(event){
    console.log("Add Clicked");
    addRecipeSearchItem(event);
});

// Clear recipe list array
$(document).on("click", "#clearRecipeList", function(event){
    console.log("Clear Clicked");
    recipeSearchItems = [];
    $("#recipe-input").val("");
    addRecipeSearchItem(event);
});

// Search for recipes by manual input
$(document).on("click", "#searchRecipeList", function(){
    console.log("Search Clicked");
    mockRecipes.forEach(renderRecipe);
    // getInputBasedRecipes()
    // .then(populateRecipes);
});

// Deletes manual search item
$(document).on("click", ".delete-search-item", removeSearchItem);

// Search for substitute ingredient on button click
$(document).on("click", "#searchForSub", function(event){
    console.log("Sub Search Clicked");
    addSubSearchList(event);
});
// Search for substitute ingredient on ENTER press
$("#sub-input").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        addSubSearchList(event);
    }
});

/****************************************
 * End Listeners Section
 ***************************************/
