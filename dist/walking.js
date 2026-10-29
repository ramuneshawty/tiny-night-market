export const CUSTOMER_SPOTS=[{x:-2.5,z:5.2},{x:0,z:5.2},{x:2.5,z:5.2}];
export const SPAWN={x:0,z:3.05};
export function canStand(x,z){return x>=-4.1&&x<=4.1&&z>=2.5&&z<=7.1&&!CUSTOMER_SPOTS.some(p=>Math.hypot(p.x-x,p.z-z)<.88)}
export function movePlayer(position,input,dt){let {x,z}=position;const length=Math.hypot(input.x,input.z);if(length>.01){const speed=2.6*Math.min(length,1)*Math.min(dt,.05),dx=input.x/length*speed,dz=input.z/length*speed;if(canStand(x+dx,z))x+=dx;if(canStand(x,z+dz))z+=dz}return{x,z}}
export function nearby(position){const distances=CUSTOMER_SPOTS.map(p=>Math.hypot(position.x-p.x,position.z-p.z));const nearest=distances.indexOf(Math.min(...distances));return{atKitchen:Math.hypot(position.x,position.z-2.65)<1.12,nearCustomer:distances[nearest]<=1.48?nearest:null}}
