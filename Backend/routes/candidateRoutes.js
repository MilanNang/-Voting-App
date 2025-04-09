const express=require('express');
const router=express.Router();
const {jwtAuthMiddleware,generateToken} = require('../Middleware/jwt');
const CandidatData=require('../Models/Candidate');
const User=require('../Models/user');
const multer=require('multer');


const storage = multer.memoryStorage();
const upload=multer({storage: storage});

const chechuse= async(userId) =>{
    try {
        const user=await User.findById(userId);
        if(user.roal==='admin'){
            return true;
        }
    } catch (error) {
        return false;
    }
}

router.post('/add',jwtAuthMiddleware,upload.single('photo'), async(req,res) =>{
    try {
        
        const {name,age,party}= req.body;

        const potobase64=req.file?req.file.buffer.toString('base64'):null;

        if(!(await chechuse(req.user.id)))
            return res.status(401).json({message:'User is Not Admin'});

        const newCandidate=new CandidatData({
            name,
            age,
            party,
            image: potobase64,
        });

        const response=await newCandidate.save();
        console.log('data Save');
        res.status(200).json({response: response});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
});

// Update candidate by ID
router.put('/:id', jwtAuthMiddleware, upload.single('photo'), async (req, res) => {
    try {
      const candidateId = req.params.id;
      const { name, party } = req.body;
  
      // Ensure user is admin
      if (!(await chechuse(req.user.id))) {
        return res.status(401).json({ message: 'User is not admin' });
      }
  
      const updateData = { name, party };
  
      if (req.file) {
        updateData.image = req.file.buffer.toString('base64');
      }
  
      console.log("Updating candidate:", candidateId, updateData);
  
      const updatedCandidate = await CandidatData.findByIdAndUpdate(
        candidateId,
        updateData,
        { new: true } 
      );
  
      if (!updatedCandidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      res.status(200).json({ message: 'Candidate updated', candidate: updatedCandidate });
    } catch (err) {
      console.error("Update failed:", err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

router.delete('/:candidateId',upload.single('photo'),jwtAuthMiddleware,async(req,res)=>{
    try {
        
        if(!(await chechuse(req.user.id)))
            return res.status(401).json({message:'User is Not Admin'});

        const candidateId=req.params.candidateId;

        const response=await CandidatData.findByIdAndDelete(candidateId);

        if (!response) {
            return res.status(403).json({ error: 'Candidate not found' });
        }

        console.log('candidate data updated');
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/vote/:candidateId',jwtAuthMiddleware, async (req,res) => {
    const candidateId=req.params.candidateId;
    const userId=req.user.id;
    try {

        const candidate= await CandidatData.findById(candidateId);
        if(!candidate){
            return res.status(404).json({message:'Candidate not found'});
        }

        const user=await User.findById(userId);
       if(!user){
        return res.status(404).json({message:'User not found'});
       }

       if(user.roal==='admin'){
           return res.status(401).json({message:' Admin not alowed to vote'}); 
       }
       if(user.isVoted){
           return res.status(403).json({message:'User already voted'});
       }

        candidate.votes.push({user:userId});
        candidate.voteCounter++;

        user.isVoted=true;
        await user.save();
        await candidate.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
       


    } catch (error) {
        console.log(error);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});


// vote count 
router.get('/vote/count' ,async (req,res) => {
    try {
        const candidat= await CandidatData.find().sort({voteCounter:'desc'});

        const voteRecord=candidat.map((data) =>{
            return {
                name:data.name,
                party: data.party,
                count: data.voteCounter
            }
        }) ;

        return res.status(200).json(voteRecord);
      
    } catch (error) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => { 
    try {
      const candidates = await CandidatData.find();
  
      const modifiedCandidates = candidates.map(candidate => ({
        _id: candidate._id, 
        name: candidate.name,
        party: candidate.party,
        image: candidate.image.startsWith('data:image')
          ? candidate.image
          : `data:image/png;base64,${candidate.image}`
      }));
  
      res.status(200).json(modifiedCandidates);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  

module.exports = router;


