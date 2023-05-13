import { config } from "dotenv";
import express from "express";
import router from "./router.mjs" ;
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import { authenticate, authCheck } from "./authController.mjs";
import copyCollections from "./copyCollections.mjs";

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

app.use(async (req, res, next) => {
	console.log("Request IP: ", req.ip) ;
	global.userCollectionsPrefix = req.ip ;
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