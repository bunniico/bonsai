import type { BranchInfo, CurriculumNode, PrereqGroup } from '../types';

/** Shorthand: every listed node required. */
const all = (...ids: string[]): PrereqGroup[] => (ids.length ? [{ ids, required: ids.length }] : []);
/** Shorthand: `n` of the listed nodes required. */
const any = (n: number, ...ids: string[]): PrereqGroup => ({ ids, required: n });

export const BRANCHES: BranchInfo[] = [
  { id: 'A', name: 'Core Fundamentals', color: '#d9a84e' },
  { id: 'B', name: 'Digital Craft', color: '#6aa9e0' },
  { id: 'C', name: 'Figure & Anatomy', color: '#e07a7a' },
  { id: 'D', name: 'Character Design', color: '#b48ce0' },
  { id: 'E', name: 'Creatures & Non-Humans', color: '#5fc9b0' },
  { id: 'F', name: 'Environments', color: '#8fbe5f' },
  { id: 'G', name: 'Advanced / Capstone', color: '#e8d9a0' },
];

export const NODES: CurriculumNode[] = [
  // ── BRANCH A — CORE FUNDAMENTALS ─────────────────────────────────────────
  {
    id: 'A1', branch: 'A', icon: '✏️', title: 'Mark Making & Line Control', tier: 1, prereqs: [],
    description: 'Confident, controlled straight lines, ellipses, and curves from the shoulder; ghosting and follow-through.',
    completeWhen: 'Fill 10 pages of the Drawabox superimposed-lines, ghosted-lines, and ellipse-in-planes drills with visibly smooth, confident strokes.',
    xp: 100,
    resources: [
      'Drawabox Lesson 1 (Lines, Ellipses, Boxes) — drawabox.com',
      'Proko "Drawing Basics" line lessons',
      'Ctrl+Paint "Brush Control" (for the digital version)',
    ],
    pos: { x: 4, y: 0 },
  },
  {
    id: 'A2', branch: 'A', icon: '📦', title: 'Basic Perspective & the Box', tier: 1, prereqs: all('A1'),
    description: '1/2/3-point perspective and rotating a box freely in space — the atom of all constructed drawing.',
    completeWhen: 'Complete the Drawabox 250 Box Challenge (or draw 50 convincing boxes in varied rotations with converging lines).',
    xp: 150,
    resources: [
      'Drawabox Lesson 1 (Boxes) + 250 Box Challenge',
      'Scott Robertson, How to Draw (perspective chapters)',
      'Ernest Norling, Perspective Made Easy',
    ],
    pos: { x: 4.7, y: 1 },
  },
  {
    id: 'A3', branch: 'A', icon: '🧊', title: 'Form & Construction (3D Primitives)', tier: 2, prereqs: all('A2'),
    description: 'Building spheres, cylinders, boxes and combining them into believable 3D objects; contour lines and cross-sections.',
    completeWhen: 'Construct 20 everyday objects from primitives (from observation and imagination) that read as solid 3D.',
    xp: 150,
    resources: [
      'Drawabox Lessons 2 & 6',
      'Peter Han Dynamic Sketching (form/organic)',
      'Proko "Structure Basics"',
    ],
    pos: { x: 4, y: 2 },
  },
  {
    id: 'A4', branch: 'A', icon: '🌗', title: 'Value, Light & Shadow', tier: 2, prereqs: all('A3'),
    description: 'Light logic: form shadow, core shadow, cast shadow, reflected light, occlusion; rendering primitives with a consistent light source; value scales.',
    completeWhen: 'Render the 5 primitives and 5 combined forms in a 5-value range with correct, consistent light logic.',
    xp: 150,
    resources: [
      'Proko "How to Shade"',
      'Ctrl+Paint value studies',
      'Scott Robertson & Thomas Bertling, How to Render',
    ],
    pos: { x: 3.6, y: 3 },
  },
  {
    id: 'A5', branch: 'A', icon: '🎨', title: 'Color Theory', tier: 3, prereqs: all('A4'),
    description: 'Hue/value/saturation, temperature, color relationships, limited palettes, light color vs. local color.',
    completeWhen: 'Produce 5 studies using a limited/deliberate palette and a written note on the color logic of each.',
    xp: 120,
    resources: [
      'James Gurney, Color and Light: A Guide for the Realist Painter',
      'Proko "Color and Light"',
      'Ctrl+Paint color series',
    ],
    pos: { x: 2.8, y: 4 },
  },
  {
    id: 'A6', branch: 'A', icon: '🎯', title: 'Composition & Design', tier: 3, prereqs: all('A4'),
    description: 'Focal points, notan/value grouping, rule of thirds and other frameworks, leading the eye, negative space.',
    completeWhen: 'Produce 10 thumbnail compositions for a given scene brief and one refined value comp explaining the focal hierarchy.',
    xp: 120,
    resources: [
      'Marcos Mateu-Mestre, Framed Ink',
      'Edgar Payne, Composition of Outdoor Painting',
      'Proko / Marco Bucci composition lessons',
    ],
    pos: { x: 4.6, y: 4 },
  },

  // ── BRANCH B — DIGITAL CRAFT ─────────────────────────────────────────────
  {
    id: 'B1', branch: 'B', icon: '💻', title: 'Software Setup & Navigation', tier: 0, prereqs: [],
    description: 'Choose and set up software; canvas navigation, document setup, shortcuts. Recommended: Clip Studio Paint or Procreate; Krita as a free option; Photoshop for painting.',
    completeWhen: 'Configure your workspace, create a correct RGB canvas, and demonstrate zoom/pan/rotate and undo fluently.',
    xp: 40,
    resources: [
      'Ctrl+Paint "Digital Painting 101" (Intro, Navigation) — ctrlpaint.com',
      'Official CSP / Procreate / Krita docs',
    ],
    pos: { x: 1, y: 0 },
  },
  {
    id: 'B2', branch: 'B', icon: '🖌️', title: 'Brushes, Layers & Blending', tier: 1, prereqs: all('B1'),
    description: 'Brush/eraser, opacity/flow, a minimal brush set (hard round, soft round, hard flat), layers, layer order, blend modes (Normal/Multiply).',
    completeWhen: 'Complete a layered value-gradient worksheet using temp layers and merge-down, and paint one object using only 3 brushes.',
    xp: 80,
    resources: [
      'Ctrl+Paint "Digital Painting 101" (Brushes, Layers)',
      'Paintable beginner guide',
    ],
    pos: { x: 1, y: 1 },
  },
  {
    id: 'B3', branch: 'B', icon: '🖊️', title: 'Tablet Control & Digital Line Confidence', tier: 1, prereqs: all('A1', 'B2'),
    description: 'Pressure sensitivity, tapered strokes, stabilization, redrawing A1 line drills digitally.',
    completeWhen: 'Reproduce the A1 line/ellipse drills digitally at equal quality and ink one clean line drawing.',
    xp: 80,
    resources: [
      'Ctrl+Paint brush-control videos',
      'Clip Studio Paint stabilization tutorials',
    ],
    pos: { x: 2, y: 2 },
  },
  {
    id: 'B4', branch: 'B', icon: '🖼️', title: 'Digital Painting & Rendering Workflow', tier: 4, prereqs: all('A4', 'A5', 'B2'),
    description: 'Grayscale-to-color, blocking-in, rendering edges (hard/soft), custom brush use, color layers.',
    completeWhen: 'Take one drawing from line → value block-in → color → rendered finish on layers.',
    xp: 150,
    resources: [
      'Ctrl+Paint "Let\'s Paint" demos',
      'Marco Bucci painting series',
      'Proko digital painting bundle',
    ],
    pos: { x: 1.6, y: 5 },
  },

  // ── BRANCH C — FIGURE & ANATOMY ──────────────────────────────────────────
  {
    id: 'C1', branch: 'C', icon: '🏃', title: 'Gesture Drawing', tier: 2, prereqs: all('A1'),
    description: 'Line of action, rhythm, capturing movement in 30s–2min poses; C/S/I lines; the "bean" / ribcage-pelvis relationship.',
    completeWhen: 'Complete 300+ timed gestures (log them); your 2-minute poses show clear line of action and weight.',
    xp: 150,
    resources: [
      'Proko Gesture course',
      'Line of Action / Croquis Cafe timed sessions',
      'Michael Mattesi, Force: Dynamic Life Drawing',
    ],
    pos: { x: 7, y: 1 },
  },
  {
    id: 'C2', branch: 'C', icon: '🧍', title: 'Figure Construction & Proportion', tier: 3, prereqs: all('C1', 'A3'),
    description: 'Mannequinization: ribcage, pelvis, limbs as forms; 7–8 head proportions; contrapposto; figure in perspective.',
    completeWhen: 'Construct 30 figures from imagination in varied poses with correct proportion and believable 3D masses.',
    xp: 180,
    resources: [
      'Michael Hampton, Figure Drawing: Design and Invention',
      'Andrew Loomis, Figure Drawing for All It\'s Worth',
      'Proko Figure Drawing Fundamentals',
    ],
    pos: { x: 7, y: 3 },
  },
  {
    id: 'C3', branch: 'C', icon: '🙂', title: 'Head, Face & Expression', tier: 3, prereqs: all('C2'),
    description: 'Loomis head construction, features, planes of the face, expression/emotion.',
    completeWhen: 'Draw the head from 8 angles on a turnaround plus 6 expressions.',
    xp: 140,
    resources: [
      'Andrew Loomis, Drawing the Head and Hands',
      'Proko Head/Portrait course',
      'Morpho: Face, Head, and Neck (Lauricella)',
    ],
    pos: { x: 6, y: 4 },
  },
  {
    id: 'C4', branch: 'C', icon: '✋', title: 'Hands, Feet & Extremities', tier: 3, prereqs: all('C2'),
    description: 'The most-avoided forms; block construction then detail.',
    completeWhen: 'Draw 40 hands and 20 feet from reference and imagination in varied poses.',
    xp: 100,
    resources: [
      'Morpho: Hands and Feet (Lauricella)',
      'Proko hands lessons',
      'George Bridgman',
    ],
    pos: { x: 8.6, y: 4 },
  },
  {
    id: 'C5', branch: 'C', icon: '💀', title: 'Muscular & Skeletal Anatomy', tier: 4, prereqs: all('C2'),
    description: 'Bones and muscle groups as they affect surface form; landmarks; écorché.',
    completeWhen: 'Produce annotated écorché studies of torso, arm, and leg, and apply the anatomy to 10 figures.',
    xp: 180,
    resources: [
      'Michel Lauricella, Morpho: Anatomy for Artists + Muscled Bodies',
      'George Bridgman, Constructive Anatomy',
      'Proko Anatomy course',
    ],
    pos: { x: 7.4, y: 4 },
  },
  {
    id: 'C6', branch: 'C', icon: '🔞', title: 'Complete Adult Anatomy', tier: 4, prereqs: all('C5'), mature: true,
    description: 'Full nude anatomy including primary/secondary sex characteristics, breast form and attachment, genital anatomy, fat distribution and body-type variation — treated as life-drawing / medical-illustration education.',
    completeWhen: 'Complete structured studies of male and female complete anatomy from reputable references, including breast and genital form on 10+ figures.',
    xp: 160,
    resources: [
      'Eliot Goldfinger, Human Anatomy for Artists: The Elements of Form (Oxford UP)',
      'Sarah Simblet, Anatomy for the Artist (DK)',
      'Uldis Zarins, Anatomy for Sculptors',
      'Morpho series (fat/skin-folds and reproductive-system volumes)',
    ],
    pos: { x: 6.6, y: 5 },
  },
  {
    id: 'C7', branch: 'C', icon: '🤸', title: 'Dynamic Action Poses & Foreshortening', tier: 5, prereqs: all('C5', 'A2'),
    description: 'Extreme poses, foreshortening, weight and momentum, exaggeration for impact.',
    completeWhen: 'Produce 20 dynamic action figures (running, jumping, fighting, falling) with convincing foreshortening.',
    xp: 140,
    resources: [
      'Michael Mattesi, Force series',
      'Proko foreshortening',
      'Line of Action action-pose sets',
    ],
    pos: { x: 7.9, y: 5 },
  },
  {
    id: 'C8', branch: 'C', icon: '👫', title: 'Figure Interaction (Two+ Figures)', tier: 5, prereqs: all('C6', 'C7'), mature: true,
    description: 'Multiple figures interacting: embracing, fighting, intertwined poses; shared weight, compression of flesh at contact, relative scale, negative space between figures.',
    completeWhen: 'Produce 12 two-figure compositions showing believable contact, weight-sharing, and interaction (mix of combat and intimate/embracing poses).',
    xp: 160,
    resources: [
      'Michael Mattesi, Force: Character Design from Life Drawing',
      'Duo/couples pose reference: CharacterDesigns.com, PoseSpace, Grafit Studio packs',
      'AdorkaStock (clothed interaction/action posing; strictly SFW)',
    ],
    pos: { x: 7, y: 6 },
  },
  {
    id: 'C9', branch: 'C', icon: '🩸', title: 'Gore, Wounds & Damaged Anatomy', tier: 5, prereqs: all('C5'), mature: true,
    description: 'Rendering wounds, blood behavior, torn flesh, bruising, and damaged anatomy convincingly for violent scenes; understanding subsurface structure so damage reads correctly.',
    completeWhen: 'Render 8 wound/gore studies (cuts, bruising, deeper trauma) and integrate one into a figure illustration.',
    xp: 120,
    resources: [
      'Paco Rico Torres, "Drawing gruesome battle wounds" (ImagineFX)',
      'SFX-makeup/moulage references (Benito Garcia III; Stan Winston School courses)',
      'Color/edge principles from A4/A5',
    ],
    pos: { x: 9, y: 5 },
  },

  // ── BRANCH D — CHARACTER DESIGN ──────────────────────────────────────────
  {
    id: 'D1', branch: 'D', icon: '🔷', title: 'Shape Language & Silhouette', tier: 4, prereqs: all('C2', 'A6'),
    description: 'Circle/square/triangle psychology, silhouette readability, shape contrast, the "10% shrink" silhouette test.',
    completeWhen: 'Design 10 characters distinguishable by silhouette alone, each with a stated shape-language rationale.',
    xp: 120,
    resources: [
      '80.lv "Character Design: Shape Language and Readability"',
      'Marc Brunet character courses',
      'Ahmed Aldoori design videos',
    ],
    pos: { x: 5.2, y: 5 },
  },
  {
    id: 'D2', branch: 'D', icon: '👕', title: 'Costume, Props & Material Design', tier: 4, prereqs: all('D1', 'A4'),
    description: 'Clothing/drapery folds, how costume communicates backstory, props, material rendering.',
    completeWhen: 'Produce 5 costumed characters where dress communicates role/background, with a folds study sheet.',
    xp: 120,
    resources: [
      'Proko "Clothing and Drapery"',
      'Morpho: Clothing Folds and Creases',
      'Marc Brunet',
    ],
    pos: { x: 4.4, y: 6 },
  },
  {
    id: 'D3', branch: 'D', icon: '🎭', title: 'Style Development & Stylization', tier: 5, prereqs: all('D1', 'C3'),
    description: 'Moving from realism to intentional stylization; proportion pushing; developing a personal visual voice from fundamentals rather than mimicry.',
    completeWhen: 'Take one realistic character and produce 4 distinct stylizations, plus a short statement of your emerging style choices.',
    xp: 120,
    resources: [
      'Sinix Design stylization videos',
      'Marc Brunet',
      'Ethan Becker style/proportion videos',
    ],
    pos: { x: 5.5, y: 6 },
  },
  {
    id: 'D4', branch: 'D', icon: '📋', title: 'Turnarounds & Model Sheets', tier: 5, prereqs: all('D2'),
    description: 'Production-ready character sheets: front/¾/profile/¾-back/back views with consistent height guides, expression sheets, callouts.',
    completeWhen: 'Produce one complete game-ready model sheet (5+ consistent views + expressions) for an original character.',
    xp: 140,
    resources: [
      'Clip Studio "Model Sheets for Character Designers"',
      'CharacterHub character-sheet guide',
      'Industry turnaround guides',
    ],
    pos: { x: 4.8, y: 7 },
  },

  // ── BRANCH E — CREATURES & NON-HUMANS ────────────────────────────────────
  {
    id: 'E1', branch: 'E', icon: '🐾', title: 'Animal Anatomy & Construction', tier: 4, prereqs: all('C1', 'A3'),
    description: 'Comparative animal anatomy, quadruped skeletons, digitigrade vs. plantigrade legs, animal gesture.',
    completeWhen: 'Construct 15 animals across 5+ species from reference and imagination.',
    xp: 150,
    resources: [
      'Terryl Whitlatch, Science of Creature Design & Animals Real and Imagined',
      'Morpho: Mammals',
      'Ken Hultgren, The Art of Animal Drawing',
    ],
    pos: { x: 9.5, y: 3 },
  },
  {
    id: 'E2', branch: 'E', icon: '🦊', title: 'Furry / Anthro Characters', tier: 5, prereqs: all('E1', 'C2', 'D1'),
    description: 'Combining human and animal anatomy into a coherent hybrid skeleton; muzzle/neck integration; the anthro scale (toony → realistic); proportions.',
    completeWhen: 'Design 5 anthro characters across different species with a consistent, believable hybrid anatomy rationale.',
    xp: 130,
    resources: [
      'Terryl Whitlatch anatomy books',
      'Line of Action (human + animal reference)',
      'Drawing Furries (Quarto/3dtotal)',
    ],
    pos: { x: 8.5, y: 6 },
  },
  {
    id: 'E3', branch: 'E', icon: '👾', title: 'Monsters & Aliens', tier: 5, prereqs: all('E1', 'C5', 'D1'),
    description: 'Believable creature design via real-anatomy grounding, silhouette, familiarity-vs-strangeness, function-driven biology, fear/appeal design.',
    completeWhen: 'Design 6 original creatures (mix of monstrous and alien) each with a stated biological/functional logic.',
    xp: 140,
    resources: [
      'Terryl Whitlatch, The Science of Creature Design',
      'Aaron Blaise creature courses',
      'Bobby Chiu / Schoolism creature design',
    ],
    pos: { x: 9.5, y: 6 },
  },
  {
    id: 'E4', branch: 'E', icon: '🤖', title: 'Robots, Mechs & Hard Surface', tier: 5, prereqs: all('A2', 'D1'),
    description: 'Hard-surface construction in perspective, functional joints, panel lines, greebling with intent, function-driven mechanical design.',
    completeWhen: 'Design 4 mechs/robots with believable joints and functional greebling, at least one in ¾ perspective.',
    xp: 140,
    resources: [
      'Scott Robertson, How to Draw (hard surface)',
      'ArtStation Mecha channel study',
      'Concept-artist mech tutorials',
    ],
    pos: { x: 10.5, y: 6 },
  },

  // ── BRANCH F — ENVIRONMENTS ──────────────────────────────────────────────
  {
    id: 'F1', branch: 'F', icon: '🏞️', title: 'Environment Perspective & Depth', tier: 4, prereqs: all('A2', 'A6'),
    description: 'Scenes in perspective, atmospheric perspective, foreground/midground/background layering, scale.',
    completeWhen: 'Produce 5 environment thumbnails with clear depth layering and correct perspective.',
    xp: 130,
    resources: [
      'Scott Robertson, How to Draw',
      'James Gurney, Color and Light (depth/atmosphere)',
      'CGMA / Schoolism environment intros',
    ],
    pos: { x: 11.8, y: 5 },
  },
  {
    id: 'F2', branch: 'F', icon: '🪨', title: 'Natural Forms: Rocks & Terrain', tier: 5, prereqs: all('F1', 'A4'),
    description: 'Rock as blocky planes first (top/side/cast shadow) then cracks; cliff faces, terrain, geological logic.',
    completeWhen: 'Produce 6 rock/cliff studies from big-form to detail with consistent light.',
    xp: 90,
    resources: [
      'Nature-drawing structure-first method guides',
      'James Gurney landscape studies',
      'Plein air references',
    ],
    pos: { x: 11.5, y: 6 },
  },
  {
    id: 'F3', branch: 'F', icon: '🌳', title: 'Foliage, Trees & Forests', tier: 5, prereqs: all('F1', 'A4'),
    description: 'Trees as trunk-angle + crown masses (not "a green cloud on a stick"); breaking canopy into a few uneven masses; forest depth.',
    completeWhen: 'Produce 6 tree/foliage studies including one forest scene with layered depth.',
    xp: 90,
    resources: [
      'Nature-drawing guides',
      'James Gurney',
      'Ctrl+Paint foliage demos',
    ],
    pos: { x: 12.4, y: 6 },
  },
  {
    id: 'F4', branch: 'F', icon: '🌊', title: 'Water, Waves & Reflections', tier: 5, prereqs: all('F1', 'A4'),
    description: 'Calm water (long horizontal reflections, softened edges) vs. moving water; ocean waves. Water is "mostly value and edge control."',
    completeWhen: 'Produce 5 water studies including calm reflection and breaking-wave examples.',
    xp: 90,
    resources: [
      'Nature-drawing guides',
      'James Gurney water studies',
      'Wave reference / plein air',
    ],
    pos: { x: 13.3, y: 6 },
  },
  {
    id: 'F5', branch: 'F', icon: '☁️', title: 'Skies, Clouds & Atmosphere', tier: 5, prereqs: all('F1', 'A5'),
    description: 'Cloud forms with soft edges, cloud types, sky gradients, time-of-day color, atmospheric perspective.',
    completeWhen: 'Produce 6 sky/cloud studies across different times of day and weather.',
    xp: 90,
    resources: [
      'James Gurney, Color and Light (skies)',
      'Nature-drawing guides',
      'Cloud photo reference',
    ],
    pos: { x: 14.2, y: 6 },
  },
  {
    id: 'F6', branch: 'F', icon: '🏗️', title: 'Machines, Vehicles & Architecture', tier: 5, prereqs: all('F1', 'E4'),
    description: 'Vehicles and buildings in perspective; industrial-design sketching; architectural basics for artists; hard-surface at environment scale.',
    completeWhen: 'Produce 3 vehicle designs and 3 architectural/structure studies in perspective.',
    xp: 130,
    resources: [
      'Scott Robertson, How to Draw & How to Render',
      'Industrial design sketching resources',
      'Architecture-for-artists references',
    ],
    pos: { x: 10.9, y: 7 },
  },
  {
    id: 'F7', branch: 'F', icon: '🖌️', title: 'Scene Composition & Environment Illustration', tier: 6, prereqs: all('F2', 'F3', 'F4', 'F5', 'A6'),
    description: 'Combining natural and artificial elements into a composed, lit environment illustration with a focal point.',
    completeWhen: 'Produce one finished environment illustration integrating multiple natural + artificial elements with deliberate composition and lighting.',
    xp: 180,
    resources: [
      'Marcos Mateu-Mestre, Framed Ink',
      'Edgar Payne, Composition of Outdoor Painting',
      'James Gurney',
    ],
    pos: { x: 12.5, y: 7 },
  },

  // ── BRANCH G — ADVANCED / CAPSTONE ───────────────────────────────────────
  {
    id: 'G1', branch: 'G', icon: '🧑‍🎨', title: 'Character Illustration (Finished)', tier: 6, prereqs: all('C5', 'D2', 'B4'),
    description: 'A fully rendered single-character illustration with background, lighting, and design intent.',
    completeWhen: 'Complete one portfolio-quality character illustration from thumbnail to finish.',
    xp: 200,
    resources: [
      'Your accumulated branches',
      'Marco Bucci rendering',
      'Sinix painting',
    ],
    pos: { x: 3.4, y: 7 },
  },
  {
    id: 'G2', branch: 'G', icon: '🐉', title: 'Creature / Mech Hero Illustration', tier: 6,
    prereqs: [any(1, 'E3', 'E4'), ...all('B4', 'F1')],
    description: 'A finished illustration featuring a non-human subject in an environment.',
    completeWhen: 'Complete one portfolio-quality creature or mech illustration in a setting.',
    xp: 200,
    resources: [
      'Accumulated branches',
      'Creature/mech pro breakdowns',
    ],
    pos: { x: 9.4, y: 7 },
  },
  {
    id: 'G3', branch: 'G', icon: '⚔️', title: 'Dynamic Multi-Figure Action Scene', tier: 6, prereqs: all('C8', 'C7', 'F7'),
    description: 'A composed scene with multiple interacting figures, action, and environment — including the capacity for violent scenes.',
    completeWhen: 'Complete one finished multi-figure action illustration with a clear narrative and focal hierarchy.',
    xp: 220,
    resources: [
      'Framed Ink',
      'Mattesi Force',
      'Accumulated branches',
    ],
    pos: { x: 8, y: 8 },
  },
  {
    id: 'G4', branch: 'G', icon: '🌶️', title: 'Mature Scene Composition (Capstone)', tier: 6, prereqs: all('C6', 'C8', 'C9', 'A6'), mature: true,
    description: 'Composing complete mature scenes with full anatomy, figure interaction, effective use of focal point, lighting, and storytelling — the culmination of the adult-content track.',
    completeWhen: 'Complete one finished mature-content illustration demonstrating command of complete anatomy, figure interaction, composition, and rendering.',
    xp: 220,
    resources: [
      'All Figure & Anatomy nodes',
      'Framed Ink (composition)',
      'Figure-interaction dynamics (Mattesi)',
    ],
    pos: { x: 6.5, y: 7 },
  },
  {
    id: 'G5', branch: 'G', icon: '🏆', title: 'Portfolio & Personal Style', tier: 6,
    prereqs: [...all('G1'), any(2, 'G2', 'G3', 'G4')],
    description: 'Assemble a cohesive body of work; identify and push your personal style; self-critique and iteration.',
    completeWhen: 'Assemble 6–10 finished pieces that show range (character + creature + environment) and a recognizable personal voice.',
    xp: 200,
    resources: [
      'Portfolio guides',
      'Peer critique communities',
      'Your accumulated work',
    ],
    pos: { x: 6.5, y: 9 },
  },
];

export const NODE_MAP: Map<string, CurriculumNode> = new Map(NODES.map((n) => [n.id, n]));

export const branchOf = (id: string): BranchInfo =>
  BRANCHES.find((b) => b.id === NODE_MAP.get(id)?.branch) ?? BRANCHES[0];

export const TOTAL_XP = NODES.reduce((sum, n) => sum + n.xp, 0);
