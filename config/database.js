// connection setting of mongodb - just run mongod service in mongodb/bin folder
const mongoose = require("mongoose");
const dbURI = "mongodb://127.0.0.1:27017/UserDatabase"; // defualt connection string of mongo db

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10,
   useNewUrlParser: true 
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);


require("../models/user");