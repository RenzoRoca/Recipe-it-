'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/recipe-it', (err, res) => {

	if (err) {
		throw err;
	} else{
		console.log("La conexión a la base de datos está funcionando corectamente...");

		app.listen(port, function(){

			console.log("Servidor del api rest de recetas escuchando en http://localhost:"+port);
		});

	}
});