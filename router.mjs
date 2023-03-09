import express from "express";
import * as events from "./eventsController.mjs"
import * as search from "./eventsSearchController.mjs"
const router = express.Router() ;

// Routes || TODO: CHECK THESE WORK ON RENDER
router.get("/", events.index) ; // Get all events
router.post("/" , events.add) ; // Add new event
router.delete("/:id", events.remove) ; // Remove event by id
router.put("/:id", events.update) ; // Update event by id
router.get("/search/:op", search.findRecordsBy) ; // Get events matching the specified criteria
export default router ;