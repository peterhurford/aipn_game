// Story Data - All scenes, dialogue, and choices

// Location registry - centralized location/background definitions
const LOCATIONS = {
    office: { location: 'AIPN Office', background: 'bg-office' },
    officeCoalition: { location: 'AIPN Office - Coalition Call', background: 'bg-office' },
    officeLate: { location: 'AIPN Office - Late Night', background: 'bg-office' },
    officeSixMonths: { location: 'AIPN Office - Six Months Later', background: 'bg-office' },
    officeThreeMonths: { location: 'AIPN Office - Three Months Later', background: 'bg-office' },
    officeNextCongress: { location: 'AIPN Office - Next Congress', background: 'bg-office' },
    bar: { location: 'The Filibuster Bar', background: 'bg-bar' },
    conference: { location: 'Conference Room B-7', background: 'bg-office' },
    thinktank: { location: "Priya's Office", background: 'bg-thinktank' },
    mall: { location: 'National Mall at Night', background: 'bg-mall' },
    capitol: { location: 'Rayburn Building - Committee Room', background: 'bg-capitol' }
};

// Speaker style configuration - maps speakers to CSS classes
const SPEAKER_STYLES = {
    'Narrator': 'speaker-narrator',
    'You': 'speaker-you',
    'Elena': 'speaker-elena',
    'Priya': 'speaker-priya',
    'Sarah': 'speaker-sarah',
    'Phone': 'speaker-phone'
};

const SPEAKER_GROUPS = {
    'speaker-official': ['Chairman', 'Peters', 'Staffer'],
    'speaker-minor': ['Industry Rep', 'Academic', 'Nonprofit Advocate', 'Facilitator', 'Voice 1', 'Voice 2', 'Voice 3', 'Voice 4']
};

// Get the CSS class for a speaker
function getSpeakerClass(speaker) {
    if (SPEAKER_STYLES[speaker]) {
        return SPEAKER_STYLES[speaker];
    }
    for (const [className, speakers] of Object.entries(SPEAKER_GROUPS)) {
        if (speakers.includes(speaker)) {
            return className;
        }
    }
    return 'speaker-character';
}

// Shared dialogue fragments - reusable dialogue blocks
const DIALOGUE_FRAGMENTS = {
    priyaDiscussion: [
        {
            speaker: 'You',
            text: 'Someone told me to talk to Priya Sharma.',
            portrait: null
        },
        {
            speaker: 'Sarah',
            text: "Priya? Good luck. She doesn't really... do meetings anymore.",
            portrait: null
        },
        {
            speaker: 'You',
            text: 'What does she do?',
            portrait: null
        },
        {
            speaker: 'Sarah',
            text: "Drinks, mostly. But she knows everyone. If she'll talk to you.",
            portrait: null
        }
    ]
};

// Conditional routing rules for router scenes
const ROUTING_RULES = {
    climax_choice_check: {
        rules: [
            {
                // Both allies = full negotiation option
                condition: (flags) => flags.trustedElena && flags.sharedWithPriya,
                target: 'climax_both'
            },
            {
                // Elena only = you understand but can't act
                condition: (flags) => flags.trustedElena,
                target: 'climax_elena_only'
            },
            {
                // Priya only = you can act but don't understand
                condition: (flags) => flags.sharedWithPriya,
                target: 'climax_priya_only'
            }
        ],
        // Neither = you're irrelevant
        default: 'climax_neither'
    },
    ending_check: {
        rules: [
            {
                // Both allies + negotiated = Incremental victory
                condition: (flags) => flags.trustedElena && flags.sharedWithPriya && flags.negotiated,
                target: 'ending_incremental'
            },
            {
                // Both allies + opposed = you had leverage but walked away
                condition: (flags) => flags.trustedElena && flags.sharedWithPriya && flags.walkedAway,
                target: 'ending_walked_away'
            },
            {
                // Elena only = Cassandra (you saw it coming)
                condition: (flags) => flags.trustedElena,
                target: 'ending_cassandra'
            },
            {
                // Priya only = Pyrrhic (won battle, lost war)
                condition: (flags) => flags.sharedWithPriya,
                target: 'ending_pyrrhic'
            }
        ],
        // No allies = Status Quo (bill died, you were irrelevant)
        default: 'ending_status_quo'
    }
};

// Route to the appropriate scene based on flags
function routeScene(routerId, flags) {
    const routing = ROUTING_RULES[routerId];
    if (!routing) return null;

    for (const rule of routing.rules) {
        if (rule.condition(flags)) {
            return rule.target;
        }
    }

    return routing.default;
}

const STORY = {
    // Initial game state flags
    initialFlags: {
        trustedElena: false,
        sharedWithPriya: false,
        foundEvidence: false,
        knowsTheTruth: false,
        spokeUp: false,
        negotiated: false,
        walkedAway: false
    },

    // Scene definitions
    scenes: {
        intro: {
            id: 'intro',
            ...LOCATIONS.office,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Three years at AIPN. Two failed bills. This is attempt number three.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your desk is covered in draft amendments. The Frontier AI Safety Act sits at the top, marked up in three colors of ink.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Sarah drops another stack.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Stakeholder meeting in an hour. Then the coalition call at three. Then markup prep.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Which stakeholder meeting?',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'The one about the other stakeholder meeting. To prepare for the listening session. Before the comment period.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Ah. That one.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. A text from an unknown number.',
                    portrait: null
                },
                {
                    speaker: 'Phone',
                    text: '"Saw your testimony last week. Want to grab a drink? I work in industry but I\'m not a monster. Mostly. - Elena V."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She peers over your shoulder.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'Elena Vance? MindScale\'s policy director?',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'MindScale and Prometheus. The two labs racing to build God. Your bill would make them slow down. They have opinions about that.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She\'s actually not terrible. For a lobbyist.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Should I be suspicious?',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'In this town? Always. But also, free drinks.',
                    portrait: null
                }
            ],
            nextScene: 'the_filibuster'
        },

        the_filibuster: {
            id: 'the_filibuster',
            ...LOCATIONS.bar,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Happy hour specials named after dead legislation. The "Public Option" is a watered-down well drink. The "Carbon Tax" costs more than it should.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Elena waves you over. She\'s in business casual, which in DC means she could be anywhere from a congressional staffer to a Fortune 500 exec.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'Thanks for coming. I know advocates aren\'t supposed to fraternize with the enemy.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'You',
                    text: 'Are you the enemy?',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'She shrugs.',
                    portrait: 'portrait-elena',
                    isAction: true
                },
                {
                    speaker: 'Elena',
                    text: 'I\'m a lobbyist for an AI company. So, probably?',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'You',
                    text: 'And yet here we are.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'I watched your testimony. You actually seem to understand what\'s happening. That\'s... rare.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'Do you know why your bills keep failing?',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'You',
                    text: 'Industry lobbying?',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'She laughs.',
                    portrait: 'portrait-elena',
                    isAction: true
                },
                {
                    speaker: 'Elena',
                    text: 'MindScale doesn\'t lobby against bills like yours. That\'s amateur hour. We lobby for them. A version of them. With amendments.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'By the time it passes, it requires companies to pinky-promise they\'ll think about safety. Twice a year. In a report no one reads.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'You',
                    text: '...',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'We show up to every meeting. Submit comments on every draft. Request clarifications on every provision.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'Meanwhile, your coalition spends six months arguing about whether to call it "AI safety" or "AI accountability."',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'You',
                    text: 'That\'s... painfully accurate.',
                    portrait: null
                }
            ],
            choices: [
                {
                    text: 'Why are you telling me this?',
                    setFlags: { trustedElena: true },
                    nextDialogue: 'elena_trusted'
                },
                {
                    text: 'What\'s MindScale getting out of this conversation?',
                    setFlags: { trustedElena: false },
                    nextDialogue: 'elena_suspicious'
                }
            ]
        },

        elena_trusted: {
            id: 'elena_trusted',
            ...LOCATIONS.bar,
            dialogue: [
                {
                    speaker: 'Elena',
                    text: 'She signals for another round.',
                    portrait: 'portrait-elena',
                    isAction: true
                },
                {
                    speaker: 'Elena',
                    text: 'I got into this because I thought I could do "responsible AI from the inside."',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'Five years later, I spend most of my time writing talking points about why mandatory safety testing would "stifle innovation."',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'You',
                    text: 'So quit.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'And do what? Join the nonprofit sector and take a 90% pay cut to be ignored more politely?',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'She stares at her drink.',
                    portrait: 'portrait-elena',
                    isAction: true
                },
                {
                    speaker: 'Elena',
                    text: 'Look, I can tell you which amendments are actually killable and which ones we\'d let through. Where the real decisions get made.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'You',
                    text: 'Why would you do that?',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'Because at some point, "winning" starts to feel like losing.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'Also—there\'s someone you should talk to. Priya Sharma. Used to run half the advocacy coalitions in this town.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'She\'ll hate you on principle. But if you can get her to help, she knows where every body is buried.',
                    portrait: 'portrait-elena'
                }
            ],
            setFlags: { foundEvidence: true },
            nextScene: 'stakeholder_meeting'
        },

        elena_suspicious: {
            id: 'elena_suspicious',
            ...LOCATIONS.bar,
            dialogue: [
                {
                    speaker: 'Elena',
                    text: 'She nods.',
                    portrait: 'portrait-elena',
                    isAction: true
                },
                {
                    speaker: 'Elena',
                    text: 'Fair. If I were you, I\'d be suspicious too.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'For the record, MindScale isn\'t getting anything out of this. I\'m here on my own time.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'You',
                    text: 'Then why?',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'Because I\'m having a crisis of professional faith and you seemed like someone who might understand.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'She finishes her drink.',
                    portrait: 'portrait-elena',
                    isAction: true
                },
                {
                    speaker: 'Elena',
                    text: 'If you want an outside perspective, talk to Priya Sharma. Used to run advocacy coalitions. She\'ll give it to you straight.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'And if you ever want to continue this conversation... you know where to find me.',
                    portrait: 'portrait-elena'
                }
            ],
            nextScene: 'stakeholder_meeting'
        },

        stakeholder_meeting: {
            id: 'stakeholder_meeting',
            ...LOCATIONS.conference,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The room contains: three industry representatives, two academics, four nonprofit advocates, one congressional staffer, and a facilitator.',
                    portrait: null
                },
                {
                    speaker: 'Industry Rep',
                    text: '"We support thoughtful regulation that doesn\'t stifle innovation..."',
                    portrait: null
                },
                {
                    speaker: 'Academic',
                    text: '"The research suggests a more nuanced framework that accounts for differential risk profiles across deployment contexts..."',
                    portrait: null
                },
                {
                    speaker: 'Nonprofit Advocate',
                    text: '"The communities most impacted by these systems need to be centered in this conversation..."',
                    portrait: null
                },
                {
                    speaker: 'Industry Rep',
                    text: '"Absolutely. We\'re committed to inclusive stakeholder engagement..."',
                    portrait: null
                },
                {
                    speaker: 'Facilitator',
                    text: '"Great points all around. Let\'s table the specifics and focus on areas of alignment."',
                    portrait: null
                },
                {
                    speaker: 'Facilitator',
                    text: 'The facilitator glances at you.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Facilitator',
                    text: '"Did you want to add anything? From the advocacy perspective?"',
                    portrait: null
                }
            ],
            choices: [
                {
                    text: 'Actually, I have concerns about the timeline...',
                    setFlags: { spokeUp: true },
                    nextDialogue: 'stakeholder_speak'
                },
                {
                    text: 'No, I think we covered it.',
                    nextDialogue: 'stakeholder_silent'
                }
            ]
        },

        stakeholder_speak: {
            id: 'stakeholder_speak',
            ...LOCATIONS.conference,
            dialogue: [
                {
                    speaker: 'You',
                    text: 'The comment period closes in six weeks. If we\'re still finalizing the framework next month, we\'ll miss it.',
                    portrait: null
                },
                {
                    speaker: 'Industry Rep',
                    text: '"That\'s a fair point. Perhaps we could request an extension—"',
                    portrait: null
                },
                {
                    speaker: 'Facilitator',
                    text: '"Great idea. I\'ll note that as an action item."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The meeting ends. You will never hear about that action item again.',
                    portrait: null
                }
            ],
            setFlags: { survivedStakeholderMeeting: true },
            nextScene: 'coalition_call'
        },

        stakeholder_silent: {
            id: 'stakeholder_silent',
            ...LOCATIONS.conference,
            dialogue: [
                {
                    speaker: 'Facilitator',
                    text: '"So we\'ll reconvene next month to finalize the framework for the working group that will draft recommendations for the comment period."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The meeting ends.',
                    portrait: null
                }
            ],
            setFlags: { survivedStakeholderMeeting: true },
            nextScene: 'coalition_call'
        },

        coalition_call: {
            id: 'coalition_call',
            ...LOCATIONS.officeCoalition,
            dialogue: [
                {
                    speaker: 'Voice 1',
                    text: '"I still think we need to lead with labor impacts—"',
                    portrait: null
                },
                {
                    speaker: 'Voice 2',
                    text: '"We discussed this. Civil liberties framing polls better—"',
                    portrait: null
                },
                {
                    speaker: 'Voice 3',
                    text: '"Can we go back to whether we\'re calling this \'AI safety\' or \'algorithmic accountability\'?"',
                    portrait: null
                },
                {
                    speaker: 'Voice 1',
                    text: '"We spent three meetings on that!"',
                    portrait: null
                },
                {
                    speaker: 'Voice 3',
                    text: '"And we never reached consensus!"',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She mutes her mic and turns to you.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'MindScale has one talking point and twenty lobbyists.',
                    portrait: null
                },
                {
                    speaker: 'Voice 4',
                    text: '"The current draft doesn\'t adequately center disability justice perspectives—"',
                    portrait: null
                },
                {
                    speaker: 'Voice 2',
                    text: '"That\'s valid, but the markup is in two weeks—"',
                    portrait: null
                },
                {
                    speaker: 'Voice 4',
                    text: '"So we should rush it and get it wrong?"',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She looks at you expectantly.',
                    portrait: null,
                    isAction: true
                }
            ],
            choices: [
                {
                    text: 'Unmute and try to refocus the group',
                    setFlags: { spokeUp: true },
                    nextDialogue: 'coalition_intervene'
                },
                {
                    text: 'Stay muted. This is above your pay grade.',
                    nextDialogue: 'coalition_silent'
                }
            ]
        },

        coalition_intervene: {
            id: 'coalition_intervene',
            ...LOCATIONS.officeCoalition,
            dialogue: [
                {
                    speaker: 'You',
                    text: 'Hey—can we focus on the markup? We have two weeks.',
                    portrait: null
                },
                {
                    speaker: 'Voice 1',
                    text: '"That\'s exactly what I\'ve been saying—"',
                    portrait: null
                },
                {
                    speaker: 'Voice 3',
                    text: '"But we haven\'t resolved the framing issue—"',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She mutes you both.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'A for effort.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'I need a drink.',
                    portrait: null
                },
                ...DIALOGUE_FRAGMENTS.priyaDiscussion
            ],
            nextScene: 'think_tank'
        },

        coalition_silent: {
            id: 'coalition_silent',
            ...LOCATIONS.officeCoalition,
            dialogue: [
                {
                    speaker: 'Sarah',
                    text: 'She unmutes.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'Great discussion everyone. Really productive.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She immediately mutes again.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'I need a drink.',
                    portrait: null
                },
                ...DIALOGUE_FRAGMENTS.priyaDiscussion
            ],
            nextScene: 'think_tank'
        },

        think_tank: {
            id: 'think_tank',
            ...LOCATIONS.thinktank,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Third floor of a building that also houses a vape shop and three think tanks you\'ve never heard of.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The office is small. Papers everywhere. She doesn\'t look up when you enter.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: 'Door was open. Doesn\'t mean I want company.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'You',
                    text: 'Elena Vance suggested I talk to you.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: 'She looks up.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'Elena. Huh.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'She finally turns around.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'Let me guess. You\'re frustrated. You want to understand why your bills keep dying. You think there\'s some trick you\'re missing.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'You',
                    text: 'Is there?',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: 'She laughs. It\'s not friendly.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'I ran coalitions for twelve years. You know how many people have sat in that chair asking me the same thing?',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'You',
                    text: 'How many?',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: 'Enough that I stopped counting. And stopped answering.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'She turns back to her computer.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'I gave advice. They nodded. Then they did exactly what they were going to do anyway. Or they burned out. Or they took jobs at Prometheus.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'So now I don\'t give advice.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'Stopping things is easy. Trying to actually make something happen is harder.',
                    portrait: 'portrait-priya'
                }
            ],
            choices: [
                {
                    text: 'What would it take to change your mind?',
                    setFlags: { sharedWithPriya: true },
                    nextDialogue: 'priya_ally'
                },
                {
                    text: 'Fine. Thanks for your time.',
                    setFlags: { sharedWithPriya: false },
                    nextDialogue: 'priya_cautious'
                }
            ]
        },

        priya_ally: {
            id: 'priya_ally',
            ...LOCATIONS.thinktank,
            dialogue: [
                {
                    speaker: 'Priya',
                    text: 'She pauses.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'What would it take.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'She opens a desk drawer. Pulls out a bottle. Pours two glasses without asking.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'Most people who come in here want me to tell them they\'re right. That they just need to try harder. Build a bigger coalition. Find the right message.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'You\'re asking what it would take. That\'s different.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'You',
                    text: 'So?',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: 'She slides a glass across the desk.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'Elena can tell you where to aim. I can tell you who might actually listen.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'Jenny Chen on the committee. She\'s a maybe on everything, but she owes me a favor from the 2019 privacy bill.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'One phone call, and you\'ve got her vote. But I\'m not spending that on someone who\'s going to be at Prometheus in eighteen months.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'You',
                    text: 'I\'m not going to Prometheus.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: 'She studies you.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'Yeah. That\'s what they all say.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'She picks up her phone.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'But Elena vouched for you. And Elena doesn\'t vouch for people.',
                    portrait: 'portrait-priya'
                }
            ],
            setFlags: { knowsTheTruth: true },
            nextScene: 'markup_prep'
        },

        priya_cautious: {
            id: 'priya_cautious',
            ...LOCATIONS.thinktank,
            dialogue: [
                {
                    speaker: 'Priya',
                    text: 'She doesn\'t turn around.',
                    portrait: 'portrait-priya',
                    isAction: true
                },
                {
                    speaker: 'Priya',
                    text: 'Good luck with the markup.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Narrator',
                    text: 'You leave.',
                    portrait: null
                }
            ],
            nextScene: 'markup_prep'
        },

        markup_prep: {
            id: 'markup_prep',
            ...LOCATIONS.officeLate,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Three days until markup. Sarah drops another stack on your desk.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Peters just filed three more amendments. Word for word from MindScale\'s model legislation.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'The "flexible compliance framework"?',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Yep.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"They\'ll sacrifice Amendments 3-6 to get 7 through. Focus your fire there."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She reads over your shoulder.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'Is that... helpful intel from a lobbyist?',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'I think so.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Weird.',
                    portrait: null
                }
            ],
            nextScene: 'markup_hearing'
        },

        markup_hearing: {
            id: 'markup_hearing',
            ...LOCATIONS.capitol,
            dialogue: [
                {
                    speaker: 'Chairman',
                    text: 'The chair recognizes Congressman Peters for Amendment 3.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You watch Elena\'s prediction play out. Amendments 3, 4, 5, 6—industry barely fights for them. Token opposition. They pass easily.',
                    portrait: null,
                    conditionalOnly: 'trustedElena'
                },
                {
                    speaker: 'Narrator',
                    text: 'Amendments 3 through 6 pass with little debate. Minor provisions. Nobody seems to care much.',
                    portrait: null,
                    conditionalOnly: '!trustedElena'
                },
                {
                    speaker: 'Chairman',
                    text: 'The chair recognizes Congressman Peters for Amendment 7.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Here it is. The real fight. Just like Elena said.',
                    portrait: null,
                    conditionalOnly: 'trustedElena'
                },
                {
                    speaker: 'Peters',
                    text: 'Thank you, Mr. Chairman. This amendment ensures that compliance frameworks remain flexible and industry-informed...',
                    portrait: null
                },
                {
                    speaker: 'Peters',
                    text: '...voluntary best practices developed in consultation with stakeholders...',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The ranking member asks for a point of order. Procedural debate. A five-minute recess becomes twenty.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Priya.',
                    portrait: null,
                    conditionalOnly: 'sharedWithPriya'
                },
                {
                    speaker: 'Priya',
                    text: '"Jenny\'s in. She\'ll vote no on 7. You owe me."',
                    portrait: null,
                    conditionalOnly: 'sharedWithPriya'
                },
                {
                    speaker: 'Chairman',
                    text: 'All in favor of Amendment 7?',
                    portrait: null
                },
                {
                    speaker: 'Chairman',
                    text: 'The amendment passes. 12-10.',
                    conditionalText: { sharedWithPriya: 'The amendment passes. 11-10.' },
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Two votes.',
                    conditionalText: { sharedWithPriya: 'One vote. Jenny Chen made a difference, but not enough.' },
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You look at Jenny Chen. She catches your eye. Nods.',
                    portrait: null,
                    conditionalOnly: 'sharedWithPriya'
                }
            ],
            nextScene: 'climax'
        },

        climax: {
            id: 'climax',
            ...LOCATIONS.mall,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Capitol dome glows against the darkness.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The bill passed committee. With Amendment 7. "Mandatory safety testing" is now "encouraged to consider appropriate evaluation practices."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Sarah.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: '"Floor vote next month. Leadership wants to know our position."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You stare at the dome.',
                    portrait: null
                }
            ],
            nextScene: 'climax_choice_check'
        },

        // Route based on which allies you have
        climax_choice_check: {
            id: 'climax_choice_check',
            isRouter: true,
            routerId: 'climax_choice_check'
        },

        // NEITHER: No allies - bill died, you were irrelevant
        climax_neither: {
            id: 'climax_neither',
            ...LOCATIONS.mall,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The bill died in committee anyway. Not enough votes. Not enough momentum.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You weren\'t at the table. You didn\'t know the players. You didn\'t have leverage.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'It would have died with or without you.',
                    portrait: null
                }
            ],
            nextScene: 'ending_check'
        },

        // ELENA ONLY: You understand but can't act
        climax_elena_only: {
            id: 'climax_elena_only',
            ...LOCATIONS.mall,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Elena.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"You saw it coming, right? Amendments 3-6 were always sacrificial. They got exactly what they wanted."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'I saw it. I just couldn\'t stop it.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"That\'s the game. Understanding it doesn\'t mean you can change it."',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"Not without people on the inside. Votes. Leverage."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'She\'s right. You knew where to aim. You just didn\'t have anyone to pull the trigger.',
                    portrait: null
                }
            ],
            nextScene: 'ending_check'
        },

        // PRIYA ONLY: You can act but don't understand
        climax_priya_only: {
            id: 'climax_priya_only',
            ...LOCATIONS.mall,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Priya.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"Jenny came through. Amendment 7 failed on the floor. 10-11."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'We won?',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"We killed Amendment 7. But..."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"The conference committee just added the same language back in. Different amendment number. Same effect."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'How?',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"I don\'t know. Someone on the inside would have seen it coming. We didn\'t."',
                    portrait: null
                }
            ],
            nextScene: 'ending_check'
        },

        // BOTH: Full picture + leverage = real choice
        climax_both: {
            id: 'climax_both',
            ...LOCATIONS.mall,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Elena, then Priya.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"You\'ve got Jenny\'s vote. And I know what they\'ll accept. There\'s a deal here if you want it."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"Elena says you can trade. Amendments 3-6 for a less gutted Amendment 7. Is that real?"',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"It\'s real. They keep their \'flexible frameworks\' but we get actual reporting requirements. Quarterly instead of annual. Public instead of confidential."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"That\'s not nothing."',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"It\'s not much either. But it\'s something they\'ll actually have to do."',
                    portrait: null
                }
            ],
            choices: [
                {
                    text: 'Make the trade. Get what we can.',
                    setFlags: { negotiated: true },
                    nextDialogue: 'climax_negotiate'
                },
                {
                    text: 'No deals. We walk away clean.',
                    setFlags: { walkedAway: true },
                    nextDialogue: 'climax_walk_away'
                }
            ]
        },

        climax_negotiate: {
            id: 'climax_negotiate',
            ...LOCATIONS.mall,
            dialogue: [
                {
                    speaker: 'You',
                    text: 'Make the trade.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"I\'ll make some calls."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"Quarterly public reports. That\'s more than we\'ve ever gotten."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'It\'s a start.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"It\'s always a start. That\'s the job."',
                    portrait: null
                }
            ],
            nextScene: 'ending_check'
        },

        climax_walk_away: {
            id: 'climax_walk_away',
            ...LOCATIONS.mall,
            dialogue: [
                {
                    speaker: 'You',
                    text: 'No. We don\'t trade away our principles for quarterly reports.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"Your call. The bill passes anyway, with or without the deal."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"At least we didn\'t help them."',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"No. You just didn\'t help anyone."',
                    portrait: null
                }
            ],
            nextScene: 'ending_check'
        },

        // Ending Router
        ending_check: {
            id: 'ending_check',
            isRouter: true,
            routerId: 'ending_check'
        },

        // ENDING: Status Quo - neither ally, bill died, you were irrelevant
        ending_status_quo: {
            id: 'ending_status_quo',
            ...LOCATIONS.officeNextCongress,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act dies in committee. "Tabled for further consideration."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'New Congress, new bill. Same language.',
                    conditionalText: { spokeUp: 'New Congress, new bill. Same language. At least you spoke up in those meetings.' },
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Did anyone notice?',
                    portrait: null,
                    conditionalOnly: 'spokeUp'
                },
                {
                    speaker: 'Sarah',
                    text: 'I did.',
                    portrait: null,
                    conditionalOnly: 'spokeUp'
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. LinkedIn notification.',
                    portrait: null
                },
                {
                    speaker: 'Phone',
                    text: '"Elena Vance has a new position: VP of Policy, Prometheus."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You never did get that drink.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Coalition call in ten.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The bill would have died with or without you. That\'s the worst part.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Status Quo'
        },

        // ENDING: Cassandra - Elena only, you saw it coming but couldn't stop it
        ending_cassandra: {
            id: 'ending_cassandra',
            ...LOCATIONS.officeSixMonths,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act passes the House. 231 to 204.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '"Mandatory testing" became "encouraged to consider." Just like Elena said it would.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'You called it. Every amendment, every vote.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Lot of good it did.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Elena.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"For what it\'s worth, you were right about all of it. Amendments 3-6 were always sacrificial."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'And Amendment 7 was always the real fight.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"Next time, find someone who can actually move votes. Understanding the game is only half of it."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'She\'s right. You saw the trap. You just couldn\'t do anything about it.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Senate version next. Same playbook?',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Same playbook. Different players, maybe.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Cassandra'
        },

        // ENDING: Pyrrhic - Priya only, won the battle, lost the war
        ending_pyrrhic: {
            id: 'ending_pyrrhic',
            ...LOCATIONS.officeThreeMonths,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act passes the House. 228 to 207.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'We killed Amendment 7. Jenny Chen came through.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'So why does the bill look exactly the same?',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Conference committee. They added the language back in under a different amendment number.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Priya.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"I heard. I\'m sorry. I didn\'t see it coming."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Neither did I.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"We needed someone on the inside. Someone who knew their playbook."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You had the votes. You just didn\'t know where to aim them.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'MindScale put out a statement thanking us for "improving the legislative process."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Of course they did.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Pyrrhic Victory'
        },

        // ENDING: Incremental - both allies, negotiated a small win
        ending_incremental: {
            id: 'ending_incremental',
            ...LOCATIONS.officeSixMonths,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act passes the House. 235 to 200.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '"Mandatory testing" became "encouraged to consider." But the quarterly public reporting requirement stayed in.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She drops a folder on your desk.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'First quarterly report from MindScale. It\'s... not nothing.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You flip through it. Boilerplate, mostly. But there\'s actual data in there. Deployment numbers. Incident counts.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Elena.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"The reporting requirement is annoying them. That\'s how you know it matters."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Another buzz. Priya.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"Jenny\'s using the reports in oversight hearings. It\'s not much, but it\'s leverage."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'So. Did we win?',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'We got quarterly reports instead of annual. Public instead of confidential.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'That\'s it?',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'That\'s it. For now.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'It\'s not the bill you wanted. It\'s not even close. But someone, somewhere, will read those reports. And maybe that matters.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Maybe.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Incremental Victory'
        },

        // ENDING: Walked Away - both allies, refused to deal
        ending_walked_away: {
            id: 'ending_walked_away',
            ...LOCATIONS.officeThreeMonths,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act passes the House. 231 to 204.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The full industry version. Every amendment intact.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Elena said we could have gotten quarterly public reports. Was that real?',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'It was real.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'And we said no.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'We said no.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Priya.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"I get it. You didn\'t want to legitimize a bad bill. But now they have everything and we have nothing."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Another buzz. Elena.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"For what it\'s worth, I respect the call. I just don\'t understand it."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Would the reports have mattered?',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'I don\'t know. Maybe. Probably not.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Then why does this feel like a loss?',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You don\'t have an answer for that.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Principled Stand'
        }
    }
};
