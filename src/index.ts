import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan';

const app = express()

app.use(bodyParser.json())

app.use(morgan('tiny'))

app.listen(8000, () => {
  console.log('Listening on port 8000')
})