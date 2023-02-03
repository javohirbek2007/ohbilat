const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send(html));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
const mineflayer = require('mineflayer');
const autoeat = require("mineflayer-auto-eat");
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const inventoryViewer = require('mineflayer-web-inventory');
const { Vec3 } = require('vec3')
const collectBlock = require('mineflayer-collectblock').plugin


const bot = mineflayer.createBot({
  host: 'ir.skyblock.uz',
  port: 25566,
  username: 'Craft_vampir7',
  version: '1.12.1'
})



let coming = false
let continue_digging = true;

let password = "YETAKCHI"



bot.on('messagestr', (message) => {
  console.log(message)
  if (message.includes("/register")) {
    bot.chat(`/register ${password} ${password}`)
    bot.chat(`/is warp Generator`)
  }

  if (message.includes("/login")) {
    bot.chat(`/login ${password}`)
    bot.chat(`/is warp Generator`)
  }
})



async function dig() {
  if (!continue_digging) { return };
  if (!bot.heldItem || !bot.heldItem.name.includes('pickaxe')) {
    var pickaxe = bot.inventory.items().filter(i => i.name.includes('pickaxe'))[0];
    if (pickaxe) await bot.equip(pickaxe, 'hand')
    if (!pickaxe) {
      bot.chat("No picaxe")
      bot.quit();

    }

  }
  var block = bot.blockAtCursor(7);
  if (!block) return setTimeout(function() {
    dig();
  }, 100);
  await bot.dig(block, 'ignore', 'raycast')
  dig()
}

bot.on('chat', (username, message) => {
  if (message == '7ke') {
    coming = true
    const target = bot.players[username]?.entity
    if (!target) {
      bot.chat("/tpa Vampir_Ruh")
      return
    }
    const { x: playerX, y: playerY, z: playerZ } = target.position
    bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, 1))
    return


  }

}

)
bot.on('chat', (username, message) => {
  if (username == 'Vampir_Ruh') {
    if (message == '7kovla') {

      continue_digging = true;
      dig()
      bot.chat("Lanatlangan_ruh sila")


    }
  }
})
bot.on('chat', (username, message) => {
  if (username == 'Vampir_Ruh') {
    if (message == 'Bot Go') {


      bot.chat(`/is warp Generator`)


    }
  }
})

bot.on('chat', (username, message) => {
  if (username == 'Vampir_Ruh') {
    if (message == '7kovlama') {
      continue_digging = false;
    }
  }
})


bot.loadPlugin(autoeat)

bot.once("spawn", () => {
  bot.autoEat.options.priority = "foodPoints"
  bot.autoEat.options.bannedFood = []
  bot.autoEat.options.eatingTimeout = 3
})

// The bot eats food automatically and emits these events when it starts eating and stops eating.

bot.on("autoeat_started", () => {

  console.log("Auto Eat started!")
  continue_digging = false;


})

bot.on("autoeat_stopped", () => {
  console.log("Auto Eat stopped!")
  continue_digging = true;
})

bot.on("health", () => {
  if (bot.food === 20) bot.autoEat.disable()
  // Disable the plugin if the bot is at 20 food points
  else bot.autoEat.enable() // Else enable the plugin again
})


// inventoryViewer(bot)
bot.loadPlugin(collectBlock)

let mcData
bot.once('spawn', () => {
  mcData = require('minecraft-data')(bot.version)
})

bot.on('chat', async (username, message) => {
  const args = message.split('inventoryViewer ')
  if (args[0] !== 'collect') return

  let count = 1
  if (args.length === 3) count = parseInt(args[1])

  let type = args[1]
  if (args.length === 3) type = args[2]

  const blockType = mcData.blocksByName[type]
  if (!blockType) {
    return
  }

  const blocks = bot.findBlocks({
    matching: blockType.id('inventoryViewer'),
    maxDistance: 64,
    count: count
  })

  if (blocks.length === 0) {
    bot.chat("I don't see that block nearby.")
    return
  }

  const targets = []
  for (let i = 0; i < Math.min(blocks.length, count); i++) {
    targets.push(bot.blockAt(blocks[i]))
  }

  bot.chat(`Found ${targets.length} ${type}(s)`)

  try {
    await bot.collectBlock.collect(targets)
    // All blocks have been collected.
    bot.chat('Done')
  } catch (err) {
    // An error occurred, report it.
    bot.chat(err.message)
    console.log(err)
  }
})
bot.on('kicked', console.log)
bot.on('error', console.log)
