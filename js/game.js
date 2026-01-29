const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    },
    backgroundColor: '#ecf0f1',
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

let score = 0;
let scoreText;
let coxinha;
let sky;

function preload() {
    this.load.image('coxinha', 'assets/images/coxinha.jpg');
    this.load.image('sky', 'assets/images/ce2.avif');
}

function create() {
    const self = this;

    // --- Criação de Texturas Programáticas ---
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffa500, 1);
    graphics.fillCircle(10, 10, 10);
    graphics.generateTexture('flare', 20, 20);
    // --- Fim Criação ---

    // Adiciona o céu (Background)
    sky = this.add.image(0, 0, 'sky');
    sky.setOrigin(0, 0); // Facilita o redimensionamento
    resizeSky(this);

    // Calcula o centro da tela
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    coxinha = this.add.image(centerX, centerY, 'coxinha');
    resizeCoxinha(this);
    coxinha.setInteractive();

    scoreText = this.add.text(16, 16, 'Coxinhas: 0', { 
        fontSize: '32px', 
        fill: '#000',
        fontFamily: 'Arial, sans-serif'
    });

    this.scale.on('resize', function (gameSize) {
        // Atualiza posição da coxinha
        coxinha.setPosition(gameSize.width / 2, gameSize.height / 2);
        
        // Redimensiona assets
        resizeSky(self);
        resizeCoxinha(self);
    });

    const emitter = this.add.particles(0, 0, 'flare', {
        lifespan: 500,
        speed: { min: 150, max: 250 },
        scale: { start: 0.8, end: 0 },
        gravityY: 150,
        blendMode: 'ADD',
        emitting: false
    });

    coxinha.on('pointerdown', function (pointer) {
        score++;
        scoreText.setText('Coxinhas: ' + score);

        playDrumSound(self);

        let plusOne = self.add.text(pointer.x, pointer.y, '+1', {
            fontSize: '32px',
            fill: '#e67e22',
            fontStyle: 'bold',
            stroke: '#fff',
            strokeThickness: 4
        });
        plusOne.setOrigin(0.5, 0.5);

        self.tweens.add({
            targets: plusOne,
            y: pointer.y - 100,
            alpha: 0,
            duration: 800,
            ease: 'Power1',
            onComplete: () => plusOne.destroy()
        });

        emitter.explode(16, pointer.x, pointer.y);

        const currentScale = coxinha.scaleX;
        self.tweens.add({
            targets: coxinha,
            scaleX: currentScale * 0.9,
            scaleY: currentScale * 0.9,
            duration: 50,
            yoyo: true,
            onComplete: () => resizeCoxinha(self)
        });
    });

    coxinha.on('pointerover', () => self.game.canvas.style.cursor = 'pointer');
    coxinha.on('pointerout', () => self.game.canvas.style.cursor = 'default');
}

function resizeSky(scene) {
    if (!sky) return;
    // Estica o céu para cobrir toda a tela (displayWidth/displayHeight)
    sky.displayWidth = scene.scale.width;
    sky.displayHeight = scene.scale.height;
}

function resizeCoxinha(scene) {
    if (!coxinha) return;
    const padding = 50;
    const availableWidth = scene.scale.width - padding;
    const availableHeight = scene.scale.height - padding;
    
    // Reseta escala para 1 para pegar as dimensões originais corretamente
    coxinha.setScale(1);
    
    const ratioX = availableWidth / coxinha.width;
    const ratioY = availableHeight / coxinha.height;
    // Garante que não aumenta mais que o original e mantém proporção
    const scale = Math.min(ratioX, ratioY, 1); 

    coxinha.setScale(scale);
}

// Contexto de áudio global para evitar criar múltiplos contextos (o que trava no mobile)
let globalAudioCtx;

function playDrumSound(scene) {
    try {
        const audioCtx = scene.sound.context;
        if (!audioCtx) return;

        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);

        gainNode.gain.setValueAtTime(1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        oscillator.start(now);
        oscillator.stop(now + 0.5);
    } catch (e) {
        console.warn("Erro ao tocar som sintetizado:", e);
    }
}