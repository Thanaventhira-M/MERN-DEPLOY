const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json())
app.use(cors())

// app.get('/',(req,res)=>{
//     res.send("Hello world")
// });


//Creatring scheema;


const todoSchema = new mongoose.Schema({

    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    }
})

const todoModel = mongoose.model('Todo', todoSchema)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

// let todos = [];
app.post('/add', async (req, res) => {

    const { title, description } = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);

    try {
        const newTodo = todoModel({ title, description });
        await newTodo.save()
        res.status(200).json(newTodo);
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: err.message })

    }



})


app.get("/getAll", async (req, res) => {

    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }

})

app.put('/update/:id', async (req, res) => {
    try {

        const { title, description } = req.body;

        const id = req.params.id;

        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo Not Found" });
        }

        res.json(updatedTodo)
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: err.message })


    }


})


app.delete("/delete/:id",async(req,res)=>{
    try{
           const id = req.params.id;

    await todoModel.findByIdAndDelete(id);
    res.status(201).end()

    }catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
        

    }
 

})

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log("Server is Listening to port" + port);

})