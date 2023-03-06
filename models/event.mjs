import { Schema, model } from 'mongoose';

const eventSchema = Schema({
})

const Event = model("Event", eventSchema) ;
export default Event ;