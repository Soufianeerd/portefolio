import 'package:flutter/material.dart';
import '../core/models/salaire.dart';
import '../core/models/calcul.dart';

class SimulateurTempsReelScreen extends StatefulWidget {
  const SimulateurTempsReelScreen({super.key});

  @override
  State<SimulateurTempsReelScreen> createState() =>
      _SimulateurTempsReelScreenState();
}

class _SimulateurTempsReelScreenState extends State<SimulateurTempsReelScreen> {
  double _brut = 3500.0;
  double _net = 0.0;

  @override
  void initState() {
    super.initState();
    _calculer();
  }

  void _calculer() {
    final s = Salaire();
    s.iAnnee = DateTime.now().year;
    s.iMois = DateTime.now().month;
    s.dBrut = _brut;
    s.iclasse = 100; // Classe Impôt 1 par défaut
    s.iMutualite = 0; // Mutualité par défaut
    s.dHMC = 173; // Heures par mois par défaut
    s.bCalculCI = true;
    s.swTxImpots = false;
    s.bCalculCIM = false; // Par défaut, non monoparental
    
    // Le calcul renseigne s.dNet entre autres
    Calcul().calculBrutNet(voSalaire: s);

    setState(() {
      _net = s.dNet;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Simulateur Temps Réel')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Text(
              'Simulateur de Négociation',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            Text(
              'Salaire Brut: ${_brut.toStringAsFixed(2)} €',
              style: const TextStyle(fontSize: 18),
            ),
            Slider(
              value: _brut,
              min: 1000,
              max: 15000,
              divisions: 140, // Palier de 100€
              label: _brut.round().toString(),
              onChanged: (double value) {
                setState(() {
                  _brut = value;
                });
                _calculer();
              },
            ),
            const SizedBox(height: 30),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  const Text(
                    'Salaire Net Estimé',
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    '${_net.toStringAsFixed(2)} €',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onPrimaryContainer,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
