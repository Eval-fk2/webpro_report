const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));

let idManager = 0;
const properties = [
  {propertyName: 'name', label: '名前', type: 'text'},
  {propertyName: 'count', label: '数', type: 'number'},
  {propertyName: 'text', label: '備考', type: 'text'},
  {propertyName: 'select', label: 'セレクト', type: 'select', options: ['a', 'b', 'c']},
  {propertyName: 'textare', label: 'textarea', type: 'textarea'}
];
const propertySettings = {
  main: 'name',
  click: 'name'
};
let dataList = [];

setDefaultData();

app.get('/db', (req, res) => {
  res.render('db', {dataList, properties, propertySettings} );
});

app.get('/db/:id', (req, res) => {
  const id = req.params.id;
  const data = dataList.find(a => a.id == id);
  if (data === undefined) {
    error(res);
    return;
  };
  res.render('db_detail', {data, properties, propertySettings} );
});

app.get('/db_add', (req, res) => {
  res.render('db_add', {properties});
});

app.get('/db_add_complete', (req, res) => {
  const data = req.query;
  addData(data);
  res.redirect('/db');
});

app.get('/db_remove/:id', (req, res) => {
  const id = req.params.id;
  const data = dataList.find(a => a.id == id);
  if (data === undefined) {
    error(res);
    return;
  };
  res.render('db_remove',{data, propertySettings});
});

app.get('/db_remove_complete/:id', (req, res) => {
  const id = req.params.id;
  removeData(id);
  res.redirect('/db');
});

app.get('/db_edit/:id', (req, res) => {
  const id = req.params.id;
  const data = dataList.find(a => a.id == id);
  if (data === undefined) {
    error(res);
    return;
  };
  res.render('db_edit', {data, properties});
});

app.get('/db_edit_complete/:id', (req, res) => {
  const id = req.params.id;
  const data = req.query;
  const edit = editData(id, data);
  if (edit === false) {
    error(res);
    return;
  }
  res.redirect(`/db/${id}`);
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));

function getId() {
  idManager++;
  return idManager;
};

function addData(data) {
  data['id'] = getId();
  dataList.push(data);
};

function removeData(id) {
  dataList = dataList.filter(a => a.id != id);
};

function editData(id, data) {
  const dataIndex = dataList.findIndex(a => a.id == id);
  if (dataIndex === -1) return false;
  for (const {propertyName} of properties) {
    dataList[dataIndex][propertyName] = data[propertyName];
  };
  return true;
};

function error(res) {
  res.redirect('/public/db_error.html');
};

function setDefaultData() {
  const defaultData = [
    ['a',0,'a','a','a','a'],
    ['b',1,'b','b','b','a'],
    ['c',2,'c','c','c','a'],
    ['d',3,'d','a','a','a'],
    ['e',4,'e','b','b','a']
  ];
  for (const data of defaultData) {
    const fixedData = {};
    for (let i = 0; i < properties.length; i++) {
      fixedData[properties[i].propertyName] = data[i];
    };
    addData(fixedData);
  };
};