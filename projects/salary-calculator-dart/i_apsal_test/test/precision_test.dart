import 'package:flutter_test/flutter_test.dart';
import 'package:i_apsal_test/core/models/salaire.dart';
import 'package:i_apsal_test/core/salary_calculator.dart';

void main() {
  group('Precision Verification - Edge Cases from PDF', () {
    test('Brut 3500.00 € -> Net 2834.68 €', () {
      final calc = SalaryCalculator();
      final salaire = Salaire(
        iAnnee: 2026,
        iMois: 1,
        dHMC: 173,
        dBrut: 3500.0,
        iclasse: 100, // Célibataire suppose
        iMutualite: 0,
        bCalculCI: true,
      );

      calc.calculBrutNet(salaire);
      expect(salaire.dNet, equals(2834.68));
    });

    test('Net 4000.00 € -> Brut 5668.29 €', () {
      final calc = SalaryCalculator();
      final salaire = Salaire(
        iAnnee: 2026,
        iMois: 1,
        dHMC: 173,
        dNet: 4000.0,
        iclasse: 100, // Célibataire suppose pour avoir ce resultat
        iMutualite: 0,
        bCalculCI: true,
      );

      calc.calculNetBrut(salaire);
      
      // Laissons l'erreur s'afficher si c'est pas exact pour voir la valeur
      print('Gross calculated for Net 4000.00 €: ${salaire.dBrut}');
      // On s'attend à 5668.29
      expect((salaire.dBrut - 5668.29).abs() < 0.02, true, reason: 'Brut doit être 5668.29');
    });
  });
}
