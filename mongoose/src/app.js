const mongoose=require("mongoose");

//Connection Creation->
// mongoose.connect("mongodb://localhost:27017/ptWebDev",{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(()=>console.log("Connection Successfull!"))
// .catch((err)=>console.log(err));

//New way->if ptmongoose is there it will connect it else it will create it and then connect it...
mongoose.connect("mongodb://0.0.0.0:27017/ptmongoose")
.then(()=>console.log("Connection Successfull!"))
.catch((err)=>console.log(err));

// Schema->
// A mongoose schema defines the structure of the document,default values,validators etc.

// here playlist p is small as it is not a class(general convention)
const playlistSchema=new mongoose.Schema({
    name:{
        type:String,
        // Validation ->
        required:true,
        // unique:true, // It is not a validator like required,lowercase etc...
        lowercase:true, // It will saved name in lowercase instead of what we have written
        // uppercase:true, // It will saved name in uppercase instead of what we have written
        trim:true, // When inserting document name-> [   mongo db    ] becomes [mongo db]
        minlength:[2,"Minimum 2 letters"],
        maxlength:30,
    },
    ctype:{
        type:String,
        required:true,
        lowercase:true,
        enum:["frontend","backend","database"], // It means ctype should only be equal to any of the enum values...
    },
    // Custom validator used here->
    videos:{
        type:Number,
        // validate(value){ // value is inputed data that we are inserting...
        //     if(value<0){
        //         throw new Error("Videos count can't be less than zero!")
        //     }
        // }
        // Use above or below (same)
        validate:{
            validator:function(value){
                return value<0
            },
            message:"Videos count can't be less than zero!"
        }

    },
    author:String,
    /* 
    npm i validator -> docs at npm website ->search validator...then->
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid!");
            }
        }
    }
     */
    active:Boolean,
    date:{
        type:Date,
        default:Date.now
    }
})

// A mongoose modal is a wrapper on the mongoose schema.
// A mongoose modal provides an interface to the database for creating,quering,updating,deleting etc...  
//i.d creating collections,documents etc...

// here playlist p is Large as it is a class(general convention)
// Write first argument in model as collection name singular as it will save Playlist as Playlists...
// Creating collection->
const Playlist=new mongoose.model("Playlist",playlistSchema);

// Creating document or insert-> without async function that used below...
// const reactPlaylist=new Playlist({
//     name:"React Js",
//     ctype:"Frontend",
//     videos:80,
//     author:"P.T.",
//     active:true,
    // date: No need default provided(so optional here...)
// })

// Below line will return promise object which take some time to store data to database but will save data.
// reactPlaylist.save();

// So, using await to wait until saved and store data...
// const result=await reactPlaylist.save();
// It will work inside aync function now...it will save data faster...

/* Creating single document->
const createDocument = async()=>{
    try{
    const reactPlaylist=new Playlist({
        name:"React Js",
        ctype:"Frontend",
        videos:80,
        author:"P.T.",
        active:true,
    })

    const result=await reactPlaylist.save();
    console.log(result);
    }catch(err){
        console.log(err);
    }finally{
        console.log("Done!");
    }
}

createDocument(); //calling async function

*/


//Creating multiple documents->

const createDocument = async()=>{
    try{
    const cssPlaylist=new Playlist({
        name:"CSS",
        ctype:"Frontend",
        videos:90,
        author:"P.T.",
        active:true,
        // date: No need default provided(so optional here...)
    })

     const nodePlaylist=new Playlist({
        name:"Node Js",
        ctype:"Backend",
        videos:100,
        author:"P.T.",
        active:true,
    })

     const mongoPlaylist=new Playlist({
        name:"Mongodb",
        ctype:"Database",
        videos:60,
        author:"P.T.",
        active:true,
    })

    // Here Playlist is modal class which has insertMany() function.
    const result=await Playlist.insertMany([cssPlaylist,nodePlaylist,mongoPlaylist]);
    console.log(result);
    }catch(err){
        console.log(err);
    }finally{
        console.log("Done!");
    }
}

// createDocument(); //used to insert data above

// Reading and quering data->

const getDocument=async()=>{
    // const result=await Playlist.find();
    // const result=await Playlist.find({ctype:"Frontend"});
    const result=await Playlist
    // .find({ctype:"Frontend"})
    // .find({videos:{$gt:80}})
    // .find({ctype:{$in:["Backend","Database"]}})
    // .find({ctype:{$nin:["Backend","Database"]}})
    .find({$or:[{ctype:"Backend"},{author:"P.T."}]})
    .select({name:1})
    // .countDocuments();
    .sort("name : 1"); // after name and colon space is important...
    /* 
    sort() -> saved order
    sort("name:1")-> 1 means ascending order  by name
    */
    // .limit(1);
    console.log(result);
}

// getDocument();

/* 
Comparison Query Operators->
$eq
$gt
$gte
$in
$lt
$lte
$ne
$nin
The $eq operator has the following form:
{ <field>: { $eq: <value> } }
link-> https://www.mongodb.com/docs/manual/reference/operator/

The  $or operator has the following syntax:

{ $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }

Other query methods available at docs...
*/

// Updating the document->

const updateDocument=async(_id)=>{
    try{
        const result=await Playlist.updateOne({_id},{ // updateOne will not show data after modify in console...
        // const result=await Playlist.findByIdAndUpdate({_id},{ -> it will show data after modified
            $set:{
                name:"Mongodb"
            }
        },{
            new:true, // optional here...
        });
        console.log(result);
    }catch(err){
        console.log(err);
    }
}

// updateDocument("6579745c3625e6b354e03ba4");

// Delete the document->

const deleteDocument=async(_id)=>{
    try{
        const result=await Playlist.deleteOne({_id});
        console.log(result);
    }catch(err){
        console.log(err);
    }
}

// deleteDocument("657aa766712ef25720e05978");