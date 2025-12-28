"use strict";
const strict = require('assert/strict');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));

let idManager = 0;
const properties = [
  {propertyName: 'name', label: '名前', type: 'text', required: true},
  {propertyName: 'role', label: 'ロール', type: 'select', options: ['タンク', 'ダメージ', 'サポート']},
  {propertyName: 'hp', label: 'HP', type: 'number', min: 0, step: 1, view: false, required: true},
  {propertyName: 'mainSkill', label: 'メイン攻撃', type: 'text', view: false},
  {propertyName: 'subSkill', label: 'サブ攻撃', type: 'text', view: false},
  {propertyName: 'ability1', label: 'アビリティ1', type: 'text', view: false},
  {propertyName: 'ability2', label: 'アビリティ2', type: 'text', view: false},
  {propertyName: 'ultimate', label: 'アルティメット', type: 'text', view: false},
  {propertyName: 'passive', label: 'パッシブ', type: 'text', view: false},
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
    ['D.va', 'タンク', 700, 'フュージョン・キャノン: 近距離用のオートマチック兵装。範囲攻撃に適している', 'ディフェンス・マトリックス: 正面からの投射物をブロックする', 'ブースター: 進行方向に飛び上がる', 'マイクロ・ミサイル: 爆発するロケット弾を一斉に発射する', '自爆: メックをオーバーロードさせてから脱出する。メックは一定時間後に爆発する', '緊急脱出！: メックが破壊された際、緊急脱出する'],
    ['ウィンストン', 'タンク', 625, 'テスラ・キャノン: 前方に電撃を放つ', 'テスラ・キャノン: チャージして前方長距離に電撃を放つ', 'ジャンプ・パック: 前方に大きく跳躍する。敵の上に直接着地するとダメージを与える', 'バリア・プロジェクター: 敵の攻撃から身を守るバリア・ドームを展開する', 'プライマル・レイジ: ライフが大幅に増加するが跳躍とパンチしかできなくなってしまう', ''],
    ['オリーサ', 'タンク', 600, '', '', '', '', '', ''],
    ['ザリア', 'タンク', 550, '', '', '', '', '', ''],
    ['シグマ', 'タンク', 625, '', '', '', '', '', ''],
    ['ジャンカー・クイーン', 'タンク', 525, '', '', '', '', '', ''],
    ['ドゥームフィスト', 'タンク', 525, '', '', '', '', '', ''],
    ['ハザード', 'タンク', 650, '', '', '', '', '', ''],
    ['マウガ', 'タンク', 725, '', '', '', '', '', ''],
    ['ラインハルト', 'タンク', 700, '', '', '', '', '', ''],
    ['ラマットラ', 'タンク', 525, '', '', '', '', '', ''],
    ['レッキング・ボール', 'タンク', 725, '', '', '', '', '', ''],
    ['ロードホッグ', 'タンク', 750, '', '', '', '', '', ''],
    
    ['アッシュ', 'ダメージ', 250, '', '', '', '', '', ''],
    ['ウィドウメイカー', 'ダメージ', 225, '', '', '', '', '', ''],
    ['ヴェンデッタ', 'ダメージ', 275, '', '', '', '', '', ''],
    ['エコー', 'ダメージ', 225, '', '', '', '', '', ''],
    ['キャスディ', 'ダメージ', 250, '', '', '', '', '', ''],
    ['ゲンジ', 'ダメージ', 250, '', '', '', '', '', ''],
    ['シンメトラ', 'ダメージ', 275, '', '', '', '', '', ''],
    ['ジャンクラット', 'ダメージ', 250, '', '', '', '', '', ''],
    ['ソジョーン', 'ダメージ', 225, '', '', '', '', '', ''],

  ];
  for (const data of defaultData) {
    const fixedData = {};
    for (let i = 0; i < properties.length; i++) {
      fixedData[properties[i].propertyName] = data[i];
    };
    addData(fixedData);
  };
};