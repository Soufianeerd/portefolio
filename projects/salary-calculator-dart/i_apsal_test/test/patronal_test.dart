import 'package:flutter_test/flutter_test.dart';
import 'package:i_apsal_test/core/models/salaire.dart';
import 'package:i_apsal_test/core/models/calcul.dart';

// ============================================================
// Tests de vérification de la logique métier Swift → Dart
// Référence : CalculSalaire.swift, Salaire.swift
// Paramètres : Brut=3500, Année=2026, Mois=1, Classe=100
//              iMutualite=0 (Mutu1 via switch(iMutualite+1)=case1)
// ============================================================
//
// Taux 2026 (source Swift CalculSalaire.swift) :
//   CMS=2.8%, CME=0.25%, CMP=8.5%, CDEP=1.4%
//   SAT=0.11%, ASAC=0.70%, Mutu1=0.70%
// ============================================================

void main() {
  group('Logique métier Swift — Brut 3500 / 2026 / mois 1 / classe 1', () {
    late Salaire s;

    setUp(() {
      s = Salaire();
      s.iAnnee = 2026;
      s.iMois = 1;
      s.dBrut = 3500;
      s.dAvNat = 0;
      s.iclasse = 100; // célibataire
      // iMutualite=0 → switch(0+1)=case1 → Mutu1=0.0070 (Swift)
      s.iMutualite = 0;
      s.dHMC = 173;
      s.bCalculCI = true;
      s.bCalculCIM = false; // non présent dans Swift
      s.swTxImpots = false;
      Calcul().calculBrutNet(voSalaire: s);
    });

    // ---- Parts salariales (Swift PartsTrav()) ----
    test('CMS (Soins 2,8%) = 98.00', () => expect(s.dCotisCMS, equals(98.00)));
    test('CME (Espèces 0,25%) = 8.75', () => expect(s.dCotisCME, equals(8.75)));
    test('CMP (Pension 8,5%) = 297.50', () => expect(s.dCotisCMP, equals(297.50)));
    test('Total cotisations salariales = 404.25',
        () => expect(s.partsTrav(), equals(404.25)));

    // ---- Caisse dépendance (Swift CDEP=1.4%) ----
    test('Caisse Dépendance = 39.54', () => expect(s.dCotisDep, equals(39.54)));

    // ---- Impôts et crédits ----
    test('Imposable = 3095.75', () => expect(s.dimposable, equals(3095.75)));
    test('Impôt = 290.80', () => expect(s.dImpot, equals(290.80)));
    test('CISSM = 4.67', () => expect(s.dCISSM, equals(4.67)));
    test('CI = 47.50', () => expect(s.dCI, equals(47.50)));
    test('CI-CO2 = 17.10', () => expect(s.dCICO2, equals(17.10)));

    // ---- Net (formule Swift l.288) ----
    test('Net = 2834.68', () => expect(s.dNet, equals(2834.68)));

    // ---- Parts patronales (Swift CoutPtronales() et PartsPtronales()) ----
    // SAT=0.11%→3.85 | ASAC=0.70%→24.50 | Mutu1=0.70%→24.50
    // Parts patronales = CMS+CME+CMP + SAT+ASAC+Mutu = 404.25 + 52.85 = 457.10
    test('Cotisations patronales (logique Swift) = 457.10',
        () => expect(s.partsPtronales(), equals(457.10)));
    test('Coût total employeur (logique Swift) = 3957.10',
        () => expect(s.coutPtronales(), equals(3957.10)));

    // ---- Parts patronales détaillées ----
    test('SAT patronal = 3.85', () => expect(s.dCotisSATPatr, equals(3.85)));
    test('ASAC patronal = 24.50', () => expect(s.dCotisASACPatr, equals(24.50)));
    test('Mutu1 patronal = 24.50', () => expect(s.dCotisMutuPatr, equals(24.50)));
    test('SecuPatr = 0.00 (Swift: toujours 0)', () => expect(s.dCotisSecuPatr, equals(0.00)));
  });
}
