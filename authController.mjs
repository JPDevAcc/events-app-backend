import getUserModel from './models/user.mjs';
import crypto from "crypto" ;
import bcrypt from "bcryptjs";

// Authentication
export async function authenticate(req, res) {
	const User = getUserModel() ;
	const user = await User.findOne({username: req.body.username}) ;
	if (!user) res.status(401).send({message: "Invalid username / password"})
	else if (!bcrypt.compareSync(req.body.password, user.password)) {
		res.status(401).send({message: "Invalid username / password"})
	}
	else {
		// Get secure random tokens
		const token = crypto.randomBytes(16).toString('base64'); // (16 * 8 = 128 bits)
		const cookieToken = crypto.randomBytes(16).toString('base64');

		// Set tokens for user in database
    user.token = token ;
		user.cookieToken = cookieToken ;
    await user.save() ;

		// Set cookie
    const options = {
      maxAge: 1000 * 60 * 30, // 30 mins
      httpOnly: true, // No JS access
			secure: true,
			sameSite: 'none'
    }
    res.cookie('cookieToken', cookieToken, options)

		// Respond with the token (and the cookie)
		res.send({token}) ;
	}
}

// Authorization
export async function authCheck(req, res, next) {
	const User = getUserModel() ;
	const token = req.headers["token"] ; // Get token from headers
	const cookieToken = req.cookies.cookieToken ; // Get second token from cookie

	let ok = true ;

	// Ensure token isn't null
	if (!token) ok = false ;
	// Ensure token matches a user in the database
	if (ok)	{
		const user = await User.findOne({token}) ;
		if (!user) ok = false ;
	}

	// Ensure cookie isn't null
	if (!cookieToken) ok = false ;
	// Ensure cookie matches a user in the database
	if (ok)	{
		const user = await User.findOne({cookieToken}) ; // (could alternatively just compare with user.cookieToken from above if assuming no duplicates)
		if (!user) ok = false ;
	}

	if (ok) next() // (tokens okay so continue processing)
	else res.status(403).send() ; // (auth failed so respond with error)
}