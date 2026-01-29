const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#ecf0f1',
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

let score = 0;
let scoreText;

function preload() {
    this.load.image('coxinha', 'images/coxinha.jpg');
}

function create() {
    // Adiciona o contador de pontos
    scoreText = this.add.text(16, 16, 'Coxinhas: 0', { 
        fontSize: '32px', 
        fill: '#000',
        fontFamily: 'Arial, sans-serif'
    });

    // Adiciona a coxinha no centro
    const coxinha = this.add.image(400, 300, 'coxinha');
    
    // Torna a coxinha interativa
    coxinha.setInteractive();

    // Evento de clique
    coxinha.on('pointerdown', function (pointer) {
        // Atualiza o contador
        score++;
        scoreText.setText('Coxinhas: ' + score);

        // Cria o texto "+1" na posição do clique
        let plusOne = this.scene.add.text(pointer.x, pointer.y, '+1', {
            fontSize: '24px',
            fill: '#e67e22', // Cor laranja coxinha
            fontStyle: 'bold'
        });
        plusOne.setOrigin(0.5, 0.5);

        // Animação do "+1" subindo e desaparecendo
        this.scene.tweens.add({
            targets: plusOne,
            y: pointer.y - 100, // Sobe 100 pixels
            alpha: 0,          // Desaparece
            duration: 1000,    // Leva 1 segundo
            ease: 'Power1',
            onComplete: function () {
                plusOne.destroy(); // Remove o objeto da memória
            }
        });

        // Efeito de "apertar" na coxinha
        this.scene.tweens.add({
            targets: coxinha,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 50,
            yoyo: true
        });
    });

    // Muda o cursor ao passar o mouse (opcional, para UX melhor)
    coxinha.on('pointerover', function () {
        this.scene.game.canvas.style.cursor = 'pointer';
    });

    coxinha.on('pointerout', function () {
        this.scene.game.canvas.style.cursor = 'default';
    });
}
