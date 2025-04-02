const mongoose=require('mongoose');
const bcrypt = require('bcrypt');


const userSchema=new mongoose.Schema({

        name:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        mobile:{
            type:String
        },
        email:{
            type:String
        },
        address:{
            type:String
        },
        aatharCardNumber:{
            type:Number,
            required:true,
            unique:true
            
        },
        password:{
            type:String,
            required:true
        },
        roal:{
            type:String,
            enum:['admin','voter'],
            default:'voter'
        },
        isVoted:{
            type:Boolean,
            default:false
        }

})

userSchema.pre('save', async function(next) {
    const person = this;
    if(!person.isModified('password')) return next();
    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User=mongoose.model('User',userSchema);

module.exports=User;