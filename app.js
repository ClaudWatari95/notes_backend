// import modules
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const run = require('./run');
const app = express(); // init express
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
let data;
// rest endpoints with callbacks (decided not to use 'routes' folder just for simplicity - few endpoints can be managed here)
app.get('/', async(req, res) => {
  data = {message: 'base endpoint returned ok!'};
  res.send({data});
});
app.post('/create', async(req, res) => {
  const {title, content, noteID } = req.body;
  if((!title || !content) || (title === '' || content === '')) // empty title or content has error
    return res.send('missing data');
  data = await run('create', {title, content, noteID });
  res.send({data});
});
app.patch('/update_note/:noteID', async(req, res) => {
  const { noteID } = req.params;
  const {toUpdate, newData } = req.body;
  if((!toUpdate || !newData) || (toUpdate === '' || newData === '')) // empty title or content has error
    return res.send('missing data');
  if(toUpdate !== 'title' && toUpdate !== 'content') // empty title or content has error
    return res.send('update value can only be \'title\' or \'content\'');
  data = await run('update_one', {noteID: parseInt(noteID, 10), toUpdate, newData});
  res.send({data});
});
app.patch('/sync_note/:noteID', async(req, res) => {
  const { noteID } = req.params;
  const { version } = req.query;
  const { title, content } = req.body;
	if(!version || version === '') return res.send('missing data');
  data = await run('sync_note', {noteID: parseInt(noteID, 10), version: parseInt(version, 10), title, content});
  res.send({data});
});
app.patch('/delete_note/:noteID', async(req, res) => {
  const { noteID } = req.params;
  data = await run('delete_note', {noteID: parseInt(noteID, 10)});
  res.send({data});
});
app.get('/read_notes', async(req, res) => {
  data = await run('read_all');
  res.send({data});
});
app.get('/read_note/:noteID', async(req, res) => {
  const { noteID } = req.params;
  data = await run('read_one', parseInt(noteID, 10));
  res.send({data});
});

const PORT = process.env.PORT || 4000; // default if no env port
// start app
app.listen(PORT, "0.0.0.0", () => {
  console.log('server running on PORT ' + PORT);
});

