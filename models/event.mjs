import { Schema, model } from 'mongoose';

const eventSchema = Schema({
	title: String,
	location: String,
	date: Date,
	duration: Number,
	durationUnits: String,
	description: String,
	picture: String
})

const Event = model("Event", eventSchema) ;
export default Event ;