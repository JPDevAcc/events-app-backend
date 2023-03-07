import { Schema, model } from 'mongoose';

const eventSchema = Schema({
	title: String,
	location: String,
	date: Date,
	description: String,
	picture: String
})

const Event = model("Event", eventSchema) ;
export default Event ;