(function(){
var idx=window.SEARCH_INDEX||[],q=document.getElementById('q'),box=document.getElementById('results'),sel=-1;
document.getElementById('menu').onclick=function(){document.getElementById('side').classList.toggle('open')};
function escRe(s){return s.split('').map(function(c){return '.*+?^${}()|[]\\'.indexOf(c)>-1?'\\'+c:c}).join('')}
function esc(s){return s.replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function run(){
  var terms=q.value.toLowerCase().split(/\s+/).filter(function(w){return w.length>1});
  if(!terms.length){box.hidden=true;return}
  var hits=[];
  idx.forEach(function(r){
    var h=r.t.toLowerCase(),p=r.p.toLowerCase(),x=r.x.toLowerCase(),score=0;
    for(var i=0;i<terms.length;i++){
      var w=terms[i],s=0;
      if(h.indexOf(w)>-1)s+=10;
      if(p.indexOf(w)>-1)s+=3;
      var pos=x.indexOf(w);
      if(pos>-1)s+=1+Math.min(3,(x.split(w).length-1)/3);
      if(!s){score=0;break}
      score+=s;
    }
    if(score)hits.push([score,r]);
  });
  hits.sort(function(a,b){return b[0]-a[0]});
  hits=hits.slice(0,25);
  if(!hits.length){box.innerHTML='<p style="padding:12px">No matches.</p>';box.hidden=false;return}
  box.innerHTML=hits.map(function(h){
    var r=h[1],x=r.x,i=x.toLowerCase().indexOf(terms[0]);
    var s=Math.max(0,i-60),snip=esc(x.substr(s,170));
    terms.forEach(function(w){snip=snip.replace(new RegExp('('+escRe(w)+')','ig'),'<mark>$1</mark>')});
    return '<a href="'+r.u+'"><b>'+esc(r.t)+'</b><small>'+esc(r.p)+'</small><p>'+(s?'…':'')+snip+'…</p></a>';
  }).join('');
  box.hidden=false;sel=-1;
}
q.addEventListener('input',run);
q.addEventListener('keydown',function(e){
  var items=box.querySelectorAll('a');
  if(e.key==='ArrowDown'){sel=Math.min(items.length-1,sel+1)}
  else if(e.key==='ArrowUp'){sel=Math.max(0,sel-1)}
  else if(e.key==='Enter'&&items.length){location.href=items[Math.max(sel,0)].getAttribute('href');return}
  else if(e.key==='Escape'){box.hidden=true;q.blur();return}
  else return;
  e.preventDefault();items.forEach(function(a,i){a.classList.toggle('sel',i===sel)});
  if(items[sel])items[sel].scrollIntoView({block:'nearest'});
});
document.addEventListener('click',function(e){if(!e.target.closest('.search'))box.hidden=true});
document.addEventListener('keydown',function(e){if(e.key==='/'&&document.activeElement!==q){e.preventDefault();q.focus()}});
var a=document.querySelector('.side a.active');if(a)a.scrollIntoView({block:'center'});
})();
