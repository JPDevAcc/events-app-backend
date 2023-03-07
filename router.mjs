import express from "express";
import * as events from "./eventsController.mjs"
const router = express.Router() ;

// Routes
router.get("/", events.index) ; // Get all events
router.delete("/delete", events.remove) ; // Remove event by id
router.post("/add" , events.add) ; // Add new event
router.put("/put", events.update) ; // Update event by id
export default router ;