// Fetches one real photo per word from Wikipedia/Wikimedia Commons (lead image of the German article).
// Writes public/img/<id>.jpg and data/vocab.json. Words with no verified photo are listed in data/dropped.json.
import fs from 'node:fs';
const UA = { 'User-Agent': 'Deutschy/0.1 (https://deutschy.pages.dev; alhinaawi@gmail.com)' };
const slug = (s) => s.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const lines = fs.readFileSync('data/vocab-source.txt','utf8').split('\n').filter(l=>l.trim()&&!l.startsWith('#'));
let topic=null; const topics=[]; const items=[];
for (const l of lines) {
  if (l.startsWith('@')) { const [id,ar,wiki]=l.slice(1).split('|'); topic={id,ar}; topics.push(topic); continue; }
  const [art,de,plural,ar,...cands]=l.split('|');
  items.push({topic:topic.id,art,de,plural,ar,cands});
}
const api = async (params, host='de.wikipedia.org') => {
  const u = `https://${host}/w/api.php?format=json&origin=*&`+new URLSearchParams(params);
  for (let i=0;i<4;i++){ const r=await fetch(u,{headers:UA}); if(r.ok) return r.json(); await new Promise(r=>setTimeout(r,1500*(i+1))); }
  throw new Error('api fail '+u);
};
const existing = fs.existsSync('data/cache.json') ? JSON.parse(fs.readFileSync('data/cache.json','utf8')) : {words:[],dropped:[]};
const have = new Map(existing.words.map(w=>[w.id,w]));
const out=[], dropped=[]; const dropSeen=new Set(existing.dropped||[]); const save=()=>fs.writeFileSync('data/cache.json',JSON.stringify({words:[...out,...existing.words.filter(w=>!out.find(o=>o.id===w.id))],dropped:[...dropped]}));
fs.mkdirSync('public/img',{recursive:true});
async function one(it){
  const id = slug(it.de);
  if (have.has(id) && fs.existsSync(`public/img/${id}.jpg`)) { out.push(have.get(id)); return; }
  if (dropSeen.has(it.de)) { dropped.push(it.de); return; }
  for (const c of it.cands) {
    const j = await api({action:'query',titles:c,prop:'pageimages|pageprops',piprop:'thumbnail|name',pithumbsize:'520',redirects:'1',ppprop:'disambiguation'});
    const p = Object.values(j.query.pages)[0];
    if (!p || p.missing!==undefined || (p.pageprops&&'disambiguation' in p.pageprops) || !p.thumbnail || !p.pageimage) continue;
    if (!/\.(jpe?g|png)$/i.test(p.pageimage)) continue; // skip svg/gif
    const info = await api({action:'query',titles:'File:'+p.pageimage,prop:'imageinfo',iiprop:'extmetadata|url',iiextmetadatafilter:'LicenseShortName|Artist|AttributionRequired|UsageTerms'},'commons.wikimedia.org');
    const ii = Object.values(info.query.pages)[0]?.imageinfo?.[0];
    const lic = ii?.extmetadata?.LicenseShortName?.value || '';
    if (!ii || !lic) continue;
    const img = await fetch(p.thumbnail.source,{headers:UA});
    if (!img.ok) continue;
    const buf = Buffer.from(await img.arrayBuffer());
    fs.writeFileSync(`public/img/${id}.jpg`, buf);
    const artist = (ii.extmetadata.Artist?.value||'').replace(/<[^>]*>/g,'').trim().slice(0,120);
    out.push({id,topic:it.topic,art:it.art,de:it.de,plural:it.plural,ar:it.ar,
      photo:{file:p.pageimage,page:`https://de.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g,'_'))}`,commons:ii.descriptionurl||`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(p.pageimage)}`,license:lic,author:artist}});
    save(); return;
  }
  dropped.push(it.de); save();
}
const t0=Date.now(); const Q=3; let idx=0;
await Promise.all(Array.from({length:Q},async()=>{ while(idx<items.length && Date.now()-t0<85000){ const it=items[idx++]; try{await one(it);}catch(e){console.log('err',it.de,String(e).slice(0,80));} } }));
if (idx<items.length) { console.log('PARTIAL', idx, '/', items.length); process.exit(2); }
const order = new Map(items.map((it,i)=>[slug(it.de),i]));
out.sort((a,b)=>order.get(a.id)-order.get(b.id));
fs.writeFileSync('data/vocab.json', JSON.stringify({topics,words:out},null,1));
fs.writeFileSync('data/dropped.json', JSON.stringify(dropped,null,1));
console.log('words',out.length,'dropped',dropped.length,dropped.join(', '));
