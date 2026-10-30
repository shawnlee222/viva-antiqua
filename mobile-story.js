/* A separate mobile presentation. Original desktop markup is never rewritten. */
(() => {
  const media = matchMedia('(max-width:760px) and (min-height:600px)');
  const motion = matchMedia('(prefers-reduced-motion:reduce)');
  const base = '/viva-antiqua/';
  let dispose;
  const scenes = [
    {id:'opening',kind:'opening',label:'VIVA ANTIQUA',title:'The ancient world<br><em>in your hands</em>',text:'Read, listen, and understand',image:'caesar-reader-poster.jpg',video:'caesar-reader-iphone.mp4',button:'Watch the reader'},
    {id:'learning',kind:'learning',steps:[
      {label:'01 / READ',title:'Every word<br><em>within reach</em>',text:'Tap a word and discover its meaning',image:'dictionary-iphone.jpg?v=2',button:'Explore the screen',focus:'dictionary'},
      {label:'02 / UNDERSTAND',title:'Ask the text<br><em>and go deeper</em>',text:'Explore grammar and meaning with your AI tutor',image:'ask-balbus-iphone.jpg',button:'Explore the screen',focus:'balbus'},
      {label:'03 / REMEMBER',title:'Make it<br><em>stay with you</em>',text:'Review your saved words and passages',image:'review-card-iphone.png',button:'Explore the screen',focus:'review'}]},
    {id:'verse',kind:'verse',label:'LATIN · RECONSTRUCTED PRONUNCIATION',title:'Feel the rhythm<br><em>of poetry</em>',text:'Hear the Aeneid in its original metre',image:'aeneid-verse-poster.jpg',video:'aeneid-verse-iphone.mp4',button:'Listen to the Aeneid'},
    {id:'community',kind:'community',label:'A LANGUAGE TO SHARE',title:'Create<br><em>and share</em>',text:'Write stories, role-play, and share videos with fellow learners',image:'play-iphone.jpg?v=2',button:'Explore the screen'},
    {id:'homer',kind:'homer',label:'THE ILIAD & THE ODYSSEY',title:'Homer<br><em>in song</em>',text:'All 48 books of the Iliad and the Odyssey, sung in Ancient Greek with accurate meter and pitch accent',image:'odyssey-song-poster.jpg?v=2',video:'odyssey-song-iphone.mp4?v=2',button:'Listen to Homer'},
    {id:'speech',kind:'speech',label:'ATHENS · PERICLES',title:'History<br><em>brought to life</em>',text:'Pericles’ Funeral Oration in Ancient Greek',image:'pericles-poster.jpg',video:'pericles-speech-mobile.mp4?v=2',button:'Watch the speech'}
  ];
  function setup() {
    dispose?.(); dispose=null;
    if (!media.matches) return;
    const root=document.createElement('div');root.className='cinema-mobile';
    root.innerHTML=`<nav class="cinema-nav" aria-label="Mobile demo"><a href="#cinema-opening" class="cinema-brand" aria-label="Viva Antiqua"><img class="brand-lockup" src="/viva-antiqua/assets/viva-antiqua-brand-final.png" width="1402" height="1122" alt="Viva Antiqua"></a><div><a href="#cinema-learning">App</a><a href="#cinema-homer">Homer</a><a href="#cinema-speech">Pericles</a></div></nav>`;
    const tracks=[];
    for(const data of scenes){
      const track=document.createElement('section');track.className=`cinema-track cinema-${data.kind}`;track.id='cinema-'+data.id;
      const steps=data.steps||[data];
      track.style.setProperty('--stops',steps.length);
      track.innerHTML=`<div class="cinema-stage">${steps.map((s,i)=>`<article class="cinema-shot ${s.focus||''}" ${i?'inert aria-hidden="true"':''}>
        <div class="cinema-art">${s.video?`<div class="cinema-device"><video controls playsinline preload="none" src="${base}media/${s.video}" poster="${base}assets/${s.image}" aria-label="${s.button}" width="${data.kind==='speech'?720:388}" height="${data.kind==='speech'?1280:844}"></video></div>`:`<button class="cinema-device cinema-image-open" type="button" data-src="${base}assets/${s.image}" aria-label="${s.button}"><img src="${base}assets/${s.image}" alt="${s.label}" width="388" height="844" loading="lazy"></button>`}</div>
        <div class="cinema-shade"></div><div class="cinema-copy">${data.kind==='opening'||data.steps?`<p class="cinema-label">${s.label}</p>`:''}<h2>${s.title}</h2><p class="cinema-description">${s.text}</p></div>
        <div class="cinema-count" aria-hidden="true">${data.kind==='speech'?'':data.steps?`${i+1} / 3`:'SCROLL TO EXPLORE ↓'}</div></article>`).join('')}<div class="cinema-progress" aria-hidden="true"><span></span></div></div>`;
      root.append(track);tracks.push({track,shots:[...track.querySelectorAll('.cinema-shot')]});
    }
    const end=document.createElement('footer');end.className='cinema-end';end.innerHTML=`<h2 class="cinema-end-brand"><img class="brand-lockup" src="${base}assets/viva-antiqua-brand-final.png" width="1402" height="1122" alt="Viva Antiqua"></h2><p>Latin & Ancient Greek<br>Preparing for App Store release</p><div><a href="${base}support/">Support</a><a href="${base}privacy/">Privacy</a><a href="${base}terms/">Terms</a></div>`;root.append(end);
    const dialog=document.createElement('dialog');dialog.className='cinema-dialog';dialog.setAttribute('aria-label','Demo viewer');dialog.innerHTML='<button class="cinema-close" type="button" aria-label="Close demo">×</button><div class="cinema-player"></div>';root.append(dialog);
    document.body.append(root);document.documentElement.classList.add('cinema-enabled');
    let frame=0,returnFocus;
    function close(){dialog.close();dialog.querySelector('.cinema-player').replaceChildren();returnFocus?.focus({preventScroll:true});}
    function click(e){
      const link=e.target.closest('.cinema-nav a');
      if(link){e.preventDefault();document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:motion.matches?'instant':'smooth'});return;}
      const button=e.target.closest('.cinema-image-open');
      if(button){returnFocus=button;const el=document.createElement('img');el.src=button.dataset.src;el.alt='Full app screen';dialog.querySelector('.cinema-player').replaceChildren(el);dialog.showModal();return;}
      if(e.target.closest('.cinema-close')||e.target===dialog)close();
    }
    root.querySelectorAll('.cinema-device video').forEach(video=>{
      video.addEventListener('play',()=>{video.closest('.cinema-shot').classList.add('is-playing');});
      video.addEventListener('ended',()=>{video.closest('.cinema-shot').classList.remove('is-playing');});
    });
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)entry.target.pause();}),{threshold:0.15});
    root.querySelectorAll('video').forEach(v=>observer.observe(v));
    root.addEventListener('click',click);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
    function update(){
      frame=0;
      for(const {track,shots} of tracks){
        const rect=track.getBoundingClientRect(),height=track.querySelector('.cinema-stage').offsetHeight;
        const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-height)));
        const active=Math.min(shots.length-1,Math.floor(p*shots.length));
        for(let i=0;i<shots.length;i++){
          const shot=shots[i],local=Math.max(0,Math.min(1,p*shots.length-i));
          const visible=i===active;shot.inert=!visible;shot.setAttribute('aria-hidden',String(!visible));
          shot.style.opacity=visible?'1':'0';
          shot.style.setProperty('--zoom',motion.matches?'1':String(1+local*.16));
          shot.style.setProperty('--drift',motion.matches?'0px':`${-local*36}px`);
        }
        track.style.setProperty('--progress',p);
      }
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(update);}
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);motion.addEventListener('change',schedule);update();
    dispose=()=>{observer.disconnect();root.querySelectorAll('video').forEach(v=>v.pause());cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);motion.removeEventListener('change',schedule);dialog.close();dialog.querySelector('.cinema-player').replaceChildren();root.remove();document.documentElement.classList.remove('cinema-enabled');};
  }
  media.addEventListener('change',setup);setup();
})();
