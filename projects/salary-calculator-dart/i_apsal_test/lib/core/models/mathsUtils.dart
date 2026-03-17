
import 'dart:math' as math;

/// Équivalent Dart de clsMaths.swift
class MathsUtils {
  /// myRound(dbVal:nPlaces:)
  /// Arrondi "half-up" à n décimales
  double myRound({required double dbVal, required int nPlaces}) {
    final double factor = math.pow(10.0, nPlaces).toDouble();
    return (dbVal * factor + 0.5).floorToDouble() / factor;
  }

  /// RoundUP(dbVal:Decplace:)
  /// Dans le code Swift, Decplace n’est jamais utilisé.
  /// L’implémentation Swift fait toujours : ceil(val * 100) / 100
  double roundUP({required double dbVal, required int decPlace}) {
    return (dbVal * 100).ceilToDouble() / 100;
  }
}

