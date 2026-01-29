document.addEventListener('DOMContentLoaded', () => {
    const img = document.querySelector('img');
    const audio = new Audio('cabra.mp3');

    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none'; // Let clicks pass through
    cursor.style.width = '64px'; // Approx 3x standard cursor
    cursor.style.height = '64px';
    cursor.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='black' stroke='white' stroke-width='1'%3E%3Cpath d='M5.5 3.21l10.08 20.16 2.15-9.25 8.74-3.48L5.5 3.21z'/%3E%3C/svg%3E\")"; // Simple arrow shape
    cursor.style.backgroundSize = 'contain';
    cursor.style.backgroundRepeat = 'no-repeat';
    cursor.style.zIndex = '9999';
    cursor.style.display = 'none';
    document.body.appendChild(cursor);

    img.addEventListener('click', () => {
        // Efeito visual: Texto subindo
        const floatingText = document.createElement('div');
        floatingText.textContent = 'COXINHA';
        floatingText.classList.add('floating-text');
        
        // Randomize um pouco a posição horizontal para não ficarem todos empilhados
        const randomOffset = (Math.random() - 0.5) * 50; // -25vw a +25vw
        floatingText.style.left = `calc(50% + ${randomOffset}vw)`;
        
        document.body.appendChild(floatingText);

        floatingText.addEventListener('animationend', () => {
            floatingText.remove();
        });

        // Tenta tocar o áudio
        audio.play().catch(error => {
            console.warn('Áudio não encontrado ou erro ao reproduzir. Usando fallback de voz.', error);
            // Fallback para Web Speech API se o arquivo não existir ou der erro
            const utterance = new SpeechSynthesisUtterance("Coxinha!");
            utterance.lang = 'pt-BR';
            utterance.rate = 1.5; // Um pouco mais rápido para parecer um grito
            utterance.pitch = 1.5; // Mais agudo
            speechSynthesis.speak(utterance);
        });
    });

    // Custom cursor logic
    img.addEventListener('mouseenter', () => {
        img.style.cursor = 'none'; // Hide native cursor
        cursor.style.display = 'block';
    });

    img.addEventListener('mouseleave', () => {
        img.style.cursor = ''; // Restore native cursor
        cursor.style.display = 'none';
    });

    img.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
});
