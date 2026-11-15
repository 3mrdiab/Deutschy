// For words whose Wikipedia lead image was missing or not a clear photo: search Wikimedia Commons directly.
import fs from 'node:fs';
const UA = { 'User-Agent': 'Deutschy/0.1 (https://deutschy.pages.dev; alhinaawi@gmail.com)' };
const Q = JSON.parse(fs.readFileSync('data/commons-queries.json','utf8'));
const cache = JSON.parse(fs.readFileSync('data/cache.json','utf8'));
const src = fs.readFileSync('data/vocab-source.txt','utf8').split('\n');
const meta = {}; let topic;
for (const l of src){ if(!l.trim()||l.startsWith('#'))continue; if(l.startsWith('@')){topic=l.slice(1).split('|')[0];continue;} const [art,de,plural,ar]=l.split('|'); meta[de]={topic,art,de,plural,ar}; }
const slug = (s) => s.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const BAD = /diagram|drawing|map|\.svg|\.gif|\.tif|illustration|schema|plate|stich|engraving|painting|logo|icon|flag|coat of arms|anatomy|cross.?section|sketch|poster|scan|stamp/i;
const OKLIC = /^(CC0|CC BY|CC BY-SA|Public domain|PD|Pixabay|Attribution)/i;
const only = process.argv.slice(2);
const t0=Date.now();
for (const [de,query] of Object.entries(Q)) {
  if (only.length && !only.includes(de)) continue;
  if (Date.now()-t0>90000) { console.log('TIME'); break; }
  const id = slug(de);
  const u = 'https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=6&gsrlimit=15&gsrsearch='+encodeURIComponent(query+' filetype:bitmap')+'&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=520&iiextmetadatafilter=LicenseShortName|Artist';
  let j; for (let i=0;i<3;i++){ const r=await fetch(u,{headers:UA}); if(r.ok){j=await r.json();break;} await new Promise(r=>setTimeout(r,2000)); }
  const pages = Object.values(j?.query?.pages||{}).sort((a,b)=>a.index-b.index);
  let done=false;
  for (const p of pages) {
    const ii=p.imageinfo?.[0]; if(!ii) continue;
    if (BAD.test(p.title)) continue;
    if (!/\.jpe?g$/i.test(p.title)) continue;
    if (ii.width<600||ii.height<400) continue;
    const lic=ii.extmetadata?.LicenseShortName?.value||''; if(!OKLIC.test(lic)) continue;
    const img=await fetch(ii.thumburl,{headers:UA}); if(!img.ok) continue;
    fs.writeFileSync(`public/img/${id}.jpg`,Buffer.from(await img.arrayBuffer()));
    const artist=(ii.extmetadata.Artist?.value||'').replace(/<[^>]*>/g,'').trim().slice(0,120);
    const w={id,...meta[de],photo:{file:p.title.replace(/^File:/,''),page:ii.descriptionurl,commons:ii.descriptionurl,license:lic,author:artist}};
    cache.words=cache.words.filter(x=>x.id!==id); cache.words.push(w);
    cache.dropped=(cache.dropped||[]).filter(x=>x!==de);
    console.log('ok',de,'<-',p.title); done=true; break;
  }
  if(!done) console.log('NONE',de);
  fs.writeFileSync('data/cache.json',JSON.stringify(cache));
}
