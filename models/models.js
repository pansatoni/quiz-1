var path = require('path');

//POSTGRES DATABASE_URL = postgres://user:passwd@host:post/database
//SQLITE DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLITE o POSTGRES

var sequelize = new Sequelize (DB_name, user, pwd,
{
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage,
	omitNull: true
}
);

//Importar definición de tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Exportar definición de tabla Quiz
exports.Quiz = Quiz;

//sequelize.sync() crea e inicializa la tabla de preguntas en BBDD
sequelize.sync().then(function(){
	//success ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if (count===0){ //La tabla solo se inicializa si está vacía
			Quiz.create({
							pregunta: 'Capital de Italia',
							respuesta: 'Roma'
						});
			Quiz.create({
							pregunta: 'Capital de Portugal',
							respuesta: 'Lisboa'
						})
			.then(function(){console.log('Base de datos inicializada')})
		}
		else console.log('Base de datos existente');
	});
});