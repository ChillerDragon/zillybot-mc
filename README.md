# zillybot-mc

This is me being biggest **[@LiveOverflow](https://github.com/LiveOverflow)** simp and following his [yt series](https://www.youtube.com/watch?v=Ekcseve-mOg&list=PLhixgUqwRTjwvBI-hmbZ2rpkAl4lutnJG)

This repository contains a minecraft client made especially for LiveOverflow's server.
And also a proxy for debugging.

So unless you are playing on the LO server check out the libraries I use directly and not my weird crap on top of it.

 - [quarry](https://github.com/barneygale/quarry) python library I used to build the proxy
 - [mineflayer](https://github.com/PrismarineJS/mineflayer) nodejs library I used to build the client

## getting started

    cp env.example .env
    vim .env
    npm install
    node zillybot.js

### private data (ignore this, its just for me)

    git clone git@github.com:ChillerDragon/zillybot-mc-data.git data
    cd data
    ./setup.sh

## goals of the project

Building a headless client that can be used as interactive terminal client and as bot.

### interactive client

- [x] chatting
- [ ] show inventory
- [ ] notify user about danger
    + [ ] alert/disconnect on damage
    + [ ] alert/disconnect on creeper nearby
    + [ ] alert/disconnect on player nearby

### bot client

- [x] stay on server (auto reconnect)
- [ ] stay alive
    + [ ] auto eat
    + [ ] kill aura
    + [ ] no fall damage hack
- [x] log everything to a file
    + [ ] parse the logfile or use a database to get stats
- [ ] chat commands about stats
    + [ ] !lastseen
    + [ ] !firstseen
    + [ ] !deaths
    + [ ] !kills
    + [x] !seed
    + [x] !checkhash
    + [ ] !mail
- [x] bridge minecraft chat to irc

## features

- show playerlist on join
- interactive chat
- chat logfile

![chat](img/chat.png)
