// Scene Management - Handles scene transitions, backgrounds, and game state

class SceneManager {
    constructor(dialogueEngine) {
        this.dialogue = dialogueEngine;
        this.sceneBackground = document.getElementById('scene-background');
        this.locationIndicator = document.getElementById('location-indicator');

        this.currentScene = null;
        this.gameFlags = {};
        this.transitionDuration = 500; // ms
    }

    // Initialize game state
    initGame() {
        // Copy initial flags
        this.gameFlags = { ...STORY.initialFlags };
    }

    // Load a scene by ID
    loadScene(sceneId) {
        const scene = STORY.scenes[sceneId];

        if (!scene) {
            console.error(`Scene not found: ${sceneId}`);
            return;
        }

        // Handle ending check scene
        if (scene.checkFlags) {
            this.determineEnding();
            return;
        }

        // Handle climax choice routing
        if (scene.checkClimaxChoice) {
            this.routeClimaxChoice();
            return;
        }

        this.currentScene = scene;

        // Transition to new scene
        this.transitionToScene(scene);
    }

    // Handle scene transition with fade
    transitionToScene(scene) {
        // Fade out
        this.sceneBackground.style.opacity = '0';
        this.locationIndicator.classList.remove('visible');
        this.dialogue.hideDialogueBox();

        setTimeout(() => {
            // Update background
            this.sceneBackground.className = scene.background || '';

            // Update location
            if (scene.location) {
                this.locationIndicator.textContent = scene.location;
            }

            // Fade in
            this.sceneBackground.style.opacity = '1';

            setTimeout(() => {
                this.locationIndicator.classList.add('visible');

                // Start dialogue
                if (scene.dialogue && scene.dialogue.length > 0) {
                    this.dialogue.startDialogue(scene.dialogue, () => {
                        this.onDialogueComplete(scene);
                    });
                }
            }, 300);
        }, this.transitionDuration);
    }

    // Called when dialogue for a scene is complete
    onDialogueComplete(scene) {
        // Apply any flags set by this scene
        if (scene.setFlags) {
            Object.assign(this.gameFlags, scene.setFlags);
        }

        // Check for choices
        if (scene.choices && scene.choices.length > 0) {
            this.dialogue.showChoices(scene.choices, (choice) => {
                this.handleChoice(choice);
            });
        } else if (scene.nextScene) {
            // Auto-advance to next scene after a brief pause
            setTimeout(() => {
                this.loadScene(scene.nextScene);
            }, 500);
        } else if (scene.isEnding) {
            // Show ending
            this.showEndingScreen(scene.endingType);
        }
    }

    // Handle player choice
    handleChoice(choice) {
        // Apply flags from choice
        if (choice.setFlags) {
            Object.assign(this.gameFlags, choice.setFlags);
        }

        // Load next dialogue or scene
        if (choice.nextDialogue) {
            this.loadScene(choice.nextDialogue);
        } else if (choice.nextScene) {
            this.loadScene(choice.nextScene);
        }
    }

    // Route to climax choice based on allies
    routeClimaxChoice() {
        const { trustedElena, sharedWithPriya } = this.gameFlags;

        // Only get the meaningful choice if you have both allies
        if (trustedElena && sharedWithPriya) {
            this.loadScene('climax_choice');
        } else {
            this.loadScene('climax_no_leverage');
        }
    }

    // Determine which ending based on flags
    determineEnding() {
        const { trustedElena, sharedWithPriya, supportedCompromise, opposedCompromise, spokeUp } = this.gameFlags;

        let baseEnding;

        // Both allies = you get to choose
        if (trustedElena && sharedWithPriya) {
            if (supportedCompromise) {
                baseEnding = 'ending_a'; // Pyrrhic victory - passed but gutted
            } else if (opposedCompromise) {
                baseEnding = 'ending_b'; // Moral victory - killed it on principle
            } else {
                baseEnding = 'ending_a'; // Default to A if somehow neither flag set
            }
        }
        // One ally = not enough leverage, bill passes without you mattering
        else if (trustedElena || sharedWithPriya) {
            baseEnding = 'ending_b_partial'; // Partial - you tried but couldn't swing it
        }
        // No allies = total failure
        else {
            baseEnding = 'ending_c';
        }

        // Add flavor suffix for spokeUp
        if (spokeUp && baseEnding !== 'ending_b_partial') {
            this.loadScene(baseEnding + '_spokeup');
        } else {
            this.loadScene(baseEnding);
        }
    }

    // Show ending screen
    showEndingScreen(endingType) {
        setTimeout(() => {
            this.dialogue.hideDialogueBox();
            this.locationIndicator.textContent = endingType;
            this.locationIndicator.classList.add('visible');

            // Add restart option
            setTimeout(() => {
                const restartBtn = document.createElement('button');
                restartBtn.className = 'choice-btn visible';
                restartBtn.textContent = 'Play Again';
                restartBtn.style.marginTop = '50px';
                restartBtn.addEventListener('click', () => {
                    window.game.showMainMenu();
                });

                const container = document.getElementById('choice-container');
                container.innerHTML = '';
                container.appendChild(restartBtn);
                container.classList.add('visible');
            }, 2000);
        }, 1000);
    }

    // Get current flags (for debugging)
    getFlags() {
        return { ...this.gameFlags };
    }

    // Set a flag manually
    setFlag(key, value) {
        this.gameFlags[key] = value;
    }
}
