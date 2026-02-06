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
        this.testInboxTriage();
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
        this.assertEqual(LOCATIONS.office.location, 'TAPP Office', 'LOCATIONS.office.location correct');
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
        const aligned = STORY.scenes.coalition_focus_aligned;
        const scattered = STORY.scenes.coalition_focus_scattered;
        const broad = STORY.scenes.coalition_broad;

        // Check that the Priya discussion appears in coalition scenes
        const alignedHasPriya = aligned.dialogue.some(d => d.text && d.text.includes('Priya Sharma'));
        const scatteredHasPriya = scattered.dialogue.some(d => d.text && d.text.includes('Priya Sharma'));
        const broadHasPriya = broad.dialogue.some(d => d.text && d.text.includes('Priya Sharma'));

        this.assert(alignedHasPriya, 'coalition_focus_aligned includes Priya discussion');
        this.assert(scatteredHasPriya, 'coalition_focus_scattered includes Priya discussion');
        this.assert(broadHasPriya, 'coalition_broad includes Priya discussion');
    },

    // Test 4: Routing Rules
    testRoutingRules() {
        console.log('\n--- Routing Rules Tests ---');

        // Coalition focus routing
        this.assertEqual(
            routeScene('coalition_focus', { trustedElena: true }),
            'coalition_focus_aligned',
            'Trusted Elena -> coalition_focus_aligned'
        );
        this.assertEqual(
            routeScene('coalition_focus', { trustedElena: false }),
            'coalition_focus_scattered',
            'Did not trust Elena -> coalition_focus_scattered'
        );

        // Elena check routing - staffer betrayal mechanic
        this.assertEqual(
            routeScene('elena_check', { trustedElena: true, trustedStaffer: true }),
            'elena_burned',
            'Trusted both Elena and staffer -> elena_burned'
        );
        this.assertEqual(
            routeScene('elena_check', { trustedElena: true, trustedStaffer: false }),
            'markup_hearing',
            'Trusted Elena but not staffer -> markup_hearing (safe)'
        );
        this.assertEqual(
            routeScene('elena_check', { trustedElena: false, trustedStaffer: true }),
            'markup_hearing',
            'Trusted staffer but not Elena -> markup_hearing (nothing to burn)'
        );
        this.assertEqual(
            routeScene('elena_check', { trustedElena: false, trustedStaffer: false }),
            'markup_hearing',
            'Trusted neither -> markup_hearing'
        );

        // Climax choice routing - five distinct paths
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: true, elenaBurned: false, sharedWithPriya: true, seizedMoment: true }),
            'climax_both',
            'Both allies + seized moment -> climax_both (full negotiation)'
        );
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: true, elenaBurned: false, sharedWithPriya: true, seizedMoment: false }),
            'climax_both_no_leverage',
            'Both allies but no moment -> climax_both_no_leverage'
        );
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: true, elenaBurned: false, sharedWithPriya: false }),
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

        // Elena burned negates her benefit in climax
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: true, elenaBurned: true, sharedWithPriya: true }),
            'climax_priya_only',
            'Elena burned + Priya -> climax_priya_only (Elena negated)'
        );
        this.assertEqual(
            routeScene('climax_choice_check', { trustedElena: true, elenaBurned: true, sharedWithPriya: false }),
            'climax_neither',
            'Elena burned + no Priya -> climax_neither (Elena negated)'
        );

        // Ending routing - six distinct endings
        this.assertEqual(
            routeScene('ending_check', { trustedElena: true, elenaBurned: false, sharedWithPriya: true, negotiated: true }),
            'ending_incremental',
            'Both + negotiated -> ending_incremental'
        );
        this.assertEqual(
            routeScene('ending_check', { trustedElena: true, elenaBurned: false, sharedWithPriya: true, walkedAway: true }),
            'ending_walked_away',
            'Both + walked away -> ending_walked_away'
        );
        this.assertEqual(
            routeScene('ending_check', { trustedElena: true, elenaBurned: false, sharedWithPriya: true }),
            'ending_no_leverage',
            'Both allies but no leverage -> ending_no_leverage'
        );
        this.assertEqual(
            routeScene('ending_check', { trustedElena: true, elenaBurned: false, sharedWithPriya: false }),
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

        // Elena burned negates her benefit in endings
        this.assertEqual(
            routeScene('ending_check', { trustedElena: true, elenaBurned: true, sharedWithPriya: true, negotiated: true }),
            'ending_pyrrhic',
            'Elena burned + Priya + negotiated -> ending_pyrrhic (Elena negated)'
        );
        this.assertEqual(
            routeScene('ending_check', { trustedElena: true, elenaBurned: true, sharedWithPriya: false }),
            'ending_status_quo',
            'Elena burned + no Priya -> ending_status_quo (Elena negated)'
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

        // Test textFn processing
        const sceneWithTextFn = {
            dialogue: [
                { speaker: 'Chairman', textFn: (flags) => flags.myFlag ? 'Yes' : 'No' },
                { speaker: 'Narrator', text: 'Static text', conditionalText: { myFlag: 'Alt text' } }
            ]
        };

        mockManager.gameFlags = { myFlag: true };
        processed = mockManager.processConditionalDialogue(sceneWithTextFn);
        this.assertEqual(
            processed.dialogue[0].text,
            'Yes',
            'textFn: computes text from flags'
        );
        this.assertEqual(
            processed.dialogue[1].text,
            'Alt text',
            'textFn: conditionalText still works on other lines'
        );

        mockManager.gameFlags = { myFlag: false };
        processed = mockManager.processConditionalDialogue(sceneWithTextFn);
        this.assertEqual(
            processed.dialogue[0].text,
            'No',
            'textFn: recomputes when flags change'
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
        this.assert(sceneIds.includes('ending_no_leverage'), 'ending_no_leverage scene exists');
        this.assert(sceneIds.includes('climax_both_no_leverage'), 'climax_both_no_leverage scene exists');

        // Staffer betrayal scenes
        this.assert(sceneIds.includes('staffer_approach'), 'staffer_approach scene exists');
        this.assert(sceneIds.includes('staffer_trust'), 'staffer_trust scene exists');
        this.assert(sceneIds.includes('staffer_dismiss'), 'staffer_dismiss scene exists');
        this.assert(sceneIds.includes('elena_check_router'), 'elena_check_router scene exists');
        this.assert(sceneIds.includes('elena_burned'), 'elena_burned scene exists');

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
        const endings = ['ending_status_quo', 'ending_cassandra', 'ending_pyrrhic', 'ending_incremental', 'ending_walked_away', 'ending_no_leverage'];
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

        // PRIYA: Markup should show her votes paying off (Senator Chen)
        const priyaLine = markup.dialogue.find(d => d.speaker === 'Priya' && d.conditionalOnly === 'sharedWithPriya');
        this.assert(
            priyaLine !== undefined,
            'Markup shows Priya\'s vote paying off (conditionally)'
        );

        // Vote count should change based on flags (uses textFn for DRY computation)
        const voteCountLine = markup.dialogue.find(d => d.textFn && d.speaker === 'Chairman');
        this.assert(voteCountLine !== undefined, 'Vote count line uses textFn');
        this.assertEqual(
            voteCountLine.textFn({ seizedMoment: false, sharedWithPriya: false }),
            'The amendment passes. 13-9.',
            'Default vote count is 13-9'
        );
        this.assertEqual(
            voteCountLine.textFn({ seizedMoment: false, sharedWithPriya: true }),
            'The amendment passes. 12-10.',
            'With Priya, vote is 12-10'
        );
        this.assertEqual(
            voteCountLine.textFn({ seizedMoment: true, sharedWithPriya: false }),
            'The amendment passes. 12-10.',
            'With seized moment, vote is 12-10'
        );
        this.assertEqual(
            voteCountLine.textFn({ seizedMoment: true, sharedWithPriya: true }),
            'The amendment passes. 11-10.',
            'With both, vote is 11-10'
        );

        // Narrator margin textFn - tests pluralization and Priya conditional
        const marginLine = markup.dialogue.find(d => d.textFn && d.speaker === 'Narrator');
        this.assert(marginLine !== undefined, 'Margin commentary line uses textFn');
        this.assertEqual(
            marginLine.textFn({ seizedMoment: false, sharedWithPriya: false }),
            'Four votes.',
            'Default margin is "Four votes."'
        );
        this.assertEqual(
            marginLine.textFn({ seizedMoment: true, sharedWithPriya: false }),
            'Two votes.',
            'Seized moment margin is "Two votes."'
        );
        this.assertEqual(
            marginLine.textFn({ seizedMoment: false, sharedWithPriya: true }),
            'Two votes. Senator Chen made a difference, but not enough.',
            'Priya margin includes Senator Chen commentary'
        );
        this.assertEqual(
            marginLine.textFn({ seizedMoment: true, sharedWithPriya: true }),
            'One vote. Senator Chen made a difference, but not enough.',
            'Both flags margin is "One vote." with Senator Chen'
        );

        // NEWS: seizedMoment is set by news_fast (gates best ending)
        const newsFast = STORY.scenes.news_fast;
        this.assert(
            newsFast !== undefined && newsFast.setFlags && newsFast.setFlags.seizedMoment === true,
            'news_fast sets seizedMoment flag'
        );
        const newsSlow = STORY.scenes.news_slow;
        this.assert(
            newsSlow !== undefined && (!newsSlow.setFlags || !newsSlow.setFlags.seizedMoment),
            'news_slow does NOT set seizedMoment flag'
        );

        // NEWS: news_break offers the choice between fast and slow
        const newsBreak = STORY.scenes.news_break;
        this.assert(newsBreak !== undefined, 'news_break scene exists');
        const fastChoice = newsBreak.choices.find(c => c.nextDialogue === 'news_fast');
        const slowChoice = newsBreak.choices.find(c => c.nextDialogue === 'news_slow');
        this.assert(fastChoice !== undefined, 'news_break has choice leading to news_fast');
        this.assert(slowChoice !== undefined, 'news_break has choice leading to news_slow');

        // STAFFER: Trusting the staffer sets the flag
        const stafferTrust = STORY.scenes.staffer_trust;
        this.assert(
            stafferTrust !== undefined,
            'staffer_trust scene exists'
        );

        // STAFFER: Choice to share Elena's intel only appears if you trusted Elena
        const stafferApproach = STORY.scenes.staffer_approach;
        const shareElenaChoice = stafferApproach.choices.find(c =>
            c.text && c.text.includes('Elena') && c.conditionalOnly === 'trustedElena'
        );
        this.assert(
            shareElenaChoice !== undefined,
            'Sharing Elena intel with staffer requires trustedElena'
        );

        // STAFFER: elena_burned scene sets the elenaBurned flag
        const elenaBurned = STORY.scenes.elena_burned;
        this.assert(
            elenaBurned !== undefined && elenaBurned.setFlags && elenaBurned.setFlags.elenaBurned === true,
            'elena_burned scene sets elenaBurned flag'
        );

        // STAFFER: Elena confronts you in elena_burned
        const elenaConfrontLine = elenaBurned.dialogue.find(d =>
            d.speaker === 'Elena' && d.text && d.text.includes('how careful')
        );
        this.assert(
            elenaConfrontLine !== undefined,
            'Elena confronts player about burning her source'
        );

        // Each climax path should be distinct
        this.assert(STORY.scenes.climax_neither !== undefined, 'climax_neither exists (no allies)');
        this.assert(STORY.scenes.climax_elena_only !== undefined, 'climax_elena_only exists (intel only)');
        this.assert(STORY.scenes.climax_priya_only !== undefined, 'climax_priya_only exists (votes only)');
        this.assert(STORY.scenes.climax_both !== undefined, 'climax_both exists (full negotiation)');
        this.assert(STORY.scenes.climax_both_no_leverage !== undefined, 'climax_both_no_leverage exists (no public pressure)');

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

    // Test 8: Inbox Triage Scene
    testInboxTriage() {
        console.log('\n--- Inbox Triage Tests ---');

        // All four inbox scenes exist
        const inboxScenes = ['inbox_triage', 'inbox_journalist', 'inbox_intern', 'inbox_listserv'];
        for (const sceneId of inboxScenes) {
            this.assert(
                STORY.scenes[sceneId] !== undefined,
                `${sceneId} scene exists`
            );
        }

        // inbox_triage has three choices
        const triage = STORY.scenes.inbox_triage;
        this.assertEqual(
            triage.choices.length,
            3,
            'inbox_triage has 3 choices'
        );

        // Each outcome scene sets exactly one flag
        const journalist = STORY.scenes.inbox_journalist;
        this.assert(
            journalist.setFlags.repliedJournalist === true,
            'inbox_journalist sets repliedJournalist'
        );
        this.assertEqual(
            Object.keys(journalist.setFlags).length,
            1,
            'inbox_journalist sets exactly one flag'
        );

        const intern = STORY.scenes.inbox_intern;
        this.assert(
            intern.setFlags.repliedIntern === true,
            'inbox_intern sets repliedIntern'
        );
        this.assertEqual(
            Object.keys(intern.setFlags).length,
            1,
            'inbox_intern sets exactly one flag'
        );

        const listserv = STORY.scenes.inbox_listserv;
        this.assert(
            listserv.setFlags.repliedListserv === true,
            'inbox_listserv sets repliedListserv'
        );
        this.assertEqual(
            Object.keys(listserv.setFlags).length,
            1,
            'inbox_listserv sets exactly one flag'
        );

        // All three outcome scenes lead to think_tank
        this.assertEqual(
            journalist.nextScene,
            'think_tank',
            'inbox_journalist leads to think_tank'
        );
        this.assertEqual(
            intern.nextScene,
            'think_tank',
            'inbox_intern leads to think_tank'
        );
        this.assertEqual(
            listserv.nextScene,
            'think_tank',
            'inbox_listserv leads to think_tank'
        );

        // Coalition scenes now route to inbox_triage
        this.assertEqual(
            STORY.scenes.coalition_focus_aligned.nextScene,
            'inbox_triage',
            'coalition_focus_aligned routes to inbox_triage'
        );
        this.assertEqual(
            STORY.scenes.coalition_focus_scattered.nextScene,
            'inbox_triage',
            'coalition_focus_scattered routes to inbox_triage'
        );
        this.assertEqual(
            STORY.scenes.coalition_broad.nextScene,
            'inbox_triage',
            'coalition_broad routes to inbox_triage'
        );
    },

    // Test 9: Complete Ending Paths
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
            },
            {
                name: 'The Almost (both allies, no leverage)',
                flags: { trustedElena: true, sharedWithPriya: true },
                expectedEnding: 'ending_no_leverage',
                expectedType: 'The Almost'
            },
            {
                name: 'Elena burned + Priya (becomes Pyrrhic)',
                flags: { trustedElena: true, elenaBurned: true, sharedWithPriya: true, negotiated: true },
                expectedEnding: 'ending_pyrrhic',
                expectedType: 'The Pyrrhic Victory'
            },
            {
                name: 'Elena burned + no Priya (becomes Status Quo)',
                flags: { trustedElena: true, elenaBurned: true, sharedWithPriya: false },
                expectedEnding: 'ending_status_quo',
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
