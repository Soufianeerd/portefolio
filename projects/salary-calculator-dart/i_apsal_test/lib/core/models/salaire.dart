class Salaire {
  int iAnnee = -1;
  int iMois = -1;
  double dHMC = 0;
  int iCotis = -1;
  double dBrut = 0;
  double dNet = 0;
  double dAvNat = 0;
  double dDeduc = 0;
  int iclasse = -1;
  double dimposable = 0;
  int iTxImpot = -1;
  bool swTxImpots = false;
  double dTxImpot = 0;
  bool bCalculCI = false;
  bool _bCalculCIE = false;
  bool bCalculCIM = false;

  bool get bCalculCIE => _bCalculCIE;
  set bCalculCIE(bool value) {
    _bCalculCIE = value;
  }
  int iMutualite = 0; // 0=Mutu1, 1=Mutu2, 2=Mutu3, 3=Mutu4 (conforme Swift)
  double dTxSAT = 0;
  double dTxASAC = 0;
  int iBonus = 1;
  double dTxCMP = 0;

  double dCotisCMS = 0;
  double dCotisCME = 0;
  double dCotisCMP = 0;
  double dCotisSurprime = 0;
  double dCotisDep = 0;

  double dCotisSecuPatr = 0;
  double dCotisMutuPatr = 0;
  double dCotisASACPatr = 0;
  double dCotisSATPatr = 0;
  double dCoutTotPatr = 0;

  double dImpot = 0;
  double dImpotEQBT = 0;
  double dCI = 0;
  double dCIM = 0;
  double dCICO2 = 0;
  double dCIC = 0;
  double dCIE = 0;
  double dCISSM = 0;

  Salaire() {
    iAnnee = -1;
    dHMC = 0;
    dimposable = 0;
    iclasse = -1;
    iMutualite = 0;
    iBonus = 1;
    dBrut = 0;
    dAvNat = 0;
    dDeduc = 0;
    dCI = 0;
    dCICO2 = 0;
    dCIE = 0;
    dCIC = 0;
    dCISSM = 0;
    dCIM = 0;
    _bCalculCIE = false;
    dNet = 0;
    dCotisCMS = 0;
    dCotisCME = 0;
    dTxCMP = 0;
    dCotisCMP = 0;
    dCotisSurprime = 0;
    dCotisDep = 0;
    dImpot = 0;
    dTxImpot = 0;
    swTxImpots = false;
    dImpotEQBT = 0;
    dCotisSecuPatr = 0;
    dCotisMutuPatr = 0;
    dCotisASACPatr = 0;
    dCotisSATPatr = 0;
    dTxSAT = 0;
    dTxASAC = 0;
    dCoutTotPatr = 0;
    iCotis = -1;
    iTxImpot = -1;
    bCalculCI = false;
    bCalculCIM = false;
  }

  /// Retourne le brut total (incl. avantages en nature)
  double totalBrut() {
    return dBrut + dAvNat;
  }

  /// Parts salariales
  double partsTrav() {
    return dCotisCMS + dCotisCME + dCotisCMP;
  }

  /// Parts patronales (cotisations à la charge de l'employeur)
  /// = Parts salariales + SAT + ASAC + Mutualité
  /// Conforme à PartsPtronales() Swift
  double partsPatronales() {
    return dCotisCMS +
        dCotisCME +
        dCotisCMP +
        dCotisMutuPatr +
        dCotisASACPatr +
        dCotisSATPatr;
  }

  /// Coût total employeur (brut + cotisations patronales)
  /// Conforme à CoutPtronales() Swift
  double coutPatronales() {
    return dBrut +
        dCotisCMS +
        dCotisCME +
        dCotisCMP +
        dCotisMutuPatr +
        dCotisASACPatr +
        dCotisSATPatr;
  }
}
