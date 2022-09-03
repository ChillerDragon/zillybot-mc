# zillybot-mc

yet another crappy headless minecraft bot

Nothing to see here. The cool library that makes it all happen is https://github.com/PrismarineJS/mineflayer



## getting started

    cp env.example .env
    vim .env
    npm install
    node zillybot.js


## goals of the project

Building a headless client that can be used as interactive terminal client and as bot.

### interactive client

- [x] chatting
- [ ] basic controls
    + [ ] drop items
    + [ ] walk around a bit

### bot client

- [x] log everything to a file
    + [ ] parse the logfile or use a database to get stats
- [ ] chat commands about stats
    + [ ] !lastseen
    + [ ] !firstseen
    + [ ] !deaths
    + [ ] !kills
- [ ] bridge minecraft chat to irc

## features

- show playerlist on join
- interactive chat
- chat logfile

![chat](img/chat.png)
