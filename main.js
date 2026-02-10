// Game State
let gameState = {
    stock: [],
    waste: [],
    foundations: [[], [], [], []],
    tableau: [[], [], [], [], [], [], []],
    drawCount: 1,
    moves: 0,
    timer: 0,
    timerInterval: null,
    history: []
};

// Card suits and ranks
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
};

// Initialize game
function initGame() {
    // Stop timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Create deck
    const deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({
                suit: suit,
                rank: rank,
                faceUp: false,
                color: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black'
            });
        }
    }
    
    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    // Reset game state
    gameState.stock = [];
    gameState.waste = [];
    gameState.foundations = [[], [], [], []];
    gameState.tableau = [[], [], [], [], [], [], []];
    gameState.moves = 0;
    gameState.timer = 0;
    gameState.history = [];
    
    // Deal cards to tableau
    let deckIndex = 0;
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row <= col; row++) {
            const card = deck[deckIndex++];
            if (row === col) {
                card.faceUp = true;
            }
            gameState.tableau[col].push(card);
        }
    }
    
    // Remaining cards go to stock
    gameState.stock = deck.slice(deckIndex);
    
    // Start timer
    gameState.timerInterval = setInterval(updateTimer, 1000);
    
    // Load settings
    loadSettings();
    
    // Render
    render();
}

// Save game state for undo
function saveState() {
    gameState.history.push({
        stock: JSON.parse(JSON.stringify(gameState.stock)),
        waste: JSON.parse(JSON.stringify(gameState.waste)),
        foundations: JSON.parse(JSON.stringify(gameState.foundations)),
        tableau: JSON.parse(JSON.stringify(gameState.tableau)),
        moves: gameState.moves
    });
}

// Undo last move
function undo() {
    if (gameState.history.length === 0) return;
    
    const lastState = gameState.history.pop();
    gameState.stock = lastState.stock;
    gameState.waste = lastState.waste;
    gameState.foundations = lastState.foundations;
    gameState.tableau = lastState.tableau;
    gameState.moves = lastState.moves;
    
    render();
}

// Update timer
function updateTimer() {
    gameState.timer++;
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update moves counter
function updateMoves() {
    gameState.moves++;
    document.getElementById('moves').textContent = gameState.moves;
}

// Draw cards from stock
function drawFromStock() {
    if (gameState.stock.length === 0) {
        // Recycle waste back to stock
        if (gameState.waste.length > 0) {
            saveState();
            gameState.stock = gameState.waste.reverse();
            gameState.stock.forEach(card => card.faceUp = false);
            gameState.waste = [];
            render();
        }
        return;
    }
    
    saveState();
    
    const count = Math.min(gameState.drawCount, gameState.stock.length);
    for (let i = 0; i < count; i++) {
        const card = gameState.stock.pop();
        card.faceUp = true;
        gameState.waste.push(card);
    }
    
    updateMoves();
    render();
}

// Check if move is valid
function isValidMove(card, targetPile, targetType) {
    if (targetType === 'foundation') {
        const foundationIndex = parseInt(targetPile.id.split('-')[1]);
        const foundation = gameState.foundations[foundationIndex];
        
        if (foundation.length === 0) {
            return card.rank === 'A';
        }
        
        const topCard = foundation[foundation.length - 1];
        return card.suit === topCard.suit && 
               ranks.indexOf(card.rank) === ranks.indexOf(topCard.rank) + 1;
    }
    
    if (targetType === 'tableau') {
        const columnIndex = parseInt(targetPile.id.split('-')[1]);
        const column = gameState.tableau[columnIndex];
        
        if (column.length === 0) {
            return card.rank === 'K';
        }
        
        const topCard = column[column.length - 1];
        return card.color !== topCard.color && 
               ranks.indexOf(card.rank) === ranks.indexOf(topCard.rank) - 1;
    }
    
    return false;
}

// Move card(s)
function moveCard(cards, sourcePile, sourceType, targetPile, targetType) {
    saveState();
    
    // Remove cards from source
    if (sourceType === 'waste') {
        gameState.waste.pop();
    } else if (sourceType === 'tableau') {
        const columnIndex = parseInt(sourcePile.id.split('-')[1]);
        gameState.tableau[columnIndex].splice(-cards.length);
        
        // Flip top card if exists
        if (gameState.tableau[columnIndex].length > 0) {
            const topCard = gameState.tableau[columnIndex][gameState.tableau[columnIndex].length - 1];
            if (!topCard.faceUp) {
                topCard.faceUp = true;
            }
        }
    } else if (sourceType === 'foundation') {
        const foundationIndex = parseInt(sourcePile.id.split('-')[1]);
        gameState.foundations[foundationIndex].pop();
    }
    
    // Add cards to target
    if (targetType === 'foundation') {
        const foundationIndex = parseInt(targetPile.id.split('-')[1]);
        gameState.foundations[foundationIndex].push(cards[0]);
    } else if (targetType === 'tableau') {
        const columnIndex = parseInt(targetPile.id.split('-')[1]);
        gameState.tableau[columnIndex].push(...cards);
    }
    
    updateMoves();
    render();
    checkWin();
}

// Check for win condition
function checkWin() {
    const totalCards = gameState.foundations.reduce((sum, foundation) => sum + foundation.length, 0);
    if (totalCards === 52) {
        clearInterval(gameState.timerInterval);
        showWinModal();
    }
}

// Show win modal
function showWinModal() {
    const modal = document.getElementById('winModal');
    const stats = document.getElementById('winStats');
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    stats.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')} | Moves: ${gameState.moves}`;
    modal.classList.add('show');
}

// Render game
function render() {
    // Render stock
    const stockEl = document.getElementById('stock');
    stockEl.innerHTML = '';
    if (gameState.stock.length > 0) {
        const cardEl = createCardElement(gameState.stock[gameState.stock.length - 1], false);
        cardEl.classList.add('face-down');
        stockEl.appendChild(cardEl);
    }
    
    // Render waste
    const wasteEl = document.getElementById('waste');
    wasteEl.innerHTML = '';
    if (gameState.waste.length > 0) {
        const card = gameState.waste[gameState.waste.length - 1];
        const cardEl = createCardElement(card, true);
        cardEl.dataset.source = 'waste';
        wasteEl.appendChild(cardEl);
    }
    
    // Render foundations
    for (let i = 0; i < 4; i++) {
        const foundationEl = document.getElementById(`foundation-${i}`);
        foundationEl.innerHTML = '';
        if (gameState.foundations[i].length > 0) {
            const card = gameState.foundations[i][gameState.foundations[i].length - 1];
            const cardEl = createCardElement(card, true);
            cardEl.dataset.source = 'foundation';
            cardEl.dataset.index = i;
            foundationEl.appendChild(cardEl);
        }
    }
    
    // Render tableau
    for (let col = 0; col < 7; col++) {
        const columnEl = document.getElementById(`tableau-${col}`);
        columnEl.innerHTML = '';
        
        gameState.tableau[col].forEach((card, index) => {
            const cardEl = createCardElement(card, card.faceUp);
            cardEl.style.top = `${index * 25}px`;
            cardEl.dataset.source = 'tableau';
            cardEl.dataset.column = col;
            cardEl.dataset.index = index;
            
            if (!card.faceUp) {
                cardEl.classList.add('face-down');
            }
            
            columnEl.appendChild(cardEl);
        });
    }
}

// Create card element
function createCardElement(card, faceUp) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.color}`;
    
    if (faceUp) {
        // Display rank properly (A, 2-10, J, Q, K)
        let displayRank = card.rank;
        if (card.rank === 'A') {
            displayRank = 'A';
        } else if (card.rank === 'J') {
            displayRank = 'J';
        } else if (card.rank === 'Q') {
            displayRank = 'Q';
        } else if (card.rank === 'K') {
            displayRank = 'K';
        }
        
        cardEl.innerHTML = `
            <div class="card-top">
                <span class="card-rank">${displayRank}</span>
                <span class="card-suit">${suitSymbols[card.suit]}</span>
            </div>
            <div class="card-center">
                <span class="card-suit">${suitSymbols[card.suit]}</span>
            </div>
            <div class="card-bottom">
                <span class="card-suit">${suitSymbols[card.suit]}</span>
                <span class="card-rank">${displayRank}</span>
            </div>
        `;
        
        cardEl.draggable = true;
        cardEl.addEventListener('dragstart', handleDragStart);
        cardEl.addEventListener('dblclick', handleDoubleClick);
    }
    
    return cardEl;
}

// Drag and drop handlers
let draggedCards = [];
let dragSource = null;

function handleDragStart(e) {
    const cardEl = e.target.closest('.card');
    if (!cardEl || cardEl.classList.contains('face-down')) return;
    
    const source = cardEl.dataset.source;
    dragSource = cardEl.parentElement;
    
    if (source === 'tableau') {
        const column = parseInt(cardEl.dataset.column);
        const index = parseInt(cardEl.dataset.index);
        draggedCards = gameState.tableau[column].slice(index);
    } else {
        if (source === 'waste') {
            draggedCards = [gameState.waste[gameState.waste.length - 1]];
        } else if (source === 'foundation') {
            const foundationIndex = parseInt(cardEl.dataset.index);
            draggedCards = [gameState.foundations[foundationIndex][gameState.foundations[foundationIndex].length - 1]];
        }
    }
    
    cardEl.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

// Drop zones
document.addEventListener('DOMContentLoaded', () => {
    // Foundation drop zones
    for (let i = 0; i < 4; i++) {
        const foundationEl = document.getElementById(`foundation-${i}`);
        foundationEl.addEventListener('dragover', handleDragOver);
        foundationEl.addEventListener('drop', handleDrop);
    }
    
    // Tableau drop zones
    for (let i = 0; i < 7; i++) {
        const columnEl = document.getElementById(`tableau-${i}`);
        columnEl.addEventListener('dragover', handleDragOver);
        columnEl.addEventListener('drop', handleDrop);
    }
    
    // Stock click
    document.getElementById('stock').addEventListener('click', drawFromStock);
    
    // Buttons
    document.getElementById('newGame').addEventListener('click', initGame);
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('settings').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.add('show');
    });
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('show');
        saveSettings();
    });
    document.getElementById('newGameWin').addEventListener('click', () => {
        document.getElementById('winModal').classList.remove('show');
        initGame();
    });
    
    // Initialize game
    initGame();
});

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    
    const targetEl = e.target.closest('.card-slot, .tableau-column');
    if (!targetEl || draggedCards.length === 0) return;
    
    const targetType = targetEl.classList.contains('foundation') ? 'foundation' : 'tableau';
    
    // Only single cards can go to foundation
    if (targetType === 'foundation' && draggedCards.length > 1) {
        draggedCards = [];
        dragSource = null;
        render();
        return;
    }
    
    if (isValidMove(draggedCards[0], targetEl, targetType)) {
        const sourceType = dragSource.classList.contains('waste') ? 'waste' :
                          dragSource.classList.contains('foundation') ? 'foundation' : 'tableau';
        moveCard(draggedCards, dragSource, sourceType, targetEl, targetType);
    }
    
    draggedCards = [];
    dragSource = null;
    render();
}

// Double click to auto-move to foundation
function handleDoubleClick(e) {
    const cardEl = e.target.closest('.card');
    if (!cardEl || cardEl.classList.contains('face-down')) return;
    
    const source = cardEl.dataset.source;
    let card = null;
    let sourcePile = null;
    let sourceType = null;
    
    if (source === 'waste') {
        card = gameState.waste[gameState.waste.length - 1];
        sourcePile = document.getElementById('waste');
        sourceType = 'waste';
    } else if (source === 'tableau') {
        const column = parseInt(cardEl.dataset.column);
        const index = parseInt(cardEl.dataset.index);
        if (index !== gameState.tableau[column].length - 1) return; // Only top card
        card = gameState.tableau[column][index];
        sourcePile = document.getElementById(`tableau-${column}`);
        sourceType = 'tableau';
    } else if (source === 'foundation') {
        return; // Can't auto-move from foundation
    }
    
    if (!card) return;
    
    // Try each foundation
    for (let i = 0; i < 4; i++) {
        const foundationEl = document.getElementById(`foundation-${i}`);
        if (isValidMove(card, foundationEl, 'foundation')) {
            moveCard([card], sourcePile, sourceType, foundationEl, 'foundation');
            return;
        }
    }
}

// Settings
function saveSettings() {
    const drawCount = document.querySelector('input[name="drawCount"]:checked').value;
    gameState.drawCount = parseInt(drawCount);
    localStorage.setItem('solitaire-drawCount', drawCount);
}

function loadSettings() {
    const savedDrawCount = localStorage.getItem('solitaire-drawCount');
    if (savedDrawCount) {
        gameState.drawCount = parseInt(savedDrawCount);
        document.querySelector(`input[name="drawCount"][value="${savedDrawCount}"]`).checked = true;
    }
}
