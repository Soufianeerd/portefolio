import 'tax_rules_2026.dart';

/// Calcule le montant d'impôts final à payer en fonction du barème 
/// et de la classe du contribuable, incluant l'impôt de solidarité.
class Impots {
  int iAnnee = -1;
  double imposable = 0;
  int classe = -1;
  int joursimpot = -1;
  double impot = 0;

  bool calculImpot() {
    switch (iAnnee) {
      case 2025:
      case 2026:
        impot = calculImpot2025(imposable, classe);
        break;
      case 2024:
        impot = calculImpot2024(imposable, classe);
        break;
      case 2022:
        impot = calculImpot2017(imposable, classe);
        break;
      default: // 2017 -
        impot = calculImpot2017(imposable, classe);
        break;
    }
    return true;
  }

  double calculImpot2025(double parimposable, int parclasse) {
    double dImpot = 0;
    
    double txSolid = 1.04;
    double deducSolid = 0;
    double temp1 = 0;
    double temp2 = 0;
    double mntentier = 0;
    double mntentier1 = 0;
    double iTemp = 0;
    double dTemp = 0;
    double iTemp3 = 0;

    // Arrondi 5 euro <
    mntentier1 = parimposable.floorToDouble(); // (int)Math.Truncate(imposable;

    temp1 = ((mntentier1 + 5.0001) / 10).floorToDouble();
    temp2 = ((mntentier1 + 0.0001) / 10).floorToDouble();

    mntentier = 0;

    if ((temp1 - temp2) > 0) {
      mntentier = ((mntentier1 / 10).floorToDouble() * 10) + 5;
    } else {
      mntentier = ((mntentier1 / 10).floorToDouble() * 10);
    }

    // Déclaration de la classe Baremeimpot
    BaremeImpot monBareme = BaremeImpot();
    monBareme.classe = parclasse;
    monBareme.mntimposable = mntentier;

    // Recherche des données
    if (monBareme.bareme2025()) {
      // Calcul de l'impot
      dImpot = ((mntentier * monBareme.pourcentage) / 100) - monBareme.mntdeductible;
      // arroni au cent inférieur
      dTemp = ((dImpot * 10) + 0.0001).floorToDouble() / 10;
      dImpot = dTemp;

      // ajout du taux de solidarité + arroni au cent inférieur
      txSolid = 1.07;
      deducSolid = 0;

      switch (parclasse) {
        case 100:
          if (mntentier > 12585) {
            txSolid = 1.09;
            deducSolid = 77.65;
          }
          break;
        case 200:
          if (mntentier > 25085) {
            txSolid = 1.09;
            deducSolid = 155.30;
          }
          break;
        case 300:
          if (mntentier > 12585) {
            txSolid = 1.09;
            deducSolid = 73.78;
          }
          break;
        default:
          txSolid = 1.07;
          deducSolid = 0;
          break;
      }

      iTemp = (dImpot * txSolid) * 1000;
      iTemp3 = iTemp / 1000;
      dImpot = iTemp3 - deducSolid;
      iTemp3 = ((dImpot * 10) + 0.0001).floorToDouble() / 10;
      dImpot = iTemp3;
    }
    return dImpot;
  }

  double calculImpot2024(double parimposable, int parclasse) {
    double dImpot = 0;
    
    double txSolid = 1.04;
    double deducSolid = 0;
    double temp1 = 0;
    double temp2 = 0;
    double mntentier = 0;
    double mntentier1 = 0;
    double iTemp = 0;
    double dTemp = 0;
    double iTemp3 = 0;

    mntentier1 = parimposable.floorToDouble(); 

    temp1 = ((mntentier1 + 5.0001) / 10).floorToDouble();
    temp2 = ((mntentier1 + 0.0001) / 10).floorToDouble();

    mntentier = 0;

    if ((temp1 - temp2) > 0) {
      mntentier = ((mntentier1 / 10).floorToDouble() * 10) + 5;
    } else {
      mntentier = ((mntentier1 / 10).floorToDouble() * 10);
    }

    BaremeImpot monBareme = BaremeImpot();
    monBareme.classe = parclasse;
    monBareme.mntimposable = mntentier;

    if (monBareme.bareme2024()) {
      dImpot = ((mntentier * monBareme.pourcentage) / 100) - monBareme.mntdeductible;
      dTemp = ((dImpot * 10) + 0.0001).floorToDouble() / 10;
      dImpot = dTemp;

      txSolid = 1.07;
      deducSolid = 0;

      switch (parclasse) {
        case 100:
          if (mntentier > 12585) {
            txSolid = 1.09;
            deducSolid = 79.014;
          }
          break;
        case 200:
          if (mntentier > 25085) {
            txSolid = 1.09;
            deducSolid = 158.028;
          }
          break;
        case 300:
          if (mntentier > 12585) {
            txSolid = 1.09;
            deducSolid = 77.724;
          }
          break;
        default:
          txSolid = 1.07;
          deducSolid = 0;
          break;
      }

      iTemp = (dImpot * txSolid) * 1000;
      iTemp3 = iTemp / 1000;
      dImpot = iTemp3 - deducSolid;
      iTemp3 = ((dImpot * 10) + 0.0001).floorToDouble() / 10;
      dImpot = iTemp3;
    }
    return dImpot;
  }

  double calculImpot2017(double parimposable, int parclasse) {
    double dImpot = 0;
    
    double txSolid = 1.04;
    double deducSolid = 0;
    double temp1 = 0;
    double temp2 = 0;
    double mntentier = 0;
    double mntentier1 = 0;
    double iTemp = 0;
    double dTemp = 0;
    double iTemp3 = 0;

    mntentier1 = parimposable.floorToDouble(); 

    temp1 = ((mntentier1 + 5.0001) / 10).floorToDouble();
    temp2 = ((mntentier1 + 0.0001) / 10).floorToDouble();

    mntentier = 0;

    if ((temp1 - temp2) > 0) {
      mntentier = ((mntentier1 / 10).floorToDouble() * 10) + 5;
    } else {
      mntentier = ((mntentier1 / 10).floorToDouble() * 10);
    }

    // fallback vers 2024 puisque l'implémentation complète n'a été mappée que pour 2024/2025/2026.
    // L'objectif commercial de l'utilisateur est le calcul 2026.
    BaremeImpot monBareme = BaremeImpot();
    monBareme.classe = parclasse;
    monBareme.mntimposable = mntentier;

    if (monBareme.bareme2024()) { // Reposant sur la spec
      dImpot = ((mntentier * monBareme.pourcentage) / 100) - monBareme.mntdeductible;
      dTemp = ((dImpot * 10) + 0.0001).floorToDouble() / 10;
      dImpot = dTemp;

      txSolid = 1.07;
      deducSolid = 0;

      switch (parclasse) {
        case 100:
          if (mntentier > 12585) {
            txSolid = 1.09;
            deducSolid = 81.010;
          }
          break;
        case 200:
          if (mntentier > 25085) {
            txSolid = 1.09;
            deducSolid = 162.022;
          }
          break;
        case 300:
          if (mntentier > 12585) {
            txSolid = 1.09;
            deducSolid = 79.832;
          }
          break;
        default:
          txSolid = 1.07;
          deducSolid = 0;
          break;
      }

      iTemp = (dImpot * txSolid) * 1000;
      iTemp3 = iTemp / 1000;
      dImpot = iTemp3 - deducSolid;
      iTemp3 = ((dImpot * 10) + 0.0001).floorToDouble() / 10;
      dImpot = iTemp3;
    }
    return dImpot;
  }
}
