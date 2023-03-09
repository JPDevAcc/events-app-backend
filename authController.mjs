import User from './models/user.mjs';
import crypto from "crypto" ;

// Authentication
export async function authenticate(req, res) {
	const user = await User.findOne({username: req.body.username}) ;
	if (!user) res.status(401).send({message: "Invalid username / password"})
	else if (user.password !== req.body.password) {
		res.status(401).send({message: "Invalid username / password"})
	}
	else {
		// Get secure random token
		const token = crypto.randomBytes(16).toString('base64'); // (16 * 8 = 128 bits)

		// Set token for user in database
    user.token = token ;
    await user.save() ;

		// Respond with the token for the client
		res.send({token}) ;
	}
}

// Authorization
export async function authCheck(req, res, next) {
	let ok = false ;

	const token = req.headers["token"] ; // Get token from headers

	// TODO: !!!!! REMOVE THIS IN PRODUCTION !!!!!
	if (token === 'secret_bypass') ok = true ;
	
	// Ensure token isn't null and is in the database
	if (token) {
		const user = await User.findOne({token}) ;
		if (user) ok = true ;
	}

	if (ok) next() // (token okay so continue processing)
	else res.status(403).send() ; // (no matching record for this token so return error)
}