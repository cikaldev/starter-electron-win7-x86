const fs = require('fs')
const path = require('path')
const cors = require('cors')
const express = require('express')
const PORT = process.env.PORT || 1945
const myapp = express()
const defaultRouter = require('./routes/default')

const corsOptions = {
  origin: `http://localhost:${PORT}`
}

myapp.use(cors(corsOptions))
myapp.use(express.json())
myapp.use(express.urlencoded({ extended: false }))
myapp.use(express.static(__dirname + '/public'))
myapp.disable('x-powered-by')
myapp.set('view engine', 'ejs')
myapp.set('views', __dirname + '/views')

myapp.use('/', defaultRouter)

myapp.get('*', (req, res) => {
  res.status(404).render('404')
})

myapp.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})