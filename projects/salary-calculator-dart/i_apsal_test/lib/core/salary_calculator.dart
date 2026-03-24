import 'models/salaire.dart';
import 'calcul_salaire.dart';

/// Services gérant le calcul Brut->Net et Net->Brut
/// Transposé fidèlement de `Calcul.swift`.
class SalaryCalculator {
  /// Calcule le salaire net à partir du brut
  bool calculBrutNet(Salaire voSalaire) {
    CalculSalaire lCalcul = CalculSalaire();
    bool lResult = lCalcul.calculSalaire(voSalaire);
    return lResult;
  }

  /// Calcule le salaire brut à partir du net (algorithme par itérations)
  bool calculNetBrut(Salaire voSalaire) {
    CalculSalaire lCalcul = CalculSalaire();
    double netRecherche = voSalaire.dNet;
    double dNet = 0;

    // L'approche itérative très bas niveau de Swift
    // On ajoute progressivement au brut jusqu'à atteindre ou dépasser le net recherché.
    while (dNet < netRecherche) {
      bool lResult = lCalcul.calculSalaire(voSalaire);

      if (lResult) {
        dNet = voSalaire.dNet;
        if (dNet < netRecherche) {
          double diff = netRecherche - dNet;

          // Même logique de seuils successifs que l'original
          if (diff > 10000000) {
            voSalaire.dBrut += 100000;
          } else if (diff > 5000000) {
            voSalaire.dBrut += 500000;
          } else if (diff > 2000000) {
            voSalaire.dBrut += 2000000;
          } else if (diff > 1000000) {
            voSalaire.dBrut += 1000000;
          } else if (diff > 500000) {
            voSalaire.dBrut += 500000;
          } else if (diff > 200000) {
            voSalaire.dBrut += 200000;
          } else if (diff > 100000) {
            voSalaire.dBrut += 100000;
          } else if (diff > 50000) {
            voSalaire.dBrut += 50000;
          } else if (diff > 20000) {
            voSalaire.dBrut += 20000;
          } else if (diff > 10000) {
            voSalaire.dBrut += 10000;
          } else if (diff > 5000) {
            voSalaire.dBrut += 5000;
          } else if (diff > 1000) {
            voSalaire.dBrut += 1000;
          } else if (diff > 500) {
            voSalaire.dBrut += 500;
          } else if (diff > 400) {
            voSalaire.dBrut += 400;
          } else if (diff > 300) {
            voSalaire.dBrut += 300;
          } else if (diff > 200) {
            voSalaire.dBrut += 200;
          } else if (diff > 100) {
            voSalaire.dBrut += 100;
          } else if (diff > 50) {
            voSalaire.dBrut += 50;
          } else if (diff > 40) {
            voSalaire.dBrut += 40;
          } else if (diff > 30) {
            voSalaire.dBrut += 30;
          } else if (diff > 20) {
            voSalaire.dBrut += 20;
          } else if (diff > 10) {
            voSalaire.dBrut += 10;
          } else if (diff > 9) {
            voSalaire.dBrut += 9;
          } else if (diff > 8) {
            voSalaire.dBrut += 8;
          } else if (diff > 7) {
            voSalaire.dBrut += 7;
          } else if (diff > 6) {
            voSalaire.dBrut += 6;
          } else if (diff > 5) {
            voSalaire.dBrut += 5;
          } else if (diff > 4) {
            voSalaire.dBrut += 4;
          } else if (diff > 3) {
            voSalaire.dBrut += 3;
          } else if (diff > 2) {
            // Note: Swift dit `> 2` brut = +2
            voSalaire.dBrut += 2;
          } else {
            // Si la différence est comprise entre 0 et 2, 
            // pour s'assurer qu'on ne boucle pas indéfiniment.
            // Le code Swift s'arrêtait à `> 2` mais un pas de 1 est nécessaire 
            // ou de 0.01 pour la précision au centime. L'ajoutons pour plus de fiabilité.
            voSalaire.dBrut += 0.01;
          }
        }
      } else {
        return false;
      }
    }
    
    // Assurer que le Net correspond exactement après convergence
    lCalcul.calculSalaire(voSalaire);
    return true;
  }
}
