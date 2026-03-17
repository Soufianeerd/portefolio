import '../models/salaire.dart';
import 'calculsalaire.dart';

class Calcul {
  /// Calcul Brut -> Net
  bool calculBrutNet({required Salaire voSalaire}) {
    final lCalcul = CalculSalaire();
    final bool lResult = lCalcul.calculSalaire(voSalaire: voSalaire);
    return lResult;
  }

  
  bool calculNetBrut({required Salaire voSalaire}) {
    final lCalcul = CalculSalaire();

    double netRecherche = voSalaire.dNet;
    double dNet = 0;
    int safeGuard = 0;

    while (dNet < netRecherche) {
      // Sécurité anti-boucle infinie
      if (safeGuard++ > 2000) {
        break;
      }

      final bool lResult = lCalcul.calculSalaire(voSalaire: voSalaire);

      if (lResult) {
        dNet = voSalaire.dNet;

        if (dNet < netRecherche) {
          final double diff = netRecherche - dNet;

          if (diff > 10000000) {
            voSalaire.dBrut = voSalaire.dBrut + 100000;
          } else if (diff > 5000000) {
            voSalaire.dBrut = voSalaire.dBrut + 500000;
          } else if (diff > 2000000) {
            voSalaire.dBrut = voSalaire.dBrut + 2000000;
          } else if (diff > 1000000) {
            voSalaire.dBrut = voSalaire.dBrut + 1000000;
          } else if (diff > 500000) {
            voSalaire.dBrut = voSalaire.dBrut + 500000;
          } else if (diff > 200000) {
            voSalaire.dBrut = voSalaire.dBrut + 200000;
          } else if (diff > 100000) {
            voSalaire.dBrut = voSalaire.dBrut + 100000;
          } else if (diff > 50000) {
            voSalaire.dBrut = voSalaire.dBrut + 50000;
          } else if (diff > 20000) {
            voSalaire.dBrut = voSalaire.dBrut + 20000;
          } else if (diff > 10000) {
            voSalaire.dBrut = voSalaire.dBrut + 10000;
          } else if (diff > 5000) {
            voSalaire.dBrut = voSalaire.dBrut + 5000;
          } else if (diff > 1000) {
            voSalaire.dBrut = voSalaire.dBrut + 1000;
          } else if (diff > 500) {
            voSalaire.dBrut = voSalaire.dBrut + 500;
          } else if (diff > 400) {
            voSalaire.dBrut = voSalaire.dBrut + 400;
          } else if (diff > 300) {
            voSalaire.dBrut = voSalaire.dBrut + 300;
          } else if (diff > 200) {
            voSalaire.dBrut = voSalaire.dBrut + 200;
          } else if (diff > 100) {
            voSalaire.dBrut = voSalaire.dBrut + 100;
          } else if (diff > 50) {
            voSalaire.dBrut = voSalaire.dBrut + 50;
          } else if (diff > 40) {
            voSalaire.dBrut = voSalaire.dBrut + 40;
          } else if (diff > 30) {
            voSalaire.dBrut = voSalaire.dBrut + 30;
          } else if (diff > 20) {
            voSalaire.dBrut = voSalaire.dBrut + 20;
          } else if (diff > 10) {
            voSalaire.dBrut = voSalaire.dBrut + 10;
          } else if (diff > 9) {
            voSalaire.dBrut = voSalaire.dBrut + 9;
          } else if (diff > 8) {
            voSalaire.dBrut = voSalaire.dBrut + 8;
          } else if (diff > 7) {
            voSalaire.dBrut = voSalaire.dBrut + 7;
          } else if (diff > 6) {
            voSalaire.dBrut = voSalaire.dBrut + 6;
          } else if (diff > 5) {
            voSalaire.dBrut = voSalaire.dBrut + 5;
          } else if (diff > 4) {
            voSalaire.dBrut = voSalaire.dBrut + 4;
          } else if (diff > 3) {
            voSalaire.dBrut = voSalaire.dBrut + 3;
          } else if (diff > 2) {
            voSalaire.dBrut = voSalaire.dBrut + 2;
          } else if (diff > 1) {
            voSalaire.dBrut = voSalaire.dBrut + 1;
          } else if (diff > 0.5) {
            voSalaire.dBrut = voSalaire.dBrut + 0.5;
          } else if (diff > 0.1) {
            voSalaire.dBrut = voSalaire.dBrut + 0.1;
          } else if (diff > 0.01) {
            voSalaire.dBrut = voSalaire.dBrut + 0.01;
          } else {
            voSalaire.dBrut = voSalaire.dBrut + 0.01;
          }
        }
      } else {
        break;
      }
    }

    // Arrondir le résultat pour corriger l'erreur de précision en virgule flottante
    voSalaire.dBrut = double.parse(voSalaire.dBrut.toStringAsFixed(2));

    return true;
  }
}
