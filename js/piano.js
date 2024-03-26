class VirusGame {
    constructor(object) {
        this.canvas = object.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = object.width;
        this.canvas.height = object.height;
        this.userName = "";
        this.timestamp = 0;
        this.timePassed = 0;
        this.startTime = 0;
        this.timeDifference = 0;
        this.failScore = 0;
        this.score = 0;
        this.gameStatus = 'play';
        this.blockQuantity = object.blockQuantity;
        this.LinePosition = [
            {
                x: this.canvas.width / 4,
                y: this.canvas.height
            }, {
                x: this.canvas.width / 2,
                y: this.canvas.height
            }, {
                x: this.canvas.width - this.canvas.width / 4,
                y: this.canvas.height
            },
        ]

        this.danger =
        {
            w: this.canvas.width,
            h: this.canvas.height / 3
        },
            this.dangerPos =
            {
                x: 0,
                y: this.canvas.height / 2.5
            },

            this.failPos =
            {
                x: 0,
                y: 536
            }

        this.NoteQuantity = object.noteQuantity;
        this.NotePos = [
            {
                x: 0,
                y: this.canvas.height / 1.33
            },
            {
                x: this.LinePosition[0].x,
                y: this.canvas.height / 1.33
            },
            {
                x: this.LinePosition[1].x,
                y: this.canvas.height / 1.33
            },
            {
                x: this.LinePosition[2].x,
                y: this.canvas.height / 1.33
            }
        ],
            this.indexPress = null;

        this.virusQuantity = object.virusQuantity;
        this.Virus = [];
        this.VirusImage = object.img;
        this.VirusDy = object.virusDy;
        this.VirusTimeGenereate = object.virusTimeGenerate;

        this.textNote = ["D", "F", "J", "K"];

        this.elFail = object.elFail;
        this.elScore = object.elScore;
        this.elTimer = object.elTimer;
        this.elPlayer = object.elPlayer;
    }
    Init() {
        for (let i = 1; i < this.virusQuantity; i++) {
            this.generateVirus();
        }

        this.event();
    }

    drawBlock() {
        this.ctx.beginPath()
        this.ctx.fillStyle = '#3e3e3e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.closePath()
    }

    drawLine() {
        this.LinePosition.forEach(length => {
            this.ctx.beginPath()
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(length.x, 0);
            this.ctx.lineTo(length.x, length.y);
            this.ctx.stroke()
            this.ctx.closePath()
        })
    }

    drawDanger() {
        this.ctx.beginPath()
        this.ctx.fillStyle = '#fa24247f';
        this.ctx.fillRect(this.dangerPos.x, this.dangerPos.y, this.danger.w, this.danger.h)
        this.ctx.fill()
        this.ctx.closePath()
    }

    drawFailArea() {
        this.ctx.beginPath()
        this.ctx.fillStyle = '#505050';
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;
        this.ctx.rect(this.failPos.x, this.failPos.y, this.canvas.width, 10);
        this.ctx.fill()
        this.ctx.stroke()
    }

    drawNote() {
        this.NotePos.forEach((length, index) => {
            this.ctx.beginPath()
            this.ctx.lineWidth = 5;
            this.ctx.fillStyle = index % 2 == 0 ? "#8067c4" : "#4aa9d6";
            this.ctx.rect(length.x, length.y, this.canvas.width / 4.1, 180)
            this.ctx.fill()

            this.indexPress !== null && this.indexPress == index ? this.ctx.strokeStyle = "#ffff5f9f" : this.ctx.strokeStyle = "#262626";
            this.ctx.strokeRect(length.x, length.y, this.canvas.width / 4.1, 180);
            this.ctx.closePath()

            this.ctx.fillStyle = "white";
            this.ctx.font = "48px Arial";
            this.ctx.fillText(this.textNote[index], length.x + 30, length.y + 110, this.canvas.width / 4);
        })

    }

    drawVirus() {
        this.Virus.forEach(virus => {
            this.ctx.beginPath()
            this.ctx.drawImage(this.VirusImage, virus.x + 10, virus.y - 50, this.canvas.width / 4 - 20, this.canvas.width / 4 - 20);
        })
    }

    draw() {
        this.drawBlock()
        this.drawLine()
        this.drawDanger()
        this.drawFailArea()
        this.drawNote()
        if (this.gameStatus == 'play') {
            this.drawVirus()
        }
    }

    updateTimer(timestamp) {
        let timeNew = timestamp - this.timeDifference;

        let second = Math.floor((timeNew / 1000) % 60);
        let minutes = Math.floor((timeNew / (1000 * 60)) % 60);
        let hours = Math.floor((timeNew / ((1000 * 60) * 60)) % 60);
        this.elTimer.innerText = `${hours < 10 ? 0 : ''}${hours}:${minutes < 10 ? 0 : ''}${minutes}:${second < 10 ? 0 : ''}${second}`
    }

    updatePlayer() {
        this.elPlayer.innerText = this.userName;
    }

    updateFailScore(score) {
        this.failScore += score;
        this.elFail.innerText = this.failScore;
    }

    updateScore(score) {
        this.score += score;
        this.elScore.innerText = this.score;
    }

    updateVirus() {
        this.Virus.forEach((virus, index) => {
            if (virus.y >= (this.failPos.y - 30)) {
                this.Virus.splice(index, 1);
                this.updateFailScore(1);
            }
        })
    }

    updateDanger(x) {
        this.Virus.forEach((virus, index) => {
            if (virus.x == x) {
                if (Math.floor(virus.y / (this.danger.h + 90)) !== 0) {
                    this.Virus.splice(index, 1);
                    this.updateScore(1);
                }
            }
        })
    }

    updateSpeed(){
        this.VirusDy <= 5 ? this.VirusDy += 0.1 : this.VirusDy = 5;
    }

    update(timestamp) {
        if (this.gameStatus == 'play') {
            this.updateVirus()
            let gameTime = timestamp - this.startTime;
            this.updateTimer(gameTime);
            this.updatePlayer();
        }
    }

    generateVirus() {
        let virus = this.randPos(0, this.NotePos.length);
        this.Virus.push({
            x: this.NotePos[virus].x,
            y: 0
        });
    }

    gameOver() {
        let bestScore = localStorage.getItem('score') ?? 0;
        if (this.score > bestScore) localStorage.setItem('score', this.score);
        bestScore = localStorage.getItem('score') ?? this.score;
        alert(`Try Again!, Your Best Score Is : ${bestScore}`);
        this.gameStatus = 'stop';
    }

    start() {
        requestAnimationFrame((timestamp) => {
            this.startTime = timestamp;
            this.render(0)
        })
    }

    event() {
        document.addEventListener('keydown', (e) => {
            if (e.key == 'd' || e.key == 'D') {
                this.indexPress = 0;
                this.Virus.forEach((virus) => {
                    if (virus.x == this.NotePos[0].x) {
                        this.updateDanger(virus.x)
                    }
                })
            }
            if (e.key == 'f' || e.key == 'F') {
                this.indexPress = 1;
                this.Virus.forEach((virus) => {
                    if (virus.x == this.NotePos[1].x) {
                        this.updateDanger(virus.x);
                    }
                })
            }
            if (e.key == 'j' || e.key == 'J') {
                this.indexPress = 2;
                this.Virus.forEach((virus) => {
                    if (virus.x == this.NotePos[2].x) {
                        this.updateDanger(virus.x)
                    }
                })
            }
            if (e.key == 'k' || e.key == 'K') {
                this.indexPress = 3;
                this.Virus.forEach((virus) => {
                    if (virus.x == this.NotePos[3].x) {
                        this.updateDanger(virus.x)
                    }
                })
            }
        })
        document.addEventListener('keyup', (e) => {
            if (e.key == 'd' || e.key == 'D') {
                this.indexPress = null;
            }
            if (e.key == 'f' || e.key == 'F') {
                this.indexPress = null;
            }
            if (e.key == 'j' || e.key == 'J') {
                this.indexPress = null;
            }
            if (e.key == 'k' || e.key == 'K') {
                this.indexPress = null;
            }
        })

        setInterval(() => {
            if (this.gameStatus == 'play') {
                if (this.Virus.length > 2) {
                    return;
                }
                this.generateVirus();
            }
        }, this.VirusTimeGenereate);

        setInterval(() => {
            if(this.score % 10 == 0 && this.score > 0){
                this.updateSpeed()
            }
        },1000)
    }

    render(timestamp) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw()
        this.update(timestamp);

        if (this.gameStatus == 'sendPause') {
            this.timePassed = timestamp;
            this.gameStatus = 'pause';
        }

        if (this.gameStatus == 'sendResume') {
            this.timeDifference = timestamp - this.timePassed;
            this.gameStatus = 'play';
        }

        if (this.failScore >= 5 && this.gameStatus == 'play') {
            this.gameOver();
        }

        if (this.gameStatus == 'play') {
            this.Virus.forEach(virus => {
                virus.y += this.VirusDy;
                console.log(this.VirusDy)
            })
        }

        requestAnimationFrame((timestamp) => {
            this.render(timestamp);
            this.timestamp = timestamp;
        })
    }

    randPos(min, max) {
        return Math.floor(Math.random() * max - min);
    }
}