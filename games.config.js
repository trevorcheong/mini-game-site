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
    ]
  }
];
