/*global require,process*/

const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');
// const { MongoClient,ServerApiVersion } = require('mongodb');
// console.log(process.env)
 


mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://ramashish62127:Root123@natour.qtju0v5.mongodb.net/?retryWrites=true&w=majority";

main().catch((err) => console.log("DataBase connnection error",err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("DB connection successfull!")
}



/* another way*************

// const uri =
// "mongodb+srv://ramashish62127:Root123@natour.qtju0v5.mongodb.net/?retryWrites=true&w=majority";

//  const client = new MongoClient(uri);
// async function run() {
//   try {
//    await client.connect();
   
    // database and collection code goes here
    // const db = client.db("natours");
    // const coll = db.collection("tours",{
    //   name:{
    //         type:String,
    //         required:[true,'A tour must have a name'],
    //         unique:true
    //       },
    //       orbitalPeriod:{
    //         type:Number,
    //         default:4.5
    //       },
    //       radius:{
    //         type:Number,
    //         required:[true,'A tour must have a price']
    //       }

    // });

    // insert code goes here
  //   const docs = [{
  //      name:'The Forest Hiker',
  //     rating:4.7,
  //     price:497
  //   },
  // {
  //   name:'The Park Camper',
  //   price:997
  // }];
    // const result = await coll.insertMany(docs);

    // display the results of your operation
//     console.log("Connected to db");
//     console.log(result.insertedId)

//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

****** */
   

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});









