// ─── Brain-Out Style Game Data ────────────────────────────────────────────────
// 30 unique puzzles (10 per game) using 9 distinct interaction types:
// drag_drop | match_pair | sequence_order | spot_mistake | multi_select |
// true_false | fill_blank | tap_sequence | scenario_select | long_press

// ─── Types reference ──────────────────────────────────────────────────────────
// drag_drop      : Drag cards into colour-coded target zones
// match_pair     : Tap LEFT item then matching RIGHT item
// sequence_order : Tap shuffled bank items to fill numbered slots in order
// spot_mistake   : Tap the ONE wrong/unsafe item in a list
// multi_select   : Tap ALL correct items then press Submit
// true_false     : Tap TRUE or FALSE for a statement
// fill_blank     : Drag a word-chip to fill the blank in a sentence
// tap_sequence   : Numbered targets – tap them 1→2→3 in order
// scenario_select: Read a scenario, select the correct PPE card
// long_press     : Long-press the correct item (hold 600 ms)

export const gameRoundsData = {

    // ══════════════════════════════════════════════════════════════════════════
    // GAME 1 – PPE & Gloving  (10 puzzles)
    // ══════════════════════════════════════════════════════════════════════════
    1: [

        // 1 – drag_drop
        {
            id: 'g1r1', type: 'drag_drop',
            title: 'PPE Body Zones! 🧤',
            instruction: 'Drag each PPE item to the body zone it protects',
            items: [
                { id: 'i1', label: 'Gloves', emoji: '🧤', correctZone: 0 },
                { id: 'i2', label: 'Goggles', emoji: '🥽', correctZone: 1 },
                { id: 'i3', label: 'Mask', emoji: '😷', correctZone: 2 },
                { id: 'i4', label: 'Apron', emoji: '🥼', correctZone: 3 },
            ],
            zones: [
                { id: 0, label: '🖐 Hands', color: '#FF7EB3', textColor: '#fff' },
                { id: 1, label: '👁 Eyes', color: '#667EEA', textColor: '#fff' },
                { id: 2, label: '👃 Nose/Mouth', color: '#48C6EF', textColor: '#fff' },
                { id: 3, label: '🫀 Body', color: '#11998e', textColor: '#fff' },
            ],
        },

        // 2 – sequence_order
        {
            id: 'g1r2', type: 'sequence_order',
            title: 'Don Gloves! 🔢',
            instruction: 'Tap the steps in the correct ORDER to put on gloves',
            steps: [
                { id: 's1', text: '🙌 Perform hand hygiene', correctPosition: 0 },
                { id: 's2', text: '🔍 Inspect gloves for defects', correctPosition: 1 },
                { id: 's3', text: '📏 Choose the correct glove size', correctPosition: 2 },
                { id: 's4', text: '🧤 Put on dominant-hand glove first', correctPosition: 3 },
                { id: 's5', text: '🧤 Pull on the second glove', correctPosition: 4 },
            ],
        },

        // 3 – spot_mistake
        {
            id: 'g1r3', type: 'spot_mistake',
            title: 'Spot the Mistake! 🚨',
            instruction: 'One of these gloving steps is WRONG – tap it!',
            items: [
                { id: 'm1', text: '🙌 Wash hands before gloving', isWrong: false },
                { id: 'm2', text: '🧤 Don gloves after all other PPE', isWrong: false },
                { id: 'm3', text: '🔄 Reuse gloves to save money', isWrong: true },
                { id: 'm4', text: '🗑️ Dispose gloves in clinical waste', isWrong: false },
            ],
            explanation: 'Single-use gloves must NEVER be reused – microbes survive removal.',
        },

        // 4 – true_false
        {
            id: 'g1r4', type: 'true_false',
            title: 'True or False? ✅❌',
            instruction: 'Tap TRUE or FALSE for this statement:',
            statement: 'Wearing gloves means you do NOT need to wash your hands.',
            correct: false,
            explanation: 'Gloves can have micro-holes. Hand hygiene is STILL required after removing gloves.',
        },

        // 5 – multi_select
        {
            id: 'g1r5', type: 'multi_select',
            title: 'Select ALL Correct! ☑️',
            instruction: 'Tap EVERY situation where gloves are required',
            items: [
                { id: 'c1', text: '🩸 Handling blood samples', correct: true },
                { id: 'c2', text: '📋 Filling a patient form', correct: false },
                { id: 'c3', text: '💉 Giving an injection', correct: true },
                { id: 'c4', text: '🚽 Handling body fluid', correct: true },
                { id: 'c5', text: '📞 Answering the phone', correct: false },
            ],
            explanation: 'Gloves are required for blood, injections, and body fluids – not administrative tasks.',
        },

        // 6 – fill_blank
        {
            id: 'g1r6', type: 'fill_blank',
            title: 'Fill the Gap! ✍️',
            instruction: 'Drag the correct word into the blank to complete the step',
            sentence: 'After removing gloves, always perform ___.',
            choices: ['Hand hygiene', 'Lunch break', 'Patient charting', 'Mask fitting'],
            correctChoice: 'Hand hygiene',
            explanation: 'Hand hygiene after glove removal removes any organisms that may have transferred through micro-holes.',
        },

        // 7 – match_pair
        {
            id: 'g1r7', type: 'match_pair',
            title: 'Match Glove Types! 🔗',
            instruction: 'Tap glove type LEFT → match its use RIGHT',
            pairs: [
                { id: 'a', left: '🧤 Latex exam glove', right: 'Routine patient care' },
                { id: 'b', left: '⚕️ Sterile surgical glove', right: 'Operative procedure' },
                { id: 'c', left: '🟦 Nitrile glove', right: 'Latex-allergic patients' },
                { id: 'd', left: '🟥 Heavy rubber glove', right: 'Decontamination / cleaning' },
            ],
        },

        // 8 – tap_sequence
        {
            id: 'g1r8', type: 'tap_sequence',
            title: 'Tap in Order! 👆',
            instruction: 'Tap the PPE items in the correct DONNING order (1 → 4)',
            items: [
                { id: 't1', label: '🥼 Apron', emoji: '🥼', correctOrder: 1 },
                { id: 't2', label: '😷 Mask', emoji: '😷', correctOrder: 2 },
                { id: 't3', label: '🥽 Goggles', emoji: '🥽', correctOrder: 3 },
                { id: 't4', label: '🧤 Gloves', emoji: '🧤', correctOrder: 4 },
            ],
        },

        // 9 – scenario_select
        {
            id: 'g1r9', type: 'scenario_select',
            title: 'What PPE? 🏥',
            instruction: 'A nurse is preparing to take blood from a patient. Which PPE is essential?',
            scenario: '🏥 Blood sampling from a patient – risk of splash and needlestick',
            options: [
                { id: 'o1', label: 'Gloves only', emoji: '🧤', correct: false },
                { id: 'o2', label: 'Gloves + Mask + Goggles', emoji: '🧤😷🥽', correct: true },
                { id: 'o3', label: 'Cap only', emoji: '🧢', correct: false },
                { id: 'o4', label: 'No PPE needed', emoji: '❌', correct: false },
            ],
            explanation: 'Blood sampling has splash and needlestick risk – gloves, mask and eye protection are all required.',
        },

        // 10 – long_press
        {
            id: 'g1r10', type: 'long_press',
            title: 'Long-Press the Answer! 👇',
            instruction: 'HOLD DOWN the item that describes correct glove removal',
            items: [
                { id: 'l1', label: 'Pull off from fingertips', emoji: '✋', correct: false },
                { id: 'l2', label: 'Peel inside-out from wrist', emoji: '🔄', correct: true },
                { id: 'l3', label: 'Snap off at the cuff', emoji: '💥', correct: false },
                { id: 'l4', label: 'Use scissors to cut off', emoji: '✂️', correct: false },
            ],
            explanation: 'Correct removal: pinch outside of first glove at wrist, peel inside-out, then use bare fingers inside the cuff of the second.',
        },
    ],

    // ══════════════════════════════════════════════════════════════════════════
    // GAME 2 – Masks, Eyewear & Aprons  (10 puzzles)
    // ══════════════════════════════════════════════════════════════════════════
    2: [

        // 1 – sequence_order
        {
            id: 'g2r1', type: 'sequence_order',
            title: 'Mask On! 😷',
            instruction: 'Tap the steps in the correct ORDER to wear a surgical mask',
            steps: [
                { id: 's1', text: '🙌 Perform hand hygiene', correctPosition: 0 },
                { id: 's2', text: '🔍 Inspect mask – no damage, correct side', correctPosition: 1 },
                { id: 's3', text: '😷 Place over nose, mouth & chin', correctPosition: 2 },
                { id: 's4', text: '👃 Mould the nose-piece to your nose', correctPosition: 3 },
                { id: 's5', text: '🔗 Secure ear loops or ties', correctPosition: 4 },
            ],
        },

        // 2 – drag_drop
        {
            id: 'g2r2', type: 'drag_drop',
            title: 'Single-Use or Reusable? ♻️',
            instruction: 'Drag each item to the correct category',
            items: [
                { id: 'i1', label: 'Surgical Mask', emoji: '😷', correctZone: 0 },
                { id: 'i2', label: 'Exam Gloves', emoji: '🧤', correctZone: 0 },
                { id: 'i3', label: 'Reusable Goggles', emoji: '🥽', correctZone: 1 },
                { id: 'i4', label: 'Face Shield', emoji: '🛡️', correctZone: 1 },
            ],
            zones: [
                { id: 0, label: '🗑️ Single-Use', color: '#F44336', textColor: '#fff' },
                { id: 1, label: '♻️ Reusable', color: '#4CAF50', textColor: '#fff' },
            ],
        },

        // 3 – spot_mistake
        {
            id: 'g2r3', type: 'spot_mistake',
            title: 'Spot the Mistake! 🚨',
            instruction: 'One mask-removal step is WRONG – tap it!',
            items: [
                { id: 'm1', text: '🧤 Remove gloves first', isWrong: false },
                { id: 'm2', text: '🙌 Perform hand hygiene', isWrong: false },
                { id: 'm3', text: '✋ Touch the front of the mask to remove', isWrong: true },
                { id: 'm4', text: '🗑️ Dispose in clinical waste', isWrong: false },
            ],
            explanation: 'NEVER touch the front of the mask – it is contaminated. Remove by reaching behind from ear loops or ties.',
        },

        // 4 – match_pair
        {
            id: 'g2r4', type: 'match_pair',
            title: 'Mask Types! 😷',
            instruction: 'Match mask type LEFT to when it is used RIGHT',
            pairs: [
                { id: 'a', left: '😷 Surgical mask', right: 'Droplet precautions – routine care' },
                { id: 'b', left: '🟦 FFP2 / N95', right: 'Airborne precautions (TB, COVID)' },
                { id: 'c', left: '🔵 FFP3 respirator', right: 'High-risk aerosol procedures' },
                { id: 'd', left: '🛡️ Full-face respirator', right: 'Chemical/hazardous aerosols' },
            ],
        },

        // 5 – true_false
        {
            id: 'g2r5', type: 'true_false',
            title: 'True or False? ✅❌',
            instruction: 'Tap TRUE or FALSE for this statement:',
            statement: 'An N95 respirator provides the same protection level as a standard surgical mask.',
            correct: false,
            explanation: 'N95 filters ≥95% of airborne particles. Surgical masks only block large droplets – they are NOT equivalent.',
        },

        // 6 – multi_select
        {
            id: 'g2r6', type: 'multi_select',
            title: 'Select ALL Correct! ☑️',
            instruction: 'Tap EVERY item that requires eye protection',
            items: [
                { id: 'c1', text: '🩸 Suturing a wound', correct: true },
                { id: 'c2', text: '📋 Writing patient notes', correct: false },
                { id: 'c3', text: '💊 Administering oral meds', correct: false },
                { id: 'c4', text: '🚿 High-pressure irrigation of wounds', correct: true },
                { id: 'c5', text: '🫁 Bronchoscopy / aerosol procedure', correct: true },
            ],
            explanation: 'Eye protection is required when there is risk of splash, spray, or aerosol reaching the eyes.',
        },

        // 7 – scenario_select
        {
            id: 'g2r7', type: 'scenario_select',
            title: 'Right Protection? 🎯',
            instruction: 'A surgeon is performing an open cavity procedure. Which eye protection should they wear?',
            scenario: '🔬 Open cavity surgery – high-splash risk environment',
            options: [
                { id: 'o1', label: 'No eye protection', emoji: '❌', correct: false },
                { id: 'o2', label: 'Sunglasses', emoji: '🕶️', correct: false },
                { id: 'o3', label: 'Goggles or Face Shield', emoji: '🥽🛡️', correct: true },
                { id: 'o4', label: 'Mask only', emoji: '😷', correct: false },
            ],
            explanation: 'Open surgery has blood/fluid splash risk – clinical goggles or a face shield are mandatory.',
        },

        // 8 – fill_blank
        {
            id: 'g2r8', type: 'fill_blank',
            title: 'Fill the Gap! ✍️',
            instruction: 'Drag the correct word to complete the safety rule',
            sentence: 'Reusable goggles must be ___ between patients.',
            choices: ['Discarded', 'Decontaminated', 'Shared freely', 'Rinsed with water only'],
            correctChoice: 'Decontaminated',
            explanation: 'Reusable goggles must be wiped down with approved disinfectant between each patient use.',
        },

        // 9 – tap_sequence
        {
            id: 'g2r9', type: 'tap_sequence',
            title: 'Tap in Order! 👆',
            instruction: 'Tap the steps to REMOVE a surgical mask in the correct order (1→4)',
            items: [
                { id: 't1', label: 'Remove gloves', emoji: '🧤', correctOrder: 1 },
                { id: 't2', label: 'Hand hygiene', emoji: '🙌', correctOrder: 2 },
                { id: 't3', label: 'Unhook ear loops from behind', emoji: '🔗', correctOrder: 3 },
                { id: 't4', label: 'Hand hygiene again', emoji: '💧', correctOrder: 4 },
            ],
        },

        // 10 – long_press
        {
            id: 'g2r10', type: 'long_press',
            title: 'Long-Press the Answer! 👇',
            instruction: 'HOLD DOWN the statement that is TRUE about apron use',
            items: [
                { id: 'l1', label: 'Worn with the opening at the front', emoji: '🔄', correct: false },
                { id: 'l2', label: 'Worn only by surgeons', emoji: '🩺', correct: false },
                { id: 'l3', label: 'Protects clothing from fluid splashes', emoji: '💧', correct: true },
                { id: 'l4', label: 'Reused for the entire shift without change', emoji: '🔁', correct: false },
            ],
            explanation: 'A plastic apron protects clothing and skin from fluid splashes. Change between each patient.',
        },
    ],

    // ══════════════════════════════════════════════════════════════════════════
    // GAME 3 – Sharps & BMW Waste  (10 puzzles)
    // ══════════════════════════════════════════════════════════════════════════
    3: [

        // 1 – drag_drop
        {
            id: 'g3r1', type: 'drag_drop',
            title: 'Bin It Right! 🗑️',
            instruction: 'Drag each waste item into the correct colour-coded BMW bin',
            items: [
                { id: 'i1', label: 'Used Syringe', emoji: '💉', correctZone: 0 },
                { id: 'i2', label: 'Blood Cotton', emoji: '🩸', correctZone: 0 },
                { id: 'i3', label: 'Body Tissue', emoji: '🦴', correctZone: 1 },
                { id: 'i4', label: 'Paper Waste', emoji: '📄', correctZone: 2 },
            ],
            zones: [
                { id: 0, label: '🟡 Yellow\nInfectious', color: '#FFC107', textColor: '#333' },
                { id: 1, label: '🔴 Red\nAnatomical', color: '#F44336', textColor: '#fff' },
                { id: 2, label: '⬛ Black\nGeneral', color: '#424242', textColor: '#fff' },
            ],
        },

        // 2 – sequence_order
        {
            id: 'g3r2', type: 'sequence_order',
            title: 'Needle Stick Response! 🚑',
            instruction: 'Tap the IMMEDIATE steps after a needle-stick injury in correct order',
            steps: [
                { id: 's1', text: "🩸 Bleed wound gently – don't suck", correctPosition: 0 },
                { id: 's2', text: '🚿 Wash with soap & running water 2 min', correctPosition: 1 },
                { id: 's3', text: '📢 Report to supervisor immediately', correctPosition: 2 },
                { id: 's4', text: '🏥 Seek occupational health / medical advice', correctPosition: 3 },
                { id: 's5', text: '📋 Complete the incident report form', correctPosition: 4 },
            ],
        },

        // 3 – spot_mistake
        {
            id: 'g3r3', type: 'spot_mistake',
            title: 'Spot the Unsafe Practice! ⚠️',
            instruction: 'One sharps safety practice below is DANGEROUS – tap it!',
            items: [
                { id: 'm1', text: '🗑️ Dispose sharps in approved bin immediately after use', isWrong: false },
                { id: 'm2', text: '🤿 Recap needle using one-handed scoop method only', isWrong: false },
                { id: 'm3', text: '🙌 Recap needle using BOTH hands', isWrong: true },
                { id: 'm4', text: '🔒 Never overfill sharps bin beyond ¾ full', isWrong: false },
            ],
            explanation: 'Two-handed recapping is the most common cause of needlestick injury. One-handed scoop only, or use a recapping device.',
        },

        // 4 – match_pair
        {
            id: 'g3r4', type: 'match_pair',
            title: 'Bin the Waste! 🌈',
            instruction: 'Match waste type LEFT to correct BMW bin colour RIGHT',
            pairs: [
                { id: 'a', left: '💉 Sharps & Syringes', right: '🟡 Yellow Bin' },
                { id: 'b', left: '🦴 Anatomical / Body parts', right: '🔴 Red Bin' },
                { id: 'c', left: '🥛 Glass / Broken ampoules', right: '🔵 Blue/White Bin' },
                { id: 'd', left: '📄 Non-hazardous office waste', right: '⬛ Black Bin' },
            ],
        },

        // 5 – true_false
        {
            id: 'g3r5', type: 'true_false',
            title: 'True or False? ✅❌',
            instruction: 'Tap TRUE or FALSE for this statement:',
            statement: 'It is acceptable to recap a needle using both hands if you are careful.',
            correct: false,
            explanation: 'Two-handed recapping is NEVER acceptable. It is the leading cause of needlestick injuries regardless of how careful you are.',
        },

        // 6 – multi_select
        {
            id: 'g3r6', type: 'multi_select',
            title: 'Select ALL Infectious Waste! ☑️',
            instruction: 'Tap every item that goes in the YELLOW infectious waste bag',
            items: [
                { id: 'c1', text: '🩸 Blood-soaked dressing', correct: true },
                { id: 'c2', text: '📄 Patient discharge letter', correct: false },
                { id: 'c3', text: '💉 Used IV catheter', correct: true },
                { id: 'c4', text: '🧴 Empty saline bag (uncontaminated)', correct: false },
                { id: 'c5', text: '🦠 Culture plates from microbiology lab', correct: true },
            ],
            explanation: 'Yellow bags are for infectious clinical waste: blood dressings, IV catheters, and microbiological material.',
        },

        // 7 – fill_blank
        {
            id: 'g3r7', type: 'fill_blank',
            title: 'Fill the Gap! ✍️',
            instruction: 'Drag the correct answer to complete the BMW rule',
            sentence: 'A sharps bin must be sealed and replaced when it is ___ full.',
            choices: ['Half', 'Completely', 'Three-quarters (¾)', 'One-quarter'],
            correctChoice: 'Three-quarters (¾)',
            explanation: 'Filling above ¾ capacity risks injuries when inserting the next sharp – seal and replace at ¾ full.',
        },

        // 8 – tap_sequence
        {
            id: 'g3r8', type: 'tap_sequence',
            title: 'Tap in Order! 👆',
            instruction: 'Tap the blood spill response steps in correct order (1→5)',
            items: [
                { id: 't1', label: '🚧 Alert others to keep clear', emoji: '🚧', correctOrder: 1 },
                { id: 't2', label: '🧤 Don PPE', emoji: '🧤', correctOrder: 2 },
                { id: 't3', label: '🧻 Cover spill with absorbent', emoji: '🧻', correctOrder: 3 },
                { id: 't4', label: '🧴 Apply chlorine disinfectant 2 min', emoji: '🧴', correctOrder: 4 },
                { id: 't5', label: '🗑️ Bag all waste in yellow bin', emoji: '🗑️', correctOrder: 5 },
            ],
        },

        // 9 – scenario_select
        {
            id: 'g3r9', type: 'scenario_select',
            title: 'Which Bin? 🎯',
            instruction: 'A nurse discards a used blood glucose lancet. Where should it go?',
            scenario: '🩸 Used lancet after finger-prick blood glucose test',
            options: [
                { id: 'o1', label: 'Black general bin', emoji: '⬛', correct: false },
                { id: 'o2', label: 'Yellow infectious bag', emoji: '🟡', correct: false },
                { id: 'o3', label: 'Sharps bin (yellow)', emoji: '💉🟡', correct: true },
                { id: 'o4', label: 'Red anatomical bin', emoji: '🔴', correct: false },
            ],
            explanation: 'Any sharp including lancets must go directly into an approved sharps bin – NEVER into bags or general bins.',
        },

        // 10 – long_press
        {
            id: 'g3r10', type: 'long_press',
            title: 'Long-Press the Answer! 👇',
            instruction: 'HOLD DOWN the correct action to take if a sharps bin is ¾ full',
            items: [
                { id: 'l1', label: 'Push items down to make space', emoji: '⬇️', correct: false },
                { id: 'l2', label: 'Continue using until completely full', emoji: '🔁', correct: false },
                { id: 'l3', label: 'Seal the bin and replace with a new one', emoji: '🔒', correct: true },
                { id: 'l4', label: 'Tip waste into a larger bag', emoji: '🗑️', correct: false },
            ],
            explanation: 'At ¾ capacity, close and seal the bin permanently, label it, and replace with a new one immediately.',
        },
    ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getGameRounds = (gameNumber) => gameRoundsData[gameNumber] ?? [];

export const GAME_META = [
    {
        gameNumber: 1,
        title: 'PPE & Gloving',
        subtitle: '10 puzzles · 9 game types',
        icon: '🧤',
        gradient: ['#FF7EB3', '#FF758C'],
    },
    {
        gameNumber: 2,
        title: 'Masks, Eyewear & Aprons',
        subtitle: '10 puzzles · 9 game types',
        icon: '😷',
        gradient: ['#667EEA', '#764BA2'],
    },
    {
        gameNumber: 3,
        title: 'Sharps & BMW Waste',
        subtitle: '10 puzzles · 9 game types',
        icon: '♻️',
        gradient: ['#11998e', '#38ef7d'],
    },
];
