import express from 'express'
import mongoose from 'mongoose'

import { router } from './routes/accountRoutes.js'

import dotenv from 'dotenv'

if(process.env.PRD !== 'true')
  dotenv.config()

const app = express()
app.use(express.json())
app.use(router)

app.listen(3000, () => {
  console.log('API Server inited on port 3000')
})

const uri = `mongodb+srv://rodrigodonizettio:${process.env.PASSWORD}@igti-fullstack-module4-xcilv.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

const connectToDb = async () => {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(`Connected with Mongoose to DB: ${process.env.DB}`)
}

connectToDb()