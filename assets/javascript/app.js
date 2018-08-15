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
    * <tr class="pantry-item">
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
    $("#recipes-list").empty();
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

$("#tcolor").hide();

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
    $("#recipes-list").empty();
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

    var btnTD = $("<td>")
        .html(removeBtn)
        .attr("data-item", key)
        .attr("class", "is-item-btn text-right");

    var fontawesomeTrash = $("<i>").attr("class", "fas fa-trash-alt");
    removeBtn.append(fontawesomeTrash);


    trEl
        .append(nameTd)
        .append(btnTD)

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
// Render recipes for manual input ----------------------------------------------------

function populateManRecipes(response) {
    $("#show-man-recipe").empty();
    response.forEach(renderManRecipe);
}

function renderManRecipe(recipe) {

    var recipeDiv= $("<div>")
        .attr("class", "recipeBox");
 
    var recipeImg = $("<img>")
        .attr("data-id", recipe.id)
        .attr("src", recipe.image)
        .attr("alt", "Recipe Image")
        .attr("class", "recipeImage")
        .attr("data-id", recipe.id);
 
    var recipeInfoDiv = $("<div>")
        .attr("class", "recipeInfo");
 
    var titleSpan = $("<h5>")
         .text(recipe.title)
         .attr("class", "text-center title"); // Centers the title font
    var ingredientsUsedSpan = $("<p>").text("Ingredients Used: " + recipe.usedIngredientCount);
    var missedIngredientsSpan = $("<p>").text("Missed Ingredients: " + recipe.missedIngredientCount);
    var likesSpan = $("<p>").text("Likes: " + recipe.likes);
    var buttonsDiv = $("<div>").css({"display": "flex", "justify-content": "center"});
    var viewRecipeBtn = $("<button>")
         .attr("data-id", recipe.id)
         .attr("data-target", "#recipe-modal")
         .attr("class", "view-recipe btn btn-success")
         .attr("type", "button")
         .text("View Recipe");
    
     var getShoppingListBtn = $("<button>")
         .attr("data-id", recipe.id)
         .attr("class", "get-shopping-list btn btn-primary")
         .attr("type", "button")
         .text("Shopping List");
 
     buttonsDiv
         .append(viewRecipeBtn)
         .append(getShoppingListBtn);
    
 
    recipeInfoDiv
        .append(titleSpan)
        .append(ingredientsUsedSpan)
        .append(missedIngredientsSpan)
        .append(likesSpan)
        .append(buttonsDiv);
    
    recipeDiv
        .append(recipeImg)
        .append(recipeInfoDiv);
 
    $("#show-man-recipe").append(recipeDiv);
 }

// --------------------------------------------------------------

function populateRecipes(response) {
    $("#recipes-list").empty();
    response.forEach(renderRecipe);
}

function renderRecipe(recipe) {

   var recipeDiv= $("<div>")
       .attr("class", "recipeBox");

   var recipeImg = $("<img>")
       .attr("data-id", recipe.id)
       .attr("src", recipe.image)
       .attr("alt", "Recipe Image")
       .attr("class", "recipeImage")
       .attr("data-id", recipe.id);

   var recipeInfoDiv = $("<div>")
       .attr("class", "recipeInfo");

   var titleSpan = $("<h5>")
        .text(recipe.title)
        .attr("class", "text-center title"); // Centers the title font
   var ingredientsUsedSpan = $("<p>").text("Ingredients Used: " + recipe.usedIngredientCount);
   var missedIngredientsSpan = $("<p>").text("Missed Ingredients: " + recipe.missedIngredientCount);
   var likesSpan = $("<p>").text("Likes: " + recipe.likes);
   var buttonsDiv = $("<div>").css({"display": "flex", "justify-content": "center"});
   var viewRecipeBtn = $("<button>")
        .attr("data-id", recipe.id)
        .attr("data-target", "#recipe-modal")
        .attr("class", "view-recipe btn btn-success")
        .attr("type", "button")
        .text("View Recipe");
   
    var getShoppingListBtn = $("<button>")
        .attr("data-id", recipe.id)
        .attr("class", "get-shopping-list btn btn-primary")
        .attr("type", "button")
        .text("Shopping List");

    buttonsDiv
        .append(viewRecipeBtn)
        .append(getShoppingListBtn);
   

   recipeInfoDiv
       .append(titleSpan)
       .append(ingredientsUsedSpan)
       .append(missedIngredientsSpan)
       .append(likesSpan)
       .append(buttonsDiv);
   
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
    

    // Cross reference our pantry to see what items we already have
    response.extendedIngredients.forEach(function(listIngredient) {
        
        var neededAmount;

        // Check if the shopping list item matches any of our pantry items
        var matchedIngredient = userPantry.find(function(pantryItem) {

            // keep track of how much we need to buy vs 
            // how much of that item we already have
            neededAmount = listIngredient.amount - pantryItem.itemQuantity;
            if (neededAmount < 0) {
                neededAmount = 0;
            }
            
            tokenizedListIngredient = listIngredient.name.toLowerCase().split(" ");
            tokenizedPantryItem = pantryItem.inventoryItem.toLowerCase().split(" ");
            
            var result = tokenizedListIngredient.filter(function(item) { 
                return tokenizedPantryItem.indexOf(item) > -1;
            });

            var hasMatch = (result.length >= 1);
            return hasMatch;
        });
        
        console.log(matchedIngredient, listIngredient);

        if (matchedIngredient > 0) {
            renderListItem(listIngredient, neededAmount);
        }

        if (!matchedIngredient) {
            renderListItem(listIngredient);
        }
    });
}

function renderListItem(item, amountValue){
    /**
    * <tr>
        <td id=pantryItem>carrots</td>
        <td id=itemQuantity>2</td>
        <td id=removeButton>TEST</td>
      </tr>
    */

   var amount = amountValue || item.measures.us.amount;
   var measure = item.measures.us.unitShort;

   var trEl = $("<tr>").attr("class", "shopping-list-item");

   var nameTd = $("<td>")
        .text(item.name)
        .attr("class", "item");

   var quantityTd = $("<td>")
        .text(amount.toString() + " " + measure)
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

function getIngredientImage(parseObject){
    var imageUrl = "";
    getIngredientParse(parseObject)
		.then(function(response){
			console.log(response);
            imageUrl = "https://spoonacular.com/cdn/ingredients_100x100/" + response[0].image;
            console.log(imageUrl);
            return imageUrl;
        });
}

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
    $("#recipes-list").empty();
    mockRecipes.forEach(renderRecipe);
});

// Get recipes based on inventory items
// by clicking on the Add Pantry Item button
$("#getRecipe").click(function() {
    $("#recipes-list").empty();
    getInventoryBasedRecipes()
        .then(populateRecipes);
});

// Generate a shopping list when you click on a recipe
$(document).on("click", ".get-shopping-list", function(){
    console.log("recipeClicked");
    var id = $(this).attr("data-id");
    getShoppingListFromRecipe(id)
        .then(populateShoppingList);
});

// Add recipe ingredient item by pressing enter on the text area
$("#recipe-input").keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) {
        $("#tcolor").show();
        addRecipeSearchItem(event);
    }
});

// Add recipe ingredient item by click
$(document).on("click", "#addRecipeItem", function(event){
    console.log("Add Clicked");
    $("#tcolor").show();
    addRecipeSearchItem(event);
});

// Clear recipe list array
$(document).on("click", "#clearRecipeList", function(event){
    console.log("Clear Clicked");
    recipeSearchItems = [];
    $("#recipe-input").val("");
    $("#tcolor").hide();
    addRecipeSearchItem(event);
});

// Search for recipes by manual input
$(document).on("click", "#searchRecipeList", function(){
    console.log("Search Clicked");
    $("#recipes-list").empty();
    //mockRecipes.forEach(renderManRecipe);
     getInputBasedRecipes()
     .then(populateManRecipes);
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

$(document).on("click", ".view-recipe", function() {
    $("#recipe-modal").modal("show");
    $("#recipe-modal-body").empty();

    var recipeId = $(this).attr("data-id");
    var queryUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + recipeId + "/information?includeNutrition=false";
    var recipeUrl;
    
    $.ajax({ 
        method: "GET", 
        url: queryUrl,
        headers: {
            "X-Mashape-Key": mashapeKey,
            "Accept": "application/json"
        }
    }).then(function(response) {
        recipeUrl = response.sourceUrl;
        var recipeIframe = $("<iframe>")
            .attr("src", recipeUrl)
            .attr("width", "550")
            .attr("height", "550")
            .css({ width: "100%" });
        $("#recipe-modal-body").append(recipeIframe);
    });
});
