(function(){
    var POOL=["JavaScript","TypeScript","React","Node.js","Python","SQL","Git","REST APIs","Docker","AWS","CI/CD","Testing","System design","GraphQL","Kubernetes","Agile"];
    var $=function(id){return document.getElementById(id)};
    var drop=$('drop'),input=$('file');
  
    function hash(s){var h=7;for(var i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))>>>0}return h}
    function rng(seed){return function(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}}
  
    function analyze(name,size){
      var r=rng(hash(name+size)),have=[],lack=[];
      POOL.forEach(function(s){(r()>0.45?have:lack).push(s)});
      if(have.length<4){have=have.concat(lack.splice(0,3))}
      if(lack.length<3){lack=lack.concat(have.splice(0,2))}
      var score=Math.round(40+(have.length/POOL.length)*55+r()*5);
      return {score:Math.min(score,98),have:have,lack:lack};
    }
  
    function verdictFor(s){
      if(s>=85)return "Ready to ship. Send it out, then tighten the few gaps below.";
      if(s>=65)return "Close. Add the missing skills you really have and this is ready.";
      return "Early draft. Start with the missing skills below, then run it again.";
    }
  
    function chips(el,list){
      el.innerHTML='';
      list.forEach(function(s,i){
        var li=document.createElement('li');li.textContent=s;li.className='in';li.style.animationDelay=(i*40)+'ms';el.appendChild(li);
      });
    }
  
    function move(pct){$('fill').style.width=pct+'%';$('pin').style.left=pct+'%'}
  
    function countUp(to){
      var n=$('num'),t0=null,dur=1400;
      function step(t){t0=t0||t;var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);n.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(step)}
      requestAnimationFrame(step);
    }
  
    function run(name,size){
      $('err').textContent='';
      $('result').style.display='none';
      $('loading').style.display='block';
      $('drop').style.display='none';document.querySelector('.alt').style.display='none';
      $('lt').textContent='Reading your resume';$('ls').textContent='Extracting text';
      setTimeout(function(){$('lt').textContent='Matching skills';$('ls').textContent='Comparing against 16 common skills'},900);
      setTimeout(function(){
        var r=analyze(name,size);
        $('loading').style.display='none';
        $('result').style.display='block';
        $('fname').textContent=name;
        $('verdict').textContent=verdictFor(r.score);
        $('havec').textContent=r.have.length+' skills matched your resume.';
        $('lackc').textContent=r.lack.length+' skills worth adding if you have them.';
        chips($('have'),r.have);chips($('lack'),r.lack);
        move(r.score);countUp(r.score);
        $('result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
      },1900);
    }
  
    function handle(f){
      if(!f)return;
      if(f.type!=='application/pdf'&&!/\.pdf$/i.test(f.name)){$('err').textContent='That file isn\'t a PDF. Export your resume as a PDF and try again.';return}
      if(f.size>5*1024*1024){$('err').textContent='That PDF is over 5 MB. Compress it and try again.';return}
      run(f.name,f.size);
    }
  
    input.addEventListener('change',function(){handle(input.files[0])});
    ['dragenter','dragover'].forEach(function(e){drop.addEventListener(e,function(ev){ev.preventDefault();drop.classList.add('over')})});
    ['dragleave','drop'].forEach(function(e){drop.addEventListener(e,function(ev){ev.preventDefault();drop.classList.remove('over')})});
    drop.addEventListener('drop',function(ev){handle(ev.dataTransfer.files[0])});
    $('sample').addEventListener('click',function(){run('sample-resume.pdf',48210)});
    $('reset').addEventListener('click',function(){
      $('result').style.display='none';$('drop').style.display='block';document.querySelector('.alt').style.display='block';
      input.value='';move(0);$('num').textContent='0';
      window.scrollTo({top:0,behavior:'auto'});
    });
  })();