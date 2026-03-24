/// Modèle de données représentant un salaire avec tous ses paramètres de calcul
/// et les montants de cotisations/impôts qui en découlent.
class Salaire {
  // Paramètres d'entrée
  int iAnnee;
  int iMois;
  double dHMC; // Heures Mensuelles Contractuelles
  double dBrut; // Salaire brut
  double dAvNat; // Avantages en nature
  double dDeduc; // Déductions
  int iclasse; // Classe d'impôt (100, 200, 300)
  int iMutualite; // Classe de mutualité (1, 2, 3, 4)
  int iBonus;
  
  // Options de calcul
  int iCotis;
  bool swTxImpots; // Activer un taux d'impôt personnalisé
  double dTxImpot; // Taux d'impôt personnalisé
  int iTxImpot;
  bool bCalculCI; // Calculer le Crédit d'Impôt (CI)
  bool bCalculCIM; // Calculer le Crédit d'Impôt Monoparental (CIM)

  // Variables intermédiaires et de résultat
  double dNet;
  double dimposable; // Montant imposable
  
  // Taux applicables
  double dTxSAT;
  double dTxASAC;
  double dTxCMP;
  
  // Cotisations salariales
  double dCotisCMS; // Caisse Maladie Santé
  double dCotisCME; // Caisse Maladie Espèces
  double dCotisCMP; // Caisse Maladie Pension
  double dCotisSurprime;
  double dCotisDep; // Cotisation Dépendance
  
  // Cotisations patronales
  double dCotisSecuPatr;
  double dCotisMutuPatr;
  double dCotisASACPatr; // Assurance Accident
  double dCotisSATPatr; // Santé au travail
  double dCoutTotPatr; // Coût total employeur
  
  // Impôts et crédits
  double dImpot;
  double dImpotEQBT;
  double dCI; // Crédit d'Impôt
  double dCIM; // Crédit d'Impôt Monoparental
  double dCICO2; // Crédit d'Impôt CO2
  double dCIC; // Crédit d'Impôt Conjoncture
  double dCIE; // Crédit d'Impôt Énergie
  double dCISSM; // Crédit d'Impôt Salaire Social Minimum

  Salaire({
    this.iAnnee = -1,
    this.iMois = -1,
    this.dHMC = 0,
    this.dBrut = 0,
    this.dAvNat = 0,
    this.dDeduc = 0,
    this.iclasse = -1,
    this.iMutualite = 1,
    this.iBonus = 1,
    this.iCotis = -1,
    this.swTxImpots = false,
    this.dTxImpot = 0,
    this.iTxImpot = -1,
    this.bCalculCI = false,
    this.bCalculCIM = false,
    this.dNet = 0,
    this.dimposable = 0,
    this.dTxSAT = 0,
    this.dTxASAC = 0,
    this.dTxCMP = 0,
    this.dCotisCMS = 0,
    this.dCotisCME = 0,
    this.dCotisCMP = 0,
    this.dCotisSurprime = 0,
    this.dCotisDep = 0,
    this.dCotisSecuPatr = 0,
    this.dCotisMutuPatr = 0,
    this.dCotisASACPatr = 0,
    this.dCotisSATPatr = 0,
    this.dCoutTotPatr = 0,
    this.dImpot = 0,
    this.dImpotEQBT = 0,
    this.dCI = 0,
    this.dCIM = 0,
    this.dCICO2 = 0,
    this.dCIC = 0,
    this.dCIE = 0,
    this.dCISSM = 0,
  });

  /// Retourne le total brut (Brut + Avantages en nature)
  double totalBrut() {
    return dBrut + dAvNat;
  }

  /// Retourne le total des parts salariales (CMS, CME, CMP)
  double partsTrav() {
    return dCotisCMS + dCotisCME + dCotisCMP;
  }

  /// Retourne le total des parts patronales (Sécu, Mutualité, Accident, Santé)
  /// Note: Le code original Swift inclut les parts salariales dans cette méthode, 
  /// ce qui semble être une erreur conceptuelle mais nous reproduisons le comportement
  double partsPtronales() {
    return dCotisCMS + dCotisCME + dCotisCMP + dCotisSecuPatr + dCotisMutuPatr + dCotisASACPatr + dCotisSATPatr;
  }

  /// Retourne le coût total pour le patron (Brut + Cotisations Patronales)
  double coutPtronales() {
    return dBrut + dCotisCMS + dCotisCME + dCotisCMP + dCotisSecuPatr + dCotisMutuPatr + dCotisASACPatr + dCotisSATPatr;
  }
}
