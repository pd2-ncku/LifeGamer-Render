render-server
=====

![travis-status](https://travis-ci.org/pd2-ncku/LifeGamer-Render.svg?branch=master)

Render part of a game project.

# How does it work ?
- Sign up : User sign up with our website
- Prepare : User can upload their code for ai / or using keyboard to play
- To Battle : Then user can choose the opponent , and go to arena !
- Arena : Using your ai program / keyboard control to defeat your enemy.

# Role of render-server
- To render the battle field of arena , and maintain all players' connections.
- Store each battle as record and provide replay service.

# Build
- Requirement :
    - node version : `v6.9.4`
    - npm version : `v3.10.10`

```shell=bash
> npm run all
```

# Usage
- "<url>/check_connection" : checking all connections in battle.
- "<url>/replay_list" : Reviewing all available replay log.
- "<url>/game_start?p1=pname&p2=pname" : battle room of pname(represent as player's name).

# Reference
- [Minion Status Intro Page](http://slides.com/kevinbird61/pd2-royale/fullscreen)

# Contribution of Art
- [先行者](http://www.pixiv.net/member_illust.php?id=5997957) (f26401004@gmail.com)
    - Art work of `human piper`,`elf dancer`,`undead alchemist`
- [Darkborderman](https://github.com/Darkborderman)
    - Art work of new `buildings` and `sgram` piskel version.
- [H+](https://soundcloud.com/9xeiexzqbawv) (hplus840426@gmail.com)
    - Design back ground music of `end-of-game`,`battle`,and `start-of-game`
    - Art work of `human thief`
    - More about H+ : [youtube](https://www.youtube.com/channel/UCPEdLLsXN8wxl-q3Esnq6eg) , [soundcloud](https://soundcloud.com/9xeiexzqbawv)
- 邱
    - Art work of `elf archer`
- 黃
    - Art work of `human priest`
- Kevin Cyu (kevinbird61@gmail.com)
    - Render engine builder and art design of most piskel character.
