import 'package:flutter/material.dart';
import '../core/models/salaire.dart';
import '../core/models/calcul.dart';

class ComparateurMultiAnneesScreen extends StatefulWidget {
  const ComparateurMultiAnneesScreen({super.key});

  @override
  State<ComparateurMultiAnneesScreen> createState() =>
      _ComparateurMultiAnneesScreenState();
}

class _ComparateurMultiAnneesScreenState
    extends State<ComparateurMultiAnneesScreen> {
  final TextEditingController _brutController =
      TextEditingController(text: '3500');

  double _net2024 = 0;
  double _net2025 = 0;
  double _net2026 = 0;

  @override
  void initState() {
    super.initState();
    _calculerComparaison();
  }

  void _calculerComparaison() {
    double brut = double.tryParse(_brutController.text) ?? 0;
    if (brut <= 0) return;

    int currentYear = DateTime.now().year;

    setState(() {
      _net2024 = _calculerPourAnnee(brut, currentYear - 1);
      _net2025 = _calculerPourAnnee(brut, currentYear);
      _net2026 = _calculerPourAnnee(brut, currentYear + 1);
    });
  }

  double _calculerPourAnnee(double brut, int annee) {
    final s = Salaire();
    s.iAnnee = annee;
    s.iMois = 1;
    s.dBrut = brut;
    s.iclasse = 100;
    s.iMutualite = 0;
    s.dHMC = 173;
    s.bCalculCI = true;
    s.swTxImpots = false;
    s.bCalculCIM = false;

    Calcul().calculBrutNet(voSalaire: s);
    return s.dNet;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Comparateur Multi-années')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Text(
              'Comparaison des Salaires Nets',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _brutController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Salaire Brut (€)',
                border: OutlineInputBorder(),
              ),
              onChanged: (val) => _calculerComparaison(),
            ),
            const SizedBox(height: 30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildColonneAnnee((DateTime.now().year - 1).toString(), _net2024, context),
                _buildColonneAnnee(DateTime.now().year.toString(), _net2025, context),
                _buildColonneAnnee((DateTime.now().year + 1).toString(), _net2026, context),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildColonneAnnee(String annee, double net, BuildContext context) {
    return Expanded(
      child: Card(
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Text(
                annee,
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              Text(
                '${net.toStringAsFixed(2)} €',
                style: TextStyle(
                  fontSize: 16,
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
