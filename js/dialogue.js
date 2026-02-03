// Dialogue Engine - Handles text display, typewriter effect, and choices

class DialogueEngine {
    constructor() {
        this.dialogueBox = document.getElementById('dialogue-box');
        this.characterName = document.getElementById('character-name');
        this.dialogueText = document.getElementById('dialogue-text');
        this.continueIndicator = document.getElementById('continue-indicator');
        this.choiceContainer = document.getElementById('choice-container');
        this.characterPortrait = document.getElementById('character-portrait');

        this.currentDialogue = [];
        this.currentIndex = 0;
        this.isTyping = false;
        this.isAdvancing = false;
        this.typewriterSpeed = 30; // ms per character
        this.typewriterInterval = null;
        this.fullText = '';
        this.onComplete = null;
        this.onChoiceMade = null;
    }

    // Start displaying a dialogue sequence
    startDialogue(dialogueArray, onComplete) {
        this.currentDialogue = dialogueArray;
        this.currentIndex = 0;
        this.onComplete = onComplete;

        this.showDialogueBox();
        this.showCurrentLine();
    }

    // Show the dialogue box with fade-in
    showDialogueBox() {
        this.dialogueBox.classList.add('visible');
    }

    // Hide the dialogue box
    hideDialogueBox() {
        this.dialogueBox.classList.remove('visible');
        this.hidePortrait();
    }

    // Display the current line of dialogue
    showCurrentLine() {
        if (this.currentIndex >= this.currentDialogue.length) {
            // Dialogue complete
            this.hideContinueIndicator();
            if (this.onComplete) {
                this.onComplete();
            }
            return;
        }

        const line = this.currentDialogue[this.currentIndex];

        // Set character name
        this.characterName.textContent = line.speaker || '';

        // Add speaker-type class for styling
        this.dialogueBox.classList.remove(
            'speaker-narrator', 'speaker-you', 'speaker-character',
            'speaker-elena', 'speaker-priya', 'speaker-sarah',
            'speaker-phone', 'speaker-official', 'speaker-minor',
            'is-action'
        );

        // Check if this is an action/description rather than dialogue
        if (line.isAction) {
            this.dialogueBox.classList.add('is-action');
        }

        const speaker = line.speaker || '';
        if (speaker === 'Narrator') {
            this.dialogueBox.classList.add('speaker-narrator');
        } else if (speaker === 'You') {
            this.dialogueBox.classList.add('speaker-you');
        } else if (speaker === 'Elena') {
            this.dialogueBox.classList.add('speaker-elena');
        } else if (speaker === 'Priya') {
            this.dialogueBox.classList.add('speaker-priya');
        } else if (speaker === 'Sarah') {
            this.dialogueBox.classList.add('speaker-sarah');
        } else if (speaker === 'Phone') {
            this.dialogueBox.classList.add('speaker-phone');
        } else if (['Chairman', 'Peters', 'Staffer'].includes(speaker)) {
            this.dialogueBox.classList.add('speaker-official');
        } else if (['Industry Rep', 'Academic', 'Nonprofit Advocate', 'Facilitator', 'Voice 1', 'Voice 2', 'Voice 3', 'Voice 4'].includes(speaker)) {
            this.dialogueBox.classList.add('speaker-minor');
        } else {
            this.dialogueBox.classList.add('speaker-character');
        }

        // Handle portrait
        if (line.portrait) {
            this.showPortrait(line.portrait);
        } else {
            this.hidePortrait();
        }

        // Start typewriter effect
        this.typewriterEffect(line.text);
    }

    // Typewriter text effect
    typewriterEffect(text) {
        // Clear any existing interval first
        if (this.typewriterInterval) {
            clearInterval(this.typewriterInterval);
        }

        this.isTyping = true;
        this.fullText = text;
        this.dialogueText.textContent = '';
        this.hideContinueIndicator();

        let charIndex = 0;

        this.typewriterInterval = setInterval(() => {
            if (charIndex < text.length) {
                this.dialogueText.textContent += text.charAt(charIndex);
                charIndex++;
            } else {
                this.completeTyping();
            }
        }, this.typewriterSpeed);
    }

    // Complete the typewriter effect immediately
    skipTypewriter() {
        if (this.isTyping) {
            clearInterval(this.typewriterInterval);
            this.dialogueText.textContent = this.fullText;
            this.completeTyping();
        }
    }

    // Called when typing is complete
    completeTyping() {
        clearInterval(this.typewriterInterval);
        this.isTyping = false;
        this.showContinueIndicator();
    }

    // Advance to next line
    advance() {
        // Prevent rapid clicking
        if (this.isAdvancing) {
            return;
        }

        if (this.isTyping) {
            this.skipTypewriter();
            return;
        }

        this.isAdvancing = true;
        this.currentIndex++;
        this.showCurrentLine();

        // Release lock after a short delay
        setTimeout(() => {
            this.isAdvancing = false;
        }, 50);
    }

    // Show continue indicator
    showContinueIndicator() {
        this.continueIndicator.classList.add('visible');
    }

    // Hide continue indicator
    hideContinueIndicator() {
        this.continueIndicator.classList.remove('visible');
    }

    // Show character portrait
    showPortrait(portraitClass) {
        this.characterPortrait.className = portraitClass;
        this.characterPortrait.classList.add('visible');
    }

    // Hide character portrait
    hidePortrait() {
        this.characterPortrait.classList.remove('visible');
    }

    // Display choice options
    showChoices(choices, onChoiceMade) {
        this.onChoiceMade = onChoiceMade;
        this.hideContinueIndicator();
        this.hideDialogueBox();

        this.choiceContainer.innerHTML = '';

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => this.selectChoice(index, choice));
            this.choiceContainer.appendChild(button);

            // Staggered animation
            setTimeout(() => {
                button.classList.add('visible');
            }, index * 100);
        });

        this.choiceContainer.classList.add('visible');
    }

    // Handle choice selection
    selectChoice(index, choice) {
        // Remove visible class for fade out
        this.choiceContainer.classList.remove('visible');

        // Clear choices after animation
        setTimeout(() => {
            this.choiceContainer.innerHTML = '';
        }, 500);

        // Callback with selected choice
        if (this.onChoiceMade) {
            this.onChoiceMade(choice);
        }
    }

    // Hide choices
    hideChoices() {
        this.choiceContainer.classList.remove('visible');
        this.choiceContainer.innerHTML = '';
    }

    // Reset dialogue state
    reset() {
        this.currentDialogue = [];
        this.currentIndex = 0;
        this.isTyping = false;
        clearInterval(this.typewriterInterval);
        this.dialogueText.textContent = '';
        this.characterName.textContent = '';
        this.hideDialogueBox();
        this.hideChoices();
        this.hidePortrait();
    }
}
