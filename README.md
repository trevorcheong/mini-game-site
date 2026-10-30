# Mini Game Site

## 文件结构
```
index.html        游戏大厅（所有游戏列表）
play.html         游戏页面（play.html?game=游戏id）
games.config.js   ★ 游戏清单 —— 新增游戏只改这里
assets/
  style.css       样式
  common.js       共用功能（弹窗、TOKEN 显示）
  token.js        ★ TOKEN 逻辑 —— 以后接第三方 API 改这里
games/            游戏 HTML
thumbs/           游戏缩略图（建议 1:1 正方形，至少 512x512）
```

## 新增游戏
1. 游戏 HTML 放进 `games/`
2. 缩略图放进 `thumbs/`（没有图也行，会显示渐变占位图）
3. 打开 `games.config.js`，复制一个 `{ ... }` 区块，改 id / title / file / thumb / cost / howTo

## TOKEN 流程
- 大厅点 thumbnail → 进入 play.html → 显示玩法 + 需要多少 TOKEN → 按 Start 扣 TOKEN → 游戏开始
- 刷新游戏页不会重复扣；按右上角 ↻ 重玩会再扣一次；回到大厅即结束这一局
- 现在是演示模式：余额存在浏览器，默认 100，页尾有 “reset tokens”

## 接第三方 API（之后）
在 `assets/token.js` 填 `API_BASE`，后端需提供：
- `GET  /balance` → `{ "balance": 95 }`
- `POST /play` body `{ "gameId": "croc-road" }` → `{ "balance": 90, "sessionId": "..." }`

第三方网站跳转过来时带上玩家 token：`https://你的网站/index.html?token=玩家TOKEN`
系统会自动用 `Authorization: Bearer 玩家TOKEN` 呼叫 API。

## 游戏规则（每局扣一次 TOKEN）
- 赢了：voucher 自动出现在顶部 **My Vouchers** 栏；按游戏里的 Replay / Play again 会弹窗确认并扣 TOKEN
- 输了（整局没命/没机会）：按 Replay 会弹窗确认，扣 TOKEN 后直接重开
- 同一局里还有命/机会时的 “Try again” 仍免费（例如 Chicken 3 条命、Croco Road 3 次、Gold Rush 3 次机会）
- 游戏顶栏的 ↻ = 付费开新局

## 新游戏怎么接入（games/mgs-bridge.js）
在游戏 HTML 加 `<script src="mgs-bridge.js"></script>`，然后在游戏代码里：
```js
MGS.win({ amount: 0.5, code: "ABC-123", label: "RM0.50" });  // 赢到 voucher 时
MGS.gameOver();                                             // 整局输了时
// 游戏里 id="claimBtn"（或加 data-mgs-claim）的按钮会自动改走网站的领取接口
retryBtn.onclick = MGS.paid(restartGame);                   // 输后/赢后重玩都要扣 TOKEN
```
原版游戏备份在 `games_original_backup/`。

## 领取接口（CLAIM）
玩家按游戏里的 **CLAIM NOW**，或 My Vouchers 里的 **CLAIM**，网站会在**同一个窗口**跳回合作方网站：

```
{claim_url}?code=CROC-7KQ2PX&amount=0.70&currency=MYR&voucher_id=mvuukmf45h3c&game=croc-road&token=<玩家token>
```

| 参数 | 说明 |
|---|---|
| code | voucher code |
| amount | 金额（2 位小数） |
| currency | 货币，默认 MYR |
| voucher_id | 本网站的 voucher 编号（合作方用来防止重复领取） |
| game | 哪个游戏赢的 |
| token | 合作方带过来的玩家 token（识别是哪个玩家） |

领取网址来源（优先顺序）：
1. 合作方跳过来时带在网址：`index.html?token=XXX&name=Trevor&claim_url=https://partner.com/claim`
2. `assets/voucher.js` 里的 `CLAIM_URL` 默认值

两个都没有时，CLAIM 会显示 voucher code 让玩家复制。游戏内原本写死的领取网址已不再使用。

> 正式上线前：合作方收到领取请求后，应该向本网站后端确认这张 voucher 真的存在、还没被领过
>（`POST {API_BASE}/vouchers/{voucher_id}/claim`），不能只相信网址上的参数。

## Voucher 存放
`assets/voucher.js` —— 演示模式存在浏览器；填 `CLAIM_URL` 后 My Vouchers 弹窗会出现 “Claim on partner site” 按钮。
