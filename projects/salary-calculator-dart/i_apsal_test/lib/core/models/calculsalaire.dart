import 'package:i_apsal_test/core/models/salaire.dart';
import 'package:i_apsal_test/core/models/mathsUtils.dart';
import 'package:i_apsal_test/core/models/impots.dart';

class CalculSalaire {
  final MathsUtils _maths = MathsUtils();

  bool calculSalaire({required Salaire voSalaire}) {
    const double CMS = 0.028;
    const double CME = 0.0025;
    double CMP = 0.08;
    const double CDEP = 0.014;
    double plafondSecu = 12541.18;

    const double SAT = 0.0011;
    double ASAC = 0.0100;

    double mutu1 = 0.0051;
    double mutu2 = 0.0123;
    double mutu3 = 0.0183;
    double mutu4 = 0.0292;

    switch (voSalaire.iAnnee) {
      case 2026:
        ASAC = 0.0070;
        mutu1 = 0.0070; // Swift: Mutu1 = 0.0070 (CalculSalaire.swift l.40)
        mutu2 = 0.0099;
        mutu3 = 0.0148;
        mutu4 = 0.0264;
        plafondSecu = 13518.68;
        CMP = 0.085;
        break;
      case 2025:
        ASAC = 0.0070;
        mutu1 = 0.0070;
        mutu2 = 0.0099;
        mutu3 = 0.0148;
        mutu4 = 0.0264;
        plafondSecu = 13518.68;
        break;
      case 2024:
        ASAC = 0.0075;
        mutu1 = 0.0072;
        mutu2 = 0.0122;
        mutu3 = 0.0176;
        mutu4 = 0.0284;
        plafondSecu = 12854.64;
        break;
      case 2023:
        plafondSecu = 12541.18;
        ASAC = 0.0075;
        mutu1 = 0.0072;
        mutu2 = 0.0122;
        mutu3 = 0.0176;
        mutu4 = 0.0284;
        switch (voSalaire.iMois) {
          case 4:
            plafondSecu = 12541.18;
            break;
          case 9:
            plafondSecu = 12854.64;
            break;
          default:
            plafondSecu = 12854.64;
            break;
        }
        break;
      case 2022:
        plafondSecu = 10355.50;
        ASAC = 0.0075;
        mutu1 = 0.0060;
        mutu2 = 0.0113;
        mutu3 = 0.0166;
        mutu4 = 0.0298;
        break;
      default:
        plafondSecu = 10355.50;
        ASAC = 0.0080;
        mutu1 = 0.0041;
        mutu2 = 0.0107;
        mutu3 = 0.0163;
        mutu4 = 0.0279;
        break;
    }

    voSalaire.dCotisSecuPatr = 0;
    voSalaire.dCotisMutuPatr = 0;
    voSalaire.dCotisASACPatr = 0;
    voSalaire.dCotisSATPatr = 0;

    voSalaire.dTxCMP = CMP * 100;

    if (voSalaire.dHMC == 0) {
      voSalaire.dHMC = 173.0;
    }

    double cotisable = voSalaire.dBrut + voSalaire.dAvNat;
    if (cotisable > plafondSecu) {
      cotisable = plafondSecu;
    }

    voSalaire.dCotisCMS = calculCotis(dMntCotisable: cotisable, taux: CMS);

    double cotisCME = _maths.myRound(dbVal: voSalaire.dBrut, nPlaces: 2);
    if (cotisCME > plafondSecu) {
      cotisCME = plafondSecu;
    }
    voSalaire.dCotisCME = calculCotis(dMntCotisable: cotisCME, taux: CME);

    voSalaire.dCotisCMP = calculCotis(dMntCotisable: cotisable, taux: CMP);

    voSalaire.dHMC = _maths.myRound(dbVal: voSalaire.dHMC, nPlaces: 0);

    int iTemp = 0;

    iTemp = ((plafondSecu / 20) * 1000).toInt();
    double dDeducDep = _maths.myRound(dbVal: iTemp / 1000.0, nPlaces: 2);
    iTemp = (((dDeducDep * voSalaire.dHMC) / 173) * 1000).toInt();
    dDeducDep = _maths.myRound(dbVal: iTemp / 1000.0, nPlaces: 2);

    iTemp = (((voSalaire.dBrut + voSalaire.dAvNat - dDeducDep) * CDEP) * 1000)
        .toInt();
    voSalaire.dCotisDep = _maths.myRound(dbVal: iTemp / 1000.0, nPlaces: 2);

    // Parts patronales : SAT + ASAC + Mutualité
    // Note : dCotisSecuPatr reste à 0 (conforme à la logique Swift originale)
    voSalaire.dCotisSATPatr =
        calculCotis(dMntCotisable: cotisable, taux: SAT);
    voSalaire.dCotisASACPatr =
        calculCotis(dMntCotisable: cotisable, taux: ASAC);

    double txMutu = 0;
    // Conforme Swift : switch (voSalaire.iMutualite + 1)
    // iMutualite = 0 → Mutu1, 1 → Mutu2, 2 → Mutu3, 3 → Mutu4
    switch (voSalaire.iMutualite + 1) {
      case 1:
        txMutu = mutu1;
        break;
      case 2:
        txMutu = mutu2;
        break;
      case 3:
        txMutu = mutu3;
        break;
      case 4:
        txMutu = mutu4;
        break;
      default:
        break;
    }
    voSalaire.dCotisMutuPatr =
        calculCotis(dMntCotisable: cotisable, taux: txMutu);

    // Impôts
    final monCalculImpot = Impots();
    monCalculImpot.classe = voSalaire.iclasse;
    monCalculImpot.imposable = voSalaire.dBrut +
        voSalaire.dAvNat -
        voSalaire.partsTrav() -
        voSalaire.dDeduc;
    voSalaire.dimposable = monCalculImpot.imposable;
    monCalculImpot.iAnnee = voSalaire.iAnnee;

    switch (voSalaire.swTxImpots) {
      case false:
        if (monCalculImpot.CalculImpot()) {
          voSalaire.dImpot = monCalculImpot.impot;
        }
        break;
      case true:
        iTemp = (voSalaire.dimposable * voSalaire.dTxImpot).toInt();
        final double dTemp = _maths.myRound(dbVal: iTemp / 100.0, nPlaces: 2);
        final double dTemp3 = ((dTemp * 10) + 0.0001).floorToDouble() / 10;
        voSalaire.dImpot = dTemp3;
        break;
    }

    // CISSM
    voSalaire.dCISSM = calculCISSM(
      dMntBrut: voSalaire.dBrut + voSalaire.dAvNat,
      dHMC: voSalaire.dHMC,
      annee: voSalaire.iAnnee,
      mois: voSalaire.iMois,
    );

    // CIM (Crédit d'Impôt Monoparental)
    switch (voSalaire.bCalculCIM) {
      case false:
        voSalaire.dCIM = 0;
        break;
      case true:
        voSalaire.dCIM = calculCIM(
          dMntBrut: voSalaire.dBrut + voSalaire.dAvNat,
          annee: voSalaire.iAnnee,
        );
        break;
    }

    // Crédit d'impôt
    switch (voSalaire.bCalculCI) {
      case false:
        voSalaire.dCI = 0;
        break;
      case true:
        voSalaire.dCI = calculCI(
          dMntBrut: voSalaire.dBrut + voSalaire.dAvNat,
          annee: voSalaire.iAnnee,
        );

        if (voSalaire.iAnnee >= 2024) {
          voSalaire.dCICO2 = calculCICO2(
            dMntBrut: voSalaire.dBrut + voSalaire.dAvNat,
            annee: voSalaire.iAnnee,
          );
        }

        if (voSalaire.iAnnee < 2024) {
          if (voSalaire.iAnnee == 2023 && voSalaire.iMois >= 6) {
            voSalaire.dCIC =
                calculCIC(dMntBrut: voSalaire.dBrut + voSalaire.dAvNat);
          }
        }
        break;
    }

    if (voSalaire.iAnnee == 2023 && voSalaire.iMois < 4) {
      voSalaire.dCIE =
          calculCIE(dMntBrut: voSalaire.dBrut + voSalaire.dAvNat);
    }

    // Net
    final double dResNet = voSalaire.dBrut -
        voSalaire.partsTrav() -
        voSalaire.dCotisDep -
        voSalaire.dImpot +
        voSalaire.dCI +
        voSalaire.dCICO2 +
        voSalaire.dCIC +
        voSalaire.dCISSM +
        voSalaire.dCIM;

    iTemp = (dResNet * 1000).toInt();
    voSalaire.dNet = _maths.myRound(dbVal: iTemp / 1000.0, nPlaces: 2);

    return true;
  }

  double calculCotis({required double dMntCotisable, required double taux}) {
    final int iTemp = (dMntCotisable * taux * 1000).toInt();
    return _maths.myRound(dbVal: iTemp / 1000.0, nPlaces: 2);
  }

  double calculCISSM({
    required double dMntBrut,
    required double dHMC,
    required int annee,
    required int mois,
  }) {
    double mntCISSM = 0;

    final int iTemp =
        ((dMntBrut / dHMC) * HMC_Secu(annee: annee, mois: mois)).toInt() * 1000;
    final double dMntBrutCISSM =
        _maths.myRound(dbVal: iTemp / 1000.0, nPlaces: 2);

    if (dMntBrutCISSM >= 1800.0 && dMntBrutCISSM < 3000.0) {
      mntCISSM = 70.00;
    } else if (dMntBrutCISSM >= 3000.0 && dMntBrutCISSM <= 3600.0) {
      mntCISSM = (70 / 600) * (3600 - dMntBrutCISSM);
      mntCISSM = (mntCISSM * 100).ceil() / 100;
      if (mntCISSM > 70) mntCISSM = 70;
    } else {
      mntCISSM = 0;
    }

    return mntCISSM;
  }

  double calculCICO2({required double dMntBrut, required int annee}) {
    double mntCICO2 = 0;
    final double dTemp = dMntBrut * 12;

    if (annee >= 2026) {
      if (dTemp < 936) {
        mntCICO2 = 0;
      } else if (dTemp < 40000) {
        mntCICO2 = 18;
      } else if (dTemp < 80000) {
        mntCICO2 = (216 - (dTemp - 40000) * 0.0054) / 12;
      } else {
        mntCICO2 = 0;
      }
    } else if (annee == 2025) {
      if (dTemp < 936) {
        mntCICO2 = 0;
      } else if (dTemp < 40000) {
        mntCICO2 = 16;
      } else if (dTemp < 80000) {
        mntCICO2 = (192 - (dTemp - 40000) * 0.0048) / 12;
      } else {
        mntCICO2 = 0;
      }
    } else if (annee == 2024) {
      if (dTemp < 936) {
        mntCICO2 = 0;
      } else if (dTemp < 40000) {
        mntCICO2 = 14;
      } else if (dTemp < 80000) {
        mntCICO2 = (168 - (dTemp - 40000) * 0.0042) / 12;
      } else {
        mntCICO2 = 0;
      }
    } else {
      if (dTemp < 936) {
        mntCICO2 = 0;
      } else if (dTemp < 40000) {
        mntCICO2 = 12;
      } else if (dTemp < 80000) {
        mntCICO2 = (144 - (dTemp - 40000) * 0.0036) / 12;
      } else {
        mntCICO2 = 0;
      }
    }

    return _maths.roundUP(dbVal: mntCICO2, decPlace: 2);
  }

  double calculCI({required double dMntBrut, required int annee}) {
    double mntCI = 0;
    final double dTemp = dMntBrut * 12;

    if (annee >= 2024) {
      if (dTemp < 936) {
        mntCI = 0;
      } else if (dTemp < 11266) {
        mntCI = (300 + (dTemp - 936) * 0.029) / 12;
      } else if (dTemp < 40000) {
        mntCI = 50;
      } else if (dTemp < 80000) {
        mntCI = (600 - (dTemp - 40000) * 0.015) / 12;
      } else {
        mntCI = 0;
      }
    } else {
      if (dTemp < 936) {
        mntCI = 0;
      } else if (dTemp < 11266) {
        mntCI = (396 + (dTemp - 936) * 0.029) / 12;
      } else if (dTemp < 40000) {
        mntCI = 58;
      } else if (dTemp < 80000) {
        mntCI = (696 - (dTemp - 40000) * 0.0174) / 12;
      } else {
        mntCI = 0;
      }
    }

    return _maths.roundUP(dbVal: mntCI, decPlace: 2);
  }

  double calculCIM({required double dMntBrut, required int annee}) {
    double mntCIM = 0;
    final double dTemp = dMntBrut * 12;

    if (annee >= 2025) {
      if (dTemp < 60000) {
        mntCIM = 3504 / 12;
      } else if (dTemp <= 105000) {
        mntCIM = (3504 - (dTemp - 60000) * 0.0612) / 12;
      } else {
        mntCIM = 750 / 12;
      }
    } else {
      if (dTemp < 60000) {
        mntCIM = 2505 / 12;
      } else if (dTemp <= 105000) {
        mntCIM = (2505 - (dTemp - 60000) * 0.039) / 12;
      } else {
        mntCIM = 750 / 12;
      }
    }

    return _maths.roundUP(dbVal: mntCIM, decPlace: 2);
  }

  double calculCIC({required double dMntBrut}) {
    double mntCIC = 0;

    if (dMntBrut < 1125) {
      mntCIC = 0;
    } else if (dMntBrut <= 1250) {
      mntCIC = (dMntBrut - 1125) * (4.0 / 125.0);
    } else if (dMntBrut <= 2100) {
      mntCIC = ((dMntBrut - 1250) * (3.0 / 850.0)) + 4;
    } else if (dMntBrut <= 4600) {
      mntCIC = ((dMntBrut - 2100) * (37.0 / 2500.0)) + 7;
    } else if (dMntBrut <= 9500) {
      mntCIC = 44;
    } else if (dMntBrut <= 9925) {
      mntCIC = ((dMntBrut - 9500) * (4.0 / 425.0)) + 44;
    } else if (dMntBrut <= 14175) {
      mntCIC = 48;
    } else if (dMntBrut <= 14916) {
      mntCIC = ((dMntBrut - 14175) * (3.0 / 356.0)) + 48;
    } else {
      mntCIC = 54.25;
    }

    return _maths.roundUP(dbVal: mntCIC, decPlace: 2);
  }

  double calculCIE({required double dMntBrut}) {
    double mntCIE = 0;

    if (dMntBrut < 79 || dMntBrut > 8333) {
      mntCIE = 0;
    } else if (dMntBrut < 3667) {
      mntCIE = 84;
    } else if (dMntBrut < 5667) {
      mntCIE = 84 - ((dMntBrut - 3667) * (8.0 / 2000.0));
    } else if (dMntBrut < 8334) {
      mntCIE = 76 - ((dMntBrut - 5667) * (76.0 / 2667.0));
    } else {
      mntCIE = 0;
    }

    return _maths.roundUP(dbVal: mntCIE, decPlace: 2);
  }

  double HMC_Secu({required int annee, required int mois}) {
    final int daysInMonth = DateTime(annee, mois + 1, 0).day;
    int lhmc = 0;

    for (int day = 1; day <= daysInMonth; day++) {
      final date = DateTime(annee, mois, day);
      final int weekday = date.weekday;
      if (weekday >= 1 && weekday <= 5) lhmc += 1;
    }

    return lhmc * 8.0;
  }
}
