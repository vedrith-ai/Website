'use client';

import { useState } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang, ShareTheme, ShareAspect } from '@/src/types';
import type { PanchangaResult } from '@/lib/types/panchanga';

interface Props { panchanga: PanchangaResult; lang: Lang }

const THEMES: ShareTheme[] = ['saffron','midnight','lotus','forest'];
const ASPECTS: ShareAspect[] = ['1:1','4:5','9:16','16:9'];
const PREVIEW: Record<ShareTheme,{bg:string;text:string;sub:string}> = {
  saffron:{bg:'from-orange-800 via-amber-600 to-yellow-400',text:'text-white',sub:'text-white/75'},
  midnight:{bg:'from-slate-950 via-indigo-950 to-slate-800',text:'text-amber-50',sub:'text-amber-200/65'},
  lotus:{bg:'from-rose-100 via-pink-50 to-rose-200',text:'text-rose-950',sub:'text-rose-700/70'},
  forest:{bg:'from-emerald-950 via-green-900 to-emerald-700',text:'text-emerald-50',sub:'text-emerald-200/70'}
};
const CANVAS_DIMS: Record<ShareAspect,{w:number;h:number}> = {
  '1:1':{w:1080,h:1080},'4:5':{w:1080,h:1350},'9:16':{w:1080,h:1920},'16:9':{w:1920,h:1080}
};
const PREVIEW_SIZES: Record<ShareAspect,string> = {
  '1:1':'aspect-square w-72','4:5':'aspect-[4/5] w-60','9:16':'aspect-[9/16] w-44','16:9':'aspect-video w-full max-w-xl'
};
const DOMAIN='vedrith.sharvasit.in';

function textFor(lang:Lang,en:string,kn:string){return lang==='kn'?kn:en}

export function ShareCard({panchanga,lang}:Props){
  const [theme,setTheme]=useState<ShareTheme>('saffron');
  const [aspect,setAspect]=useState<ShareAspect>('1:1');
  const [generating,setGenerating]=useState(false);

  const fields = [
    [textFor(lang,'Vara','ವಾರ'), panchanga.vara.displayName || panchanga.vara.name],
    [textFor(lang,'Tithi','ತಿಥಿ'), `${panchanga.tithi.displayName || panchanga.tithi.name} · ${panchanga.tithi.pakshaName}`],
    [textFor(lang,'Nakshatra','ನಕ್ಷತ್ರ'), `${panchanga.nakshatra.displayName || panchanga.nakshatra.name} · ${textFor(lang,'Pada','ಪಾದ')} ${panchanga.nakshatra.pada}`],
    [textFor(lang,'Yoga','ಯೋಗ'), panchanga.yoga.displayName || panchanga.yoga.name],
    [textFor(lang,'Karana','ಕರಣ'), panchanga.karana.displayName || panchanga.karana.name],
    [textFor(lang,'Masa','ಮಾಸ'), panchanga.masa.current.displayName || panchanga.masa.current.name],
    [textFor(lang,'Samvatsara','ಸಂವತ್ಸರ'), panchanga.samvatsara.displayName || panchanga.samvatsara.name],
    [textFor(lang,'Sunrise','ಸೂರ್ಯೋದಯ'), panchanga.sunriseLocal],
    [textFor(lang,'Sunset','ಸೂರ್ಯಾಸ್ತ'), panchanga.sunsetLocal],
    [textFor(lang,'Rahu Kalam','ರಾಹು ಕಾಲ'), `${panchanga.rahuKalam.startLocal} – ${panchanga.rahuKalam.endLocal}`],
    [textFor(lang,'Yamaganda','ಯಮಗಂಡ'), `${panchanga.yamaganda.startLocal} – ${panchanga.yamaganda.endLocal}`],
    [textFor(lang,'Gulika Kalam','ಗುಳಿಕ ಕಾಲ'), `${panchanga.gulikaKalam.startLocal} – ${panchanga.gulikaKalam.endLocal}`],
    [textFor(lang,'Abhijit Muhurta','ಅಭಿಜಿತ್ ಮುಹೂರ್ತ'), `${panchanga.abhijitMuhurta.startLocal} – ${panchanga.abhijitMuhurta.endLocal}`],
  ] as [string,string][];

  const drawWrapped=(ctx:CanvasRenderingContext2D,txt:string,x:number,y:number,maxWidth:number,lineHeight:number)=>{
    const words=txt.split(/\s+/); let line=''; let yy=y;
    for(const word of words){
      const test=line?`${line} ${word}`:word;
      if(ctx.measureText(test).width>maxWidth && line){ctx.fillText(line,x,yy);yy+=lineHeight;line=word;}else line=test;
    }
    if(line){ctx.fillText(line,x,yy);yy+=lineHeight;}
    return yy;
  };

  const downloadJPEG=async()=>{
    setGenerating(true);
    try{
      await document.fonts.ready;
      const canvasSize = CANVAS_DIMS[aspect as ShareAspect];
      const { w, h } = canvasSize;
      const canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
      const ctx=canvas.getContext('2d'); if(!ctx) return;
      const palette={
        saffron:{stops:['#8a2d08','#df6f13','#f3c33b'],text:'#fff',sub:'rgba(255,255,255,.72)'},
        midnight:{stops:['#0b1020','#28325f','#192041'],text:'#fff6d7',sub:'rgba(255,246,215,.66)'},
        lotus:{stops:['#f8d7e4','#f5b5cf','#e9a4c2'],text:'#5f153a',sub:'rgba(95,21,58,.68)'},
        forest:{stops:['#0d3b22','#16623a','#23874e'],text:'#edfdf5',sub:'rgba(237,253,245,.68)'}
      }[theme as ShareTheme];
      const grad=ctx.createLinearGradient(0,0,w,h);
      grad.addColorStop(0,palette.stops[0]); grad.addColorStop(.5,palette.stops[1]); grad.addColorStop(1,palette.stops[2]);
      ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);
      const pad=Math.round(w*.07);
      ctx.save(); ctx.globalAlpha=.08; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(w*.84,h*.14,w*.26,0,Math.PI*2); ctx.fill(); ctx.restore();

      const face=lang==='kn'?'Noto Sans Kannada, sans-serif':'Inter, system-ui, sans-serif';
      const small=Math.max(20,Math.round(w*.022));
      const title=Math.max(38,Math.round(w*.065));
      ctx.fillStyle=palette.sub; ctx.font=`500 ${small}px ${face}`;
      ctx.fillText(textFor(lang,'Daily Panchanga','ನಿತ್ಯ ಪಂಚಾಂಗ'),pad,pad+small);
      ctx.fillStyle=palette.text; ctx.font=`700 ${title}px ${face}`;
      ctx.fillText('VedRith',pad,pad+small+title*1.25);
      ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(pad,pad+small+title*1.55); ctx.lineTo(w-pad,pad+small+title*1.55); ctx.stroke();

      ctx.fillStyle=palette.sub; ctx.font=`400 ${small}px ${face}`;
      let y=pad+small+title*2.0;
      y=drawWrapped(ctx, `${panchanga.date} · ${panchanga.location.name || `${panchanga.location.lat.toFixed(2)}°, ${panchanga.location.lng.toFixed(2)}°`}`, pad, y, w-pad*2, small*1.45);

      const labelSize=Math.max(17,Math.round(w*.018));
      const valueSize=Math.max(20,Math.round(w*.025));
      const columns=aspect==='9:16'?1:2;
      const colW=(w-pad*2)/columns;
      const rowH=Math.max(66,Math.round(h*.060));
      let i=0;
      y+=small;
      fields.forEach(([label,value])=>{
        const c=i%columns, r=Math.floor(i/columns), x=pad+c*colW, yy=y+r*rowH;
        ctx.fillStyle=palette.sub; ctx.font=`400 ${labelSize}px ${face}`; ctx.fillText(label.toUpperCase(),x,yy);
        ctx.fillStyle=palette.text; ctx.font=`600 ${valueSize}px ${face}`; ctx.fillText(value,x,yy+valueSize*1.45);
        i++;
      });
      y += Math.ceil(fields.length/columns)*rowH + small;
      ctx.fillStyle=palette.sub; ctx.font=`400 ${labelSize}px ${face}`;
      y=drawWrapped(ctx,textFor(lang,'Daily highlight:','ಇಂದಿನ ವಿಶೇಷ:')+' '+(panchanga.recommendations?.businessOpening?.reason || panchanga.nakshatra.deity || ''),pad,y,w-pad*2,labelSize*1.5);

      ctx.fillStyle=palette.sub; ctx.font=`400 ${Math.max(16,Math.round(w*.017))}px ${face}`; ctx.globalAlpha=.82;
      ctx.fillText(DOMAIN,pad,h-pad);
      const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/jpeg',.93));
      if(!blob) return;
      const url=URL.createObjectURL(blob); const a=document.createElement('a');
      a.href=url; a.download=`VedRith-Panchanga-${panchanga.date}.jpg`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),5000);
    } finally { setGenerating(false); }
  };

  const pv=PREVIEW[theme as ShareTheme];
  return <div className="space-y-6">
    <div><p className="text-xs text-muted-foreground mb-2">{textFor(lang,'Theme','ಥೀಮ್')}</p><div className="flex flex-wrap gap-2">{THEMES.map(th=><button key={th} onClick={()=>setTheme(th)} className={`px-3 py-1 text-xs rounded-full border ${theme===th?'border-primary bg-primary text-primary-foreground':'hover:bg-accent'}`}>{t(`share.${th}`,lang)}</button>)}</div></div>
    <div><p className="text-xs text-muted-foreground mb-2">{textFor(lang,'Format','ರೂಪ')}</p><div className="flex flex-wrap gap-2">{ASPECTS.map(a=><button key={a} onClick={()=>setAspect(a)} className={`px-3 py-1 text-xs rounded-full border ${aspect===a?'border-primary bg-primary text-primary-foreground':'hover:bg-accent'}`}>{a}</button>)}</div></div>
    <div className="flex justify-center"><div className={`${PREVIEW_SIZES[aspect as ShareAspect]} ${pv.bg} bg-gradient-to-br rounded-2xl p-6 flex flex-col justify-between shadow-xl overflow-hidden`}>
      <div><p className={`text-xs ${pv.sub}`}>{textFor(lang,'Daily Panchanga','ನಿತ್ಯ ಪಂಚಾಂಗ')}</p><p className={`text-2xl font-bold mt-1 ${pv.text}`}>☀ VedRith</p><p className={`text-xs mt-1 ${pv.sub}`}>{panchanga.location.name || '—'} · {panchanga.date}</p></div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">{fields.slice(0,10).map(([a,b])=><div key={a} className="text-xs"><p className={pv.sub}>{a}</p><p className={`font-semibold ${pv.text}`}>{b}</p></div>)}</div>
      <p className={`text-[10px] ${pv.sub}`}>{DOMAIN}</p>
    </div></div>
    <div className="flex justify-center"><button onClick={downloadJPEG} disabled={generating} className="btn-gold">{generating?textFor(lang,'Generating image…','ಚಿತ್ರ ರಚಿಸಲಾಗುತ್ತಿದೆ…'):t('share.download',lang)}</button></div>
    <p className="text-center text-xs text-muted-foreground">{CANVAS_DIMS[aspect as ShareAspect].w} × {CANVAS_DIMS[aspect as ShareAspect].h}px · JPEG</p>
  </div>;
}
