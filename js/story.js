// Story Data - All scenes, dialogue, and choices

// Location registry - centralized location/background definitions
const LOCATIONS = {
    office: { location: 'AIPN Office', background: 'bg-office' },
    officeCoalition: { location: 'AIPN Office - Coalition Call', background: 'bg-coalition' },
    officeLate: { location: 'AIPN Office - Late Night', background: 'bg-office' },
    officeNight: { location: 'AIPN Office - 11:47 PM', background: 'bg-office' },
    officeMidnight: { location: 'AIPN Office - 12:14 AM', background: 'bg-office' },
    officeNextMorning: { location: 'AIPN Office - The Next Morning', background: 'bg-office' },
    officeSixMonths: { location: 'AIPN Office - Six Months Later', background: 'bg-office' },
    officeThreeMonths: { location: 'AIPN Office - Three Months Later', background: 'bg-office' },
    officeNextCongress: { location: 'AIPN Office - Next Congress', background: 'bg-office' },
    bar: { location: 'The Filibuster Bar', background: 'bg-bar' },
    conference: { location: 'Conference Room B-7', background: 'bg-conference' },
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

// Vote count helper - computes Amendment 7 results based on flags
// Each flag swings one vote; when both swing, one member abstains (21 total)
function getAmendment7Result(flags) {
    const swings = (flags.seizedMoment ? 1 : 0) + (flags.sharedWithPriya ? 1 : 0);
    const yesVotes = 13 - swings;
    const total = 22 - (swings === 2 ? 1 : 0);
    const noVotes = total - yesVotes;
    const margin = yesVotes - noVotes;
    const NUMBER_WORDS = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four' };
    return { yesVotes, noVotes, margin, marginWord: NUMBER_WORDS[margin] || String(margin) };
}

// Conditional routing rules for router scenes
const ROUTING_RULES = {
    coalition_focus: {
        rules: [
            {
                condition: (flags) => flags.trustedElena,
                target: 'coalition_focus_aligned'
            }
        ],
        default: 'coalition_focus_scattered'
    },
    elena_check: {
        rules: [
            {
                // Trusted both Elena and the staffer = Elena gets burned
                condition: (flags) => flags.trustedElena && flags.trustedStaffer,
                target: 'elena_burned'
            }
        ],
        // Otherwise proceed normally to markup
        default: 'markup_hearing'
    },
    climax_choice_check: {
        rules: [
            {
                // Both allies + seized moment = full negotiation option
                condition: (flags) => flags.trustedElena && !flags.elenaBurned && flags.sharedWithPriya && flags.seizedMoment,
                target: 'climax_both'
            },
            {
                // Both allies but no public pressure = deal falls through
                condition: (flags) => flags.trustedElena && !flags.elenaBurned && flags.sharedWithPriya,
                target: 'climax_both_no_leverage'
            },
            {
                // Elena only (not burned) = you understand but can't act
                condition: (flags) => flags.trustedElena && !flags.elenaBurned,
                target: 'climax_elena_only'
            },
            {
                // Priya only = you can act but don't understand
                condition: (flags) => flags.sharedWithPriya,
                target: 'climax_priya_only'
            }
        ],
        // Neither (or Elena burned) = you're irrelevant
        default: 'climax_neither'
    },
    ending_check: {
        rules: [
            {
                // Both allies + negotiated = Incremental victory
                condition: (flags) => flags.trustedElena && !flags.elenaBurned && flags.sharedWithPriya && flags.negotiated,
                target: 'ending_incremental'
            },
            {
                // Both allies + walked away = principled stand
                condition: (flags) => flags.trustedElena && !flags.elenaBurned && flags.sharedWithPriya && flags.walkedAway,
                target: 'ending_walked_away'
            },
            {
                // Both allies but no leverage (no seizedMoment, never got the deal) = The Almost
                condition: (flags) => flags.trustedElena && !flags.elenaBurned && flags.sharedWithPriya,
                target: 'ending_no_leverage'
            },
            {
                // Elena only (not burned) = Cassandra (you saw it coming)
                condition: (flags) => flags.trustedElena && !flags.elenaBurned,
                target: 'ending_cassandra'
            },
            {
                // Priya only = Pyrrhic (won battle, lost war)
                condition: (flags) => flags.sharedWithPriya,
                target: 'ending_pyrrhic'
            }
        ],
        // No allies (or Elena burned without Priya) = Status Quo
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
        trustedStaffer: false,
        elenaBurned: false,
        coalitionAligned: false,
        seizedMoment: false,
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
                    text: 'You\'re right. We need people on the inside.',
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
                    text: 'Amendments 3 through 6? We\'ll let those pass—makes it look like we\'re compromising. The real play is Amendment 7. That\'s where the testing requirements get gutted.',
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
                    text: 'Committee staff organized a "multi-stakeholder roundtable" on the Frontier AI Safety Act. Standard procedure before markup—get everyone in a room, let them talk, write a summary memo that a member may or may not read.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The idea is that committee members review the feedback and adjust the bill language. In practice, the bill language was finalized last week. This is theater.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Fluorescent lights. Bottled water with the Senate seal. Name tents nobody reads.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Three industry representatives, two academics, four nonprofit advocates, one congressional staffer, and a facilitator. AIPN got one seat. Industry got three.',
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
            nextScene: 'staffer_approach'
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
            nextScene: 'staffer_approach'
        },

        // Staffer approaches after stakeholder meeting
        staffer_approach: {
            id: 'staffer_approach',
            ...LOCATIONS.conference,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'On your way out, a young staffer catches up to you.',
                    portrait: null
                },
                {
                    speaker: 'Staffer',
                    text: 'Hey—you\'re with AIPN, right? I work for Congressman Davis on the committee.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'That\'s right.',
                    portrait: null
                },
                {
                    speaker: 'Staffer',
                    text: 'Look, I shouldn\'t be saying this, but... some of us actually want the bill to work. The real bill, not the watered-down version.',
                    portrait: null
                },
                {
                    speaker: 'Staffer',
                    text: 'If you have any intel on what industry is planning—amendments, vote counts, anything—I could make sure it gets to the right people.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'He seems earnest. But then, everyone in this town seems earnest.',
                    portrait: null
                }
            ],
            choices: [
                {
                    text: 'Share what Elena told you about the amendments',
                    setFlags: { trustedStaffer: true },
                    nextDialogue: 'staffer_trust',
                    conditionalOnly: 'trustedElena'
                },
                {
                    text: 'Tell him you\'ll keep your eyes open',
                    nextDialogue: 'staffer_dismiss'
                }
            ]
        },

        staffer_trust: {
            id: 'staffer_trust',
            ...LOCATIONS.conference,
            dialogue: [
                {
                    speaker: 'You',
                    text: 'I heard Amendment 7 is the real target. Amendments 3 through 6 are sacrificial—industry will let them go to get 7 through.',
                    portrait: null
                },
                {
                    speaker: 'Staffer',
                    text: 'His eyes widen.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Staffer',
                    text: 'That\'s... that\'s exactly the kind of thing we need. Do you have a source for this?',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Someone on the inside. I can\'t say more.',
                    portrait: null
                },
                {
                    speaker: 'Staffer',
                    text: 'Of course, of course. This is really helpful. I\'ll make sure it gets to Congressman Davis.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'He nods, genuinely grateful, and heads back inside.',
                    portrait: null
                }
            ],
            nextScene: 'coalition_call'
        },

        staffer_dismiss: {
            id: 'staffer_dismiss',
            ...LOCATIONS.conference,
            dialogue: [
                {
                    speaker: 'You',
                    text: 'I appreciate the offer. I\'ll let you know if I hear anything useful.',
                    portrait: null
                },
                {
                    speaker: 'Staffer',
                    text: 'He nods, a little disappointed.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Staffer',
                    text: 'Sure. Here\'s my card. The offer stands.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You pocket the card. You\'ll probably never use it.',
                    portrait: null
                }
            ],
            nextScene: 'coalition_call'
        },

        coalition_call: {
            id: 'coalition_call',
            ...LOCATIONS.officeCoalition,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Your desk. Laptop open, twelve faces in tiny rectangles. Half on mute. One visibly eating lunch.',
                    portrait: null
                },
                {
                    speaker: 'Voice 1',
                    text: '"We need to talk about the compliance amendments. The testing language in 7 is—"',
                    portrait: null
                },
                {
                    speaker: 'Voice 2',
                    text: '"Forget 7. Amendment 4 guts the bias audit requirements. That\'s our issue."',
                    portrait: null
                },
                {
                    speaker: 'Voice 3',
                    text: '"Can we talk about opposing the whole bill? Because once we start picking and choosing amendments, we\'ve already lost."',
                    portrait: null
                },
                {
                    speaker: 'Voice 1',
                    text: '"We can\'t oppose the whole bill. We spent two years getting it introduced."',
                    portrait: null
                },
                {
                    speaker: 'Voice 4',
                    text: '"The disability community has been fighting for the data access provision since last session. We are not giving that up to chase your priorities."',
                    portrait: null
                },
                {
                    speaker: 'Voice 2',
                    text: '"Nobody\'s saying give it up. We\'re saying we need a unified message."',
                    portrait: null
                },
                {
                    speaker: 'Voice 4',
                    text: '"A unified message that somehow always ends up being your message."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The call has been going for ninety minutes. You\'re no closer to a strategy than when you started.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She mutes the call and turns to you.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'Twelve organizations. Twelve priorities. Two weeks until markup.',
                    portrait: null
                }
            ],
            choices: [
                {
                    text: 'We need to focus. Pick one fight and win it.',
                    nextDialogue: 'coalition_focus_router'
                },
                {
                    text: 'Every amendment matters. We fight them all.',
                    nextDialogue: 'coalition_broad'
                }
            ]
        },

        // Route based on whether you have Elena's insider intel
        coalition_focus_router: {
            id: 'coalition_focus_router',
            isRouter: true,
            routerId: 'coalition_focus'
        },

        // Focus + Elena's intel = you know exactly where to aim
        coalition_focus_aligned: {
            id: 'coalition_focus_aligned',
            ...LOCATIONS.officeCoalition,
            dialogue: [
                {
                    speaker: 'You',
                    text: 'You unmute.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'You',
                    text: 'Amendment 7. That\'s where the testing requirements get gutted. Everything else is a distraction.',
                    portrait: null
                },
                {
                    speaker: 'Voice 2',
                    text: '"What about the bias provisions? We can\'t just—"',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'If Amendment 7 passes, the whole enforcement mechanism becomes voluntary. Your bias audits become suggestions. Nobody has to do anything.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Silence on the line.',
                    portrait: null
                },
                {
                    speaker: 'Voice 4',
                    text: '"...How do you know this?"',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'I know. That\'s what matters right now.',
                    portrait: null
                },
                {
                    speaker: 'Voice 1',
                    text: '"Amendment 7 it is. I\'ll draft the joint statement tonight."',
                    portrait: null
                },
                {
                    speaker: 'Voice 2',
                    text: '"I want the bias language in the statement."',
                    portrait: null
                },
                {
                    speaker: 'Voice 1',
                    text: '"Fine. But Amendment 7 is the headline."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She stares at you.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'That\'s the first time I\'ve seen this coalition agree on anything in two years.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'I need a drink.',
                    portrait: null
                },
                ...DIALOGUE_FRAGMENTS.priyaDiscussion
            ],
            setFlags: { coalitionAligned: true, spokeUp: true },
            nextScene: 'think_tank'
        },

        // Focus + no Elena intel = you try but can't agree on what
        coalition_focus_scattered: {
            id: 'coalition_focus_scattered',
            ...LOCATIONS.officeCoalition,
            dialogue: [
                {
                    speaker: 'You',
                    text: 'You unmute.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'You',
                    text: 'We need to pick one amendment. The worst one. Put everything behind killing it.',
                    portrait: null
                },
                {
                    speaker: 'Voice 2',
                    text: '"Which one?"',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You don\'t have an answer for that.',
                    portrait: null
                },
                {
                    speaker: 'Voice 3',
                    text: '"This is the problem. Everyone says \'focus\' but nobody agrees on what."',
                    portrait: null
                },
                {
                    speaker: 'Voice 1',
                    text: '"Top three amendments. We divide into working groups."',
                    portrait: null
                },
                {
                    speaker: 'Voice 4',
                    text: '"So now we have three messages instead of twelve. Progress."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She mutes again.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'Better than last week. I\'ll take it.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'I need a drink.',
                    portrait: null
                },
                ...DIALOGUE_FRAGMENTS.priyaDiscussion
            ],
            setFlags: { spokeUp: true },
            nextScene: 'think_tank'
        },

        // Fight everything = coalition scatters
        coalition_broad: {
            id: 'coalition_broad',
            ...LOCATIONS.officeCoalition,
            dialogue: [
                {
                    speaker: 'You',
                    text: 'You unmute.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'You',
                    text: 'We fight every amendment. All of them. Nobody\'s issue gets left behind.',
                    portrait: null
                },
                {
                    speaker: 'Voice 4',
                    text: '"Finally. Someone who gets it."',
                    portrait: null
                },
                {
                    speaker: 'Voice 1',
                    text: '"That\'s not a strategy. That\'s a wish list."',
                    portrait: null
                },
                {
                    speaker: 'Voice 3',
                    text: '"It\'s a principle."',
                    portrait: null
                },
                {
                    speaker: 'Voice 1',
                    text: '"Great. Principles and four dollars will get you a coffee in this town."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The call ends with everyone agreeing to disagree. Testimony is divided by organization. No joint statement. No unified message.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'MindScale has one talking point and twenty lobbyists. We have twelve talking points and... us.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'I need a drink.',
                    portrait: null
                },
                ...DIALOGUE_FRAGMENTS.priyaDiscussion
            ],
            setFlags: { spokeUp: true },
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
                    text: 'Senator Chen on the committee. She\'s a maybe on everything, but she owes me a favor from the 2019 privacy bill.',
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
            nextScene: 'news_break'
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
            nextScene: 'news_break'
        },

        // Breaking news creates a narrow window of relevance
        news_break: {
            id: 'news_break',
            ...LOCATIONS.officeNight,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Your phone won\'t stop buzzing.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She\'s calling from home. She never calls from home.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'Prometheus just deployed Titan 4. No safety eval. No waiting period. Just... live.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You pull up the news. A Titan 4 medical chatbot told a patient to take ten times the recommended dose of blood thinners. The patient is in the ICU. It\'s everywhere.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Every reporter covering this will call us tomorrow. But by tomorrow there\'ll be a new crisis. A new cycle.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'If we put out a statement tonight—right now—we\'re the quote in every story. We frame the narrative. "This is exactly why the Frontier AI Safety Act matters."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Tonight? The coalition hasn\'t even—',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Forget the coalition. AIPN. Just us. Three paragraphs. Out by midnight.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'If we go solo, the coalition—',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Will be furious. At least two of them will put out statements saying we don\'t speak for the movement.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'And we\'ll get something wrong. Midnight, no policy review, no legal check. Industry will pick it apart.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'So why?',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Because by tomorrow, nobody will care about Titan 4. And nobody will care about our perfectly vetted statement either.',
                    portrait: null
                }
            ],
            choices: [
                {
                    text: 'Write it. We can\'t wait.',
                    nextDialogue: 'news_fast'
                },
                {
                    text: 'We just got the coalition aligned. I\'m not blowing that up.',
                    nextDialogue: 'news_slow'
                }
            ]
        },

        news_fast: {
            id: 'news_fast',
            ...LOCATIONS.officeMidnight,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'You write it in twenty minutes. Sarah edits in ten. It\'s not perfect. You send it anyway.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'By 6 AM, AIPN is in the Washington Post, Politico, and three cable news segments. "AI Safety Group Warns: This Was Preventable."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She drops her phone on your desk, grinning.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'Twelve organizations spent six months writing position papers. We wrote three paragraphs at midnight and got more coverage than all of them combined.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'By noon, two coalition partners have put out statements distancing themselves from AIPN\'s "unilateral action." One calls it "counterproductive grandstanding."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She shows you the coverage numbers.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'Four committee members\' offices called us for comment. Let them grandstand about that.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Elena.',
                    portrait: null,
                    conditionalOnly: 'trustedElena'
                },
                {
                    speaker: 'Elena',
                    text: '"Nice work. MindScale\'s comms team is losing it. First time I\'ve seen them play defense."',
                    portrait: null,
                    conditionalOnly: 'trustedElena'
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Priya.',
                    portrait: null,
                    conditionalOnly: 'sharedWithPriya'
                },
                {
                    speaker: 'Priya',
                    text: '"Saw the statement. Senator Chen\'s office is citing it in her floor remarks."',
                    portrait: null,
                    conditionalOnly: 'sharedWithPriya'
                }
            ],
            setFlags: { seizedMoment: true },
            nextScene: 'markup_prep'
        },

        news_slow: {
            id: 'news_slow',
            ...LOCATIONS.officeNextMorning,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'You draft an email to the coalition. "Urgent: Need consensus on statement re: Titan 4. Please review attached by 9 AM."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'By 9 AM, you have four replies. Two with suggested edits. One requesting a call. One auto-reply.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The coalition statement goes out at 2 PM. Carefully worded. Twelve signatories. Reviewed by two lawyers.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She pulls up the coverage.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'MindScale put out their statement at 7 AM. "Isolated incident. Internal safeguards worked as intended." They\'re the quote in every story.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Ours got six retweets.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'At least the coalition is still together.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She doesn\'t say anything.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Narrator',
                    text: 'By evening, a senator says something about crypto. The Titan 4 story is below the fold.',
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
                    portrait: null,
                    conditionalOnly: 'trustedElena'
                },
                {
                    speaker: 'Elena',
                    text: '"Peters is whipping votes for Amendment 7. He thinks he has 13. You need one more no."',
                    portrait: null,
                    conditionalOnly: 'trustedElena'
                },
                {
                    speaker: 'Sarah',
                    text: 'She reads over your shoulder.',
                    portrait: null,
                    isAction: true,
                    conditionalOnly: 'trustedElena'
                },
                {
                    speaker: 'Sarah',
                    text: 'Your lobbyist friend again?',
                    portrait: null,
                    conditionalOnly: 'trustedElena'
                },
                {
                    speaker: 'You',
                    text: 'She\'s not my friend. But she\'s useful.',
                    portrait: null,
                    conditionalOnly: 'trustedElena'
                }
            ],
            nextScene: 'elena_check_router'
        },

        elena_check_router: {
            id: 'elena_check_router',
            isRouter: true,
            routerId: 'elena_check'
        },

        elena_burned: {
            id: 'elena_burned',
            ...LOCATIONS.officeLate,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Your phone rings. Elena.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'Word\'s going around the committee that someone knows about the amendment strategy. My boss just asked me if I\'d been "talking to advocacy groups."',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'She pauses.',
                    portrait: 'portrait-elena',
                    isAction: true
                },
                {
                    speaker: 'Elena',
                    text: 'I told one person about that strategy. You.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'You',
                    text: 'Elena, I only mentioned it to—',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: 'It doesn\'t matter who you told. They told someone. Who told someone. That\'s how this town works.',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'Her voice is quiet.',
                    portrait: 'portrait-elena',
                    isAction: true
                },
                {
                    speaker: 'Elena',
                    text: 'Do you have any idea how careful I have to be?',
                    portrait: 'portrait-elena'
                },
                {
                    speaker: 'Elena',
                    text: 'She hangs up.',
                    portrait: 'portrait-elena',
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'She looks at you.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'Was that...',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Yeah. I burned our source.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Sarah doesn\'t say anything. She doesn\'t have to.',
                    portrait: null
                }
            ],
            setFlags: { elenaBurned: true },
            nextScene: 'markup_hearing'
        },

        markup_hearing: {
            id: 'markup_hearing',
            ...LOCATIONS.capitol,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The gallery is fuller than usual. The Titan 4 story put the Frontier AI Safety Act on the front page, and AIPN\'s name is attached to it. Reporters in the back row.',
                    portrait: null,
                    conditionalOnly: 'seizedMoment'
                },
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
                    text: '"Senator Chen\'s in. She\'ll vote no on 7. You owe me."',
                    portrait: null,
                    conditionalOnly: 'sharedWithPriya'
                },
                {
                    speaker: 'Narrator',
                    text: 'The coalition\'s joint statement is on every desk. Twelve organizations, one message: kill Amendment 7.',
                    portrait: null,
                    conditionalOnly: 'coalitionAligned'
                },
                {
                    speaker: 'Narrator',
                    text: 'The coalition testimonies trickle in. Scattered. Three different priorities. Industry thanks them for their "diverse perspectives."',
                    portrait: null,
                    conditionalOnly: '!coalitionAligned'
                },
                {
                    speaker: 'Chairman',
                    text: 'All in favor of Amendment 7?',
                    portrait: null
                },
                {
                    speaker: 'Chairman',
                    textFn: (flags) => {
                        const { yesVotes, noVotes } = getAmendment7Result(flags);
                        return `The amendment passes. ${yesVotes}-${noVotes}.`;
                    },
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    textFn: (flags) => {
                        const { margin, marginWord } = getAmendment7Result(flags);
                        const base = `${marginWord} vote${margin > 1 ? 's' : ''}.`;
                        return flags.sharedWithPriya
                            ? `${base} Senator Chen made a difference, but not enough.`
                            : base;
                    },
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You look at Senator Chen. She catches your eye. Nods.',
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
                    text: 'You didn\'t know the players. You didn\'t have leverage. You weren\'t even in the conversation.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Sarah\'s text sits unanswered. What would you even tell leadership? You have nothing to offer.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'The bill will pass or die on the floor. Either way, it has nothing to do with you.',
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
                    text: '"Senator Chen came through. Amendment 7 failed on the floor. 10-11."',
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
                    text: '"You\'ve got Senator Chen\'s vote. And I know what they\'ll accept. There\'s a deal here if you want it."',
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
                    conditionalText: { coalitionAligned: '"It\'s real. They keep their \'flexible frameworks\' but we get actual reporting requirements. Quarterly instead of annual. Public instead of confidential. And your coalition made enough noise that they\'ll accept independent verification."' },
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

        // BOTH BUT NO LEVERAGE: Had allies but no public pressure
        climax_both_no_leverage: {
            id: 'climax_both_no_leverage',
            ...LOCATIONS.mall,
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Elena, then Priya.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"You\'ve got Senator Chen. And I know what they\'d accept. There\'s a deal here—in theory."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"In theory?"',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"Nobody\'s watching. No public pressure. Why would they give anything up? They\'re winning."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"She\'s right. Without anyone paying attention, there\'s no deal to make."',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"You had the pieces. You just needed the moment."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'She\'s right. You understood the game. You had the votes. But nobody was watching, and that\'s the only thing that makes politicians move.',
                    portrait: null
                }
            ],
            nextScene: 'ending_check'
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
                    conditionalText: { coalitionAligned: '"Quarterly public reports with independent verification. That\'s more than we\'ve ever gotten."' },
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
                    text: 'The Frontier AI Safety Act passes committee. Then nothing. No floor vote. Not enough support. "Tabled for further consideration."',
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
                    text: 'We killed Amendment 7. Senator Chen came through.',
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
                    conditionalText: { coalitionAligned: '"Mandatory testing" became "encouraged to consider." But the quarterly public reporting requirement stayed in. And the coalition\'s pressure got independent verification written into the final text.' },
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
                    text: '"Senator Chen\'s using the reports in oversight hearings. It\'s not much, but it\'s leverage."',
                    conditionalText: { coalitionAligned: '"Senator Chen\'s using the reports in oversight hearings. And the coalition is filing FOIA requests every quarter. It\'s not much, but it\'s leverage."' },
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
                    conditionalText: { coalitionAligned: 'We got quarterly reports instead of annual. Public instead of confidential. Independent verification. And twelve organizations watching.' },
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
                    text: 'The Titan 4 story faded. But the three paragraphs you wrote at midnight are still the first Google result for "AI safety legislation." That matters more than you\'d think.',
                    portrait: null,
                    conditionalOnly: 'seizedMoment'
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
        },

        // ENDING: The Almost - both allies, but no public leverage to force a deal
        ending_no_leverage: {
            id: 'ending_no_leverage',
            ...LOCATIONS.officeSixMonths,
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
                    text: 'We had Elena. We had Priya. We had Senator Chen\'s vote. What happened?',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Nobody was watching.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes. Elena.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"The deal was real. Quarterly public reports. They would have taken it."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'If anyone had been paying attention.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"Information. Access. Timing. You had two out of three."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Another buzz. Priya.',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"I keep thinking about the Titan 4 story. If we\'d moved faster..."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'I know.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Senate version next.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You had everything except the one thing that mattered. Next time, you\'ll move faster. Or you won\'t.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Almost'
        }
    }
};
