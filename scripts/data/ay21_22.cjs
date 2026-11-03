// AY21/22 Mid-term Test Paper (40 questions)
// ANS: AAADACAADADDADBDBAADDCCDAC(B/D)B(A/B)DBCCDCCABDA

const fs = require('fs');
let q16ImageBase64 = '';
try {
  const imgBuf = fs.readFileSync('public/assets/ay21_22_q16.png');
  q16ImageBase64 = 'data:image/png;base64,' + imgBuf.toString('base64');
} catch (e) {
  // fallback if read fails during build
}

module.exports = [
  {
    id: 'AY21_22_Q01',
    academicYear: 'AY21/22',
    originalQNum: 1,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 2,
    questionText: 'Which of the following is not a coordination compound?',
    options: {
      A: 'Urea',
      B: 'Haemoglobin',
      C: 'Chlorophyll II',
      D: 'Cobalt(III) ammines'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Nomenclature & Formulas',
    secondaryTags: ['Coordination Definitions', 'Bioinorganic'],
    explanation: 'Generated explanation; not an official solution. Urea, (NH2)2CO, is a simple organic diamide consisting solely of main-group elements without a central metal coordination center. In contrast, haemoglobin contains an iron porphyrin complex, chlorophyll contains magnesium, and cobalt(III) ammines are classic Werner coordination complexes.',
    notes: 'Urea is an organic diamide, not a metal coordination compound.'
  },
  {
    id: 'AY21_22_Q02',
    academicYear: 'AY21/22',
    originalQNum: 2,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 2,
    questionText: 'The number of chlorine atoms acting as ligands in the complex [Co(en)2(H2)Cl]Cl2 is:',
    options: {
      A: '1',
      B: '3',
      C: '2',
      D: 'None of these'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Nomenclature & Formulas',
    secondaryTags: ['Coordination Sphere', 'Inner vs Outer Sphere'],
    explanation: 'Generated explanation; not an official solution. Ligands reside within the inner coordination sphere enclosed by the square brackets. In [Co(en)2(H2)Cl]Cl2, only 1 chlorine atom is inside the brackets acting as a chlorido ligand, while the 2 chloride atoms outside serve as counteranions.',
    notes: 'Only the single Cl atom inside the square brackets acts as an inner-sphere ligand.'
  },
  {
    id: 'AY21_22_Q03',
    academicYear: 'AY21/22',
    originalQNum: 3,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 2,
    questionText: 'Consider the complex [Co(NH3)5CO3]ClO4, in which coordination number, oxidation number, and the number of d-electrons on the metal are respectively?',
    options: {
      A: '6, 3, 6',
      B: '6, 2, 7',
      C: '5, 3, 6',
      D: '5, 3, 7'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Nomenclature & Formulas',
    secondaryTags: ['Coordination Number', 'Oxidation State', 'd-Electrons'],
    explanation: 'Generated explanation; not an official solution. In [Co(NH3)5(CO3)]ClO4, the cobalt center is coordinated to five monodentate NH3 ligands and one monodentate carbonato ligand, giving a coordination number of 6. Balancing charges with perchlorate (ClO4-) and carbonato (CO3 2-) gives Co3+ (x - 2 = +1 => x = +3). Neutral cobalt is [Ar] 4s2 3d7, so Co3+ has 6 d-electrons ([Ar] 3d6).',
    notes: 'Coordination number = 6; Co(III) oxidation state; d6 configuration.'
  },
  {
    id: 'AY21_22_Q04',
    academicYear: 'AY21/22',
    originalQNum: 4,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 2,
    questionText: 'Which of the following compound shows both linkage and ionization isomerism?',
    options: {
      A: '[Co(NH3)5NO2](NO2)',
      B: '[Co(NO2)(py)2(NH3)2]NO2',
      C: '[Co(NH3)6]Cl2',
      D: '[Co(NO2)Br(NH3)4]Cl'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Linkage Isomerism', 'Ionization Isomerism'],
    explanation: 'Generated explanation; not an official solution. [Co(NO2)Br(NH3)4]Cl contains the ambidentate NO2- ligand capable of binding via N (nitro) or O (nitrito), conferring linkage isomerism. It also possesses different anions inside and outside the sphere (inner Br-, outer Cl-), allowing ion exchange to yield the ionization isomer [Co(NO2)Cl(NH3)4]Br.',
    notes: 'Shows linkage isomerism via NO2/ONO and ionization isomerism via Br-/Cl- exchange.'
  },
  {
    id: 'AY21_22_Q05',
    academicYear: 'AY21/22',
    originalQNum: 5,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 2,
    questionText: 'The complex [Co(NH3)5Br]SO4 will give white precipitate with:',
    options: {
      A: 'PbCl2',
      B: 'AgNO3',
      C: 'KI',
      D: 'None'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Nomenclature & Formulas',
    secondaryTags: ['Precipitation Test', 'Sulfate Counterion'],
    explanation: 'Generated explanation; not an official solution. In [Co(NH3)5Br]SO4, sulfate (SO4 2-) is the free counteranion in solution. When treated with a lead(II) salt like PbCl2, Pb2+ reacts with free SO4 2- to precipitate insoluble white lead(II) sulfate (PbSO4). Silver nitrate does not precipitate because bromide is coordinated inside the inner sphere.',
    notes: 'Free sulfate precipitates with Pb2+ as insoluble white PbSO4.'
  },
  {
    id: 'AY21_22_Q06',
    academicYear: 'AY21/22',
    originalQNum: 6,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 2,
    questionText: 'The name of the coordination compound [Cu(NH3)4](NO3)2 is:',
    options: {
      A: 'cuprammonium nitrate',
      B: 'tetraammine copper(II) dinitrate',
      C: 'tetraamminecopper(II) nitrate',
      D: 'tetraammine copper(III) dinitrate'
    },
    acceptedAnswers: ['C'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Nomenclature & Formulas',
    secondaryTags: ['IUPAC Naming', 'Ammine Complex'],
    explanation: 'Generated explanation; not an official solution. Under IUPAC rules, the complex cation [Cu(NH3)4]2+ is named without a space as tetraamminecopper(II), followed by the counteranion "nitrate" without any Greek multiplying prefix ("dinitrate"), making tetraamminecopper(II) nitrate the correct systematic name.',
    notes: 'No multiplying prefix on counterion nitrate; no space within complex cation name.'
  },
  {
    id: 'AY21_22_Q07',
    academicYear: 'AY21/22',
    originalQNum: 7,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 2,
    questionText: 'The name of [Fe(CN)2(CH3NH2)2] is:',
    options: {
      A: 'dicyanobis(methylamine)iron(II)',
      B: 'dicyanodimethylamineiron(II)',
      C: 'dicyanodimethylamineiron(IV)',
      D: 'dimethylaminedicyanoiron(II)'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Nomenclature & Formulas',
    secondaryTags: ['IUPAC Naming', 'Bis Prefix', 'Methylamine'],
    explanation: 'Generated explanation; not an official solution. The neutral ligand CH3NH2 is methylamine. In IUPAC naming, ligands with compound names use the multiplicative prefix "bis-", and anionic ligands are named first (dicyano). The iron atom is in the +2 oxidation state, yielding dicyanobis(methylamine)iron(II).',
    notes: 'Multiplicative prefix bis- is required for the substituted amine ligand methylamine.'
  },
  {
    id: 'AY21_22_Q08',
    academicYear: 'AY21/22',
    originalQNum: 8,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 2,
    questionText: 'The name of [Pt(NH3)4Cl2][PtCl4] is:',
    options: {
      A: 'tetraamminedichloroplatinum(IV) tetrachloroplatinate(II)',
      B: 'dichlorotetraammineplatinum(IV) tetrachloroplatinate(II)',
      C: 'tetrachloroplatinum(II) tetraammineplatinate(IV)',
      D: 'tetrachloroplatinum(II) dichlorotetraammineplatinate(IV)'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Nomenclature & Formulas',
    secondaryTags: ['IUPAC Naming', 'Coordination Salt', 'Alphabetical Order'],
    explanation: 'Generated explanation; not an official solution. In the cation [Pt(NH3)4Cl2]2+, ligands are listed alphabetically: "ammine" precedes "dichloro", and Pt is in the +4 oxidation state. In the anion [PtCl4]2-, Pt is in the +2 state and named tetrachloroplatinate(II). Naming the cation first gives tetraamminedichloroplatinum(IV) tetrachloroplatinate(II).',
    notes: 'Ligands arranged alphabetically: tetraammine before dichloro; cation named before anion.'
  },
  {
    id: 'AY21_22_Q09',
    academicYear: 'AY21/22',
    originalQNum: 9,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 3,
    questionText: 'Which of the following coordination complexes is most stable?',
    options: {
      A: '[Ni(NH3)6]2+',
      B: 'NiCl2',
      C: '[Ni(H2O)6]2+',
      D: '[NiEDTA]2-'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Stability & Thermodynamics',
    secondaryTags: ['EDTA Chelate Effect', 'Thermodynamic Stability'],
    explanation: 'Generated explanation; not an official solution. Ethylenediaminetetraacetate (EDTA4-) is a hexadentate chelating ligand that wraps around the metal center forming five fused five-membered chelate rings. The massive entropic gain upon displacing six monodentate water molecules confers extraordinary thermodynamic stability (log Kf ≈ 18.6) to [NiEDTA]2-.',
    notes: 'Hexadentate EDTA chelate effect produces the highest thermodynamic stability constant.'
  },
  {
    id: 'AY21_22_Q10',
    academicYear: 'AY21/22',
    originalQNum: 10,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 3,
    questionText: 'SCN- has two possible donor atoms. It is a/an',
    options: {
      A: 'monodentate ligand',
      B: 'bidentate ligand',
      C: 'tridentate ligand',
      D: 'tetradentate ligand'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Nomenclature & Formulas',
    secondaryTags: ['Ambidentate Ligand', 'Denticity'],
    explanation: 'Generated explanation; not an official solution. Although the thiocyanate ion (SCN-) possesses two potential donor atoms (sulfur and nitrogen), geometric constraints prevent it from binding simultaneously to the same metal center. It coordinates through only one donor atom at a time, classifying it as a monodentate (specifically ambidentate) ligand.',
    notes: 'SCN- binds via either S or N, but only one at a time, making it monodentate.'
  },
  {
    id: 'AY21_22_Q11',
    academicYear: 'AY21/22',
    originalQNum: 11,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 3,
    questionText: 'Which of the following gives the most number of isomers?',
    options: {
      A: '[Co(NH3)4Cl2]',
      B: 'Ni(en)(NH3)4]2+',
      C: '[Ni(C2O4)(en)2]',
      D: '[Cr(SCN)2(NH3)4]4+'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Isomer Counting', 'Linkage Combinations'],
    explanation: 'Generated explanation; not an official solution. [Cr(SCN)2(NH3)4]4+ has cis and trans geometrical isomers, and each geometry can have three distinct linkage combinations for the two ambidentate thiocyanate ligands: (-SCN,-SCN), (-SCN,-NCS), and (-NCS,-NCS), producing 6 distinct isomers, the highest among the choices.',
    notes: '2 geometrical arrangements x 3 linkage combinations = 6 isomers.'
  },
  {
    id: 'AY21_22_Q12',
    academicYear: 'AY21/22',
    originalQNum: 12,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 3,
    questionText: '[Co(NH3)4(NO2)2]Cl exhibits:',
    options: {
      A: 'ionization, geometrical and optical isomerisms',
      B: 'linkage, geometrical and optical isomerisms',
      C: 'linkage, ionization and optical isomerisms',
      D: 'linkage, geometrical and ionization isomerisms'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Isomerism Types', 'Achiral Octahedral'],
    explanation: 'Generated explanation; not an official solution. This complex shows linkage isomerism (NO2/ONO), geometrical isomerism (cis and trans [Ma4b2]), and ionization isomerism (exchange of inner NO2- with outer Cl- to give [Co(NH3)4Cl(NO2)]NO2). Because both cis and trans [Ma4b2] have mirror planes of symmetry, optical isomerism is absent, making D correct.',
    notes: 'Optical isomerism is impossible for [Ma4b2] complexes because both cis and trans isomers have planes of symmetry.'
  },
  {
    id: 'AY21_22_Q13',
    academicYear: 'AY21/22',
    originalQNum: 13,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 3,
    questionText: 'The total number of possible isomers for the square planar [PtCl(NO2)(NO3)(SCN)]2- is:',
    options: {
      A: '12',
      B: '8',
      C: '16',
      D: '24'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Square Planar', 'Isomer Multiplicity'],
    explanation: 'Generated explanation; not an official solution. A square planar complex with four different monodentate ligands [Mabcd] forms exactly 3 geometrical isomers. Among the four ligands, NO2- has 2 linkage modes (N, O) and SCN- has 2 linkage modes (S, N). Multiplying 3 geometrical arrangements by 2 (NO2) and 2 (SCN) gives 3 x 2 x 2 = 12 total isomers.',
    notes: '3 geometrical isomers x 2 linkage (NO2) x 2 linkage (SCN) = 12 total isomers.'
  },
  {
    id: 'AY21_22_Q14',
    academicYear: 'AY21/22',
    originalQNum: 14,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 3,
    questionText: 'Optical isomers have:',
    options: {
      A: 'same physical properties',
      B: 'same molecular formula',
      C: 'difference in action towards plane polarized light',
      D: 'all of the above'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Optical Isomers', 'Enantiomer Properties'],
    explanation: 'Generated explanation; not an official solution. Enantiomers share the same molecular formula and identical scalar physical properties (such as melting point, boiling point, density, and solubility in achiral solvents), but rotate the plane of polarized light in equal magnitude but opposite directions. Therefore, all of the statements are correct.',
    notes: 'Enantiomers have identical achiral physical properties and rotate plane-polarized light in opposite directions.'
  },
  {
    id: 'AY21_22_Q15',
    academicYear: 'AY21/22',
    originalQNum: 15,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 3,
    questionText: 'Which of the following compound shows optical isomerism?',
    options: {
      A: '[Co(CN)6]3-',
      B: '[Cr(C2O4)3]3-',
      C: '[ZnCl4]2-',
      D: '[Cu(NH3)4]2+'
    },
    acceptedAnswers: ['B'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Tris-chelate', 'Chirality'],
    explanation: 'Generated explanation; not an official solution. The tris(oxalato)chromate(III) ion, [Cr(C2O4)3]3-, has D3 point group symmetry like a three-bladed propeller. It lacks any improper rotation axis (no plane of symmetry or inversion center) and exists as a pair of non-superimposable mirror-image enantiomers (Δ and Λ), demonstrating optical isomerism.',
    notes: '[Cr(C2O4)3]3- is a chiral tris-chelate showing optical activity.'
  },
  {
    id: 'AY21_22_Q16',
    academicYear: 'AY21/22',
    originalQNum: 16,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 3,
    questionText: 'Two complexes given below are:\n(Shown in accompanying diagram: two representations of cis-[M(en)2A2] drawn with octahedral frames in different spatial orientations)',
    visualAsset: q16ImageBase64,
    options: {
      A: 'geometrical isomers',
      B: 'position isomers',
      C: 'optical isomers',
      D: 'identical'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Spatial Rotation', 'Chiral Congruence'],
    explanation: 'Generated explanation; not an official solution. In both depictions, the two monodentate ligands A are mutually cis (at 90 degrees), and the two chelating ethylenediamine (en) rings occupy the remaining four cis-coordinated positions. Rotating the first drawing by 90 degrees around an axis brings all atoms into identical spatial alignment with the second drawing; hence, they represent the identical complex.',
    notes: 'The two figures depict the same cis isomer in different orientations, superimposable by simple rigid-body rotation.'
  },
  {
    id: 'AY21_22_Q17',
    academicYear: 'AY21/22',
    originalQNum: 17,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 4,
    questionText: 'Which of the following will have two stereoisomeric forms?\ni. [Cr(NO3)3(NH3)3]\nii. K3[Fe(C2O4)3]\niii. [CoCl2(en)2]+\niv. [CoBrCl(ox)2]3-',
    options: {
      A: 'i only',
      B: 'i and ii',
      C: 'iii and iv',
      D: 'all of these'
    },
    acceptedAnswers: ['B'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Stereoisomer Counting', 'fac/mer and Enantiomers'],
    explanation: 'Generated explanation; not an official solution. Complex i [Ma3b3] forms exactly two geometrical isomers: facial (fac) and meridional (mer), both achiral. Complex ii [M(A-A)3] forms exactly two optical isomers: the Δ and Λ enantiomeric pair. In contrast, complex iii forms three stereoisomers (trans and a pair of cis enantiomers). Thus, only i and ii have exactly two stereoisomeric forms.',
    notes: 'i has 2 geometrical isomers (fac/mer); ii has 2 optical enantiomers (Δ/Λ); iii has 3 stereoisomers.'
  },
  {
    id: 'AY21_22_Q18',
    academicYear: 'AY21/22',
    originalQNum: 18,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 4,
    questionText: 'The octahedral complex CoSO4Cl5NH3 exists in two isomeric forms X and Y. Isomer X reacts with AgNO3 to give a white precipitate, but does not react with BaCl2. Isomer Y gives white precipitate with BaCl2 but does not react with AgNO3. Isomers X and Y are:',
    options: {
      A: 'ionization isomers',
      B: 'linkage isomers',
      C: 'coordinating isomers',
      D: 'solvent isomers'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Ionization Isomerism', 'Precipitation Test'],
    explanation: 'Generated explanation; not an official solution. Isomer X reacts with AgNO3 to precipitate AgCl, meaning Cl- is the outer-sphere counterion: [Co(SO4)(NH3)5]Cl. Isomer Y reacts with BaCl2 to precipitate BaSO4, meaning SO4 2- is the counterion: [CoCl(NH3)5]SO4. Interchange of an anionic ligand with an outer counterion defines ionization isomerism.',
    notes: 'Ionization isomers differing in which anion acts as the free counterion in aqueous solution.'
  },
  {
    id: 'AY21_22_Q19',
    academicYear: 'AY21/22',
    originalQNum: 19,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 4,
    questionText: 'Which of the following does not have optical isomer?',
    options: {
      A: '[Co(NH3)3Cl3]',
      B: '[Co(en)3]Cl3',
      C: '[Co(en)2Cl2]Cl',
      D: '[Co(en)(NH3)2Cl2]Cl'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Chirality', 'Symmetry Planes'],
    explanation: 'Generated explanation; not an official solution. [Co(NH3)3Cl3] is an [Ma3b3] complex that exists as facial (fac) and meridional (mer) geometrical isomers. The fac isomer possesses three planes of symmetry (C3v), and the mer isomer possesses a mirror plane of symmetry (C2v). Having planes of symmetry, neither isomer is chiral, so it has no optical isomers.',
    notes: 'Both fac and mer forms of [Ma3b3] contain mirror planes and are strictly achiral.'
  },
  {
    id: 'AY21_22_Q20',
    academicYear: 'AY21/22',
    originalQNum: 20,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 4,
    questionText: 'Number of geometrical isomers shown by the octahedral complex of the type [MX2Y4] is',
    options: {
      A: '4',
      B: '6',
      C: '8',
      D: '2'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Isomerism & Stereochemistry',
    secondaryTags: ['Geometrical Isomers', 'cis/trans'],
    explanation: 'Generated explanation; not an official solution. An octahedral complex with formula [MX2Y4] has exactly two geometrical arrangements for the two X ligands: cis, in which the two X ligands subtend an angle of 90 degrees at the metal center, and trans, in which they occupy opposite vertices at 180 degrees.',
    notes: 'Exactly 2 geometrical isomers: cis and trans.'
  },
  {
    id: 'AY21_22_Q21',
    academicYear: 'AY21/22',
    originalQNum: 21,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 4,
    questionText: 'Transition metals form most stable complex ions as:',
    options: {
      A: 'they exhibit multiple oxidation states',
      B: 'they have large charge to radius ratio',
      C: 'vacant orbitals to accommodate electrons are present',
      D: 'all of these'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Stability & Thermodynamics',
    secondaryTags: ['Transition Metal Chemistry', 'Stability Factors'],
    explanation: 'Generated explanation; not an official solution. The propensity of transition metals to form exceptionally stable complexes stems collectively from their high charge density (large charge-to-radius ratio), their variable oxidation states allowing favorable redox tuning, and the presence of low-lying empty valence d-orbitals suitable for accepting ligand electron pairs.',
    notes: 'All listed properties contribute synergistically to complex stability in transition metals.'
  },
  {
    id: 'AY21_22_Q22',
    academicYear: 'AY21/22',
    originalQNum: 22,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 4,
    questionText: 'Which of the following metal atomic orbital is considered in crystal field theory?',
    options: {
      A: 's',
      B: 'p',
      C: 'd',
      D: 'f'
    },
    acceptedAnswers: ['C'],
    isAlternativeKey: false,
    primaryTheme: 'Crystal Field & Ligand Field Theory',
    secondaryTags: ['CFT Postulates', 'd Orbitals'],
    explanation: 'Generated explanation; not an official solution. Classic Crystal Field Theory focuses exclusively on the effect of the surrounding electrostatic ligand field on the five degenerate valence d orbitals of transition metal ions, describing how their energies split without considering s or p orbital hybridization.',
    notes: 'CFT specifically addresses the energetic perturbation and splitting of d-orbitals.'
  },
  {
    id: 'AY21_22_Q23',
    academicYear: 'AY21/22',
    originalQNum: 23,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 4,
    questionText: 'The more stable complex among the following is:',
    options: {
      A: '[Fe(H2O)6]2+',
      B: '[Mn(H2O)6]2+',
      C: '[Fe(H2O)6]3+',
      D: 'None of these'
    },
    acceptedAnswers: ['C'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Stability & Thermodynamics',
    secondaryTags: ['Oxidation State', 'Charge Density'],
    explanation: 'Generated explanation; not an official solution. Iron(III) carries a +3 charge and has a significantly smaller ionic radius (64.5 pm) than divalent Fe2+ (78 pm) or Mn2+ (83 pm). Its much higher charge density creates stronger electrostatic attraction and greater covalent orbital overlap with water ligands, giving [Fe(H2O)6]3+ the highest stability.',
    notes: 'Fe3+ has much higher charge density than the divalent cations, maximizing thermodynamic stability.'
  },
  {
    id: 'AY21_22_Q24',
    academicYear: 'AY21/22',
    originalQNum: 24,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 5,
    questionText: 'Stability of a metal complex depends upon:',
    options: {
      A: 'charge on the central metal ion',
      B: 'nature of the ligand',
      C: 'chelation',
      D: 'all of the above'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Stability & Thermodynamics',
    secondaryTags: ['Stability Factors', 'Chelation'],
    explanation: 'Generated explanation; not an official solution. The overall thermodynamic stability of a coordination complex depends on metal properties (higher charge and smaller radius increase stability), ligand properties (basicity, polarizability, and spectrochemical strength), and chelation (multidentate ring formation increases stability via entropy). Hence, all of the above factors are critical.',
    notes: 'Metal charge, ligand properties, and chelate formation all govern complex stability.'
  },
  {
    id: 'AY21_22_Q25',
    academicYear: 'AY21/22',
    originalQNum: 25,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 5,
    questionText: 'The stability constant of the complexes formed by a metal ion M2+ with NH3, CN-, H2O, and en are of the order of 10^11, 10^27, 10^15, and 10^18, respectively. Which of the following is true:',
    options: {
      A: 'CN- is the strongest ligand',
      B: 'en is the strongest ligand',
      C: 'these values cannot predict the strength of the ligand',
      D: 'all the ligands are equally strong'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Stability & Thermodynamics',
    secondaryTags: ['Stability Constant', 'Ligand Strength'],
    explanation: 'Generated explanation; not an official solution. The stability constant (Kf) directly quantifies the thermodynamic equilibrium for complex formation. A formation constant of order 10^27 for the cyanide complex is by far the largest value among the four ligands, establishing that CN- binds most strongly to the M2+ ion.',
    notes: 'Kf of 10^27 demonstrates that CN- forms the most thermodynamically stable complex.'
  },
  {
    id: 'AY21_22_Q26',
    academicYear: 'AY21/22',
    originalQNum: 26,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 5,
    questionText: 'The degeneracy of d-orbitals is lost under:\ni. strong field ligand\nii. weak field ligand\niii. mixed field ligand\niv. chelated ligand field',
    options: {
      A: 'i, ii and iv',
      B: 'i and ii',
      C: 'i, ii, iii and iv',
      D: 'i, ii and iii'
    },
    acceptedAnswers: ['C'],
    isAlternativeKey: false,
    primaryTheme: 'Crystal Field & Ligand Field Theory',
    secondaryTags: ['d-Orbital Degeneracy', 'Ligand Field Splitting'],
    explanation: 'Generated explanation; not an official solution. The degeneracy of the five metal d-orbitals is lifted whenever ligands approach the central metal ion in any non-spherical coordination geometry. Whether the ligands are strong field, weak field, mixed, or chelating, their anisotropic electrostatic and covalent interactions inevitably break the five-fold d degeneracy.',
    notes: 'Any non-spherical field (strong, weak, mixed, or chelated) lifts the 5-fold d orbital degeneracy.'
  },
  {
    id: 'AY21_22_Q27',
    academicYear: 'AY21/22',
    originalQNum: 27,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 5,
    questionText: 'Choose the incorrect order of stability:',
    options: {
      A: '[Cu(NH3)4]2+ < [Cu(en)2]2+ < [Cu(trien)]2+',
      B: '[Fe(H2O)6]3+ < [Fe(NO2)6]3- < (Fe(NH3)6]3+',
      C: '[Fe(H2O)6]2+ < [Fe(H2O)6]3+ < [Co(NH3)6]3+',
      D: '[Co(H2O)6]3+ < [Rh(H2O)6]2+ < [Ir(H2O)6]3+'
    },
    acceptedAnswers: ['B', 'D'],
    isAlternativeKey: true,
    primaryTheme: 'Coordination Stability & Thermodynamics',
    secondaryTags: ['Alternative Key Entry', 'Stability Order', 'Spectrochemical Series'],
    explanation: 'Generated explanation; not an official solution. The official answer key explicitly designates the parenthesised alternative (B/D) for this question. In option B, NO2- is a stronger-field and more stable ligand than NH3, making the sequence incorrect. In option D, a divalent Rh(II) aqua ion is placed between two trivalent ions (Co3+ and Ir3+), violating periodic and oxidation-state stability trends. Both B and D depict incorrect stability orders.',
    notes: 'The official answer key designates parenthesised alternative (B/D). Both option B and option D show flawed stability orders, so both answers are accepted.'
  },
  {
    id: 'AY21_22_Q28',
    academicYear: 'AY21/22',
    originalQNum: 28,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 5,
    questionText: 'The complexes formed by Cu2+ ion are more stable than those formed by Cd2+ ion because:',
    options: {
      A: 'the value of the stability constant for Cd2+ complexes is greater than that of Cu2+ ions',
      B: 'the charge density on Cu2+ is greater than that of Cd2+ ion',
      C: 'the ionic radius of Cu2+ ion is more than that of Cd2+ ion',
      D: 'Cu2+ ion forms chelate compounds'
    },
    acceptedAnswers: ['B'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Stability & Thermodynamics',
    secondaryTags: ['Irving-Williams Series', 'Charge Density'],
    explanation: 'Generated explanation; not an official solution. Although both Cu2+ and Cd2+ carry a +2 formal charge, the 3d transition metal ion Cu2+ has a much smaller ionic radius (~73 pm) than the 4d metal ion Cd2+ (~95 pm). Consequently, Cu2+ possesses a substantially greater charge density (charge-to-radius ratio), leading to stronger electrostatic and covalent bond strengths.',
    notes: 'Smaller ionic radius of Cu2+ gives higher charge density, explaining its higher stability.'
  },
  {
    id: 'AY21_22_Q29',
    academicYear: 'AY21/22',
    originalQNum: 29,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 5,
    questionText: 'The most stable complex species is:',
    options: {
      A: '[Fe(C2O4)3]3-',
      B: '[Fe(CN)6]3-',
      C: '[Fe(CN)6]4-',
      D: '[Fe(H2O)6]3+'
    },
    acceptedAnswers: ['A', 'B'],
    isAlternativeKey: true,
    primaryTheme: 'Coordination Stability & Thermodynamics',
    secondaryTags: ['Alternative Key Entry', 'Chelate vs Strong Field'],
    explanation: 'Generated explanation; not an official solution. The official answer key marks (A/B) as accepted alternatives. Chemically, [Fe(C2O4)3]3- derives immense thermodynamic stability from the chelate effect (three bidentate rings), whereas [Fe(CN)6]3- exhibits massive stability from strong-field covalent σ-bonding and π-backbonding with iron(III). Both represent exceptionally stable complex species.',
    notes: 'The official answer key designates parenthesised alternative (A/B). Both the chelated tris(oxalato) complex (A) and hexacyanidoferrate(III) (B) are accepted.'
  },
  {
    id: 'AY21_22_Q30',
    academicYear: 'AY21/22',
    originalQNum: 30,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 6,
    questionText: 'In Fe(CO)5, the Fe-C bond possesses:',
    options: {
      A: 'π character only',
      B: 'σ character only',
      C: 'ionic character only',
      D: 'both π and σ character'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Bonding & Spectrochemical Series',
    secondaryTags: ['Synergic Bonding', 'Iron Pentacarbonyl'],
    explanation: 'Generated explanation; not an official solution. In metal carbonyls like Fe(CO)5, bonding is synergic: CO donates its lone pair into empty iron hybrid orbitals to form a σ-bond, while filled iron d orbitals donate electron density into the empty π* orbitals of CO (π-backbonding). The Fe-C bond thus possesses both σ and π character.',
    notes: 'Synergic bonding in metal carbonyls involves both sigma and pi character.'
  },
  {
    id: 'AY21_22_Q31',
    academicYear: 'AY21/22',
    originalQNum: 31,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 6,
    questionText: 'In the complex ion ML6 n+ ,Mn+ has five d-electrons and L is weak field ligand. According to crystal field theory, how many unpaired electrons are there in this complex ion?',
    options: {
      A: '0',
      B: '5',
      C: '2',
      D: '3'
    },
    acceptedAnswers: ['B'],
    isAlternativeKey: false,
    primaryTheme: 'Crystal Field & Ligand Field Theory',
    secondaryTags: ['High-Spin d5', 'Unpaired Electrons'],
    explanation: 'Generated explanation; not an official solution. With a weak-field ligand, the crystal field splitting Δo is smaller than the electron pairing energy (Δo < P), resulting in a high-spin complex. For a d5 system, electrons occupy all five d-orbitals singly according to Hund\'s rule: configuration t2g^3 eg^2, giving exactly 5 unpaired electrons.',
    notes: 'High-spin d5 has one electron in each of the 5 d-orbitals, giving 5 unpaired electrons.'
  },
  {
    id: 'AY21_22_Q32',
    academicYear: 'AY21/22',
    originalQNum: 32,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 6,
    questionText: 'The energies of dxy and dz2 orbitals in octahedral and tetrahedral transition metal complexes are such that:',
    options: {
      A: 'E(dxy) > E(dz2) in both tetrahedral and octahedral complexes',
      B: 'E(dxy) < E(dz2) in both tetrahedral and octahedral complexes',
      C: 'E(dxy) > E(dz2) in tetrahedral but E(dxy) < E(dz2) in octahedral complexes',
      D: 'E(dxy) < E(dz2) in tetrahedral but E(dxy) < E(dz2) in octahedral complexes'
    },
    acceptedAnswers: ['C'],
    isAlternativeKey: false,
    primaryTheme: 'Crystal Field & Ligand Field Theory',
    secondaryTags: ['Orbital Inversion', 'Octahedral vs Tetrahedral'],
    explanation: 'Generated explanation; not an official solution. In octahedral geometry, dz2 belongs to the higher-energy eg set pointing directly at ligands, whereas dxy is in the lower-energy t2g set, so E(dxy) < E(dz2). In tetrahedral geometry, the splitting pattern is reversed: t2 (including dxy) is higher in energy than the e set (including dz2), so E(dxy) > E(dz2).',
    notes: 'In Oh: E(dxy) < E(dz2); in Td: E(dxy) > E(dz2).'
  },
  {
    id: 'AY21_22_Q33',
    academicYear: 'AY21/22',
    originalQNum: 33,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 6,
    questionText: 'What is the electronic arrangement of metal atom/ion in octahedral complex with d4 configuration, if Δo < pairing energy',
    options: {
      A: 't2g4 eg0',
      B: 'eg4 t2g0',
      C: 't2g3 eg1',
      D: 'eg2 t2g2'
    },
    acceptedAnswers: ['C'],
    isAlternativeKey: false,
    primaryTheme: 'Crystal Field & Ligand Field Theory',
    secondaryTags: ['High-Spin d4', 'Electron Configuration'],
    explanation: 'Generated explanation; not an official solution. When Δo is smaller than the pairing energy, electrons prefer promoting to the higher-energy eg level rather than pairing in t2g. For a d4 metal ion, three electrons occupy the three degenerate t2g orbitals singly and the fourth electron enters the eg set, producing the high-spin configuration t2g^3 eg^1.',
    notes: 'Δo < P produces high-spin t2g3 eg1.'
  },
  {
    id: 'AY21_22_Q34',
    academicYear: 'AY21/22',
    originalQNum: 34,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 6,
    questionText: 'The ratio of CFSE for [NiCl6]4- and [NiCl4]2- will be nearly:',
    options: {
      A: '3/2',
      B: '4/9',
      C: '9/4',
      D: '27/8'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Crystal Field & Ligand Field Theory',
    secondaryTags: ['CFSE Ratio', 'Octahedral vs Tetrahedral'],
    explanation: 'Generated explanation; not an official solution. Both complexes contain Ni(II), a d8 ion. For octahedral [NiCl6]4-, CFSE_oct = 1.2 Δo. For tetrahedral [NiCl4]2-, CFSE_tet = 0.8 Δt = 0.8 * (4/9)Δo = (16/45)Δo. Taking the ratio gives CFSE_oct / CFSE_tet = 1.2 / (16/45) = (6/5) * (45/16) = 27/8.',
    notes: '1.2 / [0.8 * (4/9)] = 27/8.'
  },
  {
    id: 'AY21_22_Q35',
    academicYear: 'AY21/22',
    originalQNum: 35,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 6,
    questionText: 'The d orbitals that are stabilized in an octahedral magnetic field are:',
    options: {
      A: 'dxy and dz2',
      B: 'dx2-y2 and dz2',
      C: 'dxy, dxz and dyx',
      D: 'dz2 only'
    },
    acceptedAnswers: ['C'],
    isAlternativeKey: false,
    primaryTheme: 'Crystal Field & Ligand Field Theory',
    secondaryTags: ['t2g Set', 'Barycenter Stabilization'],
    explanation: 'Generated explanation; not an official solution. In an octahedral field, ligands approach along the x, y, and z axes. The t2g orbitals (dxy, dxz, and dyz/dyx) have lobes pointing between the Cartesian axes, experiencing less electrostatic repulsion and becoming stabilized by 0.4Δo relative to the barycenter.',
    notes: 'The t2g set (dxy, dxz, dyz) points between the axes and is stabilized by 0.4Δo.'
  },
  {
    id: 'AY21_22_Q36',
    academicYear: 'AY21/22',
    originalQNum: 36,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 6,
    questionText: 'The magnitude of crystal field stabilization energy in tetrahedral complexes is considerably less than in the octahedral field because:',
    options: {
      A: 'there are only four ligands instead of six',
      B: 'the direction of the orbitals does not coincide with the direction of the ligands',
      C: 'Both points (a) and (b) are correct',
      D: 'Both points (a) and (b) are wrong'
    },
    acceptedAnswers: ['C'],
    isAlternativeKey: false,
    primaryTheme: 'Crystal Field & Ligand Field Theory',
    secondaryTags: ['Tetrahedral Splitting', 'Geometric Factor'],
    explanation: 'Generated explanation; not an official solution. The crystal field splitting in tetrahedral geometry is related to octahedral splitting by Δt = 4/9 Δo. This substantial reduction arises from two physical factors: having only 4 ligands instead of 6 (giving a factor of 4/6 = 2/3) and the fact that tetrahedral ligand trajectories do not point directly at any d orbital (giving another geometric factor of 2/3). Thus, both points are correct.',
    notes: 'Δt = (2/3) * (2/3) * Δo = 4/9 Δo, combining fewer ligands and indirect orbital orientation.'
  },
  {
    id: 'AY21_22_Q37',
    academicYear: 'AY21/22',
    originalQNum: 37,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 7,
    questionText: 'Which of the following on CO ligand is true?',
    options: {
      A: 'σ-donor, π-acceptor',
      B: 'σ-donor, π-donor',
      C: 'σ-acceptor, π-acceptor',
      D: 'σ-acceptor, π-acceptor'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Bonding & Spectrochemical Series',
    secondaryTags: ['Carbonyl Bonding', 'Pi-Acceptor'],
    explanation: 'Generated explanation; not an official solution. Carbon monoxide coordinates through the lone pair on carbon by donating electron density into an empty metal hybrid orbital (σ-donation), while simultaneously accepting electron density from filled metal d-orbitals into its low-energy empty π* antibonding orbitals (π-backbonding). Thus, CO is a σ-donor and π-acceptor.',
    notes: 'Synergic bonding classifies CO as a sigma-donor and pi-acceptor.'
  },
  {
    id: 'AY21_22_Q38',
    academicYear: 'AY21/22',
    originalQNum: 38,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 7,
    questionText: 'Cisplatin compounds are used in the treatment of:',
    options: {
      A: 'malaria',
      B: 'cancer',
      C: 'AIDS',
      D: 'yellow fever'
    },
    acceptedAnswers: ['B'],
    isAlternativeKey: false,
    primaryTheme: 'Coordination Nomenclature & Formulas',
    secondaryTags: ['Medicinal Chemistry', 'Cisplatin'],
    explanation: 'Generated explanation; not an official solution. Cisplatin, cis-[Pt(NH3)2Cl2], is an inorganic platinum-based chemotherapeutic drug widely used in the clinical treatment of various cancers, where it binds to DNA to form intrastrand crosslinks that inhibit DNA replication and trigger apoptosis in malignant cells.',
    notes: 'Classic platinum anticancer chemotherapeutic.'
  },
  {
    id: 'AY21_22_Q39',
    academicYear: 'AY21/22',
    originalQNum: 39,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 7,
    questionText: 'In the spectrochemical series, which ligand produces strongest field?',
    options: {
      A: 'Cl-',
      B: 'H2O',
      C: 'NO2',
      D: 'CO'
    },
    acceptedAnswers: ['D'],
    isAlternativeKey: false,
    primaryTheme: 'Bonding & Spectrochemical Series',
    secondaryTags: ['Spectrochemical Series', 'Strong-Field Ligands'],
    explanation: 'Generated explanation; not an official solution. In the spectrochemical series, ligands are ordered by the magnitude of crystal field splitting Δo they induce: I- < Br- < Cl- < F- < OH- < H2O < NH3 < NO2- < CN- < CO. Carbon monoxide is the strongest π-acceptor ligand and sits at the highest end of the series, producing the strongest crystal field.',
    notes: 'CO is at the extreme strong-field end of the spectrochemical series.'
  },
  {
    id: 'AY21_22_Q40',
    academicYear: 'AY21/22',
    originalQNum: 40,
    sourcePdf: 'AY21_22_Mid_term_test_paper.pdf',
    page: 7,
    questionText: 'Which effect/theory could account for the presence of two different M-L bond lengths in [Cu(H2O)6]2+?',
    options: {
      A: 'Jahn-Teller effect',
      B: 'Crystal Field Theory',
      C: 'Ligand Field Theory',
      D: 'Valence Bond Theory'
    },
    acceptedAnswers: ['A'],
    isAlternativeKey: false,
    primaryTheme: 'Jahn-Teller & Electronic Spectra',
    secondaryTags: ['Jahn-Teller Distortion', 'Tetragonal Elongation'],
    explanation: 'Generated explanation; not an official solution. Cu(II) has a d9 electronic configuration with an unevenly occupied degenerate eg level (t2g^6 eg^3). According to the Jahn-Teller theorem, any non-linear molecule in a degenerate electronic state must undergo geometric distortion to remove degeneracy and lower the overall energy, resulting in four short equatorial and two long axial Cu-O bonds.',
    notes: 'Jahn-Teller distortion in d9 copper(II) causes tetragonal elongation (two distinct bond lengths).'
  }
];
