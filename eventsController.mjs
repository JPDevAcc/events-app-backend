import Event from './models/event.mjs';

// Retrieve all events
export async function index(req, res) {
	try {
    const events = await Event.find() ;
    res.send(events) ;
	}
	catch(err) {
		res.status(500).send({message: "Something went wrong!"})
	}
}

// Remove event by id
export async function remove(req, res) {
	try {
  	const event = await Event.findByIdAndRemove(req.params.id) ;
		if (event) res.send({ message: "Event removed" }) ;
		else res.status(404).send({message: "Event not found"})
	}
	catch(err) {
		res.status(500).send({message: "Something went wrong!"})
	}
}

// Add event
export async function add(req, res) {
	if (!ensurePresent(req.body, ['title', 'location', 'date', 'duration', 'durationUnits', 'description', 'picture'])) {
		res.status(400).send({message: "Bad request"})
		return ;
	}
	const newEvent = req.body;
	const event = new Event(newEvent);
	await event.save();
	res.send({ message: "New event inserted" });
}

// Update an event (all fields)
export async function update(req, res) {
	if (!ensurePresent(req.body, ['title', 'location', 'date', 'duration', 'durationUnits', 'description', 'picture'])) {
		res.status(400).send({message: "Bad request"})
		return ;
	}

  const event = await Event.findOneAndUpdate({ _id:req.params.id }, req.body);
	if (event) res.send({ message: "Event updated" }) ;
	else res.status(404).send({message: "Event not found"})
};

function ensurePresent(data, fields) {
	for (const field of fields) {
		if (data[field] === undefined || data[field] === null) return false ;
	}
	return true ;
}