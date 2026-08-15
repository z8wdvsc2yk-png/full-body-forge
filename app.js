const library=[
{id:'squat',name:'Back Squat',movement:'Squat',muscles:'Quads, glutes, core',equipment:'Barbell'},
{id:'goblet',name:'Goblet Squat',movement:'Squat',muscles:'Quads, glutes, core',equipment:'Dumbbell'},
{id:'legpress',name:'Leg Press',movement:'Squat',muscles:'Quads, glutes',equipment:'Machine'},
{id:'split',name:'Bulgarian Split Squat',movement:'Squat',muscles:'Quads, glutes',equipment:'Dumbbell'},
{id:'pushup',name:'Push-up',movement:'Horizontal push',muscles:'Chest, triceps, shoulders',equipment:'Bodyweight'},
{id:'bench',name:'Bench Press',movement:'Horizontal push',muscles:'Chest, triceps, shoulders',equipment:'Barbell'},
{id:'dbbench',name:'Dumbbell Bench Press',movement:'Horizontal push',muscles:'Chest, triceps, shoulders',equipment:'Dumbbell'},
{id:'chestpress',name:'Machine Chest Press',movement:'Horizontal push',muscles:'Chest, triceps, shoulders',equipment:'Machine'},
{id:'row',name:'Chest-supported Row',movement:'Horizontal pull',muscles:'Back, rear delts, biceps',equipment:'Dumbbell'},
{id:'cablerow',name:'Seated Cable Row',movement:'Horizontal pull',muscles:'Back, rear delts, biceps',equipment:'Cable'},
{id:'barrow',name:'Barbell Row',movement:'Horizontal pull',muscles:'Back, rear delts, biceps',equipment:'Barbell'},
{id:'bandrow',name:'Band Row',movement:'Horizontal pull',muscles:'Back, rear delts, biceps',equipment:'Band'},
{id:'rdl',name:'Romanian Deadlift',movement:'Hinge',muscles:'Hamstrings, glutes, back',equipment:'Barbell'},
{id:'dbrdl',name:'Dumbbell Romanian Deadlift',movement:'Hinge',muscles:'Hamstrings, glutes, back',equipment:'Dumbbell'},
{id:'curl',name:'Leg Curl',movement:'Hinge',muscles:'Hamstrings',equipment:'Machine'},
{id:'hipthrust',name:'Hip Thrust',movement:'Hinge',muscles:'Glutes, hamstrings',equipment:'Barbell'},
{id:'ohp',name:'Overhead Press',movement:'Vertical push',muscles:'Shoulders, triceps',equipment:'Barbell'},
{id:'dbohp',name:'Dumbbell Shoulder Press',movement:'Vertical push',muscles:'Shoulders, triceps',equipment:'Dumbbell'},
{id:'machineohp',name:'Machine Shoulder Press',movement:'Vertical push',muscles:'Shoulders, triceps',equipment:'Machine'},
{id:'pulldown',name:'Lat Pulldown',movement:'Vertical pull',muscles:'Lats, upper back, biceps',equipment:'Cable'},
{id:'pullup',name:'Pull-up',movement:'Vertical pull',muscles:'Lats, upper back, biceps',equipment:'Bodyweight'},
{id:'bandpull',name:'Band Pulldown',movement:'Vertical pull',muscles:'Lats, upper back, biceps',equipment:'Band'},
{id:'lateral',name:'Lateral Raise',movement:'Accessory',muscles:'Side delts',equipment:'Dumbbell'},
{id:'curlb',name:'Dumbbell Curl',movement:'Accessory',muscles:'Biceps',equipment:'Dumbbell'},
{id:'pushdown',name:'Triceps Pushdown',movement:'Accessory',muscles:'Triceps',equipment:'Cable'},
{id:'plank',name:'Plank',movement:'Core',muscles:'Core',equipment:'Bodyweight'},
{id:'deadbug',name:'Dead Bug',movement:'Core',muscles:'Core',equipment:'Bodyweight'},
{id:'cablecrunch',name:'Cable Crunch',movement:'Core',muscles:'Core',equipment:'Cable'}];
const defaults={
A:{title:'Strength foundation',coverage:'Squat • push • pull • hinge • core',ex:[['squat',3,5,7,60],['bench',3,5,7,50],['row',3,6,8,22.5],['rdl',3,6,8,60],['lateral',2,10,15,7.5],['plank',3,30,45,0]]},
B:{title:'Hypertrophy balance',coverage:'Legs • chest • back • shoulders • arms',ex:[['legpress',3,8,12,80],['dbbench',3,8,12,20],['pulldown',3,8,12,45],['dbrdl',3,8,12,22.5],['dbohp',2,8,12,15],['curlb',2,10,15,10],['pushdown',2,10,15,20]]},
C:{title:'Unilateral and posterior',coverage:'Single-leg • push • pull • glutes • core',ex:[['split',3,8,10,14],['ohp',3,6,8,30],['pullup',3,5,8,0],['hipthrust',3,8,12,60],['pushup',2,8,15,0],['deadbug',3,8,12,0]]}};
const clone=x=>JSON.parse(JSON.stringify(x));
let state=JSON.parse(localStorage.getItem('fbf-state')||'null')||{day:'A',plans:clone(defaults),history:[],weights:[],settings:{small:2.5,large:5,days:6},draft:{}};
const save=()=>localStorage.setItem('fbf-state',JSON.stringify(state));
const byId=id=>library.find(x=>x.id===id);
const draftKey=(day,id)=>day+'-'+id;
function recommendation(ex){const [id,sets,min,max,start]=ex;const past=state.history.flatMap(h=>h.exercises).filter(x=>x.id===id);if(!past.length)return {weight:start,text:`Start at ${start?start+' kg':'bodyweight'} and finish with 1–3 reps in reserve.`};const last=past.at(-1), completed=last.sets.filter(s=>s.done);if(!completed.length)return {weight:last.weight,text:'Repeat the previous starting load.'};const allTop=completed.length>=sets&&completed.every(s=>s.reps>=max&&s.rir>=1);const misses=completed.filter(s=>s.reps<min).length;let w=last.weight,text='Keep this load and add reps within the range.';if(allTop){const lower=['Squat','Hinge'].includes(byId(id).movement);w=+(w+(lower?state.settings.large:state.settings.small)).toFixed(2);text=`Progress achieved. Try ${w} kg next time.`}else if(misses>=2){w=+(w*.95).toFixed(1);text=`Several sets missed the range. Consider ${w} kg and rebuild.`}return {weight:w,text}}
function renderToday(){const p=state.plans[state.day];dayPill.textContent='DAY '+state.day;workoutTitle.textContent=p.title;coverage.textContent=p.coverage;sessionCount.textContent=state.history.length;exerciseList.innerHTML='';p.ex.forEach((ex,i)=>{const item=byId(ex[0]),rec=recommendation(ex),key=draftKey(state.day,item.id),draft=state.draft[key]||Array.from({length:ex[1]},(_,n)=>({weight:rec.weight,reps:ex[2],rir:2,done:false}));state.draft[key]=draft;const c=document.createElement('article');c.className='exercise-card';c.innerHTML=`<div class="exercise-head"><div><h3>${i+1}. ${item.name}</h3><p>${item.muscles} • ${item.equipment}</p></div><button class="swap" data-swap="${i}">Switch</button></div><div class="recommend">${rec.text} Target: ${ex[1]} × ${ex[2]}–${ex[3]}</div><div class="set-caption"><span>WEIGHT (KG)</span><span>REPS / RIR</span></div>${draft.map((s,n)=>`<div class="set-row"><b>${n+1}</b><input data-field="weight" data-key="${key}" data-set="${n}" type="number" step="0.5" inputmode="decimal" value="${s.weight}"><div style="display:grid;grid-template-columns:1fr 1fr;gap:5px"><input data-field="reps" data-key="${key}" data-set="${n}" type="number" inputmode="numeric" value="${s.reps}"><input data-field="rir" data-key="${key}" data-set="${n}" type="number" min="0" max="5" inputmode="numeric" value="${s.rir}"></div><button class="tick ${s.done?'done':''}" data-key="${key}" data-set="${n}">✓</button></div>`).join('')}`;exerciseList.append(c)});save()}
function renderPlan(){planCards.innerHTML=Object.entries(state.plans).map(([k,p])=>`<div class="plan-card"><span class="pill" style="background:#eeeafd;color:#503fd0">DAY ${k}</span><h3>${p.title}</h3><ol>${p.ex.map(e=>`<li><b>${byId(e[0]).name}</b> • ${e[1]} × ${e[2]}–${e[3]}</li>`).join('')}</ol></div>`).join('')}
function renderProgress(){weightHistory.innerHTML=state.weights.slice(-5).reverse().map(w=>`<div><span>${new Date(w.date).toLocaleDateString()}</span><b>${w.value} kg</b></div>`).join('')||'<p>No weigh-ins logged.</p>';history.innerHTML=state.history.slice(-10).reverse().map(h=>`<div><span><b>Day ${h.day}</b><br>${new Date(h.date).toLocaleDateString()}</span><span>${h.exercises.reduce((a,e)=>a+e.sets.filter(s=>s.done).length,0)} sets</span></div>`).join('')||'<p>No workouts completed.</p>'}
function showPage(id){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.page===id));if(id==='plan')renderPlan();if(id==='progress')renderProgress()}
document.querySelector('nav').onclick=e=>{const b=e.target.closest('button');if(b)showPage(b.dataset.page)};
cycleDay.onclick=()=>{state.day=state.day==='A'?'B':state.day==='B'?'C':'A';renderToday()};
exerciseList.addEventListener('input',e=>{const t=e.target;if(!t.dataset.field)return;state.draft[t.dataset.key][+t.dataset.set][t.dataset.field]=+t.value;save()});
exerciseList.addEventListener('click',e=>{const tick=e.target.closest('.tick');if(tick){const s=state.draft[tick.dataset.key][+tick.dataset.set];s.done=!s.done;tick.classList.toggle('done',s.done);save()}const sw=e.target.closest('.swap');if(sw)openSwap(+sw.dataset.swap)});
let swapIndex=0;function openSwap(i){swapIndex=i;const ex=state.plans[state.day].ex[i],cur=byId(ex[0]);swapTitle.textContent=cur.name;equipmentFilter.value='all';drawSwaps();swapDialog.showModal()}
function drawSwaps(){const cur=byId(state.plans[state.day].ex[swapIndex][0]),filter=equipmentFilter.value;const opts=library.filter(x=>x.id!==cur.id&&x.movement===cur.movement&&(filter==='all'||x.equipment===filter));swapOptions.innerHTML=opts.map(x=>`<button class="swap-option" type="button" data-id="${x.id}"><b>${x.name}</b><span>${x.muscles} • ${x.equipment}</span></button>`).join('')||'<p>No matching alternatives for this equipment filter.</p>'}
equipmentFilter.onchange=drawSwaps;swapOptions.onclick=e=>{const b=e.target.closest('[data-id]');if(!b)return;const old=state.plans[state.day].ex[swapIndex],oldId=old[0];state.plans[state.day].ex[swapIndex][0]=b.dataset.id;delete state.draft[draftKey(state.day,oldId)];save();swapDialog.close();renderToday();renderPlan()};
finishWorkout.onclick=()=>{const p=state.plans[state.day],exercises=p.ex.map(ex=>{const item=byId(ex[0]),sets=state.draft[draftKey(state.day,item.id)]||[];return{id:item.id,name:item.name,weight:sets[0]?.weight||0,sets:clone(sets)}});if(!exercises.some(x=>x.sets.some(s=>s.done))){alert('Complete at least one set before finishing.');return}state.history.push({date:new Date().toISOString(),day:state.day,exercises});p.ex.forEach(ex=>delete state.draft[draftKey(state.day,ex[0])]);state.day=state.day==='A'?'B':state.day==='B'?'C':'A';save();renderToday();alert('Workout saved. Recommendations have been updated.')};
logWeight.onclick=()=>{const v=+weightInput.value;if(v>0){state.weights.push({date:new Date().toISOString(),value:v});weightInput.value='';save();renderProgress()}};
smallIncrement.value=state.settings.small;largeIncrement.value=state.settings.large;daysPerWeek.value=state.settings.days;[smallIncrement,largeIncrement,daysPerWeek].forEach(x=>x.onchange=()=>{state.settings={small:+smallIncrement.value,large:+largeIncrement.value,days:+daysPerWeek.value};save()});
resetData.onclick=()=>{if(confirm('Delete all plans, workouts and weigh-ins?')){localStorage.removeItem('fbf-state');location.reload()}};
let installPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;installBtn.hidden=false});installBtn.onclick=async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installBtn.hidden=true}};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');renderToday();