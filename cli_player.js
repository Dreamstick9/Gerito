#!/usr/local/bin/node
// // I have to make a cli music player

// /* The feature's I would want 
//    1) A command that I type that asks for the music songs directory
//    2) I choose a number that is linked with a song
//    3) It asks a confirmatory message wether I want to play this song, If I type 0 it goes back to the selector and if I type 1 it plays that song
//    4) The song starts playing, and I have a basic catalog of numbers that when typed do a action like pause, play, skip, previous.
// */

const path = require('node:path')
const fs = require('node:fs')
const { execFile } = require('node:child_process')
const readline = require('node:readline')

const SPLASH_DELAY = 3500

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

function showLoading(){
    console.log("Loading Gerito....")
}

function showBanner(){
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
}

function createPrompt(){
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
}

// Reads a directory and keeps only the .mp3 files in it
function readSongFiles(dir){
    return fs.readdirSync(dir).filter((i)=>{
        return i.endsWith(".mp3")
    })
}

// Strips the ".mp3" off every file name, for display
function toDisplayNames(files){
    return files.map((i)=>{
        return i.slice(0, -4)
    })
}

function printSongList(names){
    for(let i = 0; i < names.length; i++){
        console.log(`${i}. ${names[i]}`)
    }
}

// Lists the songs of one directory: reads, warns if empty, prints them.
// Returns { files, names } — files are the real names, names are the pretty ones.
function listSongsFrom(dir, listeningMessage, emptyMessage, rl){
    console.log(listeningMessage)
    const files = readSongFiles(dir)
    if (files.length == 0){
        console.log(emptyMessage)
        rl.close()
    }
    const names = toDisplayNames(files)
    printSongList(names)
    return { files, names }
}

function listSongsFromCurrentDirectory(rl){
    return listSongsFrom(
        process.cwd(),
        "Listing songs present in the current directory....",
        "There are no songs present please check the current directory",
        rl,
    )
}

function listSongsFromGivenDirectory(dir, rl){
    return listSongsFrom(
        dir,
        "Listing songs present in the given directory....",
        "There are no songs present in the given directory path, please check the directory",
        rl,
    )
}

function resolveSongPath(value, file){
    if(value == 'c'){
        return path.join(process.cwd(), file)
    }
    return path.join(value, file)
}

function playSong(name, songPath){
    console.log(`Now playing ${name}`)
    execFile('sh', ['-c', `afplay "${songPath}"`], (err) =>{
        if (err){
            console.log("Could not play:", err.message)
        }
    })
}

// Step 3: "So you want to play X?" -> play it or bail out
function askForConfirmation(rl, name, songPath){
    rl.question(`So you want to play ${name}...? \n \n Yes or No? \n \n ---> `, te =>{
        if(te.trim().toLowerCase()==="yes"){
            playSong(name, songPath)
            rl.close()
        }else{
            console.log("Okay bro take your time")
            rl.close()
        }
    })
}

// Step 2: pick a song by its number
function askForSong(rl, value, files, names){
    rl.question("Type the number of the song that you want to listen to \n \n --> ", choice =>{
        console.log()
        const name = names[choice]
        const file = files[choice]
        const songPath = resolveSongPath(value, file)
        askForConfirmation(rl, name, songPath)
    })
}

// Step 1: ask where the songs live
function askForDirectory(rl){
    rl.question("Paste the path of the music directory, Type 'c' for current \n \n ---> ", value =>{
        console.log()
        let songs
        if(value == 'c'){
            songs = listSongsFromCurrentDirectory(rl)
        }else{
            songs = listSongsFromGivenDirectory(value, rl)
        }
        askForSong(rl, value, songs.files, songs.names)
    })
}

function main(){
    showLoading()
    setTimeout(()=>{
        showBanner()
        const rl = createPrompt()
        askForDirectory(rl)
    }, SPLASH_DELAY)
}

main()


// const folderpath = '/Users/kushagargargsmacbook/Appdevelective/Lecture-17-aug/cli-music-player/songs'

// let contents_of_folder = fs.readdirSync(folderpath)
// console.log(contents_of_folder)
