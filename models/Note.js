// custom model to define schema (with expected data types - no typescript so initializing values)
const Note = {
  noteID: 0,
  title: "", 
  content: "",
  dateCreated: new Date(),
  dateModified: new Date(),
  syncStatus: "", // can only be one of these
  version: 1,
  isDeleted: false
};
// Object.freeze(Note);

module.exports = Note;