const Note = require("../models/Note");
const table = require("../database");
// global response object
const sendResponse = (message, type, data) => {
  if(typeof message !== 'string' || typeof type !== 'string') return false;
  if(!data) data = 'ok';
  // type is only error or success, otherwise send null
  return type === "error" ? {error: true, message, data} : type === "success" ? {success: true, message, data} : false;
};
const addNote = async({ title, content, noteID }) => {
  try {
    if(Note._id) delete(Note._id); // remove mongoDB _id prop if appended to model
    let length = await table.countDocuments(); // count all existing documents, to use for auto-increment noteID
    Note.noteID = noteID ? noteID : length += 1;
    Note.title = title;
    Note.content = content;
    Note.syncStatus = 'Unsynced'; // default
    Note.version = 1; // default
    Note.isDeleted = false; // default
    await table.insertOne(Note);
    return sendResponse('created note', 'success', {noteId: Note.noteID}); // call global response with arguments
  } catch (e) {
    console.log('add note error:', e.message);
    return sendResponse('add note error', 'error', {"reason": e.message});
  }
};
const softDeleteNote = async ({noteID, toUpdate, newData}) => {
  try {
    const note = await table.findOneAndUpdate(
	    { noteID: noteID },
	    {
		    $set: {
			    isDeleted: true,
			    syncStatus: "Unsynced"
		    }
	    }
	);
    return note ?
      sendResponse('delete note data', 'success', note) :
      sendResponse('delete note error', 'error', {"empty": true}); // send success if note found and updated, else not found and not updated
  } catch (e) {
    return sendResponse('delete note error', 'error',{"reason": e.message});
  }
};
const readNotes = async () => {
  try {
    const notes = table.find({isDeleted: false});
    const data = notes.toArray(function(err, documents) { // iterate over mongoDB cursor
      if (err) {
        console.error('Error fetching documents:', err);
        return false;
      }
      client.close();
      return documents; // send instances of document(s)
    });
    const result = await data;
    return result ?
      sendResponse('notes data', 'success', result) :
      sendResponse('fetch notes error', 'error', {"empty": true});
  } catch (e) {
    console.log('fetch notes error:', e);
    return sendResponse('fetch notes error', 'error', {"reason": e.message});
  }
};
const readNote = async (noteID) => {
  try {
    const note = await table.findOne({noteID, isDeleted: false});
    return note ?
    sendResponse('note data', 'success', note) :
    sendResponse('fetch note error', 'error', {"empty": true});
  } catch (e) {
    console.log('fetch note error:', e.message);
    return sendResponse('fetch note error', 'error', {"reason": e.message});
  }
};
const syncNote = async ({ noteID, version, title, content }) => {
  try {
		let syncedNote = null;
		const existingNote = await table.findOne({ noteID });
		if(!existingNote) {
			return sendResponse('fetch note error', 'error', {"empty": true});
		}
		const existingVersion = parseInt(existingNote.version, 10);
		if(existingVersion > version) {
			await table.findOneAndUpdate({noteID: noteID}, {
				$set: { syncStatus: "Conflict" }
			});
			syncedNote = null;
			console.log({e: true, existingVersion, version});
		} else {
			syncedNote = await table.findOneAndUpdate(
  				{ noteID: noteID },
				  {
				    $set: {
				      version: version,
				      title: title,
				      content: content,
				      syncStatus: "Unsynced"
				    }
				  }
				);
			//syncedNote = true;		
		}
    return syncedNote ?
			sendResponse('note data', 'success', {note: syncedNote})
     :
    sendResponse('sync note error', 'error', {"database_error": true});
  } catch (e) {
    console.log('fetch note error:', e.message);
    return sendResponse('fetch note error', 'error', {"reason": e.message});
  }
};
module.exports = {
  addNote,
  softDeleteNote,
  readNotes,
  readNote,
  syncNote
};
