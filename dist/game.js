const $=s=>document.querySelector(s);const foods=[['🍜','Noodles'],['🍄','Mushroom'],['🥬','Greens'],['🌶️','Spice'],['🥚','Egg'],['🧈','Butter'],['🌽','Corn'],['🧄','Garlic']];
const toppingNames=['','Forest','Garden','Dragon','Golden egg','Velvet butter','Harvest corn','Moon garlic'];
const oldNames=new Map([['0,1','Forest ramen'],['0,2','Garden bowl'],['0,3','Dragon ramen'],['0,1,2','Moonlight special'],['0,1,3','Firefly feast']]);
// Every distinct set of one, two, or three toppings, over a noodle base.
const dishes=[];
for(let size=1;size<=3;size++){
  function combine(start,chosen){
    if(chosen.length===size){
      const recipe=[0,...chosen],key=recipe.join(',');
      const name=oldNames.get(key)||(size===1?toppingNames[chosen[0]]+' ramen':chosen.map(i=>foods[i][1]).join(' & ')+(size===2?' bowl':' feast'));
      dishes.push({name,recipe,price:4+size*4+(chosen.includes(3)?2:0)});
      return;
    }
    for(let i=start;i<foods.length;i++)combine(i+1,[...chosen,i]);
  }
  combine(1,[]);
}
const availableDishes=()=>dishes.filter(d=>d.recipe.length<=Math.min(4,night+1));
const names=['Mochi','Bramble','Pip','Clover','Nimbus','Fern','Tofu','Boba'];
let saved;try{saved=JSON.parse(localStorage.getItem('moonbowl-v1'))}catch{}
let bank=saved?.bank||0,night=saved?.night||1,levels=saved?.levels||[0,0,0],customers=[],selected=0,bowl=[],carried=null,remaining=120,running=false,paused=false,cooking=false,served=0,earned=0,streak=0,last=0;
const save=()=>{try{localStorage.setItem('moonbowl-v1',JSON.stringify({bank,night,levels}))}catch{}};
const icons=r=>r.map(i=>foods[i][0]).join(' ');
const gameWindow=typeof window==='undefined'?{}:window;
function hint(t){$('#hint').textContent=t}
function addCustomer(slot){const menu=availableDishes();customers[slot]={name:names[Math.floor(Math.random()*names.length)],skin:['#a7bd9b','#b6a1cd','#e8af91','#99bdc2'][Math.floor(Math.random()*4)],dish:menu[Math.floor(Math.random()*menu.length)],patience:1,max:75+levels[1]*12};renderCustomers()}
function renderCustomers(){gameWindow.market3d?.sync(customers,selected,levels);$('#customers').innerHTML=customers.map((c,i)=>`<button class="customer ${selected===i?'selected':''}" data-slot="${i}" aria-label="View ${c.name}: ${c.dish.name}, ${c.dish.recipe.map(f=>foods[f][1]).join(', ')}"><div class="order"><b>${c.name}</b> ${c.dish.name}<span class="recipe">${icons(c.dish.recipe)}</span><div class="patience"><i style="width:${c.patience*100}%"></i></div></div></button>`).join('');document.querySelectorAll('.customer').forEach(b=>b.onclick=()=>{if(!running||paused)return;focusCustomer(+b.dataset.slot);hint(`${customers[selected].name} would love ${customers[selected].dish.name.toLowerCase()}.`)})}
function focusCustomer(slot){if(slot!==selected){selected=slot;renderCustomers();stats()}}
function renderBowl(){gameWindow.market3d?.bowl(bowl);$('#bowl').textContent=carried?'🍲':bowl.length?'🥣':'🍽️';$('#dishname').textContent=carried?'Carrying a warm bowl':bowl.length?'Your bowl is taking shape':'Ready to cook';$('#ingredients').textContent=(carried||bowl).length?(carried||bowl).map(i=>foods[i][1]).join(' + '):'Match an order, then pick up your bowl';stats()}
function stats(){gameWindow.marketState={customers,selected,levels,bowl,carried,paused,running,cooking};$('#coins').textContent=bank;$('#menu-count').textContent=availableDishes().length+' / '+dishes.length+' recipes';$('#night').textContent=`NIGHT ${String(night).padStart(2,'0')}`;$('#served').textContent=served;$('#time').textContent=`☾ ${Math.max(0,Math.ceil(remaining))}s`;$('#carry-text').textContent=carried?'CARRYING '+icons(carried):'HANDS FREE · WALK TO COOK'}
function setCooking(value){cooking=value;$('#game').classList.toggle('cooking',value);stats()}
function atKitchen(){return !!gameWindow.walkState?.atKitchen}
function addIngredient(id){if(!running||paused||!cooking||!atKitchen()||carried)return;if(bowl.length>=4){hint('Bowl is full. Use ↺ to start again.');return}bowl.push(id);gameWindow.market3d?.ingredient(id);renderBowl()}
$('#pantry').innerHTML=foods.map(([icon,name],i)=>`<button class="ingredient" data-food="${i}"><span>${icon}</span>${name}</button>`).join('');document.querySelectorAll('.ingredient').forEach(b=>b.onclick=()=>addIngredient(+b.dataset.food));
$('#clear').onclick=()=>{if(running&&!paused&&cooking&&atKitchen()){bowl=[];renderBowl()}};
function pickup(){if(!running||paused||!cooking||!atKitchen()||carried)return;if(bowl.length<2||!bowl.includes(0)){hint('Add noodles and at least one topping first.');return}carried=[...bowl];bowl=[];setCooking(false);renderBowl();hint('Bowl ready! Walk to a customer and tap Serve.')}
$('#serve').textContent='Pick up bowl →';$('#serve').onclick=pickup;
function deliver(slot){if(!running||paused||!carried||gameWindow.walkState?.nearCustomer!==slot)return false;const c=customers[slot];if([...carried].sort().join()!==[...c.dish.recipe].sort().join()){hint(`${c.name} ordered ${c.dish.name}. Return to the counter to change your bowl.`);$('#walk-status').textContent='Wrong recipe. Return to the counter to change it.';streak=0;return false}gameWindow.market3d?.serve(slot);streak++;const tip=(c.patience>.5?2:0)+levels[0]*2+(streak>=3?3:0),amount=c.dish.price+tip;bank+=amount;earned+=amount;served++;carried=null;hint(`${c.name}: “So cozy! Thank you.” +${amount} ✦`);$('#combo').textContent=streak>=3?`${streak} bowl streak! +3 ✦`:'made with magic ✧';addCustomer(slot);renderBowl();save();return true}
function interact(){if(!running||paused)return;const location=gameWindow.walkState;if(location?.nearCustomer!=null){focusCustomer(location.nearCustomer);if(carried)deliver(location.nearCustomer);else{$('#walk-status').textContent=`${customers[selected].name}: ${customers[selected].dish.name}. Cook it at the counter.`;hint('Order selected. Walk back to the counter to cook.')}return}if(location?.atKitchen){if(carried){bowl=[...carried];carried=null;renderBowl()}setCooking(true);hint('Choose an order above. Tap ingredients, then pick up the bowl.');return}$('#walk-status').textContent='Move closer to the counter or a customer.'}
$('#interact').onclick=interact;$('#leave-kitchen').onclick=()=>{setCooking(false);hint('Walk to a customer, or return here to finish cooking.')};
function start(){remaining=120+levels[2]*15;served=0;earned=0;streak=0;bowl=[];carried=null;selected=0;customers=[];for(let i=0;i<3;i++)addCustomer(i);running=true;paused=false;setCooking(false);$('#pause').textContent='Ⅱ';$('#pause').setAttribute('aria-label','Pause game');$('#overlay').classList.add('hidden');gameWindow.market3d?.resetPlayer?.();renderBowl();hint('Walk to the counter and tap Cook.');last=performance.now()}
function end(){running=false;carried=null;bowl=[];setCooking(false);gameWindow.market3d?.bowl([]);night++;save();showShop()}
function showShop(){const upgradeNames=['Golden broth','Comfy waiting stools','Moonlit lanterns'],desc=['+2 stars per bowl','Customers wait 12s longer','Nights last 15s longer'];$('#overlay').innerHTML=`<section class="modal"><div class="eyebrow">THE LANTERNS ARE GLOWING LOW</div><div class="hero-icon">🌙</div><h1 style="font-size:36px">A lovely little night.</h1><p>${served} happy customers · ${earned} stars earned<br>You have <b>${bank} ✦</b> to grow your market.</p>${upgradeNames.map((n,i)=>{const cost=25*(levels[i]+1);return `<button class="upgrade" data-upgrade="${i}" ${bank<cost||levels[i]>=5?'disabled':''}><span>${n} · Lv ${levels[i]}<br><small>${desc[i]}</small></span><b>${levels[i]>=5?'MAX':cost+' ✦'}</b></button>`}).join('')}<button id="next" class="primary">Open night ${night} ↗</button><small>All 63 recipes unlock by night 3. Progress saves automatically.</small></section>`;$('#overlay').classList.remove('hidden');$('#next').onclick=start;document.querySelectorAll('[data-upgrade]').forEach(b=>b.onclick=()=>{const i=+b.dataset.upgrade,cost=25*(levels[i]+1);if(bank>=cost&&levels[i]<5){bank-=cost;levels[i]++;save();stats();showShop()}})}
$('#start').onclick=start;$('#pause').onclick=()=>{if(!running)return;paused=!paused;$('#pause').textContent=paused?'▶':'Ⅱ';$('#pause').setAttribute('aria-label',paused?'Resume game':'Pause game');gameWindow.market3d?.stopMoving?.();stats();hint(paused?'The market is paused.':'Welcome back. Your customers are waiting.')};document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)$('#pause').click()});
function frame(t){const dt=Math.min((t-last)/1000,.2);last=t;if(running&&!paused){remaining-=dt;customers.forEach((c,i)=>{c.patience-=dt/c.max;if(c.patience<=0){streak=0;hint(`${c.name} headed home. Another friend is here!`);addCustomer(i)}});document.querySelectorAll('.patience i').forEach((el,i)=>{el.style.width=customers[i].patience*100+'%';el.style.background=customers[i].patience<.25?'#c47a76':'#76a68a'});stats();if(remaining<=0)end()}requestAnimationFrame(frame)}
gameWindow.marketGame={interact,deliver,focusCustomer,addIngredient,pickup};stats();for(let i=0;i<3;i++)addCustomer(i);requestAnimationFrame(frame);
