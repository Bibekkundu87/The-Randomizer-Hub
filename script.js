// Wait for the DOM to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {

    /**
     * ----------------------------------------
     * V2: APP NAVIGATION
     * ----------------------------------------
     */
    const navButtons = document.querySelectorAll('.nav-button');
    const toolPanels = document.querySelectorAll('.tool-panel');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const toolId = button.dataset.tool;

            // Remove 'active' from all buttons and panels
            navButtons.forEach(btn => btn.classList.remove('active'));
            toolPanels.forEach(panel => panel.classList.remove('active'));

            // Add 'active' to the clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(toolId).classList.add('active');
        });
    });


    /**
     * ----------------------------------------
     * RANDOM NUMBER GENERATOR
     * ----------------------------------------
     */
    const minNumInput = document.getElementById('min-num');
    const maxNumInput = document.getElementById('max-num');
    const generateNumBtn = document.getElementById('generate-num-btn');
    const clearNumBtn = document.getElementById('clear-num-btn');
    const numberResult = document.getElementById('number-result');
    const numError = document.getElementById('num-error');

    generateNumBtn.addEventListener('click', () => {
        const min = parseInt(minNumInput.value);
        const max = parseInt(maxNumInput.value);

        if (isNaN(min) || isNaN(max)) {
            showError('Both inputs must be valid numbers.');
            return;
        }
        if (min >= max) {
            showError('Minimum number must be less than maximum number.');
            return;
        }

        hideError();
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        
        // V2: Animate the result
        animateResult(numberResult, randomNum);
    });

    clearNumBtn.addEventListener('click', () => {
        minNumInput.value = '1';
        maxNumInput.value = '100';
        numberResult.textContent = '--';
        hideError();
    });

    function showError(message) {
        numError.textContent = message;
        numError.style.display = 'block';
        numberResult.textContent = '--';
    }
    function hideError() {
        numError.style.display = 'none';
    }

    // V2: Helper function to animate result text
    function animateResult(element, text) {
        element.textContent = text;
        element.classList.remove('animate');
        // void element.offsetWidth is a trick to force browser reflow
        void element.offsetWidth; 
        element.classList.add('animate');
    }


    /**
     * ----------------------------------------
     * V2: 3D COIN FLIPPER
     * ----------------------------------------
     */
    const flipCoinBtn = document.getElementById('flip-coin-btn');
    const coin = document.getElementById('coin');
    const coinResult = document.getElementById('coin-result');
    const flipHistoryList = document.getElementById('flip-history');
    const resetHistoryBtn = document.getElementById('reset-history-btn');

    let flipHistory = [];
    let isFlipping = false;
    const MAX_HISTORY = 10;

    flipCoinBtn.addEventListener('click', () => {
        if (isFlipping) return; // Don't allow flip while already flipping

        isFlipping = true;
        flipCoinBtn.disabled = true;
        coinResult.textContent = 'Flipping...';
        
        // Determine result
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        
        // V2: Reset animation classes and trigger 3D flip
        coin.classList.remove('flip-heads', 'flip-tails');
        void coin.offsetWidth; // Force reflow
        
        if (result === 'Heads') {
            coin.classList.add('flip-heads');
        } else {
            coin.classList.add('flip-tails');
        }

        // Wait for animation to finish (1s, matching CSS)
        setTimeout(() => {
            coinResult.textContent = result;
            updateFlipHistory(result);
            isFlipping = false;
            flipCoinBtn.disabled = false;
        }, 1000); // 1000ms = 1s
    });

    resetHistoryBtn.addEventListener('click', () => {
        flipHistory = [];
        renderFlipHistory();
    });

    function updateFlipHistory(result) {
        flipHistory.unshift(result);
        if (flipHistory.length > MAX_HISTORY) {
            flipHistory.pop();
        }
        renderFlipHistory();
    }

    function renderFlipHistory() {
        flipHistoryList.innerHTML = '';
        if (flipHistory.length === 0) {
            flipHistoryList.innerHTML = '<li>No flips yet...</li>';
            return;
        }
        flipHistory.forEach(flip => {
            const li = document.createElement('li');
            li.textContent = flip;
            li.className = flip.toLowerCase(); // .heads or .tails
            flipHistoryList.appendChild(li);
        });
    }
    renderFlipHistory(); // Initial render on load


    /**
     * ----------------------------------------
     * RANDOM NAME PICKER
     * ----------------------------------------
     */
    const nameListInput = document.getElementById('name-list');
    const pickNameBtn = document.getElementById('pick-name-btn');
    const clearNameBtn = document.getElementById('clear-name-btn');
    const nameCount = document.getElementById('name-count');
    const nameResult = document.getElementById('name-result');
    const prevNameResult = document.getElementById('prev-name-result');

    nameListInput.addEventListener('input', updateNameCount);

    pickNameBtn.addEventListener('click', () => {
        const names = getNamesArray();
        
        if (names.length === 0) {
            animateResult(nameResult, 'No Names');
            prevNameResult.textContent = '--';
            return;
        }

        const randomIndex = Math.floor(Math.random() * names.length);
        const selectedName = names[randomIndex];

        const currentWinner = nameResult.textContent;
        if (currentWinner !== '--' && currentWinner !== 'No Names') {
            prevNameResult.textContent = currentWinner;
        }

        // V2: Animate the result
        animateResult(nameResult, selectedName);
    });

    clearNameBtn.addEventListener('click', () => {
        nameListInput.value = '';
        nameResult.textContent = '--';
        prevNameResult.textContent = '--';
        updateNameCount();
    });

    function getNamesArray() {
        const text = nameListInput.value.trim();
        if (text === '') return [];
        return text.split(/[\n,]+/)
                   .map(name => name.trim())
                   .filter(name => name.length > 0);
    }

    function updateNameCount() {
        nameCount.textContent = getNamesArray().length;
    }
});
