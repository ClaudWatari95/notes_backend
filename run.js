// import service functions file
const notes = require('./services/notes');

// run mongoDB calls
async function run(method, data) {
    try {
      if(method === 'create') {
        const res = await notes.addNote(data);
        return res;
      }
      else if(method === 'read_all') {
        const res = await notes.readNotes();
        return res;
      }
      else if(method === 'read_one') {
        const res = await notes.readNote(data);
        return res;
      }
      else if(method === 'update_one') {
        const res = await notes.updateNote(data);
        return res;
      }
      else if(method === 'sync_note') {
        const res = await notes.syncNote(data);
        return res;
      }
      else if(method === 'delete_note') {
        const res = await notes.softDeleteNote(data);
        return res;
      }
      else return 'invalid command';
    } catch (e) {
      console.log('error:', e.message);
      return false;
    }
  };

  module.exports = run;
