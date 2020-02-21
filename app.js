require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const movies = require('./resources/movies.json')

const app = express()

//MIDDLEWARE
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

//securityMiddleware
function securityMiddleware(req, res, next) {
    //check api key
    const apiKey = req.get('authorization')
    if(!apiKey || apiKey.split(' ')[1] !== process.env.API_KEY) {
        next( {status: '401', message: 'Unauthorized request' } )
    }
    next()
}

app.use(securityMiddleware)

//ENDPOINTS
//-> home
app.get('/', (req, res) => {
    res.send('Welcome to moviedex-api home')
})

//movie handler
function movieHandler(req, res) {
    let result = movies;
    const genre = req.query.genre;
    const country = req.query.country;
    const avg_vote = req.query.avg_vote;
    
    //filter movies by genre
    if(genre) {
        result = result.filter(movie => (
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        ))
    }

    //filter movies by country
    if(country) {
        result = result.filter(movie => (
            movie.country.toLowerCase().includes(country.toLowerCase())  
        ))
    }

    //filter movies by avg_vote
    if(avg_vote) {
        result = result.filter(movie => (
            movie.avg_vote >= parseFloat(avg_vote)
        ))
    }

    return res.json(result)
}

// -> /movie
app.get('/movie', securityMiddleware, movieHandler)

//error handling middleware
function errorHandler(error, req, res, next){
    let response
    if(process.env.NODE_ENV === 'production'){
        response = { error: { message: "server error" } }
    }
    else {
        response = { error }
    }
    res.status(500).json(response)
}
app.use(errorHandler)

module.exports = app