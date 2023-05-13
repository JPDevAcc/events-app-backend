import { model } from 'mongoose';
import CollectionCopyPrefixModel from './models/collectionCopies.mjs';
import { userSchema } from './models/user.mjs';
import { eventSchema } from './models/event.mjs';
import { MONGO_ERR_DUPLICATE_KEY } from "./utils/errcodes.mjs";

const collectionsSchema = [
	['user', userSchema],
	['event', eventSchema]
] ;

export default async function copyCollections() {
	const collectionCopyPrefix = global.userCollectionsPrefix + '_' ;
	const alreadyCopied = !!(await CollectionCopyPrefixModel.findOne({prefix: collectionCopyPrefix})) ;

	if (!alreadyCopied) {
		for (const [schemaName, schema] of collectionsSchema) {
			const schemaCopyName = collectionCopyPrefix + schemaName ;
			console.log("Creating collection copy", schemaCopyName) ;

			const modelBase = model(schemaName, schema) ;
			const entries = await modelBase.find() ;

			try {
				const modelCopy = model(schemaCopyName, schema) ;
				await modelCopy.insertMany(entries) ;
			}
			catch(err) {
				if (err.code !== MONGO_ERR_DUPLICATE_KEY) throw (err) ; // Unknown error
				console.warn("Unexpected duplicate key when copying collections") ;
			}
		}

		await CollectionCopyPrefixModel.create({prefix: global.userCollectionsPrefix + '_'}) ;
	}
	else {
		if (Math.random() > 0.1) return ; // (no need to do this check every time)
		console.log("(checking for expired collection copies)") ;

		// Get list of prefixes for expired copies
		let collectionCopyPrefixes = await CollectionCopyPrefixModel.find() ;
		const expiryHours = (collectionCopyPrefixes.length < 10) ? 24 : 1 ; // 24 or 1 hour depending on how many we currently have
		const threshold = new Date().getTime() - (expiryHours * 60 * 60 * 1000) ;
		collectionCopyPrefixes = await CollectionCopyPrefixModel.find({timestamp: {$lt: threshold}}) ;

		// Remove them		
		for (const {prefix} of collectionCopyPrefixes) {
			for (const [schemaName, schema] of collectionsSchema) {
				const schemaCopyName = prefix + schemaName ;
				console.log("Removing old collection", schemaCopyName) ;
				const modelCopy = model(schemaCopyName, schema) ;
				try {
					await modelCopy.collection.drop() ;
				}
				catch(err) {
					// (ignore errors when removing collections - they might just have not been copied due to being empty)
				}
			}
		}
		await CollectionCopyPrefixModel.deleteMany({timestamp: {$lt: threshold}}) ;
	}
}