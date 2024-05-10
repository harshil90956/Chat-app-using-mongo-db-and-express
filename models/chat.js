const mongoose = require('mongoose');

main().then(res => console.log("connection with db")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Twitter');

}

const chatSchema = new mongoose.Schema({
    from : {
        type : String,
        required: true,
    },
    msg:{
        type: String,
        max: 50,
    },
    to:{
        type:String,
        required:true,
    },
    created_at:{
        type: Date,
    }
  });

  const Chat = mongoose.model('Chat',chatSchema);

  module.exports=Chat;

  