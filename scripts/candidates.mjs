import fs from 'node:fs';
const UA = { 'User-Agent': 'Deutschy/0.1 (https://deutschy.pages.dev; alhinaawi@gmail.com)' };
const Q = {
 Großmutter:'elderly grandmother smiling portrait', Kopf:'human head portrait man side', Finger:'human index finger hand pointing', Regen:'rain drops falling street', Straße:'city street asphalt road', Löffel:'wooden spoon', Gabel:'fork cutlery', Fernseher:'flat screen television living room', Wiese:'green meadow flowers', Himmel:'blue sky clouds', Schloss:'castle Germany Neuschwanstein', Tankstelle:'petrol station fuel pumps', Messer:'kitchen knife', Topf:'cooking pot stainless steel', Birne:'pear fruit', Kirsche:'cherries fruit', Pfirsich:'peach fruit', Paprika:'red bell pepper', Schmetterling:'butterfly on flower', Besen:'broom', Stadion:'football stadium', Nase:'nose of a child portrait face',
 Hut:'straw hat', Hand:'open human hand palm', Bein:'human leg standing', Fuß:'bare human foot', Baby:'baby sleeping smiling', Haar:'woman long hair', Mund:'smiling mouth teeth woman', Teppich:'carpet living room floor', Auto:'red car on road', Mütze:'knitted winter hat beanie', Stern:'night sky stars milky way', Kino:'cinema interior seats', Lehrer:'teacher in classroom blackboard', Käse:'cheese wedge', Schwester:'two sisters girls', Stuhl:'wooden chair', Küche:'modern kitchen interior', Tür:'wooden front door', Lampe:'table lamp', Nudel:'spaghetti pasta plate', Museum:'museum hall exhibition', Heft:'school notebook exercise book'};
const BAD=/diagram|drawing|map|\.svg|\.gif|\.tif|illustration|schema|plate|engraving|painting|logo|icon|flag|coat of arms|anatomy|sketch|poster|scan|stamp|pdf|ogg/i;
const OK=/^(CC0|CC BY|CC BY-SA|Public domain|PD)/i;
const out={};
for (const [de,q] of Object.entries(Q)) {
  const u='https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=6&gsrlimit=25&gsrsearch='+encodeURIComponent(q+' filetype:bitmap')+'&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=520&iiextmetadatafilter=LicenseShortName|Artist';
  let j;for(let i=0;i<3;i++){const r=await fetch(u,{headers:UA});if(r.ok){j=await r.json();break;}await new Promise(r=>setTimeout(r,2500));}
  const pages=Object.values(j?.query?.pages||{}).sort((a,b)=>a.index-b.index);
  const c=[];
  for(const p of pages){const ii=p.imageinfo?.[0];if(!ii||BAD.test(p.title)||!/\.jpe?g$/i.test(p.title)||ii.width<700||ii.height<500)continue;const lic=ii.extmetadata?.LicenseShortName?.value||'';if(!OK.test(lic))continue;
    const img=await fetch(ii.thumburl,{headers:UA});if(!img.ok)continue;
    const n=c.length;fs.writeFileSync(`/tmp/cand/${de}_${n}.jpg`,Buffer.from(await img.arrayBuffer()));
    c.push({title:p.title.replace(/^File:/,''),page:ii.descriptionurl,license:lic,author:(ii.extmetadata.Artist?.value||'').replace(/<[^>]*>/g,'').trim().slice(0,120)});
    if(c.length>=5)break;}
  out[de]=c;console.log(de,c.length);
}
fs.writeFileSync('/tmp/cand/meta.json',JSON.stringify(out));
