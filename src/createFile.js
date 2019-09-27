var fs = require('fs');
var ejs = require('ejs');
function loadTmp(fileName,callback){
  console.log(fileName);
  fs.readFile(fileName, 'utf8', function (err, text) {
    if(err) {
      callback(err);
      return;
    }
    callback(text);
  });
}

function getContent(fileName,callback){
  loadTmp(fileName,function (text) {
    var arry=text.split(/<p>|<\/p>|¤/);  // <p> , </p> 分割
    var narry=Array.from(new Set(arry)); // 去重
    //console.dir(narry);
    narry.splice(narry.indexOf('\r\n'),1); // 去换行
    narry.splice(narry.indexOf('&nbsp;'),1); // 去换行
    narry.splice(narry.indexOf(''),1); // 去空
    //console.dir(narry);
    callback(narry);
  });
}
function getFirstSection(chapter){
  //console.dir(chapter);
  var arry=chapter.split("。");
  arry=arry[0].split("；");
  arry=arry[0].split("？");
  //console.dir(arry);
  console.dir(arry[0]);
  return arry[0];
}
function getNewLine(chapter){
  //console.dir(chapter);
  var nline=chapter.replace(/。/g,"。\r\n"); // 全局替换，句号后加换行
  //console.dir(nline);
  return nline;
}

function saveToFile(textArray){
  var chapters=[];
  //console.log(textArray);
  for (var i = 0; i < textArray.length; i++) {
    var line=textArray[i];
    var fileName=getFirstSection(line);
    console.log(fileName);
    var nline=getNewLine(line);
    chapters.push(fileName);
    fileName='../daodejing/'+fileName+'.md';
    //fileName=fileName+'.md';
    converContex(fileName,nline);

  }
  updateSummry(chapters);
}

function converContex(fileName,nline){
  var title= getFirstSection(nline);
  var content=nline.slice(3); //删除行号
  console.log(content);

  contents=content.split('\r\n');
  console.log(content);
  var param={'title':title,'contents':contents};
  //console.log(fileName);
  fs.readFile('temp.ejs', 'utf8', function (err, text) {
    var result=ejs.render(text,param);
    fs.writeFileSync(fileName, result); //save file
    //callback(result);
  });
}
function convertFile(fileName){
  getContent(fileName,function(textArray){
      saveToFile(textArray);
  });
}
function updateSummry(chapters){
  var param={'chapters':chapters};
  fs.readFile('SUMMARY.ejs', 'utf8', function (err, text) {
    var result=ejs.render(text,param);
    fs.writeFileSync('../SUMMARY.md', result); //save file
    //callback(result);
  });

}


//getContent('./daode-org.md');
//getFirstSection('75.民之饥以其上食税之多，是以饥。民之难治以其上之有为，是以难治。民之轻死以其求生之厚，是以轻死。夫唯无以生为者，是贤於贵生。');
//getNewLine('75.民之饥以其上食税之多，是以饥。民之难治以其上之有为，是以难治。民之轻死以其求生之厚，是以轻死。夫唯无以生为者，是贤於贵生。');
convertFile('./daode-org.md');
