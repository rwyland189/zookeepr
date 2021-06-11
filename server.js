// require express
const express = require('express');

const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();

// create a route that the front-end can request data from
// start by requiring data here
const { animals } = require('./data/animals');

// get just the json you need by using this function
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array
        //if personalityTraits is a string, place it into a new and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }

        // loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Rememeber, it is initially a copy of the animalsArray, but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results
    return filteredResults;
}

// takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// now add the route to view animals json data
app.get('/api/animals', (req, res) => {
    let results = animals;
    // take a query parameter
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // and turn it into json
    res.json(results);
});

// a param route must come after the other GET route (above)
app.get('/api/animals/:id', (req, res) => {
    // return only a single animal using its id
    const result = findById(req.params.id, animals);

    if (result) {
        res.json(result);
    // make it clear to the user that what they're asking for doesn't exist
    } else {
        res.send(404);
    }
});

// listen for server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});