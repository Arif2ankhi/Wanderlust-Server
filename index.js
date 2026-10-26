import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'


const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json());
//Code copied from MongoDB

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();

const db = mongoClient.db("wanderlust")
const  destinationCollection = db.collection("destination")
const bookingCollection= db.collection("bookings")



//Start to send  create and send data from backend

//add-destination form backend 
app.post('/add-destination', async(req, res) =>{
    const data = req.body
    const result = await destinationCollection.insertOne(data)

    console.log(result);
    res.send(result)

    //API- http://localhost:8000/add-destination

})

//destination in backend 

app.get('/destinations', async(req, res)=> {
    const result = await destinationCollection.find().toArray()
    res.send(result)

})

//destinations details (/: id/params)

app.get('/destination/:id', async(req, res)=>{
    const {id}= req.params
    const result = await destinationCollection.findOne({_id: new ObjectId(id)})
    
    res.send(result)
})


//Edit data in form 

app.patch('/destination/:id', async(req, res)=>{
    const  {id} = req.params
    const updatedData = req.body
    const result = await destinationCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set:updatedData}
    )
    res.json(result)
})

app.delete('/destination/:id', async (req, res)=>{
    const  {id} = req.params
    const result = await destinationCollection.deleteOne({_id: new ObjectId(id)})
    res.json(result)

})

// Bookings database collection  data from backend 


app.post('/booking', async(req, res)=>{
    const data = req.body
    const result = await bookingCollection.insertOne(data)
    res.send(result)
})

// Access with email check all destinatio book with this email
app.get('/my-bookings/:email', async(req, res)=> {
      const {email}= req.params
    const result = await bookingCollection.find({email: email}).toArray()
    
    res.send(result)
})



//http://localhost:8000/my-bookings

app.get('/', (req, res) =>{
    res.send({message: 'Server is running fine!'})
})


app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})






