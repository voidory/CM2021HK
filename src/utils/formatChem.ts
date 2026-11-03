/**
 * Formats chemical formulas, ions, complexes, orbital terms, and scientific notation
 * with proper superscripts (<sup>) and subscripts (<sub>).
 */
export function formatChemHtml(text: string): string {
  if (!text) return '';

  let res = text;

  // 1. Crystal field orbital terms and configurations
  // dx2-y2, dz2, dxy, dyz, dxz
  res = res.replace(/\bdx2-y2\b/gi, 'd<sub>x<sup>2</sup>-y<sup>2</sup></sub>');
  res = res.replace(/\bdz\s*2\b/gi, 'd<sub>z<sup>2</sup></sub>');
  res = res.replace(/\bdz2\b/gi, 'd<sub>z<sup>2</sup></sub>');
  res = res.replace(/\bdxy\b/gi, 'd<sub>xy</sub>');
  res = res.replace(/\bdyz\b/gi, 'd<sub>yz</sub>');
  res = res.replace(/\bdxz\b/gi, 'd<sub>xz</sub>');
  res = res.replace(/\bdyx\b/gi, 'd<sub>yx</sub>');

  // Crystal field delta: Δo, Δt, Δ0
  res = res.replace(/Δ[oO0]/g, 'Δ<sub>o</sub>');
  res = res.replace(/Δt(?!\w)/g, 'Δ<sub>t</sub>');

  // Orbital subshell configurations: e.g. 3d7, 4s2, 3d6, 3d0, 4f14, 5d7, 6s2
  res = res.replace(/\b([1-6])([spdf])(\d+)\b/g, '$1$2<sup>$3</sup>');

  // Hybridization: sp3, sp2
  res = res.replace(/\bsp([23])\b/g, 'sp<sup>$1</sup>');

  // t2g and eg configurations
  // e.g. "t2g 4 eg 0", "t2g^4 eg^0", "t2g4 eg0", "t2g3eg1"
  res = res.replace(/\bt2g\s*\^?(\d+)/gi, 't<sub>2g</sub><sup>$1</sup>');
  res = res.replace(/\beg\s*\^?(\d+)/gi, 'e<sub>g</sub><sup>$1</sup>');
  res = res.replace(/\bt2g\b/gi, 't<sub>2g</sub>');
  res = res.replace(/\beg\b/gi, 'e<sub>g</sub>');

  // d-electron counts: d0 to d10 (when standalone or preceded by space/bracket/hyphen/slash/greater-than)
  res = res.replace(/(^|[\s\(\[\-\/\>])d([0-9]|10)\b/g, '$1d<sup>$2</sup>');

  // Scientific notation powers of 10: 1011, 1027, 1015, 1018, 10^11, 10^-5
  res = res.replace(/\b10\^([+\-]?\d+)/g, '10<sup>$1</sup>');
  res = res.replace(/\b10(11|27|15|18)\b/g, '10<sup>$1</sup>');

  // 2. Coordination complexes inside brackets [...]
  // First, handle bracket charge suffixes: e.g. ]2+, ]3+, ]4+, ]2-, ]3-, ]4-, ]-, ]+
  res = res.replace(/\]\s*([2-6]?)([+\-])/g, (_m, num, sign) => {
    const s = sign === '-' ? '−' : '+';
    return `]<sup>${num}${s}</sup>`;
  });

  // Handle counterion stoichiometry before '[' like Na2[, K3[, K4[, K2[
  res = res.replace(/\b(Na|K|Ba|Ca|Mg|Li)(\d+)\[/g, '$1<sub>$2</sub>[');

  // Format the inside of [...] blocks
  res = res.replace(/\[([^\]]+)\]/g, (_wholeMatch, inner) => {
    let formattedInner = inner;

    // Subscripts on parentheses: (group)2 -> (group)<sub>2</sub>
    formattedInner = formattedInner.replace(/\)([2-8])/g, ')<sub>$1</sub>');

    // Common ligand formulas with internal numbers:
    // H2O, NH3, CH3, NH2, PPh3, C2O4, NO2, NO3, SO4, CO3, C6H5
    formattedInner = formattedInner.replace(/H2O/g, 'H<sub>2</sub>O');
    formattedInner = formattedInner.replace(/NH3/g, 'NH<sub>3</sub>');
    formattedInner = formattedInner.replace(/CH3/g, 'CH<sub>3</sub>');
    formattedInner = formattedInner.replace(/NH2/g, 'NH<sub>2</sub>');
    formattedInner = formattedInner.replace(/PPh3/g, 'PPh<sub>3</sub>');
    formattedInner = formattedInner.replace(/C2O4/g, 'C<sub>2</sub>O<sub>4</sub>');
    formattedInner = formattedInner.replace(/C6H5/g, 'C<sub>6</sub>H<sub>5</sub>');
    formattedInner = formattedInner.replace(/NO2/g, 'NO<sub>2</sub>');
    formattedInner = formattedInner.replace(/NO3/g, 'NO<sub>3</sub>');
    formattedInner = formattedInner.replace(/SO4/g, 'SO<sub>4</sub>');
    formattedInner = formattedInner.replace(/CO3/g, 'CO<sub>3</sub>');

    // Elements followed by digits: Cl2, Cl4, Cl6, F6, Br2, I2, O2, H2, Ni2, Fe2, etc.
    formattedInner = formattedInner.replace(/(Cl|Br|F|I|H|O|N|P|S|Pt|Pd|Ni|Co|Fe|Mn|Cr|V|Ti|Cu|Zn)(\d+)/g, '$1<sub>$2</sub>');

    return `[${formattedInner}]`;
  });

  // Counterions directly after ']' or '</sup>': e.g. ]Cl2, ]Cl3, </sup>Cl2, </sup>Cl, </sup>(NO3)2
  res = res.replace(/(\]|<\/sup>)(Cl|Br|I|F)(\d+)/g, '$1$2<sub>$3</sub>');
  res = res.replace(/(\]|<\/sup>)\(NO3\)(\d+)/g, '$1(NO<sub>3</sub>)<sub>$2</sub>');
  res = res.replace(/(\]|<\/sup>)\(NO2\)(\d+)/g, '$1(NO<sub>2</sub>)<sub>$2</sub>');
  res = res.replace(/(\]|<\/sup>)\(SO4\)/g, '$1SO<sub>4</sub>');

  // Generic coordination formulas: ML6, ML4, MX2Y4, Ma4b2, Ma3b3, Ma2b2c2, M(A-B)3, M(A-A)2, M(A-A)3
  res = res.replace(/\bML6\b/g, 'ML<sub>6</sub>');
  res = res.replace(/\bML4\b/g, 'ML<sub>4</sub>');
  res = res.replace(/\bMX2Y4\b/g, 'MX<sub>2</sub>Y<sub>4</sub>');
  res = res.replace(/\bMa4b2\b/g, 'Ma<sub>4</sub>b<sub>2</sub>');
  res = res.replace(/\bMa3b3\b/g, 'Ma<sub>3</sub>b<sub>3</sub>');
  res = res.replace(/\bMa4bc\b/g, 'Ma<sub>4</sub>bc');
  res = res.replace(/\bMa2b2c2\b/g, 'Ma<sub>2</sub>b<sub>2</sub>c<sub>2</sub>');
  res = res.replace(/M\(A\-B\)3/g, 'M(A-B)<sub>3</sub>');
  res = res.replace(/M\(A\-A\)2/g, 'M(A-A)<sub>2</sub>');
  res = res.replace(/M\(A\-A\)3/g, 'M(A-A)<sub>3</sub>');
  res = res.replace(/\(A\-B\)3/g, '(A-B)<sub>3</sub>');
  res = res.replace(/\(A\-A\)2/g, '(A-A)<sub>2</sub>');
  res = res.replace(/\(A\-A\)3/g, '(A-A)<sub>3</sub>');

  // Standalone common neutral compounds & molecules
  res = res.replace(/\bKMnO4\b/g, 'KMnO<sub>4</sub>');
  res = res.replace(/\bPbCl2\b/g, 'PbCl<sub>2</sub>');
  res = res.replace(/\bBaCl2\b/g, 'BaCl<sub>2</sub>');
  res = res.replace(/\bAgNO3\b/g, 'AgNO<sub>3</sub>');
  res = res.replace(/\bNiCl2\b/g, 'NiCl<sub>2</sub>');
  res = res.replace(/\bCoCl2\b/g, 'CoCl<sub>2</sub>');
  res = res.replace(/\bFeCl3\b/g, 'FeCl<sub>3</sub>');
  res = res.replace(/\bFeCl2\b/g, 'FeCl<sub>2</sub>');
  res = res.replace(/\bCuSO4\b/g, 'CuSO<sub>4</sub>');
  res = res.replace(/\bH2O\b/g, 'H<sub>2</sub>O');
  res = res.replace(/\bNH3\b/g, 'NH<sub>3</sub>');
  res = res.replace(/\bCH3NH2\b/g, 'CH<sub>3</sub>NH<sub>2</sub>');
  res = res.replace(/\bPPh3\b/g, 'PPh<sub>3</sub>');

  // Parentheses followed by stoichiometric numbers outside brackets: (NH3)5, (H2O)2, (en)2
  res = res.replace(/\)([2-8])(?!\w)/g, ')<sub>$1</sub>');

  // Polyatomic groups outside brackets: SO4, CO3, NO2, NO3, C2O4
  res = res.replace(/\bSO4(?!\w)/g, 'SO<sub>4</sub>');
  res = res.replace(/\bCO3(?!\w)/g, 'CO<sub>3</sub>');
  res = res.replace(/\bNO2(?!\w)/g, 'NO<sub>2</sub>');
  res = res.replace(/\bNO3(?!\w)/g, 'NO<sub>3</sub>');
  res = res.replace(/\bC2O4(?!\w)/g, 'C<sub>2</sub>O<sub>4</sub>');

  // Standalone metal ions with charges: Fe2+, Fe3+, Cu2+, Cu+, Ti4+, Cr3+, etc.
  const metals = ['Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Pt', 'Ti', 'Cr', 'Mn', 'V', 'Cd', 'Rh', 'Ir', 'Pd', 'Ba', 'Pb', 'Ag', 'Ca', 'Mg', 'Sc', 'Al'];
  for (const m of metals) {
    const reg = new RegExp(`\\b${m}([2-7]?)([+\\-])(?!\\w)`, 'g');
    res = res.replace(reg, (_match, num, sign) => {
      const s = sign === '-' ? '−' : '+';
      return `${m}<sup>${num}${s}</sup>`;
    });
  }

  // M2+, Mn+, M(n+), M3+
  res = res.replace(/\bM([2-7]?)([+\-])(?!\w)/g, (_match, num, sign) => {
    const s = sign === '-' ? '−' : '+';
    return `M<sup>${num}${s}</sup>`;
  });
  res = res.replace(/\bMn\+(?!\w)/g, 'M<sup>n+</sup>');
  res = res.replace(/\bPt0\b/g, 'Pt<sup>0</sup>');

  // Standalone polyatomic and simple anions with charges:
  // SCN-, CN-, NO2-, NO3-, OH-, Cl-, Br-, I-, F-, SO4 2-, CO3 2-, C2O4 2-
  res = res.replace(/\bSCN\s*([+\-])(?!\w)/g, 'SCN<sup>−</sup>');
  res = res.replace(/\bCN\s*([+\-])(?!\w)/g, 'CN<sup>−</sup>');
  res = res.replace(/\bOH\s*([+\-])(?!\w)/g, 'OH<sup>−</sup>');
  res = res.replace(/\bNO2\s*([+\-])(?!\w)/g, 'NO<sub>2</sub><sup>−</sup>');
  res = res.replace(/\bNO3\s*([+\-])(?!\w)/g, 'NO<sub>3</sub><sup>−</sup>');
  res = res.replace(/\bSO4\s*2\-(?!\w)/g, 'SO<sub>4</sub><sup>2−</sup>');
  res = res.replace(/\bCO3\s*2\-(?!\w)/g, 'CO<sub>3</sub><sup>2−</sup>');
  res = res.replace(/\bC2O4\s*2\-(?!\w)/g, 'C<sub>2</sub>O<sub>4</sub><sup>2−</sup>');
  res = res.replace(/\bCl\s*([+\-])(?!\w)/g, 'Cl<sup>−</sup>');
  res = res.replace(/\bBr\s*([+\-])(?!\w)/g, 'Br<sup>−</sup>');
  res = res.replace(/\bI\s*([+\-])(?!\w)/g, 'I<sup>−</sup>');
  res = res.replace(/\bF\s*([+\-])(?!\w)/g, 'F<sup>−</sup>');

  return res;
}
