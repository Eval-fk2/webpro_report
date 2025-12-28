"use strict";
const strict = require('assert/strict');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + '/public'));

let idManager = 0;
const properties = [
  {propertyName: 'name', label: '名前', type: 'text', required: true},
  {propertyName: 'rarity', label: 'レアリティ', type: 'select', options: ['星1', '星2', '星3', '星4', '星5', '星6'], required: true},
  {propertyName: 'role', label: '職業', type: 'select', options: ['先鋒', '狙撃', '前衛', '術師', '重装', '医療', '特殊', '補助']},
  {propertyName: 'hp', label: 'HP', type: 'number', min: 0, view: false, required: true},
  {propertyName: 'atk', label: '攻撃力', type: 'number', min: 0, step: 1, view: false, required: true},
  {propertyName: 'def', label: '防御力', type: 'number', min: 0, step: 1, view: false, required: true},
  {propertyName: 'res', label: '術耐性', type: 'number', min: 0, step: 1, view: false, required: true},
  {propertyName: 'redep_time', label: '再配置', type: 'number', min: 0, view: false, required: true},
  {propertyName: 'cost', label: 'コスト', type: 'number', min: 0, step: 1, view: false, required: true},
  {propertyName: 'block', label: 'ブロック数', type: 'number', min: 0, step: 1, view: false, required: true},
  {propertyName: 'atk_int', label: '攻撃速度', type: 'number', min: 0, view: false, required: true},
  {propertyName: 'passive1', label: '素質1', type: 'textarea', view: false},
  {propertyName: 'passive2', label: '素質2', type: 'textarea', view: false},
  {propertyName: 'skill1', label: 'スキル1', type: 'textarea', view: false},
  {propertyName: 'skill2', label: 'スキル2', type: 'textarea', view: false},
  {propertyName: 'skill3', label: 'スキル3', type: 'textarea', view: false}
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
    ['Mon3tr', '星6', '医療', 1735, 528, 221, 0, 70, 18, 1, 2.85, '自己修復: 攻撃範囲内の地面マスに自身のみが治療可能な「再構成核」を1体配置可能。\n再構成核の周囲にいる味方ユニットの攻撃力+15%(+5%)、再構成核が自身かMon3trによる治療を受けると、減衰と跳躍回数の消費なしで次の対象へと跳躍', '戦術連携: 自身または再構成核による治療時、自身と治療対象の攻撃速度が10秒間+20(+2)（重複不可）', '過圧力連結: 次に味方を治療する時、対象のHPを自身の攻撃力の200%回復し、その治療の跳躍回数+1', '超飽和治療: 再構成核を優先して治療する。再構成核はMon3trの治療を受けるたび、跳躍治療を追加で1回行う。第二素質の効果が2.8倍にまで上昇する', 'メルトダウン: 攻撃範囲変化、再構成核の位置に移動し、攻撃力+330%、攻撃間隔が短縮(-1.5)、ブロック数+2、最大HP+5000。1秒ごとにHPを80失い、\nブロック中の敵全員を同時に攻撃。通常攻撃が対象に確定ダメージを与えるようになり、攻撃時に自身のHPを攻撃力の50%治療する\nスキル終了時または致命的なダメージを受けた際、元の位置に戻る'],
    ['アスカロン', '星6', '特殊', 1623, 954, 333, 30, 70, 21, 0, 3.50, '', '', '', '', ''],
    ['アルケット', '星6', '狙撃', 1705, 528, 172, 0, 70, 14, 1, 1.00, '', '', '', '', ''],
    ['イネス', '星6', '先鋒', 2121, 589, 281, 0, 35, 11, 1, 1.00, '', '', '', '', ''],
    ['イフリータ', '星6', '術師', 1680, 870, 130, 20, 70, 34, 1, 2.90, '', '', '', '', ''],
    ['ウィシャデル', '星6', '狙撃', 1888, 687, 256, 15, 70, 25, 1, 2.10, '', '', '', '', ''],
    ['ウルピアヌス', '星6', '前衛', 6022, 1569, 0, 0, 70, 24, 2, 2.50, '', '', '', '', ''],
    ['エイヤフィヤトラ', '星6', '術師', 1743, 645, 122, 20, 70, 21, 1, 1.60, '', '', '', '', ''],
    ['エクシア', '星6', '狙撃', 1673, 540, 161, 0, 70, 14, 1, 1.00, '', '', '', '', ''],
    ['グレイディーア', '星6', '特殊', 2309, 801, 331, 0, 80, 16, 2, 1.80, '', '', '', '', ''],
    ['ケルシー', '星6', '医療', 1633, 490, 215, 0, 70, 20, 1, 2.85, '', '', '', '', ''],
    ['ゴールデングロー', '星6', '術師', 1480, 331, 125, 20, 70, 22, 1, 1.30, '', '', '', '', ''],
    ['サリア', '星6', '重装', 3150, 485, 595, 10, 70, 22, 3, 1.20, '', '', '', '', ''],
    ['シュウ', '星6', '重装', 3213, 479, 602, 10, 70, 22, 3, 1.20, '', '', '', '', ''],
    ['シルバーアッシュ', '星6', '前衛', 2560, 713, 397, 10, 70, 20, 2, 1.30, '', '', '', '', ''],
    ['シー', '星6', '術師', 1801, 918, 127, 20, 70, 34, 1, 2.90, '', '', '', '', ''],
    ['スカジ', '星6', '前衛', 3866, 1015, 263, 0, 70, 19, 1, 1.50, '', '', '', '', ''],
    ['スズラン', '星6', '補助', 1480, 521, 128, 25, 70, 16, 1, 1.90, '', '', '', '', ''],
    ['スルト', '星6', '前衛', 2916, 672, 414, 15, 70, 21, 1, 1.25, '', '', '', '', ''],
    ['ソーンズ', '星6', '前衛', 2612, 711, 402, 10, 70, 20, 2, 1.30, '', '', '', '', ''],
    ['チェン', '星6', '前衛', 2880, 610, 352, 0, 70, 23, 2, 1.30, '', '', '', '', ''],
    ['チョンユエ', '星6', '前衛', 2635, 590, 363, 0, 70, 11, 1, 0.78, '', '', '', '', ''],
    ['ティフォン', '星6', '狙撃', 1702, 1045, 113, 0, 70, 24, 1, 2.40, '', '', '', '', ''],
    ['ナイチンゲール', '星6', '医療', 1705, 350, 169, 5, 70, 18, 1, 2.85, '', '', '', '', ''],
    ['ニェン', '星6', '重装', 3699, 619, 726, 0, 70, 23, 3, 1.50, '', '', '', '', ''],
    ['バグパイプ', '星6', '先鋒', 2484, 586, 382, 0, 70, 13, 1, 1.00, '', '', '', '', ''],
    ['フィアメッタ', '星6', '狙撃', 1926, 861, 156, 0, 70, 29, 1, 2.80, '', '', '', '', ''],
    ['ブレイズ', '星6', '前衛', 2821, 765, 370, 0, 70, 24, 3, 1.20, '', '', '', '', ''],
    ['ホシグマ', '星6', '重装', 3850, 430, 723, 0, 70, 23, 3, 1.20, '', '', '', '', ''],
    ['マウンテン', '星6', '前衛', 2745, 587, 357, 0, 70, 11, 1, 0.78, '', '', '', '', ''],
    ['マドロック', '星6', '重装', 3927, 882, 602, 10, 70, 36, 3, 1.60, '', '', '', '', ''],
    ['ムリナール', '星6', '前衛', 3906, 355, 502, 15, 70, 12, 3, 1.20, '', '', '', '', ''],
    ['モスティマ', '星6', '術師', 1831, 834, 132, 20, 70, 34, 1, 2.90, '', '', '', '', ''],
    ['ユー', '星6', '重装', 3333, 685, 577, 10, 70, 26, 3, 1.60, '', '', '', '', ''],
    ['リィン', '星6', '補助', 1079, 473, 138, 20, 70, 12, 1, 1.60, '', '', '', '', ''],
    ['レミュアン', '星6', '狙撃', 1448, 1201, 175, 0, 70, 22, 1, 2.70, '', '', '', '', ''],
    ['ロゴス', '星6', '術師', 1663, 671, 119, 20, 70, 21, 1, 1.60, '', '', '', '', ''],
    ['ロスモンティス', '星6', '狙撃', 1944, 688, 245, 15, 70, 25, 1, 2.10, '', '', '', '', ''],
    ['ヴィルトゥオーサ', '星6', '補助', 1201, 485, 109, 15, 70, 16, 1, 1.60, '', '', '', '', ''],
    ['引星ソーンズ', '星6', '特殊', 1173, 501, 106, 30, 70, 18, 1, 1.50, '', '', '', '', ''],
    ['新約エクシア', '星6', '特殊', 2150, 708, 150, 10, 70, 13, 1, 1.30, '', '', '', '', ''],
    ['濁心スカジ', '星6', '補助', 1603, 368, 233, 0, 70, 8, 1, 1.30, '', '', '', '', ''],
    ['焔影リード', '星6', '医療', 1583, 550, 84, 20, 70, 17, 1, 1.60, '', '', '', '', ''],
    ['熾炎ブレイズ', '星6', '術師', 1608, 662, 131, 15, 70, 21, 1, 1.60, '', '', '', '', ''],
    ['純燼エイヤフィヤトラ', '星6', '医療', 1439, 424, 109, 10, 70, 16, 1, 2.85, '', '', '', '', ''],
    ['荒蕪ラップランド', '星6', '術師', 1503, 342, 117, 20, 70, 22, 1, 0.93, '', '', '', '', ''],
    ['血掟テキサス', '星6', '特殊', 1598, 569, 320, 0, 18, 10, 1, 0.93, '', '', '', '', ''],
    ['遊龍チェン', '星6', '狙撃', 2501, 773, 203, 0, 70, 32, 1, 2.30, '', '', '', '', '']
  ];
  for (const data of defaultData) {
    const fixedData = {};
    for (let i = 0; i < properties.length; i++) {
      fixedData[properties[i].propertyName] = data[i];
    };
    addData(fixedData);
  };
};