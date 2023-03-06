import express from "express";
import * as events from "./eventsController.mjs"
const router = express.Router() ;

// Routes
router.get("/", events.index) ; // Get all events

export default router ;