'use strict';
// Load Environment Variables from the .env file
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
// API Routes
app.get('/', (request, response) => {
    response.status(200).send('Home Page!');
});
app.get('/bad', (request, response) => {
    throw new Error('oh nooooo!');
});

app.get('/location', (request, response) => {
    try {
        const geoData = require('./data/geo.json');
        // console.log("query:", request.query.city );
        const city = request.query.city;
        const locationData = new Location(city, geoData);
        response.status(200).json(locationData);
    } catch (error) {
        errorHandler(error, request, response);
    }

});



app.get('/weather', (request, response) => {

    try {
        const darkSkyData = require('./data/darksky.json');
        // console.log(darkSkyData.data[0].length);
        darkSkyData.data.forEach((element) => {
            new Weather(element)
        })
        response.status(200).json(Weather.all);
    } catch (error) {
        errorHandler(error, request, response);
    }

});

app.use('*', notFoundHandler);

Weather.all = [];

function Weather(element) {

    this.forecast = element.weather.description;
    this.time = new Date(element.valid_date).toString().slice(0, 15);
    Weather.all.push(this);

}

function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}
// HELPER FUNCTIONS
function notFoundHandler(request, response) {
    response.status(404).send('NOT FOUND!!');
}

function errorHandler(error, request, response) {
    response.status(500).send({ 'Status': "500", "responseText": 'sorry something went wrong' });
}
// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`the server is up and running on ${PORT}`));