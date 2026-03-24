import 'package:flutter_test/flutter_test.dart';
import 'package:i_apsal_test/core/models/salaire.dart';
import 'package:i_apsal_test/core/salary_calculator.dart';

void main() {
  group('Core Engine Calculations - 2026', () {
    test('Standard Gross to Net mapping', () {
      final calc = SalaryCalculator();
      final salaryParams = Salaire(
        iAnnee: 2026,
        iMois: 1, // Janvier
        dHMC: 173,
        dBrut: 3500.0,
        iclasse: 100, // Célibataire
        iMutualite: 1, // Classe mutualité 1
        bCalculCI: true, // Avec crédits d'impôt
      );

      calc.calculBrutNet(salaryParams);

      // Verify intermediate sums and final Net
      // Les asserts précis dépendront de la feuille de paie de test. 
      // On teste surtout que ça ne crash pas et que l'algo déroule l'imposable et l'impot.
      expect(salaryParams.dBrut, 3500.0);
      expect(salaryParams.dCotisCMS > 0, true);
      expect(salaryParams.dCotisCMP > 0, true);
      expect(salaryParams.dimposable > 0, true);
      expect(salaryParams.dNet > 0, true);
      
      // Let's print out the Net to see what the direct port yields
      print('Gross: 3500.00 €, Net calculated: ${salaryParams.dNet} €');
      print('Taxes (Impot): ${salaryParams.dImpot} €');
    });

    test('Iterative Net to Gross mapping', () {
      final calc = SalaryCalculator();
      final targetNet = 2834.68; // Exemple d'un Net connu
      
      final salaryParams = Salaire(
        iAnnee: 2026,
        iMois: 1,
        dHMC: 173,
        dNet: targetNet,
        iclasse: 100,
        iMutualite: 1,
        bCalculCI: true,
      );

      // This should iteratively find the dBrut
      calc.calculNetBrut(salaryParams);
      
      print('Target Net: $targetNet €, Calculated Gross needed: ${salaryParams.dBrut} €');
      
      // Recalcule Brut->Net pour vérifier que la boucle marche bien
      final validationCalc = SalaryCalculator();
      final validationParams = Salaire(
        iAnnee: 2026,
        iMois: 1,
        dHMC: 173,
        dBrut: salaryParams.dBrut,
        iclasse: 100,
        iMutualite: 1,
        bCalculCI: true,
      );
      
      validationCalc.calculBrutNet(validationParams);
      
      // The validation Net should be very close to our target Net
      expect((validationParams.dNet - targetNet).abs() < 1.0, true);
    });
  });
}
