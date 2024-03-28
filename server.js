const express = require('express');
const connectDB = require('./db/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());

app.get('/',(req,res)=>{
	const obj = {
		name:'james',
		email:"james@gmail.com"
	};
	res.json(obj);
});

/** This is Register Route Method */
app.post('/register',async (req,res,_next)=>{
	const {name,email,password} = req.body;

	if(!name || !email || !password){
		return res.status(400).json({message:'Invalid Data'})
	};
	try{
		let user = await User.findOne({email});
	if(user){
		return res.status(400).json({message:'User allready exitst'});
	};
	user = await new User({name,email,password});

	/** Password Hash Method Here */
	// const salt = await bcrypt.genSalt(10);
	// const hash = await bcrypt.hash(password,salt);
	// user.password = hash;
	/** End Password Method */

	await user.save();
	return res.status(201).json({message:'User Create Successfully',user});
	}catch(error) {
		_next(error);
	}
});

/** This is Login Route Method */
app.post('/login',async(req,res,next)=>{
	const {email, password} = req.body;
	try{
		const user = await User.findOne({email,password});
		if(!user){
			return res.status(400).json({messgae:'Invalid Credental'});
		};
		/**  
		 * jodu password hash korte hoy tahole nicer method hove
		 * //const isMatch = await bcrypt(password,user.password);
		 */
		
		const isMatch = await User({email, password});
		if(!isMatch){
			return res.status(400).json({message:'Invalid Credential'});
		};
		delete user._doc.password;
		return res.status(200).json({message:'Login Successfully',user});
	}catch(error){
		next(error);
	}
});

const url = `mongodb+srv://mongodbx:ZtuOFIp8wwL66inD@cluster0.q64w53r.mongodb.net/`;

connectDB(url).then(async()=>{
	console.log('Database Connected');
	app.listen(5000,()=>{
		console.log('i am listening on port 5000')
	})
})
.catch((e) => console.log(e));



//mongodb+srv://mongodbx:ZtuOFIp8wwL66inD@cluster0.q64w53r.mongodb.net/