 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyB8Bj_xxVtsVUJ6x_3lExJjWJLYEhctwa4",
    authDomain: "team6project1-utcb.firebaseapp.com",
    databaseURL: "https://team6project1-utcb.firebaseio.com",
    projectId: "team6project1-utcb",
    storageBucket: "",
    messagingSenderId: "403216771793"
};
firebase.initializeApp(config);

// Mashape Key
var mashapeKey = "vukyYrHPQrmsha2NRhe46UduOi0jp1cuAdWjsnuvAnizHqDZIh";

var mapsKey = "AIzaSyCVf591AZ-evHODFReCvcQ56eAJZecmLgc"

var mockRecipes = [
    {
        "id": 246459,
        "title": "Indonesian Fried Rice",
        "image": "https://spoonacular.com/recipeImages/246459-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 4,
        "missedIngredientCount": 3,
        "likes": 1412
    },
    {
        "id": 11115,
        "title": "Stuffed Red Cabbage With Island Fragrance",
        "image": "https://spoonacular.com/recipeImages/11115-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 4,
        "missedIngredientCount": 7,
        "likes": 2
    },
    {
        "id": 94126,
        "title": "Savory Chicken Egg Rolls With Sweet and Sour Sauce",
        "image": "https://spoonacular.com/recipeImages/94126-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 4,
        "missedIngredientCount": 11,
        "likes": 1
    },
    {
        "id": 922256,
        "title": "Gochujang-Ranch Crispy Chicken Bowl",
        "image": "https://spoonacular.com/recipeImages/922256-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 4,
        "missedIngredientCount": 11,
        "likes": 0
    },
    {
        "id": 113806,
        "title": "chicken stir fry with frozen mixed vegetables",
        "image": "https://spoonacular.com/recipeImages/113806-312x231.jpg",
        "imageType": "jpg",
        "usedIngredientCount": 3,
        "missedIngredientCount": 1,
        "likes": 1
    }
];