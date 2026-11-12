const RAMP = " .:-=+*#%@";

const ART = [
  "                      .:-=+++=+=---:.                     ",
  "                   :=+*#########**#*+*-                   ",
  "                 -*##*******####*###*#%=                  ",
  "                +%#######################.                ",
  "               :%##%%%#**##*+*%######*%##*.               ",
  "               +#=++=-::----::-::=++*+-%*#*               ",
  "              .%-:==+==-:::::::--:-:...-*#%               ",
  "              -#.=====+*=-::-=+=--:--...-#%:              ",
  "              :#:-==++==+=:::=+++:-:....=#%.              ",
  "              ==-:-=====*:.-=-===-:--:::+#+.              ",
  "             -=:::::::--:...-:.:.......::. =.             ",
  "             ------:-====-:-:--::.. ...:.-.-.             ",
  "             .-:-----:-==-:::..:......:.::-.              ",
  "              :----=+=++==------.:....:::..               ",
  "                =--==+++===----=:....: .                  ",
  "                :+=----===-:....::::-.                    ",
  "                 .==----::......:---.                     ",
  "                   -+=++===----==-:.:                     ",
  "                  .===++**+==---::.:%=                    ",
  "                 -%+-==+=---:::::: *%#*:                  ",
  "             .:-+@+=======-:::::..=@####+=-.              ",
  "       ..:-+*%##%*:#======---::::-#%#####%@#*+-:.         ",
  "   .-+**##%%%**#%--**+=====-----==*%######%%##%##*=-.     ",
  " :*######%%#*##@*:-+++=--------==+#%#######%#########*=:. ",
  "=%%###%#%%####%%=-:==.:::--:--===*%########%%##%########*=",
  "%###%%%%%####%%*##=-=:..:#*#*+-=+#%########%%%%###########",
  "%%#%%%#######%%***#+-=:.+**+***+*%#%#######%%%##%########*",
  "%%%%@%######%%%==++#+=--*+++++++%%#%#######%%%*%%%######*#"
];

const SHIMMER_MS = 110;
const CELLS_PER_FRAME = 22;

export function initAsciiPortrait() {
  const el = document.getElementById('ascii-portrait');
  if (!el) return;

  el.textContent = ART.join('\n');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lit = [];
  ART.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== ' ') lit.push([y, x]);
    }
  });
  if (!lit.length) return;

  const grid = ART.map(row => row.split(''));

  setInterval(() => {
    if (document.hidden || el.offsetParent === null) return;
    for (let i = 0; i < CELLS_PER_FRAME; i++) {
      const [y, x] = lit[(Math.random() * lit.length) | 0];
      const step = Math.random() < 0.5 ? -1 : 1;
      const next = RAMP.indexOf(ART[y][x]) + step;
      grid[y][x] = RAMP[Math.min(RAMP.length - 1, Math.max(1, next))];
    }
    el.textContent = grid.map(row => row.join('')).join('\n');
  }, SHIMMER_MS);
}
