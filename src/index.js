const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mOverride = require('method-override');
const eSession = require('express-session');

//const eValidate = require('express-validation');
//Inicializaciones
const app = express();

app.set('port', process.env.PORT || 8080);
//Configura la ruta de views
app.set('views', path.join(__dirname, 'views'));
//Motor de la vista
app.engine('.hbs', exphbs({
defaultLayout: 'main',
layoutsDir: path.join(app.get('views'), 'layouts'),
partialDir: path.join(app.get('views'), 'partials'),
extname: '.hbs'
}));
app.set('view engine', '.hbs');


//Middlewares
app.use(express.urlencoded({extended: false}));

//app.use(mOverride('_method')); //Posiblemente eliminar
app.use(eSession({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/client'));

//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));


app.listen(app.get('port'), () => {
	console.log('Server on port ', app.get('port'));
})
