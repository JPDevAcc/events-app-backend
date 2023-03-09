// General search function (extended from booklist frontend)

import createError from 'http-errors' ;
import Record from './models/event.mjs';

// Return matching entries according to given criteria
/* URL format: /[or|and]?f1=fieldName1&s1=searchValue1&f2=fieldName2&s2=searchValue2... */
export async function findRecordsBy(req, res, next) {
	// Get just the query values (i.e. only the order matters, not the parameter names themselves)
	const queryValues = Object.values(req.query) ;

	// Get logical operator
	const logicalOp = req.params.op ;
	if (!['or', 'and'].includes(logicalOp)) {
    return (next(createError(400, "Unknown operator"))) ;
  }

	// Create query array
	if (queryValues.length % 2 !== 0) {
		return (next(createError(400, "Invalid number of query arguments"))) ;
	}
	const queryData = [] ;
	for (let i = 0; i < queryValues.length; i+=2) {
		const fieldName = queryValues[i] ;
		const searchValue = queryValues[i + 1] ;
		queryData.push({[fieldName]: { $eq: searchValue }}) ;
	}

	// Do query
	try {
		let records ;
		if (logicalOp === 'or') records = await Record.find({$or: queryData}).collation({locale: "en", strength: 2});
		else records = await Record.find({$and: queryData}).collation({locale: "en", strength: 2});
		res.send(records) ;
	}
	catch {
		return (next(createError(500, "Unknown error"))) ;
	}
}