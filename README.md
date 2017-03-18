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
- "<url>/game_start?p1=<p1>&p2=<p2>" : battle room of <p1> & <p2>.

# Reference
- [Minion Status Intro Page](http://slides.com/kevinbird61/pd2-royale/fullscreen)
