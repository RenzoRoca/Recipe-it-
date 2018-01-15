'use strict'

var express = require('express');
var RecipeController = require('../controllers/recipe');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/recipes'});

api.get('/recipe/:id', md_auth.ensureAuth, RecipeController.getRecipe);
api.post('/recipe', md_auth.ensureAuth, RecipeController.saveRecipe);
api.get('/recipes/:page?', md_auth.ensureAuth, RecipeController.getAllRecipes);
api.get('/recipes-search/:title?', md_auth.ensureAuth, RecipeController.getRecipesByTitle);
api.put('/recipe/:id', md_auth.ensureAuth, RecipeController.updateRecipe);
api.delete('/recipe/:id', md_auth.ensureAuth, RecipeController.deleteRecipe);
api.post('/upload-image-recipe/:id', [md_auth.ensureAuth, md_upload], RecipeController.uploadImage);
api.get('/get-recipe-image/:imageFile', RecipeController.getImageFile);

module.exports = api;