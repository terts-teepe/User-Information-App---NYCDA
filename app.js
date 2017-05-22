
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.set('views', 'views');
app.set('view engine', 'pug');

app.use('/', bodyParser()); //activates middleware of body-parser -- request.body is nu beschikbaar onder elke app.post
app.use('/', express.static('public'))

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
			if (parsedData[i].firstname+ " " + parsedData[i].lastname === userInput || parsedData[i].firstname === userInput || parsedData[i].lastname === userInput) {
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

	// route 6: Compares usersinput (typedIn) with the database and gives suggestion if it finds a mach.
	app.post('/suggestionfinder', (request, response) => {
		var sugg = "";
		var typedIn = request.body.typedIn;
		console.log(request.body.typedIn);
		// response.send('confirming, route works');

		for (i=0; i<parsedData.length; i++) {
			if (typedIn === parsedData[i].firstname.slice(0, typedIn.length) || typedIn === parsedData[i].lastname.slice(0, typedIn.length)) {
				sugg = parsedData[i].firstname + " " + parsedData[i].lastname
			}
		}

		response.send(sugg);
	});
});

const listener = app.listen(3000, () => {
	console.log('server had started at ', listener.address().port)
});
