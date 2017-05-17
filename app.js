
const app = require('express')();
const fs = require('fs');
const bodyParser = require('body-parser');

app.set('views', 'views');
app.set('view engine', 'pug');
app.use('/', bodyParser()); //activates middleware of body-parser -- request.body is nu beschikbaar onder elke app.post

var parse = {}

fs.readFile('./users.json', 'utf-8', (err, data) => {

    if (err) {
        throw err;
    }

	let parsedData = JSON.parse(data);

	// route 1: renders a page that displays all your users.
	app.get('/', function(request, response) {
		response.render('index', {
				users: parsedData
			});
	});

	// route 2: renders a page that displays a form which is your search bar.
	app.get('/search', function(request, response) {
		response.render('search');
	});

	// route 3: takes in the post request from your form, then displays matching users on a new page. Users should be matched based on whether either their first or last name contains the input string.
	app.post('/search', function(request, response) {
		const userInput = request.body.searchQuery;
		const searchResult = [];

		console.log('userInput');
		console.log(userInput);

		for (let i = 0; i<parsedData.length; i++) {
			if (parsedData[i].firstname === userInput || parsedData[i].lastname === userInput) {
				searchResult.push(parsedData[i]);
			}
		}
		
		//response.render moet aan het eind blijven staan -- het mag niet in een for-loop
		response.render('searchResult', {
			users: searchResult
		})
	});

	// route 4: renders a page with three forms on it (first name, last name, and email) that allows you to add new users to the users.json file.
	app.get('/adduser', function(request, response) {

	// eerste data lezen uit post request
	// data toevoegen aan json file
	// json file terugschrijven (stringefy)
	// eventueel success page laten zien

	response.render('adduser');
	});

	// route 5: takes in the post request from the 'create user' form, then adds the user to the users.json file. Once that is complete, redirects to the route that displays all your users (from part 0).
	app.post('/adduser', function(request, response){
		const newUser = {
			firstname: request.body.firstname, 
			lastname: request.body.lastname, 
			email: request.body.email
		};
		console.log(newUser);
		parsedData.push(newUser); // Zorgen dat newUser wordt toegevoegd aan parsedData kan ook met parsedData.push(request.body)
		data = JSON.stringify(parsedData); //When sending data to a web server, the data has to be a string.

		fs.writeFile(__dirname + '/users.json', data, (err) => {
			if (err) throw err
				console.log('new user added: ' + newUser.firstname);
			})
			response.redirect('/')

	})
})

const listener = app.listen(3000, () => {
	console.log('server had started at ', listener.address().port)
});
