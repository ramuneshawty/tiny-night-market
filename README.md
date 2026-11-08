# Tiny Night Market

A portrait-friendly fantasy cooking game with PSX-inspired 3D visuals. Walk around a lantern-lit market, listen to monster customers' cravings, experiment with flavors, slice and saute toppings, taste and adjust bowls, and discover 63 ingredient combinations.

## Play

https://tiny-night-market-moonbowl.robparra3.chatgpt.site

## Run locally

The game is a buildless static site. Serve the `dist` directory with any local HTTP server, for example:

```sh
python -m http.server 5173 --directory dist
```

Then open http://localhost:5173. Use a current browser with WebGL support.

## Controls

- Phone: drag the thumbstick or use directional buttons to walk; interact near the counter or a customer.
- Desktop: WASD or arrow keys to walk.
- Cooking: select ingredients, swipe to slice, drag to stir, then taste and adjust. Action buttons are also available.
- Customer patience and the night clock pause during cooking.

Coins, upgrades, and discovered recipes save in this browser's local storage.

## Checks

With Node.js installed:

```sh
node check.cjs
```

## Project layout

- `dist/`: complete static game, artwork, and vendored Three.js runtime.
- `check.cjs`: flavor, cooking, delivery, progression, and persistence checks.
- `ART-DIRECTION.md`: visual references, generation notes, and version checkpoint.
- `.openai/hosting.json`: existing Sites hosting configuration.

Three.js is distributed under the MIT license; its license is included at `dist/vendor/THREE-LICENSE.txt`. No license has been assigned to the original game source and artwork.
