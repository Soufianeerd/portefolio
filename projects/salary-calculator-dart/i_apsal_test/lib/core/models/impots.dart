import 'baremeImpot.dart';

class Impots {
  int iAnnee = -1;
  double imposable = 0;
  int classe = -1;
  int joursimpot = -1;
  double impot = 0;

  bool CalculImpot() {
    switch (iAnnee) {
      case 2025:
      case 2026:
        impot = CalculImpot2025(parimposable: imposable, parclasse: classe);
        break;
      case 2024:
        impot = CalculImpot2024(parimposable: imposable, parclasse: classe);
        break;
      case 2022:
        impot = CalculImpot2017(parimposable: imposable, parclasse: classe);
        break;
      default: // 2017 -
        impot = CalculImpot2017(parimposable: imposable, parclasse: classe);
        break;
    }
    return true;
  }

  // Calcul impot 2025
  double CalculImpot2025({required double parimposable, required int parclasse}) {
    double dImpot = 0;

    double txSolid = 1.04;
    double deducSolid = 0;
    double temp1;
    double temp2;
    double mntentier = 0;
    double mntentier1;
    double iTemp;
    double dTemp;
    double iTemp3;

    // Arrondi au 5 € le plus proche (vers le bas / logique d’origine)
    mntentier1 = parimposable.floorToDouble();

    temp1 = ((mntentier1 + 5.0001) / 10).floorToDouble();
    temp2 = ((mntentier1 + 0.0001) / 10).floorToDouble();

    if ((temp1 - temp2) > 0) {
      mntentier = (mntentier1 / 10).floorToDouble() * 10 + 5;
    } else {
      mntentier = (mntentier1 / 10).floorToDouble() * 10;
    }

    // Barème
    final monBareme = BaremeImpot();
    monBareme.classe = parclasse;
    monBareme.mntimposable = mntentier;

    if (monBareme.bareme2025()) {
      // Impôt de base
      dImpot = ((mntentier * monBareme.pourcentage) / 100) - monBareme.mntdeductible;

      // Arrondi au dixième inférieur
      dTemp = (((dImpot * 10) + 0.0001).floorToDouble()) / 10;
      dImpot = dTemp;

      // Majoration solidarité
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

      // Arrondi au dixième inférieur
      iTemp3 = (((dImpot * 10) + 0.0001).floorToDouble()) / 10;
      dImpot = iTemp3;
    }

    return dImpot;
  }

  // Calcul impot 2024
  double CalculImpot2024({required double parimposable, required int parclasse}) {
    double dImpot = 0;

    double txSolid = 1.04;
    double deducSolid = 0;
    double temp1;
    double temp2;
    double mntentier = 0;
    double mntentier1;
    double iTemp;
    double dTemp;
    double iTemp3;

    // Arrondi au 5 € le plus proche
    mntentier1 = parimposable.floorToDouble();

    temp1 = ((mntentier1 + 5.0001) / 10).floorToDouble();
    temp2 = ((mntentier1 + 0.0001) / 10).floorToDouble();

    if ((temp1 - temp2) > 0) {
      mntentier = (mntentier1 / 10).floorToDouble() * 10 + 5;
    } else {
      mntentier = (mntentier1 / 10).floorToDouble() * 10;
    }

    final monBareme = BaremeImpot();
    monBareme.classe = parclasse;
    monBareme.mntimposable = mntentier;

    if (monBareme.bareme2024()) {
      dImpot = ((mntentier * monBareme.pourcentage) / 100) - monBareme.mntdeductible;

      // Arrondi au dixième inférieur
      dTemp = (((dImpot * 10) + 0.0001).floorToDouble()) / 10;
      dImpot = dTemp;

      // Solidarité
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

      iTemp3 = (((dImpot * 10) + 0.0001).floorToDouble()) / 10;
      dImpot = iTemp3;
    }

    return dImpot;
  }

  // Calcul impot 2017
  double CalculImpot2017({required double parimposable, required int parclasse}) {
    double dImpot = 0;

    double txSolid = 1.04;
    double deducSolid = 0;
    double temp1;
    double temp2;
    double mntentier = 0;
    double mntentier1;
    double iTemp;
    double dTemp;
    double iTemp3;

    // Arrondi au 5 € le plus proche
    mntentier1 = parimposable.floorToDouble();

    temp1 = ((mntentier1 + 5.0001) / 10).floorToDouble();
    temp2 = ((mntentier1 + 0.0001) / 10).floorToDouble();

    if ((temp1 - temp2) > 0) {
      mntentier = (mntentier1 / 10).floorToDouble() * 10 + 5;
    } else {
      mntentier = (mntentier1 / 10).floorToDouble() * 10;
    }

    final monBareme = BaremeImpot();
    monBareme.classe = parclasse;
    monBareme.mntimposable = mntentier;

    if (monBareme.bareme2017()) {
      dImpot = ((mntentier * monBareme.pourcentage) / 100) - monBareme.mntdeductible;

      // Arrondi au dixième inférieur
      dTemp = (((dImpot * 10) + 0.0001).floorToDouble()) / 10;
      dImpot = dTemp;

      // Solidarité
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

      iTemp3 = (((dImpot * 10) + 0.0001).floorToDouble()) / 10;
      dImpot = iTemp3;
    }

    return dImpot;
  }
}
