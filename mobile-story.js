/* Enhance only portrait-size mobile layouts; desktop DOM and behavior stay intact. */
(() => {
  const mobile = matchMedia('(max-width: 760px) and (min-height: 600px)');
  const section = document.querySelector('#experience');
  const radios = [...section.querySelectorAll('input[name="learning-feature"]')];
  let cleanup;
  function setup() {
    cleanup?.();
    cleanup = null;
    if (!mobile.matches) return;
    const previousSelection = radios.find(r => r.checked);
    const stage = document.createElement('div');
    stage.className = 'mobile-learning-stage';
    while (section.firstChild) stage.append(section.firstChild);
    section.append(stage);
    section.classList.add('mobile-story');
    const hint = document.createElement('p');
    hint.className = 'mobile-story-hint';
    hint.textContent = 'Scroll to explore · 1 / 3';
    stage.append(hint);
    let frame = 0;
    function update() {
      frame = 0;
      const top = section.getBoundingClientRect().top;
      const travel = section.offsetHeight - stage.offsetHeight;
      const progress = Math.max(0, Math.min(1, (56 - top) / Math.max(1, travel)));
      const index = Math.min(2, Math.floor(progress * 3));
      radios[index].checked = true;
      hint.textContent = `Scroll to explore · ${index + 1} / 3`;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function select(event) {
      const index = radios.indexOf(event.target);
      if (index < 0) return;
      const start = scrollY + section.getBoundingClientRect().top - 56;
      const travel = section.offsetHeight - stage.offsetHeight;
      // Jump to the middle of each stage so reverse scrolling remains predictable.
      scrollTo({top: start + travel * ((index + .5) / 3), behavior: 'instant'});
      update();
    }
    addEventListener('scroll', schedule, {passive:true});
    addEventListener('resize', schedule);
    section.addEventListener('change', select);
    update();
    cleanup = () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      section.removeEventListener('change', select);
      hint.remove();
      if (previousSelection) previousSelection.checked = true;
      while (stage.firstChild) section.insertBefore(stage.firstChild, stage);
      stage.remove();
      section.classList.remove('mobile-story');
    };
  }
  mobile.addEventListener('change', setup);
  setup();
})();
