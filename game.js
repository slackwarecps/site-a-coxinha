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
    this.load.image('cookie', 'images/coxinha.jpg');
}

function create() {
    // Adiciona o texto do placar
    scoreText = this.add.text(16, 16, 'Cookies: 0', { fontSize: '32px', fill: '#fff' });

    // Adiciona o biscoito no meio da tela
    let cookie = this.add.sprite(400, 300, 'cookie').setInteractive();

    // Evento de clique com efeito visual
    cookie.on('pointerdown', function () {
        score += 1;
        scoreText.setText('Cookies: ' + score);
        
        // Efeito de "pulo" usando o sistema de Tweens do Phaser
        this.tweens.add({
            targets: cookie,
            scale: 1.2,
            duration: 50,
            yoyo: true // Volta ao tamanho original
        });
    }, this);
}