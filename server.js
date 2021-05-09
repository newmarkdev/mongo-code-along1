import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/animals'
mongoose.connect(mongoUrl, {userNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = Promise

const Animal = mongoose.model('Animal', {
  name: String,
  age: Number, 
  isFurry: Boolean,
})

Animal.deleteMany().then(() => {
  new Animal ({name: 'Alfons', age: 2, isFurry: true}).save()
  new Animal ({name: 'Ben', age: 5, isFurry: true}).save()
  new Animal ({name: 'Goldy Fish', age: 6, isFurry: false}).save()
  
}) 

// Start defining your routes here
app.get('/', (req, res) => {
  Animal.find().then(animals => {
    res.json(animals)
  })
})
// 2nd endpoint 
app.get('/:name', (req, res) => {
  Animal.findOne({name: req.params.name}).then(animal => {
    if (animal){
      res.json(animal)
    }else{
      res.status(404).json({error: 'Not Found'})
    }
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
