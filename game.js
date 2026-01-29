const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);
let score = 0;
let scoreText;

function preload() {
    // Carrega uma imagem de exemplo
    this.load.image('coxinha', 'images/coxinha.jpg');
}

function create() {
    
    scoreText = this.add.text(16, 16, 'coxinhas: 0', { fontSize: '32px', fill: '#fff' });

    
    let cookie = this.add.sprite(400, 300, 'coxinha').setInteractive();

    
    cookie.on('pointerdown', function () {
        score += 1;
        scoreText.setText('coxinhas: ' + score);
        
        // Efeito de "pulo" usando o sistema de Tweens do Phaser
        // this.tweens.add({
        //     targets: coxinha,
        //     scale: 2.5,
        //     duration: 75,
        //     yoyo: true // Volta ao tamanho original
        // });
    }, this);
}