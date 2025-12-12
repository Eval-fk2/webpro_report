const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));

let idManager = 0;
const db_properties = [{propertyName: 'name', label: '名前', type: 'text'}];
let dataList = [];

defaultData();

app.get('/db', (req, res) => {
  res.render('db', {dataList, db_properties} );
});

app.get('/db/:id', (req, res) => {
  const id = req.params.id;
  const data = dataList.find(a => a.id == id);
  res.render('db_detail', {data, db_properties} );
});

app.get('/db_add', (req, res) => {
  const data = req.query;
  addData(data);
  res.redirect('/db');
});

app.get('/db_remove/:id', (req, res) => {
  const id = req.params.id;
  removeData(id);
  res.redirect('/db');
});

app.get('/db_edit/:id', (req, res) => {
  const id = req.params.id;
  const data = dataList.find(a => a.id == id);
  res.render('db_edit', {data, db_properties});
});

app.get('/db_edit_complete/:id', (req, res) => {
  const id = req.params.id;
  const data = req.query;
  editData(id, data);
  res.redirect(`/db/${id}`);
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));

function getId() {
  idManager++;
  return idManager;
};

function addData(data) {
  const newData = {};
  for (const {propertyName} of db_properties) {
    newData[propertyName] = data[propertyName];
  };
  newData['id'] = getId();
  dataList.push(newData);
};

function removeData(id) {
  dataList = dataList.filter(a => a.id != id);
};

function editData(id, editData) {
  const dataIndex = dataList.findIndex(a => a.id == id);
  for (const {propertyName} of db_properties) {
    dataList[dataIndex][propertyName] = editData[propertyName];
  };
};

function defaultData() {
  const defaultData = [
    {name: 'a'},
    {name: 'b'},
    {name: 'c'},
    {name: 'd'},
    {name: 'e'}
  ];
  for (const data of defaultData) {
    addData(data);
  };
};