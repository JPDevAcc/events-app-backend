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

export { eventSchema };

const getModel = () => model(global.userCollectionsPrefix + 'Event', eventSchema) ;
export default getModel ;