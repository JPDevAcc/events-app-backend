import createError from 'http-errors';
import Event from './models/event.mjs';

// Retrieve all events
export function index(req, res) {
    Event.find()
    .then((event) => {
        res.send(event)
    })
}