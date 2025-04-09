const express=require('express');
const router=express.Router();
const {jwtAuthMiddleware,generateToken} = require('../Middleware/jwt');
const User=require('../Models/user');





router.post('/signup', async(req,res) =>{

    try{

        const data=req.body;
        data.roal = (data.roal || '').toLowerCase();
         // Check if there is already an admin user
         const adminUser = await User.findOne({ roal: 'admin' });

        
         if (data.roal === 'admin' && adminUser) {
             return res.status(400).json({ error: 'Admin user already exists' });
         }
 
       
         // Validate Aadhar Card Number must have exactly 12 digit
         if(!/^\d{12}$/.test(data.aatharCardNumber)){
            return res.status(400).json({message:'athar card number must be 12 digites'});

         }

          // Check if a user with the same Aadhar Card Number already exists
        const exetUser=await User.findOne({aatharCardNumber:data.aatharCardNumber});
        if(exetUser){
            return res.status(400).json({message:'User with the same Aadhar Card Number already exists'})
        }

      
       
          // Create a new User document using the Mongoose model
          const newUser= new User(data);

           // Save the new user to the database
           const response=await newUser.save();
           console.log('data saved');
           

           const payload = {
            id: response.id
        }

        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        res.status(200).json({response: response, token: token});

    }catch(err){
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        }

});

//user login 
router.post('/login', async (req, res) => {
    try {
      const { aatharCardNumber, password } = req.body;
  
      // Find user by Aadhar number
      const user = await User.findOne({ aatharCardNumber });
  
      //  Check if user exists and password matches
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid Aadhar number or password' });
      }
  
      //  Create JWT payload
      const payload = {
        id: user._id,
        name: user.name,
        role: user.roal,
      };
  
      //  Generate JWT token
      const token = generateToken(payload); 
  
      // Respond with token and optional user info
      return res.json({
        message: 'Login successful',
        token,
        user: {
          name: user.name,
          role: user.roal,
          id: user._id,
        },
      });
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

//profile routes

router.get('/profile',jwtAuthMiddleware,async(req,res) => {

    try{
        const userData = req.user;
        const userId = userData.id;
        const user=await User.findById(userId);
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({error:'Internal Server Error'});
    }
})

//user admin chack


router.get('/exists', async (req, res) => {
    try {
      const admin = await User.findOne({ roal: 'admin' });
  
      if (admin) {
        return res.json({ exists: true });
      }
  
      res.json({ exists: false });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  




router.put('/password',jwtAuthMiddleware,async (req,res)=>{
   
try{

  const {aatharCardNumber,newPassword}=req.body;

  
if (!aatharCardNumber || !newPassword) {
  return res.status(400).json({ message: 'Missing Aadhar number or new password' });
}
   const user=await User.findOne({aatharCardNumber});

  

   
   if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }


   user.password=newPassword;
   await user.save();

   res.status(200).json({message:'Password changed successfully'});
  }
  catch(error){

    res.status(500).json({error:'Internal Server Error'}); 
  }



})




module.exports = router;
