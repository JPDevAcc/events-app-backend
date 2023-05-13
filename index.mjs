import { config } from "dotenv";
import express from "express";
import router from "./router.mjs" ;
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import { authenticate, authCheck } from "./authController.mjs";
import copyCollections from "./copyCollections.mjs";
import crypto from "crypto" ;

// Init dotenv
config() ;

// Express setup + middleware stack
const app = express() ;

// CORS
const corsOptions = {
  origin: true,
  credentials: true
};
app.use(cors(corsOptions));

// Other middleware
app.use(express.json()) ;
app.use(express.urlencoded({ extended: false })) ;
app.use(cookieParser()) ;

// Outer session for database isolation
// Note: We use this rather than IP address as it's a bit more reliable
// TODO: Add some kind of IP-based throttling as well?
app.use(async (req, res, next) => {
	if (req.cookies.outerSession) global.userCollectionsPrefix = req.cookies.outerSession ;
	else {
		global.userCollectionsPrefix = crypto.randomBytes(16).toString('base64');
		 const options = {
      httpOnly: true, // No JS access
			secure: true,
			sameSite: 'none'
    }
		res.cookie('outerSession', global.userCollectionsPrefix, options)
	}
	await copyCollections() ;
	next() ;
}) ;

 // Authentication and authorization-check
app.post("/auth", authenticate) ;
app.use(authCheck) ;

// Routes
app.use(router) ;

// Connect to DB
mongoose.connect(process.env.DBURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}) ;

// Database event handling
const db = mongoose.connection ;
db.on('error', console.error.bind(console, 'connection error:')) ; // Log connection errors
db.once('open', () => console.log("Database connected")) ; // Open the connection

// Listen for connections
const port = process.env.PORT || 3005 ;
app.listen(port, () => {
	console.log(`My app is listening on port: ${port}`) ;
 }) ;