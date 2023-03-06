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
		const token = crypto.randomInt(1, 1000000000).toString() ;

		// Set token for user in database
    user.token = token ;
    await user.save() ;

		// Respond with the token for the client
		res.send({token}) ;
	}
}

// Authorization
export async function authCheck(req, res, next) {
	// Get token from headers
	const token = req.headers["token"] ;

	// Get token from database
	const user = await User.findOne({token}) ;

	if (user) next() ; // (token okay so continue processing)
	else {
		res.sendStatus(403) ; // (no matching record for this token so return error)
	}
} ;