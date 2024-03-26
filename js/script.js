const canvas = document.getElementById('canvas');
const fail = document.getElementById('fail')
const score = document.getElementById('score');
const timer = document.getElementById('timer');
const restart = document.getElementById('restart');
const quit = document.getElementById('quit');
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
    virusDy:3,
    virusTimeGenerate:1500,
    elFail:fail,
    elScore:score,
    elTimer:timer
});

Virus.Init()
Virus.start()

