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

function preload() {
    this.load.image('coxinha', 'assets/images/coxinha.jpg');
}

function create() {
    const self = this;

    // --- Criação de Texturas Programáticas ---
    
    // Textura para Explosão (uma partícula amarela redonda)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffa500, 1); // Laranja/Amarelo
    graphics.fillCircle(10, 10, 10);
    graphics.generateTexture('flare', 20, 20);

    // --- Fim Criação ---

    scoreText = this.add.text(16, 16, 'Coxinhas: 0', { 
        fontSize: '32px', 
        fill: '#000',
        fontFamily: 'Arial, sans-serif'
    });

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    coxinha = this.add.image(centerX, centerY, 'coxinha');
    resizeCoxinha(this);
    coxinha.setInteractive();

    this.scale.on('resize', function (gameSize) {
        coxinha.setPosition(gameSize.width / 2, gameSize.height / 2);
        resizeCoxinha(self);
    });

    // Configura o sistema de partículas para a explosão
    // No Phaser 3.60+, a sintaxe do emitter mudou ligeiramente, mas vamos usar uma compatível
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

        // --- Efeito Sonoro (Sintetizado) ---
        // Passamos a cena para usar o contexto de áudio do Phaser
        playDrumSound(self);

        // --- Efeito Visual: Texto +1 ---
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

        // --- Efeito Visual: Explosão de Partículas ---
        emitter.explode(16, pointer.x, pointer.y);

        // --- Animação da Coxinha ---
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

function resizeCoxinha(scene) {
    const padding = 50;
    const availableWidth = scene.scale.width - padding;
    const availableHeight = scene.scale.height - padding;
    
    coxinha.setScale(1);
    
    const ratioX = availableWidth / coxinha.width;
    const ratioY = availableHeight / coxinha.height;
    const scale = Math.min(ratioX, ratioY, 1); 

    coxinha.setScale(scale);
}

// Função para sintetizar um som de "bum" (bombo/tambor) usando Web Audio API do Phaser
function playDrumSound(scene) {
    try {
        // Usa o contexto de áudio já gerenciado pelo Phaser
        // Isso evita erros de "AudioContext not allowed to start" e conflitos
        const audioCtx = scene.sound.context;
        
        if (!audioCtx) return;

        // Se por acaso ainda estiver suspenso (ex: carregamento muito rápido), tenta resumir
        if (audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        // Frequência baixa caindo rápido (kick drum style)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);

        // Volume caindo rápido
        gainNode.gain.setValueAtTime(1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        oscillator.start(now);
        oscillator.stop(now + 0.5);
    } catch (e) {
        console.warn("Erro ao tocar som sintetizado:", e);
    }
}
