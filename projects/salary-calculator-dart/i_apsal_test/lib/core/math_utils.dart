/// Utilitaires mathématiques fidèles à la logique Swift de iApsal
class ClsMaths {
  /// Arrondi une valeur à n décimales (round nearest, half away from zero)
  /// Équivalent à la fonction myRound dans CalculSalaire.swift
  static double myRound(double dbVal, int nPlaces) {
    double temp = double.parse('1' + '0' * nPlaces);
    return (dbVal * temp + 0.5).floorToDouble() / temp;
  }

  /// Arrondi au chiffre supérieur avec un nombre de décimales spécifié
  static double roundUP(double dbVal, int decplace) {
    double temp = double.parse('1' + '0' * decplace);
    return (dbVal * temp).ceilToDouble() / temp;
  }
}
