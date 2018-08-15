var shoppingList = {"vegetarian":false,"vegan":false,"glutenFree":true,"dairyFree":true,"veryHealthy":false,"cheap":false,"veryPopular":false,"sustainable":false,"weightWatcherSmartPoints":7,"gaps":"no","lowFodmap":true,"ketogenic":false,"whole30":false,"preparationMinutes":45,"cookingMinutes":8,"sourceUrl":"http://www.food.com/recipe/chicken-stir-fry-w-frozen-mixed-vegetables-85208","spoonacularSourceUrl":"https://spoonacular.com/chicken-stir-fry-w-frozen-mixed-vegetables-113806","aggregateLikes":1,"spoonacularScore":52.0,"healthScore":14.0,"creditText":"Food.com","sourceName":"Food.com","pricePerServing":215.0,"extendedIngredients":[{"id":5062,"aisle":"Meat","image":"chicken-breasts.png","consitency":"solid","name":"boneless chicken breast","original":"1/2 lb cooked boneless chicken breast, cubed","originalString":"1/2 lb cooked boneless chicken breast, cubed","originalName":null,"amount":0.5,"unit":"lb","meta":["boneless","cubed","cooked"],"metaInformation":["boneless","cubed","cooked"],"measures":{"us":{"amount":0.5,"unitShort":"lb","unitLong":"pounds"},"metric":{"amount":226.796,"unitShort":"g","unitLong":"grams"}}},{"id":20041,"aisle":"Pasta and Rice","image":"rice-brown-cooked.png","consitency":"solid","name":"cooked brown rice","original":"3 cups cooked brown rice","originalString":"3 cups cooked brown rice","originalName":null,"amount":3.0,"unit":"cups","meta":["cooked"],"metaInformation":["cooked"],"measures":{"us":{"amount":3.0,"unitShort":"cups","unitLong":"cups"},"metric":{"amount":709.764,"unitShort":"g","unitLong":"grams"}}},{"id":1123,"aisle":"Milk, Eggs, Other Dairy","image":"egg.jpg","consitency":"solid","name":"egg","original":"1 egg, slightly beaten","originalString":"1 egg, slightly beaten","originalName":null,"amount":1.0,"unit":"","meta":["slightly beaten"],"metaInformation":["slightly beaten"],"measures":{"us":{"amount":1.0,"unitShort":"","unitLong":""},"metric":{"amount":1.0,"unitShort":"","unitLong":""}}},{"id":21052,"aisle":"Produce","image":"mixed-greens-or-mesclun.jpg","consitency":"solid","name":"leafy vegetables","original":"1 (16 ounce) package frozen mixed vegetables","originalString":"1 (16 ounce) package frozen mixed vegetables","originalName":null,"amount":16.0,"unit":"ounce","meta":["mixed","frozen"],"metaInformation":["mixed","frozen"],"measures":{"us":{"amount":16.0,"unitShort":"oz","unitLong":"ounces"},"metric":{"amount":453.592,"unitShort":"g","unitLong":"grams"}}},{"id":4053,"aisle":"Oil, Vinegar, Salad Dressing","image":"olive-oil.jpg","consitency":"liquid","name":"olive oil","original":"3 tablespoons olive oil","originalString":"3 tablespoons olive oil","originalName":null,"amount":3.0,"unit":"tablespoons","meta":[],"metaInformation":[],"measures":{"us":{"amount":3.0,"unitShort":"Tbsps","unitLong":"Tbsps"},"metric":{"amount":3.0,"unitShort":"Tbsps","unitLong":"Tbsps"}}},{"id":16124,"aisle":"Ethnic Foods;Condiments","image":"soy-sauce.jpg","consitency":"liquid","name":"soy sauce","original":"2 tablespoons soy sauce","originalString":"2 tablespoons soy sauce","originalName":null,"amount":2.0,"unit":"tablespoons","meta":[],"metaInformation":[],"measures":{"us":{"amount":2.0,"unitShort":"Tbsps","unitLong":"Tbsps"},"metric":{"amount":2.0,"unitShort":"Tbsps","unitLong":"Tbsps"}}},{"id":14412,"aisle":"Beverages","image":"water.jpg","consitency":"liquid","name":"water","original":"2 tablespoons water","originalString":"2 tablespoons water","originalName":null,"amount":2.0,"unit":"tablespoons","meta":[],"metaInformation":[],"measures":{"us":{"amount":2.0,"unitShort":"Tbsps","unitLong":"Tbsps"},"metric":{"amount":2.0,"unitShort":"Tbsps","unitLong":"Tbsps"}}}],"id":113806,"title":"chicken stir fry w/ frozen mixed vegetables","readyInMinutes":53,"servings":5,"image":"https://spoonacular.com/recipeImages/113806-556x370.jpg","imageType":"jpg","cuisines":[],"dishTypes":["lunch","main course","main dish","dinner"],"diets":["gluten free","dairy free","fodmap friendly"],"occasions":[],"winePairing":{"pairedWines":[],"pairingText":"","productMatches":[]},"instructions":null,"analyzedInstructions":[],"creditsText":"Food.com"};

var userPantry = [{
    inventoryItem: "eggs",
    itemQuantity: 2
}, {
    inventoryItem: "chicken",
    itemQuantity: 2
}, {
    inventoryItem: "cabbage",
    itemQuantity: 2
}, {
    inventoryItem: "chocolate",
    itemQuantity: 2
}];

var revisedShoppingList = [];

shoppingList.extendedIngredients.forEach(function(item) {
    var neededIngredients = userPantry.find(function(pantryItem) {
        return item.name.includes(pantryItem.inventoryItem);
    });
    console.log(neededIngredients);
    var amountNeeded = item.quantity;
    if (neededIngredients) {
        amountNeeded -= item.quantity 
    }

    if (amountNeeded > 0) {
        // add it to the list
        revisedShoppingList.push({
            neededIngredient: item.name,
            quantity: amountNeeded
        });
    }
});
