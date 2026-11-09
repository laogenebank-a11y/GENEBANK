// GENEBANK backend: Google Apps Script (ຜູກກັບ Google Sheet)
const PASS = 'GB2026'; // ປ່ຽນລະຫັດແກ້ໄຂຢູ່ບ່ອນນີ້
const H = {Items:['id','cat','name','qty','dateIn','by','loc','locNote','resp','photos','created'],Logs:['ts','date','id','action','qty','person','reason'],Lists:['type','value','flag']};
const SEED = [['cat','ເຄື່ອງໃຊ້ໄຟຟ້າຂະໜາດໃຫຍ່',0],['cat','ເຄື່ອງໃຊ້ໄຟຟ້າຂະໜາດນ້ອຍ',0],['cat','ອຸປະກອນ IT',0],['cat','ເຈ້ຍ',1],['cat','ອຸປະກອນຈັດເກັບເອກະສານ',0],['cat','ເຄື່ອງຂຽນ',1],['cat','ອຸປະກອນ ບໍລິການ',0],['cat','ສຸຂະອານາໄມ ສ່ວນກາງ',1],['cat','ລະບົບປະຕິບັດງານ GGCE',0],
 ['staff','ທ ກູ່ຄຳ',''],['staff','ທ ເຂັມຄຳ',''],['staff','ທ ຄຳສອນ',''],['staff','ທ ຄຳປພດິດ',''],['staff','ນ ບຸນຊູ',''],['staff','ທ ເລ່ເມີ້ນ',''],
 ['loc','ຫ້ອງ KK',''],['loc','ຫ້ອງຖານຂໍ້ມູນ',''],['loc','ຫ້ອງເກັບຮັກສາໄລຍະຍາວ',''],['loc','ຫ້ອງເກັບຮັກສາໄລຍະກາງ','']];
function sh(n){const ss=SpreadsheetApp.getActive();let s=ss.getSheetByName(n);if(!s){s=ss.insertSheet(n);s.appendRow(H[n]);s.getRange('A:K').setNumberFormat('@');if(n=='Lists')SEED.forEach(r=>s.appendRow(r))}return s}
function rows(n){const v=sh(n).getDataRange().getValues(),h=v.shift();return v.map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i] instanceof Date?Utilities.formatDate(r[i],'GMT+7','yyyy-MM-dd'):r[i]])))}
const out=o=>ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
function doGet(){return out({ok:1})}
function doPost(e){const p=JSON.parse(e.postData.contents),l=LockService.getScriptLock();l.waitLock(20000);try{return out(act(p))}catch(x){return out({err:String(x)})}finally{l.releaseLock()}}
function need(p){if(p.pwd!==PASS)throw 'Wrong password'}
function folder(){const f=DriveApp.getFoldersByName('GENEBANK_Photos');return f.hasNext()?f.next():DriveApp.createFolder('GENEBANK_Photos')}
function save(ph,id){const f=folder();return (ph||[]).map((b,i)=>{const x=f.createFile(Utilities.newBlob(Utilities.base64Decode(b.split(',')[1]),'image/jpeg',id+'_'+Date.now()+'_'+i+'.jpg'));x.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);return x.getId()})}
function find(s,id){const v=s.getDataRange().getValues();for(let i=1;i<v.length;i++)if(v[i][0]==id)return {r:i+1,row:v[i]};throw 'ID not found'}
function setRow(s,r,o){s.getRange(r,1,1,H.Items.length).setValues([H.Items.map(k=>o[k]??'')])}
function act(p){const a=p.a;
 if(a=='auth'){need(p);return {ok:1}}
 if(a=='list'){const L=rows('Lists');return {items:rows('Items'),cats:L.filter(x=>x.type=='cat').map(x=>({v:x.value,c:+x.flag||0})),staff:L.filter(x=>x.type=='staff').map(x=>x.value),locs:L.filter(x=>x.type=='loc').map(x=>x.value)}}
 if(a=='addList'){sh('Lists').appendRow([p.type,p.value,p.flag||'']);return {ok:1}}
 if(a=='delList'){need(p);const s=sh('Lists'),v=s.getDataRange().getValues();for(let i=v.length-1;i>0;i--)if(v[i][0]==p.type&&v[i][1]==p.value)s.deleteRow(i+1);return {ok:1}}
 if(a=='add'){const s=sh('Items'),n=Math.max(0,...rows('Items').map(x=>+String(x.id).slice(2)||0))+1,id='GB'+('00000'+n).slice(-5),it=p.item;
  it.id=id;it.photos=save(p.photos,id).join(',');it.created=new Date().toISOString();s.appendRow(H.Items.map(k=>it[k]??''));return {id}}
 if(a=='update'){need(p);const s=sh('Items'),f=find(s,p.item.id),old=Object.fromEntries(H.Items.map((k,i)=>[k,f.row[i]])),it=Object.assign(old,p.item);
  it.photos=String(old.photos||'').split(',').filter(Boolean).concat(save(p.photos,it.id)).join(',');setRow(s,f.r,it);return {ok:1}}
 if(a=='del'){need(p);const s=sh('Items');s.deleteRow(find(s,p.id).r);return {ok:1}}
 if(a=='move'){const m=p.m,s=sh('Items'),f=find(s,m.id),q=+m.qty,cur=+f.row[3];if(m.type=='out'&&q>cur)throw 'Not enough stock';
  s.getRange(f.r,4).setValue(m.type=='out'?cur-q:cur+q);sh('Logs').appendRow([new Date().toISOString(),m.date,m.id,m.type,q,m.person,m.reason||'']);return {ok:1}}
 throw 'Unknown action'}
