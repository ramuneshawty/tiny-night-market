/* Flavor rules are independent of the interface and renderer. */
const Flavor={
  traits:[[1,0,1],[4,0,0],[1,0,0],[0,5,0],[0,0,3],[0,-2,4],[0,0,1],[2,1,1]],
  labels:['Earthy','Heat','Richness'],
  notes:['The comforting base','Earthy and savory','Fresh, light, a little crunch','Brings a fiery kick','Soft and rich','Richness that softens heat','Sweet little pops','Savory, mellow when golden'],
  cravings:[
    {id:'earthy',text:'Something earthy, with a little heat.',target:[6,2,4]},
    {id:'creamy',text:'Rich and comforting. Keep it mild.',target:[2,0,7]},
    {id:'gentle',text:'A gentle bowl with a sweet little crunch.',target:[1,0,3]},
    {id:'fire',text:'Make it fiery, with a savory finish!',target:[3,7,3]},
    {id:'fresh',text:'Something fresh and light tonight.',target:[2,0,1]},
    {id:'earthrich',text:'Deeply earthy and wonderfully rich, please.',target:[7,0,8]},
    {id:'earthfire',text:'Earthy mushrooms and a bold fiery kick!',target:[7,5,2]},
    {id:'silkyheat',text:'Something silky, with a little warmth.',target:[2,4,6]},
    {id:'forest',text:'A deeply earthy forest bowl. Keep it light.',target:[8,0,2]},
    {id:'garlic',text:'Mellow garlic and a silky broth, please.',target:[4,1,5]}
  ],
  clamp:v=>Math.max(0,Math.min(10,v)),
  profile(recipe,tech={brown:.55,slices:4,stirs:4},adjust={butter:0,broth:0,chili:0}){
    const p=[0,0,0];for(const id of recipe)for(let j=0;j<3;j++)p[j]+=Flavor.traits[id][j];
    const golden=tech.brown>=.38&&tech.brown<=.78;
    if(recipe.includes(1)&&golden)p[0]+=1;
    if(recipe.includes(7)&&golden)p[1]=Math.max(0,p[1]-1);
    if(golden&&tech.stirs>=3)p[2]+=.5;
    p[1]=(p[1]-2*adjust.butter+2.5*adjust.chili)*Math.pow(.72,adjust.broth);p[2]+=2*adjust.butter-.6*adjust.broth;
    return p.map(Flavor.clamp);
  },
  matches(profile,craving){const dif=profile.map((v,i)=>Math.abs(v-craving.target[i]));return Math.max(...dif)<=3.25&&(dif[0]+dif[1]*1.2+dif[2])/3.2<=1.9},
  feedback(profile,craving,tech){
    if(tech.brown>.82)return 'A smoky edge from the pan. A gentler sear next time will taste sweeter.';
    if(tech.brown<.3)return 'A little pale. Return to the pan to bring out the flavor.';
    if(Flavor.matches(profile,craving))return 'That is the balance! Warm, fragrant, and ready to serve.';
    const diff=profile.map((v,i)=>v-craving.target[i]);
    if(diff[1]>1.8)return 'A little too fiery. Butter or broth can soften the heat.';
    if(diff[1]<-1.8)return 'It needs a little warmth. Try a pinch of chili.';
    const i=Math.abs(diff[0])>Math.abs(diff[2])?0:2;
    return i===0?(diff[0]<0?'More earthy depth would help. Mushrooms or garlic are worth trying next time.':'Very earthy! A different customer might enjoy this bowl more.'):(diff[2]<0?'A touch of butter would make it more comforting.':'Quite rich. A splash of broth could lighten it.');
  },
  quality:tech=>tech.brown>.82?'Smoky':tech.brown<.3?'Lightly cooked':tech.stirs<3?'Rustic sear':'Golden sear',
  key:recipe=>[...recipe].sort((a,b)=>a-b).join(',')
};
if(typeof window!=='undefined')window.Flavor=Flavor;
