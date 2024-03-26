const canvas = document.getElementById('canvas');
const fail = document.getElementById('fail')
const score = document.getElementById('score');
const timer = document.getElementById('timer');
const resume = document.getElementById('continue');
const restart = document.getElementById('restart');
const restartBtn = document.getElementById('btn-restart');
const quit = document.getElementById('quit');
const elStop = document.getElementById('stop');
const nama = document.getElementById('name');
const play = document.getElementById('play');
const start_game = document.getElementById('start-game');
const gameplay = document.getElementById('gameplay');
const userName = localStorage.getItem('name') ?? null;
const playerName = document.getElementById('player-name');
const image = new Image();
image.src = './Assets/virus.svg';

const Virus = new VirusGame({
    canvas:canvas,
    img:image,
    width: 384,
    height:730,
    noteQuantity:4,
    blockQuantity:4,
    virusQuantity:1,
    virusDy:2,
    virusTimeGenerate:1000,
    elFail:fail,
    elScore:score,
    elTimer:timer,
    elPlayer:playerName
});

let countPress = 0;

document.addEventListener('keydown', (e) => {
    if(e.key == 'Escape' && countPress == 0){
        elStop.classList.add('show');
        Virus.gameStatus = 'sendPause';
    }else if(e.key == 'Escape' && countPress == 1){
        elStop.classList.remove('show');
        Virus.gameStatus = 'sendResume';
    }
})

document.addEventListener('keyup', (e) => {
    if(e.key == 'Escape' && countPress == 0){
        countPress = 1;
    }else if(e.key == 'Escape' && countPress == 1){
        countPress = 0;
    }
})

resume.addEventListener('click',() => {
    countPress = 0;
    elStop.classList.remove('show');
    Virus.gameStatus = 'sendResume';
});

restart.addEventListener('click', () => {
    window.location.reload()
})

restartBtn.addEventListener('click', () => {
    window.location.reload()
})

play.addEventListener('click', () => {
    if(nama.value === ""){
      return alert("Masukkan Nama Terlebih Dahulu!");
    }
    localStorage.setItem('name',nama.value);
    start_game.classList.add('hide');
    gameplay.classList.add('show');
    Virus.Init()
    Virus.start()
    Virus.userName = nama.value;
})

window.addEventListener('load',() => {
    if(userName !== null){
        start_game.classList.add('hide');
        gameplay.classList.add('show');
        Virus.Init()
        Virus.start()
        Virus.userName = userName;
    }
})

quit.addEventListener('click',() => {
    localStorage.removeItem('name');
    localStorage.removeItem('score');
    window.location.reload();
})


