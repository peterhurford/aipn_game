// Main Game Controller - Entry point and game loop

class Game {
    constructor() {
        this.dialogue = new DialogueEngine();
        this.scene = new SceneManager(this.dialogue);

        this.mainMenu = document.getElementById('main-menu');
        this.gameScreen = document.getElementById('game-screen');
        this.startBtn = document.getElementById('start-btn');
        this.continueBtn = document.getElementById('continue-btn');

        this.isPlaying = false;

        this.init();
    }

    init() {
        // Set up event listeners
        this.setupEventListeners();

        // Check for saved game
        this.checkSavedGame();
    }

    setupEventListeners() {
        // Start button
        this.startBtn.addEventListener('click', () => {
            this.startNewGame();
        });

        // Continue button (if saved game exists)
        this.continueBtn.addEventListener('click', () => {
            this.continueGame();
        });

        // Click/Space to advance dialogue
        document.addEventListener('click', (e) => {
            if (this.isPlaying && !e.target.classList.contains('choice-btn') && !e.target.classList.contains('menu-btn')) {
                this.dialogue.advance();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.isPlaying && (e.code === 'Space' || e.code === 'Enter')) {
                e.preventDefault();
                this.dialogue.advance();
            }
        });
    }

    // Check localStorage for saved game
    checkSavedGame() {
        const savedGame = localStorage.getItem('capitol_save');
        if (savedGame) {
            this.continueBtn.disabled = false;
        }
    }

    // Start a new game
    startNewGame() {
        this.scene.initGame();
        this.showGameScreen();
        this.scene.loadScene('intro');
    }

    // Continue from saved game
    continueGame() {
        const savedGame = localStorage.getItem('capitol_save');
        if (savedGame) {
            try {
                const data = JSON.parse(savedGame);
                this.scene.gameFlags = data.flags || {};
                this.showGameScreen();
                this.scene.loadScene(data.currentScene || 'intro');
            } catch (e) {
                console.error('Failed to load saved game:', e);
                this.startNewGame();
            }
        }
    }

    // Save game state
    saveGame(sceneId) {
        const saveData = {
            currentScene: sceneId,
            flags: this.scene.getFlags(),
            timestamp: Date.now()
        };
        localStorage.setItem('capitol_save', JSON.stringify(saveData));
    }

    // Show main menu
    showMainMenu() {
        this.isPlaying = false;
        this.gameScreen.classList.remove('active');
        this.mainMenu.classList.add('active');
        this.dialogue.reset();
        this.checkSavedGame();
    }

    // Show game screen
    showGameScreen() {
        this.isPlaying = true;
        this.mainMenu.classList.remove('active');
        this.gameScreen.classList.add('active');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
