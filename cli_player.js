#!/usr/local/bin/node
// // I have to make a cli music player

// /* The feature's I would want 
//    1) A command that I type that asks for the music songs directory
//    2) I choose a number that is linked with a song
//    3) It asks a confirmatory message wether I want to play this song, If I type 0 it goes back to the selector and if I type 1 it plays that song
//    4) The song starts playing, and I have a basic catalog of numbers that when typed do a action like pause, play, skip, previous.
// */

console.log("Loading Gerito....")

const art = `
██████                  ██████    ██
██████                  ██████    ██
██      ██████  ██████    ██    ██████  ██████
██      ██████  ██████    ██    ██████  ██████
██      ██████  ██        ██      ██    ██  ██
██      ██████  ██        ██      ██    ██  ██
██  ██  ██      ██        ██      ██    ██  ██
██  ██  ██      ██        ██      ██    ██  ██
██████  ██████  ██      ██████    ████  ██████
██████  ██████  ██      ██████    ████  ██████
            
`


setTimeout(()=>{
    console.log()
console.log()
console.log()
console.log()
console.log()
console.log(art)
console.log("Gerito! Your personal cli music player is here!!")
console.log()
console.log()
console.log()
const path = require('node:path')
const fs = require('node:fs')
const { execFile } = require('node:child_process')
const readline = require('node:readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})


rl.question("Paste the path of the music directory, Type 'c' for current \n \n ---> ", value =>{
    console.log()
    let p
    let copy
    if(value == 'c'){
        console.log("Listing songs present in the current directory....")
        p = fs.readdirSync(process.cwd())
        p = p.filter((i)=>{
            return i.endsWith(".mp3")
        })
        if (p.length == 0){
            console.log("There are no songs present please check the current directory")
            rl.close()
        }
        copy = p
        copy = copy.map((i)=>{
            return i.slice(0, -4)
        })
        for(let i = 0; i < copy.length; i++){
            console.log(`${i}. ${copy[i]}`)
        }
    }else{
        console.log("Listing songs present in the given directory....")
        p = fs.readdirSync(value)
        p = p.filter((i)=>{
            return i.endsWith(".mp3")
        })
        if (p.length == 0){
            console.log("There are no songs present in the given directory path, please check the directory")
            rl.close()
        }
        copy = p
        copy = copy.map((i)=>{
            return i.slice(0, -4)
        })
        for(let i = 0; i < copy.length; i++){
            console.log(`${i}. ${copy[i]}`)
        }
    }
    rl.question("Type the number of the song that you want to listen to \n \n --> ", choice =>{
        console.log()
        let r = copy[choice]
        let q = p[choice]
        let v 
        if(value == 'c'){
            v = path.join(process.cwd(), q)
        }else{
            v = path.join(value, q)
        }
        rl.question(`So you want to play ${r}...? \n \n Yes or No? \n \n ---> `, te =>{
            if(te.trim().toLowerCase()==="yes"){
                console.log(`Now playing ${r}`)
                execFile('sh', ['-c', `afplay "${v}"`], (err) =>{
                    if (err){
                        console.log("Could not play:", err.message)
                    }
                })
                rl.close()
            }else{
                console.log("Okay bro take your time")
                rl.close()
            }
        })


    })
})
},3500)


// const folderpath = '/Users/kushagargargsmacbook/Appdevelective/Lecture-17-aug/cli-music-player/songs'

// let contents_of_folder = fs.readdirSync(folderpath)
// console.log(contents_of_folder) 