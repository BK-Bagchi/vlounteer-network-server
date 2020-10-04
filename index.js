require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g0cgl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.send('<h1>This is Volunteer Network Home page</h1>')
})

client.connect(err => {
    const volunteeringTypes = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_ONE}`)
    const registeredWorks = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_TWO}`)
    console.log("Database is connected")

    app.get('/volunteeringTypes', (req, res) => {
        volunteeringTypes.find({})
            .toArray((err, result) => res.send(result))
    })

    app.post('/registerVolunteerWork', (req, res) => {
        registeredWorks.insertOne(req.body)
            .then(result => res.send(result))
    })

    //Despite of being post method, it works for data read(get method)
    app.post('/seeVolunteerWork', (req, res) => {
        registeredWorks.find(req.body)
            .toArray((err, result) => res.send(result))
    })

    app.delete('/cancelVolunteering', (req, res) => {
        // const { id } = req.body
        registeredWorks.deleteOne({ _id: ObjectId(req.body.id) })
            .then(result => res.send(result))
    })

    app.get('/adminSeeAddEvents', (req, res) => {
        registeredWorks.find({})
            .toArray((err, result) => res.send(result))
    })

    app.post('/adminInsertEvent', (req, res) => {
        volunteeringTypes.insertOne(req.body)
            .then(result => res.send(result))
    })
});




app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running")
})