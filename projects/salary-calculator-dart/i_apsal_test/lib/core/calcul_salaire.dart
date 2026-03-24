import 'models/salaire.dart';
import 'math_utils.dart';
import 'impots.dart';

/// Moteur principal de calcul de salaire. Calcule l'intégralité des cotisations,
/// de l'impôt, des crédits d'impôt et aboutit au Net.
/// Transposé fidèlement de `CalculSalaire.swift`.
class CalculSalaire {
  bool calculSalaire(Salaire voSalaire) {
    // Définition des paramètres cotisations
    double cms = 0.028;
    double cme = 0.0025;
    double cmp = 0.08;
    double cdep = 0.014;
    double plafondSecu = 12541.18;

    // Parts Patronales
    double sat = 0.0011;
    double asac = 0.0100;
    // Mutualité
    double mutu1 = 0.0051;
    double mutu2 = 0.0123;
    double mutu3 = 0.0183;
    double mutu4 = 0.0292;

    switch (voSalaire.iAnnee) {
      case 2026:
        asac = 0.0070;
        mutu1 = 0.0070;
        mutu2 = 0.0099;
        mutu3 = 0.0148;
        mutu4 = 0.0264;
        plafondSecu = 13518.68;
        cmp = 0.085;
        break;
      case 2025:
        asac = 0.0070;
        mutu1 = 0.0070;
        mutu2 = 0.0099;
        mutu3 = 0.0148;
        mutu4 = 0.0264;
        plafondSecu = 13518.68;
        break;
      case 2024:
        asac = 0.0075;
        mutu1 = 0.0072;
        mutu2 = 0.0122;
        mutu3 = 0.0176;
        mutu4 = 0.0284;
        plafondSecu = 12854.64;
        break;
      case 2023:
        plafondSecu = 12541.18;
        asac = 0.0075;
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
        asac = 0.0075;
        mutu1 = 0.0060;
        mutu2 = 0.0113;
        mutu3 = 0.0166;
        mutu4 = 0.0298;
        break;
      default:
        plafondSecu = 10355.50;
        asac = 0.0080;
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

    // Mise en mémoire du tx de pension pour affichage
    voSalaire.dTxCMP = cmp * 100;

    // Mettre 173 par défaut si pas de saisie de l'utilisateur
    if (voSalaire.dHMC == 0) {
      voSalaire.dHMC = 173.0;
    }

    // Calcul des cotisations

    // ************* Cotisable *********************
    double cotisable = voSalaire.dBrut + voSalaire.dAvNat;
    if (cotisable > plafondSecu) {
      cotisable = plafondSecu;
    }

    // ************* Parts Salariales *********************
    // **** CMS ****
    voSalaire.dCotisCMS = calculCotis(cotisable, cms);

    // **** CME ****
    double cotisCme = ClsMaths.myRound(voSalaire.dBrut, 2);
    if (cotisCme > plafondSecu) {
      cotisCme = plafondSecu;
    }
    voSalaire.dCotisCME = calculCotis(cotisCme, cme);

    // **** CMP ****
    voSalaire.dCotisCMP = calculCotis(cotisable, cmp);

    voSalaire.dHMC = ClsMaths.myRound(voSalaire.dHMC, 0);
    int iTemp = 0;

    // Calcul de la cotisation dépendance
    iTemp = ((plafondSecu / 20) * 1000).toInt();
    double dDeducDep = ClsMaths.myRound(iTemp / 1000, 2);
    iTemp = (((dDeducDep * voSalaire.dHMC) / 173) * 1000).toInt();
    dDeducDep = ClsMaths.myRound(iTemp / 1000, 2);

    iTemp = ((((voSalaire.dBrut + voSalaire.dAvNat) - dDeducDep) * cdep) * 1000).toInt();
    voSalaire.dCotisDep = ClsMaths.myRound(iTemp / 1000, 2);

    // ************* Parts Patronales *********************
    // Cotisation patronale santé au travail
    // **** SAT ****
    voSalaire.dCotisSATPatr = calculCotis(cotisable, sat);

    // Cotisation patronale Assurance Accident
    voSalaire.dCotisASACPatr = calculCotis(cotisable, asac);

    // Mutualité
    double txMutu = 0;
    switch (voSalaire.iMutualite + 1) { // Swift model was +1 shifted
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
    voSalaire.dCotisMutuPatr = calculCotis(cotisable, txMutu);

    // déclaration de la classe Impots
    Impots monCalculImpot = Impots();
    // classe impôt
    monCalculImpot.classe = voSalaire.iclasse;
    // renseignement de l'imposable
    monCalculImpot.imposable = voSalaire.dBrut + voSalaire.dAvNat - voSalaire.partsTrav() - voSalaire.dDeduc;
    voSalaire.dimposable = monCalculImpot.imposable;
    monCalculImpot.iAnnee = voSalaire.iAnnee;

    // ************* Impots **************
    switch (voSalaire.swTxImpots) {
      case false:
        // Calcul de l'impot normal
        if (monCalculImpot.calculImpot()) {
          voSalaire.dImpot = monCalculImpot.impot;
        }
        break;
      case true:
        // Taux personnalisé (ex: frontaliers mariés)
        iTemp = (voSalaire.dimposable * voSalaire.dTxImpot).toInt();
        double dTemp = ClsMaths.myRound(iTemp / 100, 2);
        // Arrondir au multiple inférieur de 10 cent
        double dTemp3 = 0;
        dTemp3 = ((dTemp * 10) + 0.0001).floorToDouble() / 10;
        voSalaire.dImpot = dTemp3;
        break;
    }

    // **************************
    // Calcul du CISSM
    voSalaire.dCISSM = calculCISSM(voSalaire.dBrut + voSalaire.dAvNat, voSalaire.dHMC, voSalaire.iAnnee, voSalaire.iMois);

    // ************* Crédit d'impôt ************
    switch (voSalaire.bCalculCI) {
      case false:
        voSalaire.dCI = 0;
        break;
      case true:
        voSalaire.dCI = calculCI(voSalaire.dBrut + voSalaire.dAvNat, voSalaire.iAnnee);
        if (voSalaire.iAnnee >= 2024) {
          voSalaire.dCICO2 = calculCICO2(voSalaire.dBrut + voSalaire.dAvNat, voSalaire.iAnnee);
        }

        // ************* CIC *********************
        if (voSalaire.iAnnee < 2024) {
          if (voSalaire.iAnnee == 2023 && voSalaire.iMois >= 6) {
            voSalaire.dCIC = calculCIC(voSalaire.dBrut + voSalaire.dAvNat);
          }
        }
        break;
    }
    // CIE arrêté fin mars 2023
    if (voSalaire.iAnnee == 2023 && voSalaire.iMois < 4) {
      voSalaire.dCIE = calculCIE(voSalaire.dBrut + voSalaire.dAvNat);
    }

    // *************
    // Calcul du total
    voSalaire.dNet = voSalaire.dBrut - voSalaire.dImpot;
    // Calcul du net
    double dResNet = voSalaire.dBrut -
        voSalaire.partsTrav() -
        voSalaire.dCotisDep -
        voSalaire.dImpot +
        voSalaire.dCI +
        voSalaire.dCICO2 +
        voSalaire.dCIC +
        voSalaire.dCISSM;

    // *************
    // Calcul du Net final arrondi
    iTemp = (dResNet * 1000).toInt();
    voSalaire.dNet = ClsMaths.myRound(iTemp / 1000, 2);

    return true;
  }

  double calculCotis(double dMntCotisable, double taux) {
    int iTemp = ((dMntCotisable * taux) * 1000).toInt();
    double dTemp = ClsMaths.myRound(iTemp / 1000, 2);
    return dTemp;
  }

  // **************************
  // Calcul du CISSM
  double calculCISSM(double dMntBrut, double dHMC, int annee, int mois) {
    double mntCISSM = 0;

    int iTemp = ((dMntBrut / dHMC) * hmcSecu(annee, mois)).toInt() * 1000;
    double dMntBrutCISSM = ClsMaths.myRound(iTemp / 1000, 2);

    if (dMntBrutCISSM >= 1800.0 && dMntBrutCISSM < 3000.0) {
      mntCISSM = 70.00;
    } else {
      if (dMntBrutCISSM >= 3000.0 && dMntBrutCISSM <= 3600.0) {
        mntCISSM = (70 / 600) * (3600 - dMntBrutCISSM);
        // arrondi au cent supérieur
        double ddd = 0;
        ddd = (mntCISSM * 100).ceilToDouble() / 100;
        mntCISSM = ddd;

        if (mntCISSM > 70) {
          mntCISSM = 70;
        }
      } else {
        mntCISSM = 0;
      }
    }
    return mntCISSM;
  }

  // **************************
  // Calcul du CI-CO2
  double calculCICO2(double dMntBrut, int annee) {
    double mntCICO2 = 0;
    double dTemp = dMntBrut * 12;

    if (annee >= 2026) {
      if (dTemp < 936) {
        mntCICO2 = 0;
      } else {
        if (dTemp < 40000) {
          mntCICO2 = 18;
        } else {
          if (dTemp < 80000) {
            mntCICO2 = (216 - (dTemp - 40000) * 0.0054) / 12;
          } else {
            mntCICO2 = 0;
          }
        }
      }
    } else if (annee == 2025) {
      if (dTemp < 936) {
        mntCICO2 = 0;
      } else {
        if (dTemp < 40000) {
          mntCICO2 = 16;
        } else {
          if (dTemp < 80000) {
            mntCICO2 = (192 - (dTemp - 40000) * 0.0048) / 12;
          } else {
            mntCICO2 = 0;
          }
        }
      }
    } else if (annee == 2024) {
      if (dTemp < 936) {
        mntCICO2 = 0;
      } else {
        if (dTemp < 40000) {
          mntCICO2 = 14;
        } else {
          if (dTemp < 80000) {
            mntCICO2 = (168 - (dTemp - 40000) * 0.0042) / 12;
          } else {
            mntCICO2 = 0;
          }
        }
      }
    } else {
      if (dTemp < 936) {
        mntCICO2 = 0;
      } else {
        if (dTemp < 40000) {
          mntCICO2 = 12;
        } else {
          if (dTemp < 80000) {
            mntCICO2 = (144 - (dTemp - 40000) * 0.0036) / 12;
          } else {
            mntCICO2 = 0;
          }
        }
      }
    }

    return ClsMaths.roundUP(mntCICO2, 2);
  }

  // **************************
  // Calcul du CI
  double calculCI(double dMntBrut, int annee) {
    double mntCI = 0;

    if (annee >= 2026) {
      double dTemp = dMntBrut * 12;
      if (dTemp < 936) {
        mntCI = 0;
      } else {
        if (dTemp < 11266) {
          mntCI = (300 + (dTemp - 936) * 0.029) / 12;
        } else {
          if (dTemp < 40000) {
            mntCI = 50;
          } else {
            if (dTemp < 80000) {
              mntCI = (600 - (dTemp - 40000) * 0.015) / 12;
            } else {
              mntCI = 0;
            }
          }
        }
      }
    } else if (annee == 2025 || annee == 2024) {
      // 2024 and 2025 follow this CI calculation identically to < 2024 swift logic here
      double dTemp = dMntBrut * 12;
      if (dTemp < 936) {
        mntCI = 0;
      } else {
        if (dTemp < 11266) {
          mntCI = (300 + (dTemp - 936) * 0.029) / 12;
        } else {
          if (dTemp < 40000) {
            mntCI = 50;
          } else {
            if (dTemp < 80000) {
              mntCI = (600 - (dTemp - 40000) * 0.015) / 12;
            } else {
              mntCI = 0;
            }
          }
        }
      }
    } else {
      double dTemp = dMntBrut * 12;
      if (dTemp < 936) {
        mntCI = 0;
      } else {
        if (dTemp < 11266) {
          mntCI = (396 + (dTemp - 936) * 0.029) / 12;
        } else {
          if (dTemp < 40000) {
            mntCI = 58;
          } else {
            if (dTemp < 80000) {
              mntCI = (696 - (dTemp - 40000) * 0.0174) / 12;
            } else {
              mntCI = 0;
            }
          }
        }
      }
    }

    return ClsMaths.roundUP(mntCI, 2);
  }

  // **************************
  // Calcul du CIC
  double calculCIC(double dMntBrut) {
    double mntCIC = 0;

    if (dMntBrut < 1125) {
      mntCIC = 0;
    } else if (dMntBrut <= 1250) {
      mntCIC = (dMntBrut - 1125) * (4 / 125);
    } else if (dMntBrut <= 2100) {
      mntCIC = ((dMntBrut - 1250) * (3 / 850)) + 4;
    } else if (dMntBrut <= 4600) {
      mntCIC = ((dMntBrut - 2100) * (37 / 2500)) + 7;
    } else if (dMntBrut <= 9500) {
      mntCIC = 44;
    } else if (dMntBrut <= 9925) {
      mntCIC = ((dMntBrut - 9500) * (4 / 425)) + 44;
    } else if (dMntBrut <= 14175) {
      mntCIC = 48;
    } else if (dMntBrut <= 14916) {
      mntCIC = ((dMntBrut - 14175) * (3 / 356)) + 48;
    } else {
      mntCIC = 54.25;
    }

    return ClsMaths.roundUP(mntCIC, 2);
  }

  // **************************
  // Calcul du CIE
  double calculCIE(double dMntBrut) {
    double mntCIE = 0;
    // si < 79 ou > 8333 lors 0
    if (dMntBrut < 79 || dMntBrut > 8333) {
      mntCIE = 0;
    } else {
      if (dMntBrut < 3667) {
        mntCIE = 84;
      } else {
        if (dMntBrut < 5667) {
          mntCIE = (84 - ((dMntBrut - 3667) * (8 / 2000)));
        } else {
          if (dMntBrut < 8334) {
            mntCIE = (76 - ((dMntBrut - 5667) * (76 / 2667)));
          } else {
            mntCIE = 0;
          }
        }
      }
    }

    return ClsMaths.roundUP(mntCIE, 2);
  }

  // ***********************************
  // Calcul des heures mois complet sécu
  // (jours du mois - les samedi et dimanche) * 8
  // ***********************************
  int hmcSecu(int annee, int mois) {
    try {
      DateTime firstDay = DateTime(annee, mois, 1);
      int daysInMonth = 0;
      
      // Trouver le nombre de jours dans le mois
      if (mois == 12) {
        daysInMonth = 31;
      } else {
        DateTime lastDay = DateTime(annee, mois + 1, 0);
        daysInMonth = lastDay.day;
      }

      int lhmc = 0;
      // Boucle sur les jours du mois pour compter les jours ouvrés (Lundi au Vendredi)
      for (int i = 1; i <= daysInMonth; i++) {
        DateTime date = DateTime(annee, mois, i);
        if (date.weekday >= 1 && date.weekday <= 5) {
          lhmc++;
        }
      }
      return lhmc * 8;
    } catch (_) {
      // Default to roughly 173 if parsing fails for any reason
      return 173;
    }
  }
}
