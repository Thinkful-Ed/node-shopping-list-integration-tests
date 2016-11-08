// we're using a single, global state object
// in this app

var shoppingItemTemplate = (
  '<li>' +
    '<span class="shopping-item js-shopping-item"></span>' +
    '<div class="shopping-item-controls">' +
      '<button class="js-shopping-item-toggle">' +
        '<span class="button-label">check</span>' +
      '</button>' +
      '<button class="js-shopping-item-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);

var recipeTemplate = (
  '<h3 class="js-recipe-name"><h3>' +
  '<hr>' +
  '<ul class="js-recipe-ingredients">' +
  '</ul>'
);


var serverBase = '';
var RECIPES_URL = serverBase + '';
var SHOPPING_LIST_URL = serverBase + '';


function getAndDisplayRecipes() {
  console.log('Retrieving recipes')
  $.getJSON(RECIPES_URL, function(data) {
    console.log('Rendering recipes');
    debugger;
  });
}

function getAndDisplayShoppingList() {
  console.log('Retrieving shopping list');
  $.getJSON(SHOPPING_LIST_URL, function(data) {
    console.log('Rendering shopping list');
    debugger;
  });
}


function addRecipe(recipe) {
  console.log('Adding recipe: ' + recipe);
  $.post(RECIPES_URL, function(data) {
    getAndDisplayRecipes();
  });
}

function addShoppingItem(item) {
  console.log('Adding shopping item: ' + item);
  $.post(SHOPPING_LIST_URL, function(data) {
    getAndDisplayRecipes();
  });
}

function deleteRecipe(recipeId) {
  console.log('Deleting recipe `' + recipeId + '`');
  $.ajax({
    url: RECIPES_URL + '/' + recipeId,
    method: 'DELETE',
    success: getAndDisplayRecipes
  });
}

function deleteShoppingItem(itemId) {
  console.log('Deleting shopping ite `' + itemId + '`');
  $.ajax({
    url: SHOPPING_LIST_URL + '/' + itemId,
    method: 'DELETE',
    success: getAndDisplayShoppingList
  });
}


function updateRecipe(recipe) {
  console.log('Updating recipe `' + recipe.id + '`');
  $.ajax({
    url: RECIPES_URL + '/' + recipe.id,
    method: 'PUT',
    data: recipe,
    success: getAndDisplayRecipes
  });
}

function updateShoppingListitem(item) {
  console.log('Updating shopping list item `' + item.id + '`');
  $.ajax({
    url: SHOPPING_LIST_URL + '/' + item.id,
    method: 'PUT',
    data: item,
    success: getAndDisplayShoppingList
  });
}


function handleRecipeAdd() {

}

function handleShoppingListAdd() {

}

function handleRecipeDelete() {

}

function handleShoppingListDelete() {

}

function handleRecipeUpdate() {

}


function handleShoppingListUpdate() {

}

$(function() {
  getAndDisplayRecipes();
  getAndDisplayShoppingList();
  // handleRecipeAdd();
  // handleShoppingListAdd();
  // handleRecipeUpdate();
  // handleShoppingListUpdate();
  // handleRecipeDelete();
  // handleShoppingListDelete();
});