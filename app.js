// var users.json = require('./users.json');
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

	parse = JSON.parse(data);



	
	// route 1: renders a page that displays all your users.

	app.get('/', function(request, response) {
	response.render('index', {
			users: parse
		});
	});

	// route 2: renders a page that displays a form which is your search bar.

	app.get('/search', function(request, response) {
		response.render('search');
	});

	// route 3: takes in the post request from your form, then displays matching users on a new page. Users should be matched based on whether either their first or last name contains the input string.

	app.post('/search', function(request, response) {
		const userInput = request.body.searchQuery;
		console.log('userInput');
		console.log(userInput);

		//mock data -- needs to be real at some point
		const matchedUsers = [{
			firstname: "Placeholder Dude",
			lastname: "Placeholder lastname",
			email: "thisguyisfindable@placeholder.com"
		},
		{
			firstname: "Placeholder Dude2",
			lastname: "Placeholder lastname2",
			email: "thisguyisfindable@placeholder2.com"
		}];

		// 1. krijg pug file werkend met mock data		--- DONE
		// 2. comment de mock data (zodat het er niet meer is), zodat je kan beginnen aan stap 3
		// 3. match users en render dat als de echte data


		//response.render moet aan het eind blijven staan -- het mag niet in een for-loop
		response.render('searchResult', {
			users: matchedUsers
		})
	});


	// route 4: renders a page with three forms on it (first name, last name, and email) that allows you to add new users to the users.json file.
	// route 5: takes in the post request from the 'create user' form, then adds the user to the users.json file. Once that is complete, redirects to the route that displays all your users (from part 0).





});



const listener = app.listen(3000, () => {
	console.log('server had started at ', listener.address().port)
});
