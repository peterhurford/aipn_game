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

        // Handle router scenes using the unified routing system
        if (scene.isRouter && scene.routerId) {
            const targetScene = routeScene(scene.routerId, this.gameFlags);
            if (targetScene) {
                this.loadScene(targetScene);
            }
            return;
        }

        this.currentScene = scene;

        // Process conditional dialogue before transitioning
        const processedScene = this.processConditionalDialogue(scene);

        // Transition to new scene
        this.transitionToScene(processedScene);
    }

    // Process conditional dialogue based on game flags
    processConditionalDialogue(scene) {
        if (!scene.dialogue) return scene;

        const processedDialogue = scene.dialogue
            .filter(line => {
                // Filter out lines that only appear under certain conditions
                if (line.conditionalOnly) {
                    const isNegated = line.conditionalOnly.startsWith('!');
                    const flagName = isNegated ? line.conditionalOnly.slice(1) : line.conditionalOnly;
                    const flagValue = this.gameFlags[flagName];
                    return isNegated ? !flagValue : flagValue;
                }
                return true;
            })
            .map(line => {
                // Apply computed text function (takes precedence over conditionalText)
                if (line.textFn) {
                    return { ...line, text: line.textFn(this.gameFlags) };
                }
                // Apply conditional text replacements
                if (line.conditionalText) {
                    for (const [flagName, altText] of Object.entries(line.conditionalText)) {
                        if (this.gameFlags[flagName]) {
                            return { ...line, text: altText };
                        }
                    }
                }
                return line;
            });

        return { ...scene, dialogue: processedDialogue };
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

    // Note: Routing logic has been moved to ROUTING_RULES in story.js
    // and is handled by the unified routeScene() function

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
