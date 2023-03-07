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

// TODO: Add validation / error handling
export async function add(req, res) {
    const newEvent = req.body;
    const event = new Event(newEvent);
    await event.save();
    res.send({ message: "New event inserted." });
}

// TODO: Add validation / error handling
export async function update(req, res){
    await Event.findOneAndUpdate({ _id:req.params.id }, req.body);
    res.send({ message: "Event updated." });
  };
