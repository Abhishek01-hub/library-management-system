const express = require('express');

const {users}=require('./data/users.json')
const {books}=require('./data/books.json')

//Importing Routers
const usersRouter=require('./routes/users.js')
const booksRouter=require('./routes/books.js')

const app=express();

const PORT=8001;

app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Home Page"
    })
})

app.use('/users',usersRouter);
app.use('/books',booksRouter);


app.use((req,res)=>{
    res.status(500).json({
        message:"Not Built Yet"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is up and running on http://localhost:${PORT}`)
})