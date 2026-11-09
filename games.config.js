/* =========================================================
   游戏清单 GAME LIST
   ---------------------------------------------------------
   新增游戏只需 3 步：
   1. 把游戏 HTML 放进  games/  文件夹
   2. 把 thumbnail（建议 1:1 正方形，至少 600x600）放进  thumbs/  文件夹
   3. 在下面数组里复制一个 { ... } 区块，改好资料即可
   字段说明：
     id     唯一英文代号（会出现在网址 play.html?game=id）
     title  游戏名称
     file   游戏文件路径
     thumb  缩略图路径（没有图也可以，会自动显示渐变占位图）
     cost   每局需要多少 TOKEN
     tag    角标（可留空 ""）例：HOT / NEW
     color  主题色（占位图 & 光晕用）
     howTo  玩法说明，每一行是一点
     howTo_zh  中文玩法说明（网站切到中文时显示；没有就显示英文）
   ========================================================= */
window.GAMES = [
  {
    id: "chicken-cross",
    title: "Chicken Cross",
    file: "games/chicken-cross-game.html",
    thumb: "thumbs/chicken-cross.jpg",
    cost: 1,
    tag: "HOT",
    color: "#f59e0b",
    howTo: [
      "Hop across the river stones to grow your prize.",
      "A croc may strike on any hop — you have 3 lives.",
      "Cash out any time to lock in your voucher.",
      "Get caught and that run's winnings are lost."
    ],
    howTo_zh: [
      "跳过河里的石头，奖金会越来越多。",
      "每一跳都可能有鳄鱼攻击——你有 3 条命。",
      "随时可以收手，锁定你的现金券。",
      "被抓到的话，这一轮赢的就没了。"
    ]
  },
  {
    id: "croc-road",
    title: "Croco Road",
    file: "games/croc-road.html",
    thumb: "thumbs/croc-road.jpg?v=21",
    cost: 1,
    tag: "",
    color: "#22c55e",
    howTo: [
      "Tap GO to hop the croc across one lane.",
      "Every lane you cross adds RM0.10 to your voucher.",
      "Collect any time after the first lane.",
      "Get hit by a car and the run ends — 3 tries per game."
    ],
    howTo_zh: [
      "按 GO 让鳄鱼过一条车道。",
      "每过一条车道，现金券加 RM0.10。",
      "过了第一条车道后随时可以领取。",
      "被车撞到这一轮就结束——每局有 3 次机会。"
    ]
  },
  {
    id: "fortune-catch",
    title: "Catch the Fortune",
    file: "games/fortune-catch.html",
    thumb: "thumbs/fortune-catch.jpg",
    cost: 1,
    tag: "NEW",
    color: "#ef4444",
    howTo: [
      "Move left & right to catch the falling gold.",
      "Collect 20 gold before time runs out.",
      "Avoid firecrackers — each one costs 3 seconds and 2 gold.",
      "Hit the target to unlock a mystery cash reward."
    ],
    howTo_zh: [
      "左右移动接住掉下来的金子。",
      "时间结束前接满 20 个金子。",
      "避开鞭炮——每碰到一个扣 3 秒和 2 个金子。",
      "达到目标就能解锁神秘现金奖励。"
    ]
  },
  {
    id: "gold-rush-mines",
    title: "Gold Rush Mines",
    file: "games/gold-rush-mines.html",
    thumb: "thumbs/gold-rush-mines.jpg",
    cost: 1,
    tag: "",
    color: "#eab308",
    howTo: [
      "Tap rocks to dig — 25 rocks hide gems and bombs.",
      "Every gem adds RM0.10 to your voucher.",
      "Hit a bomb and you lose this dig.",
      "Tap Collect before it's too late!"
    ],
    howTo_zh: [
      "点石头挖矿——25 块石头里藏着宝石和炸弹。",
      "每挖到一颗宝石，现金券加 RM0.10。",
      "挖到炸弹，这次挖矿就输了。",
      "在太迟之前按 Collect 领取！"
    ]
  },
  {
    id: "jungle-whack",
    title: "Jungle Whack",
    file: "games/jungle-whack.html",
    thumb: "thumbs/jungle-whack.jpg",
    cost: 1,
    tag: "",
    color: "#84cc16",
    howTo: [
      "Tap the animals as they pop up.",
      "Hit 12 animals within 20 seconds to win.",
      "Don't hit the bomb — it costs you 3 seconds.",
      "Win to pick a mystery box with your prize voucher."
    ],
    howTo_zh: [
      "动物冒出来时快点打。",
      "20 秒内打中 12 只动物就赢。",
      "别打到炸弹——会扣 3 秒。",
      "赢了可以选一个神秘箱，里面有你的现金券。"
    ]
  },
  {
    id: "neon-rocket",
    title: "Neon Rocket",
    file: "games/neon-rocket-standalone.html",
    thumb: "thumbs/neon-rocket.jpg",
    cost: 1,
    tag: "18+",
    color: "#d946ef",
    howTo: [
      "Tap LAUNCH — the multiplier starts climbing.",
      "Tap CASH OUT before the rocket explodes.",
      "Cash out at the target multiplier (2.00×) or higher to win.",
      "The higher you cash out, the bigger your reward. 18+ only."
    ],
    howTo_zh: [
      "按 LAUNCH——倍数开始往上升。",
      "在火箭爆炸前按 CASH OUT。",
      "在目标倍数（2.00×）或更高时收手就赢。",
      "越晚收手，奖励越大。仅限 18 岁以上。"
    ]
  },
  {
    id: "golden-goal",
    title: "Golden Goal",
    file: "games/golden-goal.html",
    thumb: "thumbs/golden-goal.jpg?v=21",
    cost: 1,
    tag: "NEW",
    color: "#ffc93c",
    howTo: [
      "Tap a spot in the goal to shoot — corners are hardest to save.",
      "Every goal adds RM0.10 to your voucher, up to RM2.00.",
      "The keeper gets sharper as your voucher grows.",
      "The round ends after 3 missed or saved shots."
    ],
    howTo_zh: [
      "点球门里的位置射门——角落最难扑救。",
      "每进一球，现金券加 RM0.10，最多 RM2.00。",
      "现金券越多，守门员越厉害。",
      "射偏或被扑出 3 次，这一轮就结束。"
    ]
  },
  {
    id: "pocket-pilot",
    title: "Pocket Pilot",
    file: "games/pocket-pilot.html",
    thumb: "thumbs/pocket-pilot.jpg",
    cost: 1,
    tag: "NEW",
    color: "#ff5d7a",
    howTo: [
      "Tap to fly through the gaps between the storms and towers.",
      "Every coin gate adds RM0.10 to your voucher.",
      "Reach the finish to win the top prize of RM2.00.",
      "One crash ends the flight, and you keep the money you collected."
    ],
    howTo_zh: [
      "点屏幕飞过风暴和高塔之间的空隙。",
      "每穿过一个金币门，现金券加 RM0.10。",
      "飞到终点就赢得最高奖 RM2.00。",
      "撞到一次就结束，已收集的奖金归你。"
    ]
  },
  {
    id: "flash-memory",
    title: "Flash Memory",
    file: "games/flash-memory.html",
    thumb: "thumbs/flash-memory.jpg",
    cost: 1,
    tag: "NEW",
    color: "#9a7bff",
    howTo: [
      "Watch the lights flash, then tap them in the same order.",
      "Each level adds one more light. There are 10 levels.",
      "Every level you clear adds to your voucher, up to RM2.00.",
      "One wrong light ends the game, and you keep what you won."
    ],
    howTo_zh: [
      "看灯亮的顺序，然后照同样顺序点。",
      "每一关多一盏灯，一共 10 关。",
      "每过一关现金券就增加，最多 RM2.00。",
      "点错一盏灯游戏就结束，已赢的归你。"
    ]
  },
  {
    id: "stack-stack-win",
    title: "Stack Stack Win",
    file: "games/stack-stack-win.html",
    thumb: "thumbs/stack-stack-win.jpg?v=37",
    cost: 1,
    tag: "NEW",
    color: "#ff6f61",
    howTo: [
      "Tap to drop each sliding block onto the tower.",
      "Every layer you land adds RM0.10 to your voucher.",
      "Reach layer 20 to win the full RM2.00. Blocks get faster as you go up.",
      "Miss and the game ends, and you keep what you stacked."
    ],
    howTo_zh: [
      "点屏幕把滑动的方块放到塔上。",
      "每叠好一层，现金券加 RM0.10。",
      "叠到第 20 层赢得全额 RM2.00。越往上方块越快。",
      "没放好游戏就结束，已叠的奖金归你。"
    ]
  },
  {
    id: "fruit-slash",
    title: "Fruit Slash",
    file: "games/fruit-slash.html",
    thumb: "thumbs/fruit-slash.jpg?v=42",
    cost: 1,
    tag: "NEW",
    color: "#3fbf5a",
    howTo: [
      "Swipe to slice the fruits. Every 3 fruits adds RM0.10.",
      "Golden fruit adds RM0.10 instantly.",
      "Slice 3 or more in one swipe for a combo bonus.",
      "Hit a bomb or drop 3 fruits and it's over. You keep what you won, up to RM2.00."
    ],
    howTo_zh: [
      "滑动屏幕切水果。每切 3 个水果加 RM0.10。",
      "金色水果立刻加 RM0.10。",
      "一刀切 3 个或以上有连击奖励。",
      "切到炸弹或漏掉 3 个水果就结束。已赢的归你，最多 RM2.00。"
    ]
  },
  {
    id: "sword-in-stone",
    title: "Sword in the Stone",
    file: "games/sword-in-stone.html",
    thumb: "thumbs/sword-in-stone.jpg?v=52",
    cost: 1,
    tag: "NEW",
    color: "#f7c95a",
    howTo: [
      "Hold the screen and the gem slides along the bar.",
      "Release in the green zone to pull the sword. Each pull adds RM0.10.",
      "The zone gets smaller and the gem gets faster.",
      "Miss once and it's over. You keep what you won, up to RM2.00."
    ],
    howTo_zh: [
      "按住屏幕，宝石会在长条上来回滑动。",
      "在绿色区放开就能拔一次剑，每次加 RM0.10。",
      "绿色区会越来越小，宝石越来越快。",
      "失手一次就结束。已赢的归你，最多 RM2.00。"
    ]
  },
  {
    id: "ghost-hunt",
    title: "Ghost Hunt",
    file: "games/ghost-hunt.html",
    thumb: "thumbs/ghost-hunt.jpg?v=52",
    cost: 1,
    tag: "NEW",
    color: "#8a5cff",
    howTo: [
      "Drag anywhere to move the flashlight.",
      "Hold the light on a ghost to catch it: +RM0.10. A lucky golden ghost is +RM0.20.",
      "Keep the light off the bats, or you lose 3 seconds.",
      "You have 30 seconds. You keep what you won, up to RM2.00."
    ],
    howTo_zh: [
      "在屏幕任何地方拖动来移动手电筒。",
      "把光停在鬼魂上就能抓到：+RM0.10。幸运金色鬼魂 +RM0.20。",
      "别照到蝙蝠，不然会扣 3 秒。",
      "你有 30 秒。已赢的归你，最多 RM2.00。"
    ]
  },
  {
    id: "punch-rush",
    title: "Punch Rush",
    file: "games/punch-rush.html",
    thumb: "thumbs/punch-rush.jpg?v=51",
    cost: 1,
    tag: "NEW",
    color: "#d8232c",
    howTo: [
      "Tap the left or right half of the screen to punch that way.",
      "Each knockout adds RM0.10. The golden raccoon adds RM0.20.",
      "Don't punch the bombs. Let them roll past.",
      "Punch too early and you miss. 3 lives. You keep what you won, up to RM2.00."
    ],
    howTo_zh: [
      "点屏幕左边或右边，就往那边出拳。",
      "每打倒一个敌人加 RM0.10，金色浣熊加 RM0.20。",
      "别打炸弹，让它滚过去。",
      "太早出拳会打空。有 3 条命。已赢的归你，最多 RM2.00。"
    ]
  },
  {
    id: "rock-n-run",
    title: "Rock N Run",
    file: "games/rock-n-run.html",
    thumb: "thumbs/rock-n-run.jpg?v=63",
    cost: 1,
    tag: "NEW",
    color: "#e39a14",
    howTo: [
      "Swipe left or right to switch lanes, up to jump, down to slide.",
      "Every 40 m adds RM0.10. So do every 10 gems and each golden idol.",
      "Hit something and the boulder rolls closer. A second hit within 5 seconds and it catches you.",
      "Reach RM2.00 to escape into the treasure room. You keep what you won."
    ],
    howTo_zh: [
      "左右滑动换跑道，往上滑跳起，往下滑滑铲。",
      "每跑 40 米加 RM0.10，每收集 10 颗宝石、每拿到一个金像也各加 RM0.10。",
      "撞到障碍物，巨石就会追近。5 秒内再撞一次就会被巨石追上。",
      "赢到 RM2.00 就能逃进宝藏室。已赢的归你。"
    ]
  },
  {
    id: "walk-the-plank",
    title: "Walk the Plank",
    file: "games/walk-the-plank.html",
    thumb: "thumbs/walk-the-plank.jpg?v=66",
    cost: 1,
    tag: "NEW",
    color: "#1fb3c9",
    howTo: [
      "Tap STEP when the needle is in the green zone. Each step adds RM0.10.",
      "The plank can snap without warning. The break risk for the next step is shown.",
      "You have 3 lives. A fall sends you back to the ship at RM0.00.",
      "Tap CASH OUT any time to keep your prize. Reach the treasure chest for RM2.00."
    ],
    howTo_zh: [
      "指针在绿色区域时按 STEP，每走一步加 RM0.10。",
      "木板可能会突然断掉，下一步断掉的风险会显示出来。",
      "有 3 条命。掉下海就回到船上，从 RM0.00 重新开始。",
      "随时按 CASH OUT 拿走奖金。走到宝箱就是 RM2.00。"
    ]
  },
  {
    id: "planet-hop",
    title: "Planet Hop",
    file: "games/planet-hop.html",
    thumb: "thumbs/planet-hop.jpg?v=66",
    cost: 1,
    tag: "NEW",
    color: "#6b3fd6",
    howTo: [
      "Tap to launch the astronaut from the spinning planet. Time it so he lands on the next one.",
      "Each planet adds RM0.10, each star RM0.10, a gold planet RM0.20 — up to RM2.00.",
      "Miss a planet or hit a meteor and the game ends. You keep what you won.",
      "You have 30 seconds. Stars add 1 extra second."
    ],
    howTo_zh: [
      "点一下屏幕，太空人就从旋转的星球弹出去，抓准时机落到下一颗星球。",
      "每颗星球加 RM0.10，星星加 RM0.10，金色星球加 RM0.20，最多 RM2.00。",
      "没落到星球或撞到陨石，游戏就结束。已赢的归你。",
      "每局 30 秒，吃到星星多 1 秒。"
    ]
  },
  {
    id: "golden-eyes",
    title: "Golden Eyes",
    file: "games/golden-eyes.html",
    thumb: "thumbs/golden-eyes.jpg?v=67",
    cost: 1,
    tag: "NEW",
    color: "#c8201e",
    howTo: [
      "A demon hides in the crowd, disguised as one of them. Watch for its clue: a tail, horns, green eyes, an odd shadow, purple smoke, or the one who doesn't nod.",
      "Tap the demon before the timer runs out. Each demon found adds RM0.10.",
      "A wrong tap or running out of time ends the game. You keep what you won.",
      "Stuck? Tap GOLDEN EYES once per game and the demon glows gold. 20 rounds = RM2.00."
    ],
    howTo_zh: [
      "妖怪混在人群里，伪装成其中一个人。留意它露出的破绽：尾巴、犄角、绿眼睛、奇怪的影子、紫色妖气，或是大家点头时只有它不点头。",
      "在时间用完前点中妖怪，每抓到一只加 RM0.10。",
      "点错人或时间用完，游戏就结束。已赢的归你。",
      "找不到？每局可以用一次「GOLDEN EYES」火眼金睛，妖怪会发出金光。过完 20 关就是 RM2.00。"
    ]
  }
];
