const mongoose=require('mongoose');



const CandidateSchema=new mongoose.Schema({

        name:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        party:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        votes:[
            {
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User',
                    required:true,

                },
                voteAt:{
                    type:Date,
                    default:Date.now()
                }
            }
        ],
        voteCounter:{
            type:Number,
            default:0
        }
      

})

const Candidate=mongoose.model('Candidate',CandidateSchema);

module.exports=Candidate;