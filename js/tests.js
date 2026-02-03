// Test Suite for Story Logic
// Run by opening tests.html in a browser

const TestRunner = {
    passed: 0,
    failed: 0,
    results: [],

    assert(condition, testName) {
        if (condition) {
            this.passed++;
            this.results.push({ name: testName, passed: true });
        } else {
            this.failed++;
            this.results.push({ name: testName, passed: false });
            console.error(`FAILED: ${testName}`);
        }
    },

    assertEqual(actual, expected, testName) {
        const condition = actual === expected;
        if (!condition) {
            console.error(`Expected: ${expected}, Got: ${actual}`);
        }
        this.assert(condition, testName);
    },

    assertDeepEqual(actual, expected, testName) {
        const condition = JSON.stringify(actual) === JSON.stringify(expected);
        if (!condition) {
            console.error(`Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
        }
        this.assert(condition, testName);
    },

    run() {
        console.log('Running tests...\n');

        this.testLocations();
        this.testSpeakerStyles();
        this.testDialogueFragments();
        this.testRoutingRules();
        this.testConditionalDialogue();
        this.testSceneStructure();
        this.testEndingPaths();

        console.log(`\n${'='.repeat(50)}`);
        console.log(`Tests: ${this.passed} passed, ${this.failed} failed`);
        console.log(`${'='.repeat(50)}`);

        return { passed: this.passed, failed: this.failed, results: this.results };
    },

    // Test 1: Location Registry
    testLocations() {
        console.log('\n--- Location Registry Tests ---');

        // All locations should have location and background properties
        for (const [key, loc] of Object.entries(LOCATIONS)) {
            this.assert(
                loc.location && typeof loc.location === 'string',
                `LOCATIONS.${key} has valid location string`
            );
            this.assert(
                loc.background && typeof loc.background === 'string',
                `LOCATIONS.${key} has valid background string`
            );
        }

        // Specific location values
        this.assertEqual(LOCATIONS.office.location, 'AIPN Office', 'LOCATIONS.office.location correct');
        this.assertEqual(LOCATIONS.office.background, 'bg-office', 'LOCATIONS.office.background correct');
        this.assertEqual(LOCATIONS.bar.location, 'The Filibuster Bar', 'LOCATIONS.bar.location correct');
        this.assertEqual(LOCATIONS.bar.background, 'bg-bar', 'LOCATIONS.bar.background correct');
        this.assertEqual(LOCATIONS.mall.background, 'bg-mall', 'LOCATIONS.mall.background correct');
        this.assertEqual(LOCATIONS.capitol.background, 'bg-capitol', 'LOCATIONS.capitol.background correct');
    },

    // Test 2: Speaker Style Configuration
    testSpeakerStyles() {
        console.log('\n--- Speaker Style Tests ---');

        // Direct speaker mappings
        this.assertEqual(getSpeakerClass('Narrator'), 'speaker-narrator', 'Narrator maps to speaker-narrator');
        this.assertEqual(getSpeakerClass('You'), 'speaker-you', 'You maps to speaker-you');
        this.assertEqual(getSpeakerClass('Elena'), 'speaker-elena', 'Elena maps to speaker-elena');
        this.assertEqual(getSpeakerClass('Priya'), 'speaker-priya', 'Priya maps to speaker-priya');
        this.assertEqual(getSpeakerClass('Sarah'), 'speaker-sarah', 'Sarah maps to speaker-sarah');
        this.assertEqual(getSpeakerClass('Phone'), 'speaker-phone', 'Phone maps to speaker-phone');

        // Group mappings
        this.assertEqual(getSpeakerClass('Chairman'), 'speaker-official', 'Chairman maps to speaker-official');
        this.assertEqual(getSpeakerClass('Peters'), 'speaker-official', 'Peters maps to speaker-official');
        this.assertEqual(getSpeakerClass('Staffer'), 'speaker-official', 'Staffer maps to speaker-official');
        this.assertEqual(getSpeakerClass('Industry Rep'), 'speaker-minor', 'Industry Rep maps to speaker-minor');
        this.assertEqual(getSpeakerClass('Academic'), 'speaker-minor', 'Academic maps to speaker-minor');
        this.assertEqual(getSpeakerClass('Voice 1'), 'speaker-minor', 'Voice 1 maps to speaker-minor');
        this.assertEqual(getSpeakerClass('Facilitator'), 'speaker-minor', 'Facilitator maps to speaker-minor');

        // Unknown speaker fallback
        this.assertEqual(getSpeakerClass('Unknown'), 'speaker-character', 'Unknown speaker maps to speaker-character');
        this.assertEqual(getSpeakerClass(''), 'speaker-character', 'Empty speaker maps to speaker-character');
    },

    // Test 3: Dialogue Fragments
    testDialogueFragments() {
        console.log('\n--- Dialogue Fragment Tests ---');

        // Priya discussion fragment exists and has correct structure
        this.assert(
            DIALOGUE_FRAGMENTS.priyaDiscussion,
            'priyaDiscussion fragment exists'
        );
        this.assertEqual(
            DIALOGUE_FRAGMENTS.priyaDiscussion.length,
            4,
            'priyaDiscussion has 4 lines'
        );

        // First line is player asking about Priya
        this.assertEqual(
            DIALOGUE_FRAGMENTS.priyaDiscussion[0].speaker,
            'You',
            'First line speaker is You'
        );
        this.assert(
            DIALOGUE_FRAGMENTS.priyaDiscussion[0].text.includes('Priya Sharma'),
            'First line mentions Priya Sharma'
        );

        // Fragment is used in coalition scenes
        const intervene = STORY.scenes.coalition_intervene;
        const silent = STORY.scenes.coalition_silent;

        // Check that the Priya discussion appears in both scenes
        const interveneHasPriya = intervene.dialogue.some(d => d.text && d.text.includes('Priya Sharma'));
        const silentHasPriya = silent.dialogue.some(d => d.text && d.text.includes('Priya Sharma'));

        this.assert(interveneHasPriya, 'coalition_intervene includes Priya discussion');
        this.assert(silentHasPriya, 'coalition_silent includes Priya discussion');
    },

    // Test 4: Routing Rules
    testRoutingRules() {
        console.log('\n--- Routing Rules Tests ---');

        // Climax choice routing
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: true, sharedWithPriya: true }),
            'climax_choice',
            'Both allies -> climax_choice'
        );
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: true, sharedWithPriya: false }),
            'climax_no_leverage',
            'Only Elena -> climax_no_leverage'
        );
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: false, sharedWithPriya: true }),
            'climax_no_leverage',
            'Only Priya -> climax_no_leverage'
        );
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: false, sharedWithPriya: false }),
            'climax_no_leverage',
            'No allies -> climax_no_leverage'
        );

        // Ending routing - Both allies + supported
        this.assertEqual(
            routeScene('ending_check', {
                trustedElena: true, sharedWithPriya: true,
                supportedCompromise: true, opposedCompromise: false
            }),
            'ending_a',
            'Both allies + supported -> ending_a (Pyrrhic Victory)'
        );

        // Ending routing - Both allies + opposed
        this.assertEqual(
            routeScene('ending_check', {
                trustedElena: true, sharedWithPriya: true,
                supportedCompromise: false, opposedCompromise: true
            }),
            'ending_b',
            'Both allies + opposed -> ending_b (Moral Victory)'
        );

        // Ending routing - One ally
        this.assertEqual(
            routeScene('ending_check', {
                trustedElena: true, sharedWithPriya: false
            }),
            'ending_b_partial',
            'Only Elena -> ending_b_partial (Compromise)'
        );
        this.assertEqual(
            routeScene('ending_check', {
                trustedElena: false, sharedWithPriya: true
            }),
            'ending_b_partial',
            'Only Priya -> ending_b_partial (Compromise)'
        );

        // Ending routing - No allies
        this.assertEqual(
            routeScene('ending_check', {
                trustedElena: false, sharedWithPriya: false
            }),
            'ending_c',
            'No allies -> ending_c (Status Quo)'
        );

        // Invalid router returns null
        this.assertEqual(
            routeScene('nonexistent_router', {}),
            null,
            'Invalid router ID returns null'
        );
    },

    // Test 5: Conditional Dialogue Processing
    testConditionalDialogue() {
        console.log('\n--- Conditional Dialogue Tests ---');

        // Create a mock scene manager to test processConditionalDialogue
        const mockManager = {
            gameFlags: { spokeUp: false },
            processConditionalDialogue: SceneManager.prototype.processConditionalDialogue
        };

        // Test conditionalText replacement
        const sceneWithConditional = {
            dialogue: [
                { speaker: 'Sarah', text: 'Default text', conditionalText: { spokeUp: 'Spoke up text' } },
                { speaker: 'Narrator', text: 'Always shown' }
            ]
        };

        // Without spokeUp flag
        mockManager.gameFlags = { spokeUp: false };
        let processed = mockManager.processConditionalDialogue(sceneWithConditional);
        this.assertEqual(
            processed.dialogue[0].text,
            'Default text',
            'conditionalText: shows default when flag is false'
        );

        // With spokeUp flag
        mockManager.gameFlags = { spokeUp: true };
        processed = mockManager.processConditionalDialogue(sceneWithConditional);
        this.assertEqual(
            processed.dialogue[0].text,
            'Spoke up text',
            'conditionalText: shows alternate when flag is true'
        );

        // Test conditionalOnly filtering
        const sceneWithConditionalOnly = {
            dialogue: [
                { speaker: 'You', text: 'Always shown' },
                { speaker: 'You', text: 'Only if spoke up', conditionalOnly: 'spokeUp' },
                { speaker: 'Sarah', text: 'Only if did not speak up', conditionalOnly: '!spokeUp' }
            ]
        };

        // Without spokeUp flag
        mockManager.gameFlags = { spokeUp: false };
        processed = mockManager.processConditionalDialogue(sceneWithConditionalOnly);
        this.assertEqual(
            processed.dialogue.length,
            2,
            'conditionalOnly: filters to 2 lines when spokeUp=false'
        );
        this.assertEqual(
            processed.dialogue[1].text,
            'Only if did not speak up',
            'conditionalOnly: includes !spokeUp line when flag is false'
        );

        // With spokeUp flag
        mockManager.gameFlags = { spokeUp: true };
        processed = mockManager.processConditionalDialogue(sceneWithConditionalOnly);
        this.assertEqual(
            processed.dialogue.length,
            2,
            'conditionalOnly: filters to 2 lines when spokeUp=true'
        );
        this.assertEqual(
            processed.dialogue[1].text,
            'Only if spoke up',
            'conditionalOnly: includes spokeUp line when flag is true'
        );
    },

    // Test 6: Scene Structure Validation
    testSceneStructure() {
        console.log('\n--- Scene Structure Tests ---');

        const sceneIds = Object.keys(STORY.scenes);

        this.assert(sceneIds.length > 0, 'STORY.scenes has scenes defined');
        this.assert(sceneIds.includes('intro'), 'intro scene exists');
        this.assert(sceneIds.includes('the_filibuster'), 'the_filibuster scene exists');
        this.assert(sceneIds.includes('ending_a'), 'ending_a scene exists');
        this.assert(sceneIds.includes('ending_b'), 'ending_b scene exists');
        this.assert(sceneIds.includes('ending_c'), 'ending_c scene exists');

        // Verify scenes have required properties
        for (const [id, scene] of Object.entries(STORY.scenes)) {
            // Router scenes have different structure
            if (scene.isRouter) {
                this.assert(
                    scene.routerId,
                    `Router scene ${id} has routerId`
                );
                continue;
            }

            this.assert(
                scene.id === id,
                `Scene ${id} has matching id property`
            );
            this.assert(
                scene.location && typeof scene.location === 'string',
                `Scene ${id} has location`
            );
            this.assert(
                scene.background && typeof scene.background === 'string',
                `Scene ${id} has background`
            );
        }

        // Ending scenes have correct properties
        const endings = ['ending_a', 'ending_b', 'ending_b_partial', 'ending_c'];
        for (const endingId of endings) {
            const ending = STORY.scenes[endingId];
            this.assert(ending.isEnding === true, `${endingId} has isEnding=true`);
            this.assert(ending.endingType, `${endingId} has endingType`);
        }

        // Verify no orphaned _spokeup scenes exist (they should be consolidated)
        this.assert(
            !STORY.scenes.ending_a_spokeup,
            'ending_a_spokeup has been consolidated'
        );
        this.assert(
            !STORY.scenes.ending_b_spokeup,
            'ending_b_spokeup has been consolidated'
        );
        this.assert(
            !STORY.scenes.ending_c_spokeup,
            'ending_c_spokeup has been consolidated'
        );
    },

    // Test 7: Complete Ending Paths
    testEndingPaths() {
        console.log('\n--- Ending Path Tests ---');

        // Simulate game flag states and verify correct endings are reachable
        const testCases = [
            {
                name: 'Pyrrhic Victory path (both allies, supported)',
                flags: { trustedElena: true, sharedWithPriya: true, supportedCompromise: true, spokeUp: false },
                expectedEnding: 'ending_a',
                expectedType: 'The Pyrrhic Victory'
            },
            {
                name: 'Moral Victory path (both allies, opposed)',
                flags: { trustedElena: true, sharedWithPriya: true, opposedCompromise: true, spokeUp: false },
                expectedEnding: 'ending_b',
                expectedType: 'The Moral Victory'
            },
            {
                name: 'Compromise path (one ally - Elena)',
                flags: { trustedElena: true, sharedWithPriya: false, spokeUp: false },
                expectedEnding: 'ending_b_partial',
                expectedType: 'The Compromise'
            },
            {
                name: 'Compromise path (one ally - Priya)',
                flags: { trustedElena: false, sharedWithPriya: true, spokeUp: false },
                expectedEnding: 'ending_b_partial',
                expectedType: 'The Compromise'
            },
            {
                name: 'Status Quo path (no allies)',
                flags: { trustedElena: false, sharedWithPriya: false, spokeUp: false },
                expectedEnding: 'ending_c',
                expectedType: 'The Status Quo'
            }
        ];

        for (const testCase of testCases) {
            const endingId = routeScene('ending_check', testCase.flags);
            const ending = STORY.scenes[endingId];

            this.assertEqual(
                endingId,
                testCase.expectedEnding,
                `${testCase.name}: routes to ${testCase.expectedEnding}`
            );
            this.assertEqual(
                ending.endingType,
                testCase.expectedType,
                `${testCase.name}: has correct ending type`
            );
        }

        // Test that spokeUp flag affects dialogue content (not routing)
        const mockManager = {
            gameFlags: { spokeUp: true },
            processConditionalDialogue: SceneManager.prototype.processConditionalDialogue
        };

        // Ending A with spokeUp should have different Sarah dialogue
        const endingA = STORY.scenes.ending_a;
        const processedA = mockManager.processConditionalDialogue(endingA);
        const sarahLine = processedA.dialogue.find(d => d.speaker === 'Sarah' && d.text.includes('Technically'));
        this.assert(
            sarahLine.text.includes('people noticed'),
            'ending_a with spokeUp has modified Sarah dialogue'
        );

        // Ending C with spokeUp should include "Did anyone hear?" line
        const endingC = STORY.scenes.ending_c;
        const processedC = mockManager.processConditionalDialogue(endingC);
        const hearLine = processedC.dialogue.find(d => d.text === 'Did anyone hear?');
        this.assert(
            hearLine !== undefined,
            'ending_c with spokeUp includes "Did anyone hear?" line'
        );

        // Ending C without spokeUp should NOT include "Did anyone hear?"
        mockManager.gameFlags = { spokeUp: false };
        const processedCNoSpoke = mockManager.processConditionalDialogue(endingC);
        const hearLineNoSpoke = processedCNoSpoke.dialogue.find(d => d.text === 'Did anyone hear?');
        this.assert(
            hearLineNoSpoke === undefined,
            'ending_c without spokeUp excludes "Did anyone hear?" line'
        );
    }
};

// Export for use in HTML test runner
if (typeof window !== 'undefined') {
    window.TestRunner = TestRunner;
}
