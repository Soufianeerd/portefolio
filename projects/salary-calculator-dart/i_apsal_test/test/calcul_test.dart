import 'package:flutter_test/flutter_test.dart';
import 'package:i_apsal_test/core/models/salaire.dart';
import 'package:i_apsal_test/core/models/calcul.dart';

void main() {
  test('Brut 3500 → Net 2834.68', () {
    final s = Salaire();
    s.iAnnee = 2026; 
    s.iMois = 1; 
    s.dBrut = 3500;
    s.iclasse = 100; 
    s.iMutualite = 0; 
    s.dHMC = 173;
    s.bCalculCI = true; 
    s.swTxImpots = false;
    
    Calcul().calculBrutNet(voSalaire: s);
    
    expect(s.dNet, equals(2834.68));
  });

  test('Net 4000 → Brut 5668.29', () {
    final s = Salaire();
    s.iAnnee = 2026; 
    s.iMois = 1; 
    s.dNet = 4000;
    s.dBrut = 4000; // point de départ
    s.iclasse = 100; 
    s.iMutualite = 0; 
    s.dHMC = 173;
    s.bCalculCI = true; 
    s.swTxImpots = false;
    
    Calcul().calculNetBrut(voSalaire: s);
    
    expect(s.dBrut, equals(5668.29));
  });
}
