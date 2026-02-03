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
        this.testCharacterPayoff();
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

        // Climax choice routing - four distinct paths
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: true, sharedWithPriya: true }),
            'climax_both',
            'Both allies -> climax_both (full negotiation)'
        );
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: true, sharedWithPriya: false }),
            'climax_elena_only',
            'Elena only -> climax_elena_only (understand but cant act)'
        );
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: false, sharedWithPriya: true }),
            'climax_priya_only',
            'Priya only -> climax_priya_only (can act but dont understand)'
        );
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: false, sharedWithPriya: false }),
            'climax_neither',
            'No allies -> climax_neither (irrelevant)'
        );

        // Ending routing - five distinct endings
        this.assertEqual(
            routeScene('ending_check', { trustedElena: true, sharedWithPriya: true, negotiated: true }),
            'ending_incremental',
            'Both + negotiated -> ending_incremental'
        );
        this.assertEqual(
            routeScene('ending_check', { trustedElena: true, sharedWithPriya: true, walkedAway: true }),
            'ending_walked_away',
            'Both + walked away -> ending_walked_away'
        );
        this.assertEqual(
            routeScene('ending_check', { trustedElena: true, sharedWithPriya: false }),
            'ending_cassandra',
            'Elena only -> ending_cassandra'
        );
        this.assertEqual(
            routeScene('ending_check', { trustedElena: false, sharedWithPriya: true }),
            'ending_pyrrhic',
            'Priya only -> ending_pyrrhic'
        );
        this.assertEqual(
            routeScene('ending_check', { trustedElena: false, sharedWithPriya: false }),
            'ending_status_quo',
            'No allies -> ending_status_quo'
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
        this.assert(sceneIds.includes('ending_status_quo'), 'ending_status_quo scene exists');
        this.assert(sceneIds.includes('ending_cassandra'), 'ending_cassandra scene exists');
        this.assert(sceneIds.includes('ending_pyrrhic'), 'ending_pyrrhic scene exists');
        this.assert(sceneIds.includes('ending_incremental'), 'ending_incremental scene exists');
        this.assert(sceneIds.includes('ending_walked_away'), 'ending_walked_away scene exists');

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
        const endings = ['ending_status_quo', 'ending_cassandra', 'ending_pyrrhic', 'ending_incremental', 'ending_walked_away'];
        for (const endingId of endings) {
            const ending = STORY.scenes[endingId];
            this.assert(ending.isEnding === true, `${endingId} has isEnding=true`);
            this.assert(ending.endingType, `${endingId} has endingType`);
        }

        // Verify old endings have been removed
        this.assert(!STORY.scenes.ending_a, 'ending_a removed (replaced by new structure)');
        this.assert(!STORY.scenes.ending_b, 'ending_b removed (replaced by new structure)');
        this.assert(!STORY.scenes.ending_c, 'ending_c removed (replaced by new structure)');
    },

    // Test 7: Character Differentiation and Payoff
    testCharacterPayoff() {
        console.log('\n--- Character Payoff Tests ---');

        // PRIYA: Should NOT mention Amendment 7 (that's Elena's intel)
        const priyaAlly = STORY.scenes.priya_ally;
        const amendment7Line = priyaAlly.dialogue.find(d => d.text && d.text.includes('Amendment 7'));
        this.assert(
            amendment7Line === undefined,
            'Priya does not mention Amendment 7 (differentiated from Elena)'
        );

        // PRIYA: Should mention her unique value - knowing WHO can be moved
        const elenaAimLine = priyaAlly.dialogue.find(d => d.text && d.text.includes('Elena can tell you where to aim'));
        this.assert(
            elenaAimLine !== undefined,
            'Priya explicitly differentiates her value from Elena'
        );

        // ELENA: Markup should show her intel paying off (Amendments 3-6 sacrificial)
        const markup = STORY.scenes.markup_hearing;
        const elenaPayoff = markup.dialogue.find(d =>
            d.text && d.text.includes('Elena\'s prediction') && d.conditionalOnly === 'trustedElena'
        );
        this.assert(
            elenaPayoff !== undefined,
            'Markup shows Elena\'s intel paying off (conditionally)'
        );

        // PRIYA: Markup should show her votes paying off (Margaret Chen)
        const priyaLine = markup.dialogue.find(d => d.speaker === 'Priya' && d.conditionalOnly === 'sharedWithPriya');
        this.assert(
            priyaLine !== undefined,
            'Markup shows Priya\'s vote paying off (conditionally)'
        );

        // Vote count should change based on Priya's help
        const voteCountLine = markup.dialogue.find(d => d.text && d.text.includes('12-10') && d.conditionalText);
        this.assert(
            voteCountLine !== undefined && voteCountLine.conditionalText.sharedWithPriya.includes('11-10'),
            'With Priya, vote is closer (12-10 -> 11-10)'
        );

        // Each climax path should be distinct
        this.assert(STORY.scenes.climax_neither !== undefined, 'climax_neither exists (no allies)');
        this.assert(STORY.scenes.climax_elena_only !== undefined, 'climax_elena_only exists (intel only)');
        this.assert(STORY.scenes.climax_priya_only !== undefined, 'climax_priya_only exists (votes only)');
        this.assert(STORY.scenes.climax_both !== undefined, 'climax_both exists (full negotiation)');

        // Elena-only path should reflect understanding without power
        const elenaOnly = STORY.scenes.climax_elena_only;
        const understandLine = elenaOnly.dialogue.find(d => d.text && d.text.includes('Understanding it'));
        this.assert(
            understandLine !== undefined,
            'Elena-only climax reflects knowing but not acting'
        );

        // Priya-only path should reflect winning battle but losing war
        const priyaOnly = STORY.scenes.climax_priya_only;
        const conferenceCommittee = priyaOnly.dialogue.find(d => d.text && d.text.includes('conference committee'));
        this.assert(
            conferenceCommittee !== undefined,
            'Priya-only climax shows victory undone in conference'
        );
    },

    // Test 8: Complete Ending Paths
    testEndingPaths() {
        console.log('\n--- Ending Path Tests ---');

        // All five distinct ending paths
        const testCases = [
            {
                name: 'Status Quo (no allies)',
                flags: { trustedElena: false, sharedWithPriya: false },
                expectedEnding: 'ending_status_quo',
                expectedType: 'The Status Quo'
            },
            {
                name: 'Cassandra (Elena only)',
                flags: { trustedElena: true, sharedWithPriya: false },
                expectedEnding: 'ending_cassandra',
                expectedType: 'The Cassandra'
            },
            {
                name: 'Pyrrhic (Priya only)',
                flags: { trustedElena: false, sharedWithPriya: true },
                expectedEnding: 'ending_pyrrhic',
                expectedType: 'The Pyrrhic Victory'
            },
            {
                name: 'Incremental (both + negotiated)',
                flags: { trustedElena: true, sharedWithPriya: true, negotiated: true },
                expectedEnding: 'ending_incremental',
                expectedType: 'The Incremental Victory'
            },
            {
                name: 'Walked Away (both + refused deal)',
                flags: { trustedElena: true, sharedWithPriya: true, walkedAway: true },
                expectedEnding: 'ending_walked_away',
                expectedType: 'The Principled Stand'
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
            this.assert(
                ending !== undefined,
                `${testCase.name}: ending scene exists`
            );
            this.assertEqual(
                ending.endingType,
                testCase.expectedType,
                `${testCase.name}: has correct ending type`
            );
        }

        // Verify endings reflect incremental victories
        const incremental = STORY.scenes.ending_incremental;
        const quarterlyReports = incremental.dialogue.find(d => d.text && d.text.includes('quarterly'));
        this.assert(
            quarterlyReports !== undefined,
            'Incremental ending shows small concrete win (quarterly reports)'
        );

        // Verify the "best" ending still feels small
        const notClose = incremental.dialogue.find(d => d.text && d.text.includes('not even close'));
        this.assert(
            notClose !== undefined,
            'Even best ending acknowledges victory is small'
        );
    }
};

// Export for use in HTML test runner
if (typeof window !== 'undefined') {
    window.TestRunner = TestRunner;
}
