// Story Data - All scenes, dialogue, and choices
const STORY = {
    // Initial game state flags
    initialFlags: {
        trustedElena: false,
        sharedWithPriya: false,
        foundEvidence: false,
        knowsTheTruth: false,
        spokeUp: false,
        supportedCompromise: false,
        opposedCompromise: false
    },

    // Scene definitions
    scenes: {
        intro: {
            id: 'intro',
            location: 'AIPN Office',
            background: 'bg-office',
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
            location: 'The Filibuster Bar',
            background: 'bg-bar',
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
            location: 'The Filibuster Bar',
            background: 'bg-bar',
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
            location: 'The Filibuster Bar',
            background: 'bg-bar',
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
            location: 'Conference Room B-7',
            background: 'bg-office',
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
            location: 'Conference Room B-7',
            background: 'bg-office',
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
            location: 'Conference Room B-7',
            background: 'bg-office',
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
            location: 'AIPN Office - Coalition Call',
            background: 'bg-office',
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
            location: 'AIPN Office - Coalition Call',
            background: 'bg-office',
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
                {
                    speaker: 'You',
                    text: 'Someone told me to talk to Priya Sharma.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Priya? Good luck. She doesn\'t really... do meetings anymore.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'What does she do?',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Drinks, mostly. But she knows everyone. If she\'ll talk to you.',
                    portrait: null
                }
            ],
            nextScene: 'think_tank'
        },

        coalition_silent: {
            id: 'coalition_silent',
            location: 'AIPN Office - Coalition Call',
            background: 'bg-office',
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
                {
                    speaker: 'You',
                    text: 'Someone told me to talk to Priya Sharma.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Priya? Good luck. She doesn\'t really... do meetings anymore.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'What does she do?',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Drinks, mostly. But she knows everyone. If she\'ll talk to you.',
                    portrait: null
                }
            ],
            nextScene: 'think_tank'
        },

        think_tank: {
            id: 'think_tank',
            location: 'Priya\'s Office',
            background: 'bg-thinktank',
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
            location: 'Priya\'s Office',
            background: 'bg-thinktank',
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
                    text: 'The markup\'s in two weeks. Amendment 7—"flexible compliance frameworks"—that\'s the one to watch.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'Jenny Chen on the committee is a maybe. She owes me a favor from the 2019 privacy bill. I could call it in.',
                    portrait: 'portrait-priya'
                },
                {
                    speaker: 'Priya',
                    text: 'But I\'m not spending that on someone who\'s going to be at Prometheus in eighteen months.',
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
            location: 'Priya\'s Office',
            background: 'bg-thinktank',
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
            location: 'AIPN Office - Late Night',
            background: 'bg-office',
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
            location: 'Rayburn Building - Committee Room',
            background: 'bg-capitol',
            dialogue: [
                {
                    speaker: 'Chairman',
                    text: 'The chair recognizes Congressman Peters for Amendment 7.',
                    portrait: null
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
                    speaker: 'Chairman',
                    text: 'All in favor of Amendment 7?',
                    portrait: null
                },
                {
                    speaker: 'Chairman',
                    text: 'The amendment passes. 12-10.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Two votes.',
                    portrait: null
                }
            ],
            nextScene: 'climax'
        },

        climax: {
            id: 'climax',
            location: 'National Mall at Night',
            background: 'bg-mall',
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
                    text: '"Floor vote next month. Leadership wants to know if we\'re supporting the bill as amended."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You stare at the dome.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Support the compromised bill—get something on the books, claim a win, move on. Or oppose it—kill your own bill rather than pass a hollow version.',
                    portrait: null
                }
            ],
            nextScene: 'climax_choice_check'
        },

        // Route based on whether player has enough allies to matter
        climax_choice_check: {
            id: 'climax_choice_check',
            checkClimaxChoice: true
        },

        // Only shown if you have both allies
        climax_choice: {
            id: 'climax_choice',
            location: 'National Mall at Night',
            background: 'bg-mall',
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'Elena texts: "Your call. I can spin it either way."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Priya texts: "Whatever you decide, I\'ll back you. But decide what you can live with."',
                    portrait: null
                }
            ],
            choices: [
                {
                    text: 'Support the bill. Something is better than nothing.',
                    setFlags: { supportedCompromise: true },
                    nextDialogue: 'climax_support'
                },
                {
                    text: 'Oppose it. We don\'t put our name on theater.',
                    setFlags: { opposedCompromise: true },
                    nextDialogue: 'climax_oppose'
                }
            ]
        },

        climax_support: {
            id: 'climax_support',
            location: 'National Mall at Night',
            background: 'bg-mall',
            dialogue: [
                {
                    speaker: 'You',
                    text: 'You text Sarah: "We support it. It\'s not what we wanted, but it\'s a foundation."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: '"Copy. I\'ll let leadership know."',
                    portrait: null
                }
            ],
            nextScene: 'ending_check'
        },

        climax_oppose: {
            id: 'climax_oppose',
            location: 'National Mall at Night',
            background: 'bg-mall',
            dialogue: [
                {
                    speaker: 'You',
                    text: 'You text Sarah: "We can\'t support this version. It\'s worse than nothing—it\'s cover."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: '"...Understood. That\'s going to be a hard sell."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: '"I know."',
                    portrait: null
                }
            ],
            nextScene: 'ending_check'
        },

        // Shown if you don't have both allies - you don't have enough leverage for the choice to matter
        climax_no_leverage: {
            id: 'climax_no_leverage',
            location: 'National Mall at Night',
            background: 'bg-mall',
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'You think about opposing the bill. Taking a stand.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'But without allies, your opposition is just noise. The vote will happen with or without you.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'You text Sarah: "I\'ll be at the call tomorrow."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: '"Good. Bring coffee."',
                    portrait: null
                }
            ],
            nextScene: 'ending_check'
        },

        // Ending Router
        ending_check: {
            id: 'ending_check',
            checkFlags: true
        },

        // Ending A: Pyrrhic Victory - supported compromise, bill passes but hollow
        ending_a: {
            id: 'ending_a',
            location: 'AIPN Office - Six Months Later',
            background: 'bg-office',
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act passes the House. 231 to 204.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '"Mandatory testing" became "encouraged to consider." "Required disclosure" became "voluntary transparency."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She drops a bottle of champagne on your desk.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'We won. Technically.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"Drinks? I need to complain about how badly we lost."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"It\'s something. It\'s not nothing. That\'s... something."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your desk is already covered in new briefs. The Senate version. The implementation regs. MindScale\'s comment letter.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Ready for round two?',
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

        // Ending A - Spoke up variant
        ending_a_spokeup: {
            id: 'ending_a_spokeup',
            location: 'AIPN Office - Six Months Later',
            background: 'bg-office',
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act passes the House. 231 to 204.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '"Mandatory testing" became "encouraged to consider." "Required disclosure" became "voluntary transparency."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She drops a bottle of champagne on your desk.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Sarah',
                    text: 'We won. Technically. And people noticed you pushing back.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"Drinks? I need to complain about how badly we lost."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"Jenny says you made an impression. That matters for next time."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your desk is already covered in new briefs. The Senate version. The implementation regs.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Ready for round two?',
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

        // Ending B: Moral Victory - opposed compromise on principle, bill dies
        ending_b: {
            id: 'ending_b',
            location: 'AIPN Office - Three Months Later',
            background: 'bg-office',
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act dies on the floor. You helped kill it.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'MindScale put out a statement "thanking advocates for their principled stand against flawed legislation."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'That\'s not why we—',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Doesn\'t matter. That\'s the story now.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"I get why you did it. Not sure it was the right call, but I get it."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"New bill next session. Same fight. You ready to do this again?"',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You look at the stack of briefs on your desk. The same briefs. New dates.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Coalition call in ten.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'At least you can live with yourself. That\'s not nothing. It\'s also not much.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Moral Victory'
        },

        // Ending B - Spoke up variant
        ending_b_spokeup: {
            id: 'ending_b_spokeup',
            location: 'AIPN Office - Three Months Later',
            background: 'bg-office',
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act dies on the floor. You helped kill it.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'MindScale put out a statement "thanking advocates for their principled stand against flawed legislation."',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'That\'s not why we—',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'Doesn\'t matter. That\'s the story now. At least you spoke up.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Did it matter?',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'She shrugs.',
                    portrait: null,
                    isAction: true
                },
                {
                    speaker: 'Narrator',
                    text: 'Your phone buzzes.',
                    portrait: null
                },
                {
                    speaker: 'Elena',
                    text: '"I get why you did it. Not sure it was the right call."',
                    portrait: null
                },
                {
                    speaker: 'Priya',
                    text: '"New bill next session. Same fight."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You look at the stack of briefs on your desk. The same briefs. New dates.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'At least you can live with yourself. That\'s not nothing. It\'s also not much.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Moral Victory'
        },

        // Ending B Partial: One ally - not enough leverage
        ending_b_partial: {
            id: 'ending_b_partial',
            location: 'AIPN Office - Three Months Later',
            background: 'bg-office',
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act passes. "Encouraged to consider appropriate evaluation practices."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You weren\'t at the table when it mattered. Not enough allies. Not enough leverage.',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'MindScale put out a press release praising the "thoughtful, balanced approach."',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'Your computer chimes. An email from a Senate staffer.',
                    portrait: null
                },
                {
                    speaker: 'Staffer',
                    text: '"We\'re looking at the Senate version. Want to try again?"',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You think about the allies you didn\'t make. The doors that didn\'t open.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: 'You start typing a reply.',
                    portrait: null
                },
                {
                    speaker: 'Narrator',
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Compromise'
        },

        // Ending C: Status Quo - no allies, bill dies
        ending_c: {
            id: 'ending_c',
            location: 'AIPN Office - Next Congress',
            background: 'bg-office',
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act dies on the floor. "Tabled for further consideration."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'New Congress, new bill. Same language.',
                    portrait: null
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
                    text: '— THE END —',
                    portrait: null
                }
            ],
            isEnding: true,
            endingType: 'The Status Quo'
        },

        // Ending C - Spoke up variant
        ending_c_spokeup: {
            id: 'ending_c_spokeup',
            location: 'AIPN Office - Next Congress',
            background: 'bg-office',
            dialogue: [
                {
                    speaker: 'Narrator',
                    text: 'The Frontier AI Safety Act dies on the floor. "Tabled for further consideration."',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'New Congress, new bill. Same language. At least you spoke up.',
                    portrait: null
                },
                {
                    speaker: 'You',
                    text: 'Did anyone hear?',
                    portrait: null
                },
                {
                    speaker: 'Sarah',
                    text: 'I did.',
                    portrait: null
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
                    speaker: 'Sarah',
                    text: 'Coalition call in ten.',
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
        }
    }
};
