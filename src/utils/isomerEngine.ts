/**
 * Dynamic Isomer Engine for Inorganic Coordination Chemistry
 * Incorporates features, trans-pair classifications, point groups,
 * chirality insights, and stereoisomer counting rules from the Isomer Sketchbook (voidory/isomers).
 *
 * RULE: Only activated for questions explicitly asking for isomer counts.
 */

export type CoordinationGeometry = 'Octahedral' | 'Square Planar' | 'Tetrahedral';

export interface LigandPosition {
  label: string;
  pos: 'top' | 'bottom' | 'front-left' | 'front-right' | 'back-left' | 'back-right' | 'left' | 'right';
  isKey?: boolean;
  color?: string; // sky, emerald, amber, rose, purple
}

export interface ChelateArc {
  fromIndex: number;
  toIndex: number;
  label: string;
}

export interface IsomerSpatialConfig {
  id: string;
  name: string;
  badge: string;
  transPair: string; // From voidory/isomers trans-pair notation (e.g. "trans-[B, B]", "fac (90°-90°-90°)")
  category: 'geometric' | 'optical' | 'linkage' | 'ionization';
  angleRelation: string;
  isChiral: boolean;
  pointGroup: string;
  symmetryElements: string;
  description: string;
  geometry: CoordinationGeometry;
  centralAtom: string;
  ligands: LigandPosition[];
  chelates?: ChelateArc[];
  cfg?: {
    labels: string[];
    edges?: [number, number][];
    centralAtom?: string;
  };
}

export function getGeometryCode(geom: CoordinationGeometry): 'Oh' | 'SP' | 'Td' {
  if (geom === 'Square Planar') return 'SP';
  if (geom === 'Tetrahedral') return 'Td';
  return 'Oh';
}

export function getIsomer3DConfig(
  isomer: IsomerSpatialConfig,
  parentGeom: CoordinationGeometry
): {
  geom: 'Oh' | 'SP' | 'Td';
  labels: string[];
  edges: [number, number][];
  centralAtom: string;
} {
  const gCode = getGeometryCode(isomer.geometry || parentGeom);
  if (isomer.cfg && isomer.cfg.labels && isomer.cfg.labels.length > 0) {
    return {
      geom: gCode,
      labels: isomer.cfg.labels,
      edges: isomer.cfg.edges || [],
      centralAtom: isomer.cfg.centralAtom || isomer.centralAtom || 'M'
    };
  }

  // Derive from ligands & chelates
  const numSites = gCode === 'Oh' ? 6 : 4;
  const labels: string[] = new Array(numSites).fill('A');
  const posToSiteIndex = (pos: LigandPosition['pos']): number => {
    if (gCode === 'SP') {
      if (pos === 'right') return 0;
      if (pos === 'left') return 1;
      if (pos === 'top') return 2;
      return 3; // bottom
    }
    if (gCode === 'Td') {
      if (pos === 'top') return 0;
      if (pos === 'bottom') return 1;
      if (pos === 'left' || pos === 'back-left') return 2;
      return 3; // right or back-right
    }
    // Oh: 0: front-right, 1: back-left, 2: top, 3: bottom, 4: front-left, 5: back-right
    if (pos === 'front-right') return 0;
    if (pos === 'back-left') return 1;
    if (pos === 'top') return 2;
    if (pos === 'bottom') return 3;
    if (pos === 'front-left') return 4;
    return 5; // back-right
  };

  const ligandToSite: number[] = [];
  isomer.ligands.forEach((lig, idx) => {
    const siteIdx = posToSiteIndex(lig.pos);
    labels[siteIdx] = lig.label;
    ligandToSite[idx] = siteIdx;
  });

  const edges: [number, number][] = [];
  if (isomer.chelates) {
    isomer.chelates.forEach(c => {
      const s1 = ligandToSite[c.fromIndex];
      const s2 = ligandToSite[c.toIndex];
      if (s1 !== undefined && s2 !== undefined) {
        edges.push(s1 < s2 ? [s1, s2] : [s2, s1]);
      }
    });
  }

  return {
    geom: gCode,
    labels,
    edges,
    centralAtom: isomer.centralAtom || 'M'
  };
}

export interface DynamicIsomerProfile {
  id: string;
  sketchbookCaseId: string; // voidory/isomers case id e.g. 'sp-mabcd', 'oh-ma4b2', 'oh-maa2b2'
  complexFormula: string;
  geometry: CoordinationGeometry;
  coordinationNumber: 4 | 6;
  archetype: string;
  totalStereoisomers: number;
  geometricCount: number;
  opticalPairs: number;
  linkageMultiplier?: number;
  formulaDerivation: string;
  sketchbookInsight: string; // Authentic insight from voidory/isomers
  sketchbookHint: string;    // Authentic exam prompt from voidory/isomers
  symmetrySummary: {
    isChiral: boolean;
    hasMirrorPlane: boolean;
    hasInversionCenter: boolean;
    explanation: string;
  };
  linkageAnalysis?: {
    ambidentateLigand: string;
    modes: { donor: string; iupacName: string; note: string }[];
    totalCombinationsFormula: string;
  };
  isomers: IsomerSpatialConfig[];
  quickRule: string;
}

// Strict list of question IDs that are EXPLICITLY about isomer counts
export const ISOMER_COUNT_QUESTION_IDS = new Set<string>([
  'AY21_22_Q11', // Which gives the most number of isomers?
  'AY21_22_Q13', // Total number of possible isomers for square planar [PtCl(NO2)(NO3)(SCN)]2-
  'AY21_22_Q17', // Which will have two stereoisomeric forms?
  'AY21_22_Q20', // Number of geometrical isomers shown by octahedral [MX2Y4]
  'AY22_23_Q01', // Which of the coordination compounds will give exactly three isomers?
  'AY22_23_Q06', // How many isomer(s) is/are possible for tetrahedral [M(A-A)2]?
  'AY22_23_Q13', // [Cu(SCN)2(NH3)4] how many isomers are possible?
  'AY23_24_Q03', // Determine the number of structural isomers for [Co(NH3)5CO3]Cl
  'AY23_24_Q11', // Which gives the least number of isomers?
  'AY23_24_Q13', // Total number of possible isomers for [M(NO2)(SCN)(NH3)4]
  'AY23_24_Q15', // Number of geometrical isomers for [M(A-B)3]
  'AY24_25_Q05', // How many isomers are possible for [Pt(NH3)(H2O)(SCN)(NO2)]
  'AY24_25_Q08', // Which gives the highest number of isomers?
  'AY25_26_Q05', // How many isomers for [Pt(en)(NO3)(SCN)]?
  'AY25_26_Q07', // How many distinct isomers for complex with three glycinato ligands?
  'AY25_26_Q08'  // Which gives the highest number of isomers?
]);

/**
 * Checks if a question is explicitly asking about isomer counts
 */
export function isIsomerCountQuestion(questionId: string, questionText?: string): boolean {
  if (ISOMER_COUNT_QUESTION_IDS.has(questionId)) return true;
  if (!questionText) return false;
  const text = questionText.toLowerCase();
  return (
    (text.includes('number of') ||
      text.includes('how many') ||
      text.includes('most number') ||
      text.includes('highest number') ||
      text.includes('least number') ||
      text.includes('exactly three isomers') ||
      text.includes('total number') ||
      text.includes('stereoisomeric forms')) &&
    (text.includes('isomer') || text.includes('stereoisomeric'))
  );
}

// Preset archetypes from voidory/isomers Sketchbook adapted for exam counting questions
export const ISOMER_PROFILES: Record<string, DynamicIsomerProfile> = {
  // oh-ma4b2: cis (90°, C2v) and trans (180°, D4h)
  'oh-ma4b2': {
    id: 'oh-ma4b2',
    sketchbookCaseId: 'oh-ma4b2',
    complexFormula: '[Co(NH3)4Cl2]+ / [MX2Y4]',
    geometry: 'Octahedral',
    coordinationNumber: 6,
    archetype: '[Ma4b2]',
    totalStereoisomers: 2,
    geometricCount: 2,
    opticalPairs: 0,
    formulaDerivation: '2 geometrical isomers (cis and trans); both contain mirror planes (0 optical)',
    sketchbookInsight:
      'The two B ligands are 90° apart (cis, C2v) or 180° apart (trans, D4h). Werner\'s violet (cis) and green (trans) [CoCl2(NH3)4]+ salts were key historical evidence for the octahedral geometry.',
    sketchbookHint: 'Two B ligands: how many distinct angles can they make? (Only 90° and 180°).',
    symmetrySummary: {
      isChiral: false,
      hasMirrorPlane: true,
      hasInversionCenter: true,
      explanation: 'cis-[Ma4b2] has C2v symmetry with 2 vertical mirror planes. trans-[Ma4b2] has D4h symmetry with an inversion center (i) and horizontal mirror plane. Both are strictly achiral.'
    },
    quickRule: '[Ma4b2] forms exactly 2 geometrical isomers (cis 90° and trans 180°). Zero optical isomers.',
    isomers: [
      {
        id: 'cis',
        name: 'cis-[Ma4b2]',
        badge: 'cis (90°)',
        transPair: 'cis (90° angle between b ligands)',
        category: 'geometric',
        angleRelation: '90° adjacent angle between b ligands',
        isChiral: false,
        pointGroup: 'C2v',
        symmetryElements: '2 vertical mirror planes (σv), 1 C2 axis',
        description: 'The two b ligands occupy adjacent vertices at 90°. Two internal mirror planes bisect the complex, making it achiral and optically inactive.',
        geometry: 'Octahedral',
        centralAtom: 'M',
        ligands: [
          { label: 'b', pos: 'top', isKey: true, color: 'rose' },
          { label: 'b', pos: 'front-right', isKey: true, color: 'rose' },
          { label: 'a', pos: 'bottom', color: 'sky' },
          { label: 'a', pos: 'front-left', color: 'sky' },
          { label: 'a', pos: 'back-left', color: 'sky' },
          { label: 'a', pos: 'back-right', color: 'sky' }
        ]
      },
      {
        id: 'trans',
        name: 'trans-[Ma4b2]',
        badge: 'trans (180°)',
        transPair: 'trans-[b, b] (180° linear axial)',
        category: 'geometric',
        angleRelation: '180° linear opposite between b ligands',
        isChiral: false,
        pointGroup: 'D4h',
        symmetryElements: 'Inversion center (i), horizontal mirror plane (σh)',
        description: 'The two b ligands lie strictly trans across the metal (180°), and the four a ligands define an equatorial square plane. Possesses an inversion center.',
        geometry: 'Octahedral',
        centralAtom: 'M',
        ligands: [
          { label: 'b', pos: 'top', isKey: true, color: 'rose' },
          { label: 'b', pos: 'bottom', isKey: true, color: 'rose' },
          { label: 'a', pos: 'front-left', color: 'sky' },
          { label: 'a', pos: 'front-right', color: 'sky' },
          { label: 'a', pos: 'back-left', color: 'sky' },
          { label: 'a', pos: 'back-right', color: 'sky' }
        ]
      }
    ]
  },

  // oh-ma3b3: fac (C3v) and mer (C2v)
  'oh-ma3b3': {
    id: 'oh-ma3b3',
    sketchbookCaseId: 'oh-ma3b3',
    complexFormula: '[Cr(NO3)3(NH3)3] / [Co(NH3)3(NO2)3]',
    geometry: 'Octahedral',
    coordinationNumber: 6,
    archetype: '[Ma3b3]',
    totalStereoisomers: 2,
    geometricCount: 2,
    opticalPairs: 0,
    formulaDerivation: '2 geometrical isomers (facial and meridional); both contain mirror planes (0 optical)',
    sketchbookInsight:
      'Three identical ligands either share a triangular face (fac, C3v) or run round a meridian with two of them mutually trans (mer, C2v). Both contain mirror planes, so neither is chiral.',
    sketchbookHint: 'Three identical ligands can share a triangular face — or form a meridian T-shape.',
    symmetrySummary: {
      isChiral: false,
      hasMirrorPlane: true,
      hasInversionCenter: false,
      explanation: 'fac-[Ma3b3] possesses C3v symmetry (3 mirror planes). mer-[Ma3b3] possesses C2v symmetry (2 mirror planes). Neither can rotate plane-polarized light.'
    },
    quickRule: '[Ma3b3] forms exactly 2 geometrical isomers: fac (all 90° on one face) and mer (two trans at 180°, one cis at 90°).',
    isomers: [
      {
        id: 'fac',
        name: 'fac-[Ma3b3] (facial)',
        badge: 'fac (all 90°)',
        transPair: 'no trans pairs among like ligands (all 90°)',
        category: 'geometric',
        angleRelation: 'Three like ligands at 90° on one triangular face',
        isChiral: false,
        pointGroup: 'C3v',
        symmetryElements: '3 vertical mirror planes (σv), 1 C3 axis',
        description: 'The three b ligands occupy the corners of a single octahedral triangular face. Every b-M-b bond angle is 90°.',
        geometry: 'Octahedral',
        centralAtom: 'Cr',
        ligands: [
          { label: 'b', pos: 'top', isKey: true, color: 'rose' },
          { label: 'b', pos: 'front-left', isKey: true, color: 'rose' },
          { label: 'b', pos: 'front-right', isKey: true, color: 'rose' },
          { label: 'a', pos: 'bottom', color: 'sky' },
          { label: 'a', pos: 'back-left', color: 'sky' },
          { label: 'a', pos: 'back-right', color: 'sky' }
        ]
      },
      {
        id: 'mer',
        name: 'mer-[Ma3b3] (meridional)',
        badge: 'mer (plane arc)',
        transPair: 'one trans-[b, b] pair + one cis-b',
        category: 'geometric',
        angleRelation: 'Two like ligands trans (180°), third cis (90°)',
        isChiral: false,
        pointGroup: 'C2v',
        symmetryElements: '2 mirror planes (σv), 1 C2 axis',
        description: 'The three b ligands lie along an octahedral meridian plane: two b ligands are mutually trans (180°) while the third is cis (90°) to both.',
        geometry: 'Octahedral',
        centralAtom: 'Cr',
        ligands: [
          { label: 'b', pos: 'top', isKey: true, color: 'rose' },
          { label: 'b', pos: 'bottom', isKey: true, color: 'rose' },
          { label: 'b', pos: 'front-left', isKey: true, color: 'rose' },
          { label: 'a', pos: 'front-right', color: 'sky' },
          { label: 'a', pos: 'back-left', color: 'sky' },
          { label: 'a', pos: 'back-right', color: 'sky' }
        ]
      }
    ]
  },

  // oh-maa2b2: trans (D2h/D4h, achiral) + cis (C2, chiral pair Δ/Λ) = 3 stereoisomers
  'oh-maa2b2': {
    id: 'oh-maa2b2',
    sketchbookCaseId: 'oh-maa2b2',
    complexFormula: '[Co(en)2Cl2]+',
    geometry: 'Octahedral',
    coordinationNumber: 6,
    archetype: '[M(AA)2b2]',
    totalStereoisomers: 3,
    geometricCount: 2,
    opticalPairs: 1,
    formulaDerivation: '1 trans isomer (achiral) + 1 cis isomer (chiral, exists as Δ and Λ enantiomers) = 3 total stereoisomers',
    sketchbookInsight:
      'trans: the B-M-B axis is perpendicular to the plane holding both chelates (D2h, achiral). cis: the chelates twist into a two-bladed propeller with only a C2 axis, so it exists as Δ and Λ, giving 3 in total. Werner\'s 1911 resolution settled the octahedral model.',
    sketchbookHint: 'Remember to count both enantiomers of the cis configuration!',
    symmetrySummary: {
      isChiral: true,
      hasMirrorPlane: true,
      hasInversionCenter: true,
      explanation: 'trans-[Co(en)2Cl2]+ contains an inversion center (i) and horizontal mirror plane (achiral). cis-[Co(en)2Cl2]+ has only a C2 axis and NO mirror planes, making it chiral.'
    },
    quickRule: '[M(AA)2b2] yields exactly 3 stereoisomers: 1 achiral trans form + 2 enantiomeric cis forms (Δ and Λ).',
    isomers: [
      {
        id: 'trans',
        name: 'trans-[Co(en)2Cl2]+ (achiral)',
        badge: 'trans (achiral)',
        transPair: 'trans-[Cl, Cl] (180° opposite)',
        category: 'geometric',
        angleRelation: '180° linear opposite between Cl atoms',
        isChiral: false,
        pointGroup: 'D2h / C2h',
        symmetryElements: 'Inversion center (i), horizontal mirror plane (σh)',
        description: 'The two chloride ligands lie opposite each other (180°), with the two chelating rings lying flat in the equatorial plane. Contains an inversion center.',
        geometry: 'Octahedral',
        centralAtom: 'Co',
        ligands: [
          { label: 'Cl', pos: 'top', isKey: true, color: 'emerald' },
          { label: 'Cl', pos: 'bottom', isKey: true, color: 'emerald' },
          { label: 'N', pos: 'front-left', color: 'sky' },
          { label: 'N', pos: 'back-left', color: 'sky' },
          { label: 'N', pos: 'front-right', color: 'sky' },
          { label: 'N', pos: 'back-right', color: 'sky' }
        ],
        chelates: [
          { fromIndex: 2, toIndex: 3, label: 'en' },
          { fromIndex: 4, toIndex: 5, label: 'en' }
        ]
      },
      {
        id: 'cis-delta',
        name: 'cis-[Co(en)2Cl2]+ (Δ-enantiomer)',
        badge: 'cis-Δ (chiral)',
        transPair: 'cis-[Cl, Cl] (90° adjacent)',
        category: 'optical',
        angleRelation: '90° adjacent between Cl atoms',
        isChiral: true,
        pointGroup: 'C2',
        symmetryElements: 'Only a single C2 axis; NO mirror plane or inversion center',
        description: 'The two chloride ligands sit at 90°. The chelate rings twist into a right-handed chiral helix (Δ configuration), giving optical activity.',
        geometry: 'Octahedral',
        centralAtom: 'Co',
        ligands: [
          { label: 'Cl', pos: 'top', isKey: true, color: 'emerald' },
          { label: 'Cl', pos: 'front-right', isKey: true, color: 'emerald' },
          { label: 'N', pos: 'bottom', color: 'sky' },
          { label: 'N', pos: 'front-left', color: 'sky' },
          { label: 'N', pos: 'back-left', color: 'sky' },
          { label: 'N', pos: 'back-right', color: 'sky' }
        ],
        chelates: [
          { fromIndex: 2, toIndex: 3, label: 'en' },
          { fromIndex: 4, toIndex: 5, label: 'en' }
        ]
      },
      {
        id: 'cis-lambda',
        name: 'cis-[Co(en)2Cl2]+ (Λ-enantiomer)',
        badge: 'cis-Λ (chiral)',
        transPair: 'cis-[Cl, Cl] (mirror reflection)',
        category: 'optical',
        angleRelation: '90° adjacent between Cl atoms (mirror image)',
        isChiral: true,
        pointGroup: 'C2',
        symmetryElements: 'Non-superimposable mirror image of Δ-enantiomer',
        description: 'The non-superimposable mirror image of the Δ form with a left-handed helical twist (Λ configuration).',
        geometry: 'Octahedral',
        centralAtom: 'Co',
        ligands: [
          { label: 'Cl', pos: 'top', isKey: true, color: 'emerald' },
          { label: 'Cl', pos: 'front-left', isKey: true, color: 'emerald' },
          { label: 'N', pos: 'bottom', color: 'sky' },
          { label: 'N', pos: 'front-right', color: 'sky' },
          { label: 'N', pos: 'back-right', color: 'sky' },
          { label: 'N', pos: 'back-left', color: 'sky' }
        ],
        chelates: [
          { fromIndex: 2, toIndex: 3, label: 'en' },
          { fromIndex: 4, toIndex: 5, label: 'en' }
        ]
      }
    ]
  },

  // sp-mabcd: square planar [Mabcd] (3 geometric isomers) + linkage
  'sp-mabcd': {
    id: 'sp-mabcd',
    sketchbookCaseId: 'sp-mabcd',
    complexFormula: '[PtCl(NO2)(NO3)(SCN)]2- / [Pt(NH3)(H2O)(SCN)(NO2)]',
    geometry: 'Square Planar',
    coordinationNumber: 4,
    archetype: '[Mabcd] Square Planar',
    totalStereoisomers: 12,
    geometricCount: 3,
    opticalPairs: 0,
    linkageMultiplier: 4,
    formulaDerivation: '3 geometrical arrangements × 2 linkage (NO2) × 2 linkage (SCN) = 12 total isomers',
    sketchbookInsight:
      'Fix A. The ligand trans to A can be B, C or D; the other two take the cis sites, and flipping the square swaps them. So exactly 3 geometrical isomers. Each ambidentate ligand then doubles the possibilities: 3 × 2 × 2 = 12.',
    sketchbookHint: 'Fix A and ask: which ligand can sit trans to it? Exactly 3 choices.',
    symmetrySummary: {
      isChiral: false,
      hasMirrorPlane: true,
      hasInversionCenter: false,
      explanation: 'The molecular square plane is itself a mirror plane (σh), so square planar complexes of monodentate ligands are achiral.'
    },
    linkageAnalysis: {
      ambidentateLigand: 'NO2- and SCN-',
      modes: [
        { donor: 'N vs O', iupacName: 'nitro (κN) vs nitrito (κO)', note: '2 linkage modes for NO2-' },
        { donor: 'S vs N', iupacName: 'thiocyanato (κS) vs isothiocyanato (κN)', note: '2 linkage modes for SCN-' }
      ],
      totalCombinationsFormula: '2 modes × 2 modes = 4 linkage permutations for every geometrical arrangement'
    },
    quickRule: 'Square planar [Mabcd] forms 3 geometrical isomers. With 2 ambidentate ligands (NO2 and SCN), total count = 3 × 2 × 2 = 12 isomers.',
    isomers: [
      {
        id: 'trans-ab',
        name: 'Isomer I: a trans to b',
        badge: 'trans-(a,b)',
        transPair: 'trans-[a, b] and trans-[c, d]',
        category: 'geometric',
        angleRelation: '180° trans pairing between a and b',
        isChiral: false,
        pointGroup: 'Cs',
        symmetryElements: 'Molecular mirror plane (σh)',
        description: 'Ligand a (Cl) is trans (180°) to ligand b (NO2), while c (NO3) and d (SCN) are mutually trans.',
        geometry: 'Square Planar',
        centralAtom: 'Pt',
        ligands: [
          { label: 'Cl', pos: 'left', isKey: true, color: 'emerald' },
          { label: 'NO2', pos: 'right', isKey: true, color: 'rose' },
          { label: 'NO3', pos: 'top', color: 'sky' },
          { label: 'SCN', pos: 'bottom', color: 'amber' }
        ]
      },
      {
        id: 'trans-ac',
        name: 'Isomer II: a trans to c',
        badge: 'trans-(a,c)',
        transPair: 'trans-[a, c] and trans-[b, d]',
        category: 'geometric',
        angleRelation: '180° trans pairing between a and c',
        isChiral: false,
        pointGroup: 'Cs',
        symmetryElements: 'Molecular mirror plane (σh)',
        description: 'Ligand a (Cl) is trans (180°) to ligand c (NO3), while b (NO2) and d (SCN) are mutually trans.',
        geometry: 'Square Planar',
        centralAtom: 'Pt',
        ligands: [
          { label: 'Cl', pos: 'left', isKey: true, color: 'emerald' },
          { label: 'NO3', pos: 'right', isKey: true, color: 'sky' },
          { label: 'NO2', pos: 'top', color: 'rose' },
          { label: 'SCN', pos: 'bottom', color: 'amber' }
        ]
      },
      {
        id: 'trans-ad',
        name: 'Isomer III: a trans to d',
        badge: 'trans-(a,d)',
        transPair: 'trans-[a, d] and trans-[b, c]',
        category: 'geometric',
        angleRelation: '180° trans pairing between a and d',
        isChiral: false,
        pointGroup: 'Cs',
        symmetryElements: 'Molecular mirror plane (σh)',
        description: 'Ligand a (Cl) is trans (180°) to ligand d (SCN), while b (NO2) and c (NO3) are mutually trans.',
        geometry: 'Square Planar',
        centralAtom: 'Pt',
        ligands: [
          { label: 'Cl', pos: 'left', isKey: true, color: 'emerald' },
          { label: 'SCN', pos: 'right', isKey: true, color: 'amber' },
          { label: 'NO2', pos: 'top', color: 'rose' },
          { label: 'NO3', pos: 'bottom', color: 'sky' }
        ]
      }
    ]
  },

  // oh-ma4b2 with 2 SCN- ligands: 2 geometrical × 3 linkage = 6 isomers
  'oh-ma4b2-2scn': {
    id: 'oh-ma4b2-2scn',
    sketchbookCaseId: 'oh-ma4b2',
    complexFormula: '[Cr(SCN)2(NH3)4]4+ / [Cu(SCN)2(NH3)4]',
    geometry: 'Octahedral',
    coordinationNumber: 6,
    archetype: '[Ma4b2] with 2 Ambidentate SCN-',
    totalStereoisomers: 6,
    geometricCount: 2,
    opticalPairs: 0,
    linkageMultiplier: 3,
    formulaDerivation: '2 geometrical (cis and trans) × 3 linkage combinations (S/S, S/N, N/N) = 6 total isomers',
    sketchbookInsight:
      'The parent [Ma4b2] geometry provides 2 arrangements: cis (90°) and trans (180°). For two identical ambidentate thiocyanate ligands, the linkage combinations are (S,S), (S,N), and (N,N) = 3 modes. Total = 2 × 3 = 6 isomers, the highest among simple octahedral complexes.',
    sketchbookHint: 'Multiply geometric arrangements (2) by unique linkage pairs (3) = 6.',
    symmetrySummary: {
      isChiral: false,
      hasMirrorPlane: true,
      hasInversionCenter: true,
      explanation: 'Both cis and trans geometries possess internal mirror planes of symmetry, so none of the 6 isomers are optically active.'
    },
    linkageAnalysis: {
      ambidentateLigand: 'SCN- (thiocyanate)',
      modes: [
        { donor: 'S-bound', iupacName: 'thiocyanato-κS', note: 'Linear M-S-C-N' },
        { donor: 'N-bound', iupacName: 'isothiocyanato-κN', note: 'Nearly linear M-N=C=S' }
      ],
      totalCombinationsFormula: 'Two identical SCN- ligands: (1) S,S ; (2) S,N ; (3) N,N => 3 unique combinations'
    },
    quickRule: '[Cr(SCN)2(NH3)4] yields 6 isomers: 2 geometrical (cis/trans) × 3 linkage combinations (S/S, S/N, N/N).',
    isomers: [
      {
        id: 'cis-SS',
        name: 'cis-[Cr(SCN)2(NH3)4] (S,S linkage)',
        badge: 'cis (S,S)',
        transPair: 'cis (90° between S-CN ligands)',
        category: 'linkage',
        angleRelation: '90° adjacent, both coordinated through Sulfur',
        isChiral: false,
        pointGroup: 'C2v',
        symmetryElements: '2 vertical mirror planes',
        description: 'Both SCN- ligands are adjacent at 90° and coordinate via Sulfur.',
        geometry: 'Octahedral',
        centralAtom: 'Cr',
        ligands: [
          { label: 'S-CN', pos: 'top', isKey: true, color: 'amber' },
          { label: 'S-CN', pos: 'front-right', isKey: true, color: 'amber' },
          { label: 'NH3', pos: 'bottom', color: 'sky' },
          { label: 'NH3', pos: 'front-left', color: 'sky' },
          { label: 'NH3', pos: 'back-left', color: 'sky' },
          { label: 'NH3', pos: 'back-right', color: 'sky' }
        ]
      },
      {
        id: 'cis-SN',
        name: 'cis-[Cr(SCN)(NCS)(NH3)4] (S,N linkage)',
        badge: 'cis (S,N)',
        transPair: 'cis (90° between S-CN and N-CS)',
        category: 'linkage',
        angleRelation: '90° adjacent, one S-bound and one N-bound',
        isChiral: false,
        pointGroup: 'Cs',
        symmetryElements: '1 mirror plane',
        description: 'Adjacent SCN- ligands with mixed coordination: one via Sulfur, one via Nitrogen.',
        geometry: 'Octahedral',
        centralAtom: 'Cr',
        ligands: [
          { label: 'S-CN', pos: 'top', isKey: true, color: 'amber' },
          { label: 'N-CS', pos: 'front-right', isKey: true, color: 'purple' },
          { label: 'NH3', pos: 'bottom', color: 'sky' },
          { label: 'NH3', pos: 'front-left', color: 'sky' },
          { label: 'NH3', pos: 'back-left', color: 'sky' },
          { label: 'NH3', pos: 'back-right', color: 'sky' }
        ]
      },
      {
        id: 'trans-SS',
        name: 'trans-[Cr(SCN)2(NH3)4] (S,S linkage)',
        badge: 'trans (S,S)',
        transPair: 'trans-[S-CN, S-CN] (180° linear)',
        category: 'linkage',
        angleRelation: '180° opposite axial, both coordinated through Sulfur',
        isChiral: false,
        pointGroup: 'D4h',
        symmetryElements: 'Inversion center (i), horizontal mirror plane',
        description: 'Both SCN- ligands occupy axial opposite positions (180°) and coordinate via Sulfur.',
        geometry: 'Octahedral',
        centralAtom: 'Cr',
        ligands: [
          { label: 'S-CN', pos: 'top', isKey: true, color: 'amber' },
          { label: 'S-CN', pos: 'bottom', isKey: true, color: 'amber' },
          { label: 'NH3', pos: 'front-left', color: 'sky' },
          { label: 'NH3', pos: 'front-right', color: 'sky' },
          { label: 'NH3', pos: 'back-left', color: 'sky' },
          { label: 'NH3', pos: 'back-right', color: 'sky' }
        ]
      }
    ]
  },

  // td-maa2: tetrahedral with symmetric bidentate [M(A-A)2] -> 1 isomer (achiral, D2d)
  'td-maa2': {
    id: 'td-maa2',
    sketchbookCaseId: 'td-mab2',
    complexFormula: '[M(A-A)2] (Tetrahedral)',
    geometry: 'Tetrahedral',
    coordinationNumber: 4,
    archetype: '[M(A-A)2] Tetrahedral',
    totalStereoisomers: 1,
    geometricCount: 1,
    opticalPairs: 0,
    formulaDerivation: 'Tetrahedral geometry cannot form cis/trans isomers; symmetric chelates possess D2d symmetry (contains S4 improper axis) => 1 isomer only',
    sketchbookInsight:
      'Each chelate spans one tetrahedral edge; the two chelate edges are mutually perpendicular. With symmetric AA chelates this has D2d symmetry (mirror planes and an S4 axis, so strictly achiral). Therefore exactly 1 isomer exists.',
    sketchbookHint: 'Tetrahedral chelates have no cis/trans. Check if the S4 improper axis is present (it is for AA, giving 1 achiral isomer).',
    symmetrySummary: {
      isChiral: false,
      hasMirrorPlane: true,
      hasInversionCenter: false,
      explanation: 'Possesses D2d point group symmetry. Contains an improper axis of rotation (S4) and two dihedral mirror planes (σd), preventing chirality.'
    },
    quickRule: 'Tetrahedral [M(A-A)2] with symmetric chelates forms only 1 isomer (achiral due to D2d symmetry).',
    isomers: [
      {
        id: 'td-single',
        name: '[M(A-A)2] (Achiral)',
        badge: 'Single Isomer (D2d)',
        transPair: 'Perpendicular bis-chelate rings',
        category: 'geometric',
        angleRelation: '109.5° tetrahedral angles with mutually perpendicular chelate rings',
        isChiral: false,
        pointGroup: 'D2d',
        symmetryElements: '1 S4 improper rotation axis, 2 dihedral mirror planes (σd), 3 C2 axes',
        description: 'The two symmetrical bidentate chelates occupy mutually perpendicular tetrahedral planes. Contains an S4 improper axis, so it is strictly achiral.',
        geometry: 'Tetrahedral',
        centralAtom: 'M',
        ligands: [
          { label: 'A', pos: 'top', color: 'sky' },
          { label: 'A', pos: 'bottom', color: 'sky' },
          { label: 'A', pos: 'left', color: 'rose' },
          { label: 'A', pos: 'right', color: 'rose' }
        ],
        chelates: [
          { fromIndex: 0, toIndex: 1, label: 'A-A' },
          { fromIndex: 2, toIndex: 3, label: 'A-A' }
        ]
      }
    ]
  },

  // oh-mab3: octahedral tris(unsymmetrical chelate) e.g. [M(gly)3] -> 2 geometrical, 4 stereoisomers
  'oh-mab3': {
    id: 'oh-mab3',
    sketchbookCaseId: 'oh-maa3',
    complexFormula: '[Co(gly)3] / [M(A-B)3]',
    geometry: 'Octahedral',
    coordinationNumber: 6,
    archetype: '[M(A-B)3]',
    totalStereoisomers: 4,
    geometricCount: 2,
    opticalPairs: 2,
    formulaDerivation: '2 geometrical isomers (fac and mer), each chiral (Δ and Λ pairs) = 2 × 2 = 4 total stereoisomers',
    sketchbookInsight:
      'Unsymmetrical bidentate ligands (like glycinate with N and O donors) form 2 geometrical isomers: facial (three like donors on one triangular face) and meridional (two like donors mutually trans). Because the donors are different, both fac (C3) and mer (C1) lack mirror planes, making all four isomers chiral!',
    sketchbookHint: '2 geometrical forms (fac and mer), each having a non-superimposable mirror image (2 × 2 = 4).',
    symmetrySummary: {
      isChiral: true,
      hasMirrorPlane: false,
      hasInversionCenter: false,
      explanation: 'Both the fac (C3 point group) and mer (C1 point group) isomers lack any improper rotation axis or mirror plane, so both exist as enantiomeric pairs.'
    },
    quickRule: '[M(A-B)3] gives 2 geometrical isomers (fac and mer) and 4 total stereoisomers (2 chiral enantiomeric pairs).',
    isomers: [
      {
        id: 'fac-enantiomers',
        name: 'fac-[M(A-B)3] (chiral pair)',
        badge: 'fac (2 isomers: Δ & Λ)',
        transPair: 'no trans pairs among like donor atoms (all 90°)',
        category: 'geometric',
        angleRelation: 'Three identical donor atoms occupy one octahedral face',
        isChiral: true,
        pointGroup: 'C3 (chiral)',
        symmetryElements: 'Only a C3 axis; NO mirror planes or inversion center',
        description: 'The three N donors occupy one triangular face and the three O donors occupy the opposite face. Because the chelate is unsymmetrical, fac is chiral.',
        geometry: 'Octahedral',
        centralAtom: 'M',
        ligands: [
          { label: 'N', pos: 'top', color: 'sky' },
          { label: 'N', pos: 'front-left', color: 'sky' },
          { label: 'N', pos: 'front-right', color: 'sky' },
          { label: 'O', pos: 'bottom', color: 'rose' },
          { label: 'O', pos: 'back-left', color: 'rose' },
          { label: 'O', pos: 'back-right', color: 'rose' }
        ],
        chelates: [
          { fromIndex: 0, toIndex: 4, label: 'gly' },
          { fromIndex: 1, toIndex: 5, label: 'gly' },
          { fromIndex: 2, toIndex: 3, label: 'gly' }
        ]
      },
      {
        id: 'mer-enantiomers',
        name: 'mer-[M(A-B)3] (chiral pair)',
        badge: 'mer (2 isomers: Δ & Λ)',
        transPair: 'one trans-[N, N] pair across center',
        category: 'geometric',
        angleRelation: 'Two like donor atoms are trans (180°), third is cis (90°)',
        isChiral: true,
        pointGroup: 'C1 (completely asymmetric)',
        symmetryElements: 'Identity element E only; completely asymmetric',
        description: 'The donor atoms lie in a meridional arc with two N atoms trans to each other. With zero symmetry elements, mer forms an enantiomeric pair.',
        geometry: 'Octahedral',
        centralAtom: 'M',
        ligands: [
          { label: 'N', pos: 'top', color: 'sky' },
          { label: 'N', pos: 'bottom', color: 'sky' },
          { label: 'N', pos: 'front-left', color: 'sky' },
          { label: 'O', pos: 'front-right', color: 'rose' },
          { label: 'O', pos: 'back-left', color: 'rose' },
          { label: 'O', pos: 'back-right', color: 'rose' }
        ],
        chelates: [
          { fromIndex: 0, toIndex: 3, label: 'gly' },
          { fromIndex: 1, toIndex: 4, label: 'gly' },
          { fromIndex: 2, toIndex: 5, label: 'gly' }
        ]
      }
    ]
  },

  // sp-en-scn: [Pt(en)(NO3)(SCN)] -> 2 isomers (linkage only)
  'sp-en-scn': {
    id: 'sp-en-scn',
    sketchbookCaseId: 'sp-mab2',
    complexFormula: '[Pt(en)(NO3)(SCN)]',
    geometry: 'Square Planar',
    coordinationNumber: 4,
    archetype: '[M(AA)bc] Square Planar',
    totalStereoisomers: 2,
    geometricCount: 1,
    opticalPairs: 0,
    linkageMultiplier: 2,
    formulaDerivation: 'Chelating en can ONLY span adjacent cis positions (0 geometrical isomers) × 2 linkage modes of SCN- = 2 total isomers',
    sketchbookInsight:
      'Ethylenediamine cannot span 180° across a square planar metal without breaking its bite angle. It is locked into adjacent cis positions, eliminating geometrical isomers. The ambidentate SCN- ligand coordinates via S or N, giving exactly 2 linkage isomers.',
    sketchbookHint: 'Bidentate en cannot span trans (180°). Only the ambidentate SCN- generates isomers.',
    symmetrySummary: {
      isChiral: false,
      hasMirrorPlane: true,
      hasInversionCenter: false,
      explanation: 'The molecular square plane provides a mirror plane of symmetry, so neither isomer is chiral.'
    },
    quickRule: 'Chelating en prevents geometrical isomers in square planar complexes; only the ambidentate SCN- gives 2 linkage isomers.',
    isomers: [
      {
        id: 'pt-scn',
        name: '[Pt(en)(NO3)(SCN)] (S-bound)',
        badge: 'κS linkage',
        transPair: 'cis en chelate, S-bound SCN',
        category: 'linkage',
        angleRelation: 'Square planar with cis en chelate',
        isChiral: false,
        pointGroup: 'Cs',
        symmetryElements: 'Molecular mirror plane',
        description: 'Square planar Pt(II) complex with chelating en occupying adjacent cis sites, coordinated through Sulfur of SCN-.',
        geometry: 'Square Planar',
        centralAtom: 'Pt',
        ligands: [
          { label: 'N', pos: 'top', color: 'sky' },
          { label: 'N', pos: 'left', color: 'sky' },
          { label: 'NO3', pos: 'bottom', color: 'purple' },
          { label: 'S-CN', pos: 'right', isKey: true, color: 'amber' }
        ],
        chelates: [
          { fromIndex: 0, toIndex: 1, label: 'en' }
        ]
      },
      {
        id: 'pt-ncs',
        name: '[Pt(en)(NO3)(NCS)] (N-bound)',
        badge: 'κN linkage',
        transPair: 'cis en chelate, N-bound NCS',
        category: 'linkage',
        angleRelation: 'Square planar with cis en chelate',
        isChiral: false,
        pointGroup: 'Cs',
        symmetryElements: 'Molecular mirror plane',
        description: 'Linkage isomer where thiocyanate coordinates through Nitrogen instead of Sulfur.',
        geometry: 'Square Planar',
        centralAtom: 'Pt',
        ligands: [
          { label: 'N', pos: 'top', color: 'sky' },
          { label: 'N', pos: 'left', color: 'sky' },
          { label: 'NO3', pos: 'bottom', color: 'purple' },
          { label: 'N-CS', pos: 'right', isKey: true, color: 'emerald' }
        ],
        chelates: [
          { fromIndex: 0, toIndex: 1, label: 'en' }
        ]
      }
    ]
  },

  // oh-ma4bc: [M(NO2)(SCN)(NH3)4] -> 2 geometrical × 2 × 2 = 8 isomers
  'oh-ma4bc': {
    id: 'oh-ma4bc',
    sketchbookCaseId: 'oh-ma4b2',
    complexFormula: '[M(NO2)(SCN)(NH3)4]',
    geometry: 'Octahedral',
    coordinationNumber: 6,
    archetype: '[Ma4bc] Octahedral',
    totalStereoisomers: 8,
    geometricCount: 2,
    opticalPairs: 0,
    linkageMultiplier: 4,
    formulaDerivation: '2 geometrical (cis and trans) × 2 linkage (NO2) × 2 linkage (SCN) = 8 total isomers',
    sketchbookInsight:
      'The parent [Ma4bc] geometry gives 2 geometrical isomers: cis (b and c at 90°) and trans (b and c at 180°). Both NO2- and SCN- are distinct ambidentate ligands with 2 modes each: 2 × 2 × 2 = 8 distinct isomers.',
    sketchbookHint: '2 geometrical arrangements × 2 (NO2) × 2 (SCN) = 8.',
    symmetrySummary: {
      isChiral: false,
      hasMirrorPlane: true,
      hasInversionCenter: false,
      explanation: 'cis-[Ma4bc] has Cs symmetry (1 mirror plane) and trans-[Ma4bc] has C4v symmetry (4 mirror planes). Both are achiral.'
    },
    quickRule: '[M(NO2)(SCN)(NH3)4] yields 8 isomers: 2 geometrical (cis/trans) × 2 (NO2) × 2 (SCN).',
    isomers: [
      {
        id: 'cis-bc',
        name: 'cis-[M(NO2)(SCN)(NH3)4]',
        badge: 'cis (90°)',
        transPair: 'cis (90° between NO2 and SCN)',
        category: 'geometric',
        angleRelation: '90° adjacent angle between NO2 and SCN',
        isChiral: false,
        pointGroup: 'Cs',
        symmetryElements: '1 mirror plane',
        description: 'The NO2 and SCN ligands occupy adjacent cis vertices at 90° to each other.',
        geometry: 'Octahedral',
        centralAtom: 'M',
        ligands: [
          { label: 'NO2', pos: 'top', isKey: true, color: 'rose' },
          { label: 'SCN', pos: 'front-right', isKey: true, color: 'amber' },
          { label: 'NH3', pos: 'bottom', color: 'sky' },
          { label: 'NH3', pos: 'front-left', color: 'sky' },
          { label: 'NH3', pos: 'back-left', color: 'sky' },
          { label: 'NH3', pos: 'back-right', color: 'sky' }
        ]
      },
      {
        id: 'trans-bc',
        name: 'trans-[M(NO2)(SCN)(NH3)4]',
        badge: 'trans (180°)',
        transPair: 'trans-[NO2, SCN] (180° opposite)',
        category: 'geometric',
        angleRelation: '180° opposite axial between NO2 and SCN',
        isChiral: false,
        pointGroup: 'C4v',
        symmetryElements: '4 vertical mirror planes',
        description: 'The NO2 and SCN ligands occupy opposite axial vertices at 180° across the metal.',
        geometry: 'Octahedral',
        centralAtom: 'M',
        ligands: [
          { label: 'NO2', pos: 'top', isKey: true, color: 'rose' },
          { label: 'SCN', pos: 'bottom', isKey: true, color: 'amber' },
          { label: 'NH3', pos: 'front-left', color: 'sky' },
          { label: 'NH3', pos: 'front-right', color: 'sky' },
          { label: 'NH3', pos: 'back-left', color: 'sky' },
          { label: 'NH3', pos: 'back-right', color: 'sky' }
        ]
      }
    ]
  },

  // structural-co3: [Co(NH3)5CO3]Cl -> 2 structural/ionization isomers
  'structural-co3': {
    id: 'structural-co3',
    sketchbookCaseId: 'oh-ma4b2',
    complexFormula: '[Co(NH3)5CO3]Cl',
    geometry: 'Octahedral',
    coordinationNumber: 6,
    archetype: 'Ionization Isomer Pair',
    totalStereoisomers: 2,
    geometricCount: 1,
    opticalPairs: 0,
    formulaDerivation: '2 structural isomers: [Co(NH3)5CO3]Cl (outer Cl-) and [Co(NH3)5Cl]CO3 (outer CO3^2-)',
    sketchbookInsight:
      'Ionization isomers differ in which anion is coordinated inside the bracket vs free as a counterion outside. Exchanging the inner monodentate CO3^2- with the outer Cl- gives exactly 2 structural isomers.',
    sketchbookHint: 'Exchange inner carbonato with outer chloride.',
    symmetrySummary: {
      isChiral: false,
      hasMirrorPlane: true,
      hasInversionCenter: false,
      explanation: 'Both complexes have C4v symmetry and are achiral.'
    },
    quickRule: '[Co(NH3)5CO3]Cl forms 2 structural isomers via inner/outer sphere exchange.',
    isomers: [
      {
        id: 'co3-inner',
        name: '[Co(NH3)5CO3]Cl',
        badge: 'Outer Cl-',
        transPair: 'Monodentate CO3 coordinated inside',
        category: 'ionization',
        angleRelation: 'Octahedral [Co(NH3)5CO3]+',
        isChiral: false,
        pointGroup: 'C4v',
        symmetryElements: '4 vertical mirror planes',
        description: 'Carbonato is coordinated inside the sphere; chloride is the outer counterion.',
        geometry: 'Octahedral',
        centralAtom: 'Co',
        ligands: [
          { label: 'CO3', pos: 'top', isKey: true, color: 'amber' },
          { label: 'NH3', pos: 'bottom', color: 'sky' },
          { label: 'NH3', pos: 'front-left', color: 'sky' },
          { label: 'NH3', pos: 'front-right', color: 'sky' },
          { label: 'NH3', pos: 'back-left', color: 'sky' },
          { label: 'NH3', pos: 'back-right', color: 'sky' }
        ]
      },
      {
        id: 'cl-inner',
        name: '[Co(NH3)5Cl]CO3',
        badge: 'Outer CO3^2-',
        transPair: 'Chloride coordinated inside',
        category: 'ionization',
        angleRelation: 'Octahedral [Co(NH3)5Cl]2+',
        isChiral: false,
        pointGroup: 'C4v',
        symmetryElements: '4 vertical mirror planes',
        description: 'Chloride is coordinated inside the sphere; carbonate is the outer counterion.',
        geometry: 'Octahedral',
        centralAtom: 'Co',
        ligands: [
          { label: 'Cl', pos: 'top', isKey: true, color: 'emerald' },
          { label: 'NH3', pos: 'bottom', color: 'sky' },
          { label: 'NH3', pos: 'front-left', color: 'sky' },
          { label: 'NH3', pos: 'front-right', color: 'sky' },
          { label: 'NH3', pos: 'back-left', color: 'sky' },
          { label: 'NH3', pos: 'back-right', color: 'sky' }
        ]
      }
    ]
  }
};

// Direct mapping of the 16 counting question IDs to their dynamic profile
export const QUESTION_ISOMER_COUNT_MAP: Record<string, string> = {
  'AY21_22_Q11': 'oh-ma4b2-2scn',
  'AY21_22_Q13': 'sp-mabcd',
  'AY21_22_Q17': 'oh-ma3b3',
  'AY21_22_Q20': 'oh-ma4b2',
  'AY22_23_Q01': 'oh-maa2b2',
  'AY22_23_Q06': 'td-maa2',
  'AY22_23_Q13': 'oh-ma4b2-2scn',
  'AY23_24_Q03': 'structural-co3',
  'AY23_24_Q11': 'oh-ma4b2',
  'AY23_24_Q13': 'oh-ma4bc',
  'AY23_24_Q15': 'oh-mab3',
  'AY24_25_Q05': 'sp-mabcd',
  'AY24_25_Q08': 'oh-ma4b2-2scn',
  'AY25_26_Q05': 'sp-en-scn',
  'AY25_26_Q07': 'oh-mab3',
  'AY25_26_Q08': 'oh-ma4b2-2scn'
};

/**
 * Returns dynamic isomer profile ONLY for questions explicitly about isomer counts.
 * Returns null for all other questions.
 */
export function getIsomerProfileForQuestion(
  questionId: string,
  questionText?: string
): DynamicIsomerProfile | null {
  // CRITICAL RULE: If not explicitly asking about isomer counts, return null immediately!
  if (!isIsomerCountQuestion(questionId, questionText)) {
    return null;
  }

  const profileKey = QUESTION_ISOMER_COUNT_MAP[questionId];
  if (profileKey && ISOMER_PROFILES[profileKey]) {
    return ISOMER_PROFILES[profileKey];
  }

  // Fallback for counting questions matching formulas
  if (questionText) {
    const lower = questionText.toLowerCase();
    if (lower.includes('glycinato') || lower.includes('[m(a-b)3]')) return ISOMER_PROFILES['oh-mab3'];
    if (lower.includes('[m(aa)2b2]') || lower.includes('[co(en)2cl2]')) return ISOMER_PROFILES['oh-maa2b2'];
    if (lower.includes('mabcd') || (lower.includes('square planar') && lower.includes('pt'))) return ISOMER_PROFILES['sp-mabcd'];
    if (lower.includes('scn') && (lower.includes('most') || lower.includes('highest') || lower.includes('how many'))) return ISOMER_PROFILES['oh-ma4b2-2scn'];
    if (lower.includes('tetrahedral') && lower.includes('m(a-a)2')) return ISOMER_PROFILES['td-maa2'];
    if (lower.includes('[mx2y4]') || lower.includes('ma4b2')) return ISOMER_PROFILES['oh-ma4b2'];
    if (lower.includes('ma3b3')) return ISOMER_PROFILES['oh-ma3b3'];
  }

  return null;
}
