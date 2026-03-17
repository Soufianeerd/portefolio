import 'package:flutter/material.dart';

import '../core/models/salaire.dart';
import '../core/models/calcul.dart';

class ResultScreen extends StatefulWidget {
  final Salaire salaire;
  final String title;

  const ResultScreen({
    Key? key,
    required this.salaire,
    required this.title,
  }) : super(key: key);

  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  late Salaire _sal;
  late double _brutDep;
  double _sliderValue = 1.0;

  @override
  void initState() {
    super.initState();
    _sal = widget.salaire;
    _brutDep = _sal.dBrut;
  }

  String _f(double v) => v.toStringAsFixed(2);

  void _recalcWithSlider(double value) {
    setState(() {
      // Slider représente l'ajustement du brut (additif, comme Swift)
      _sliderValue = value.clamp(-1000, 1000);
      _sal.dBrut = _brutDep + _sliderValue;

      final calcul = Calcul();
      calcul.calculBrutNet(voSalaire: _sal);
    });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Résultat de Simulation'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // --- Hero Card: Net à Payer ---
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6366F1), Color(0xFF4F46E5)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6366F1).withOpacity(0.3),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const Text(
                    'NET À PAYER',
                    style: TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.bold, letterSpacing: 1.2),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${_f(_sal.dNet)} €',
                    style: const TextStyle(color: Colors.white, fontSize: 42, fontWeight: FontWeight.black),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      'Simulation au ${_sal.iMois}/${_sal.iAnnee}',
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // --- Slider Section: Simulation rapide ---
            Card(
              color: Colors.grey.shade50,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: Colors.grey.shade200)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Variation du Brut', style: TextStyle(fontWeight: FontWeight.bold)),
                        Text(
                          '${_sliderValue >= 0 ? '+' : ''}${_sliderValue.toStringAsFixed(0)} €',
                          style: TextStyle(color: _sliderValue >= 0 ? Colors.indigo : Colors.red, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Slider(
                      value: _sliderValue,
                      min: -1000,
                      max: 1000,
                      divisions: 40,
                      activeColor: const Color(0xFF6366F1),
                      onChanged: _recalcWithSlider,
                    ),
                    const Text('Ajustez le salaire brut pour voir l\'impact en temps réel', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // --- Détails Salarié ---
            _buildResultCard(
              title: 'Détails Salarié',
              icon: Icons.person_outline,
              color: Colors.indigo,
              children: [
                _row('Salaire Brut', '${_f(_sal.dBrut)} €', isBold: true),
                _row('Avantages en nature', '${_f(_sal.dAvNat)} €'),
                _row('Total Brut imposable', '${_f(_sal.totalBrut())} €'),
                const Divider(height: 24),
                _row('Cotisations : Soins (CMS)', '- ${_f(_sal.dCotisCMS)} €'),
                _row('Cotisations : Espèces (CME)', '- ${_f(_sal.dCotisCME)} €'),
                _row('Cotisations : Pension (CMP)', '- ${_f(_sal.dCotisCMP)} €', subtitle: 'Taux : ${_f(_sal.dTxCMP)} %'),
                _row('Part salariale totale', '- ${_f(_sal.partsTrav())} €', isBold: true, color: Colors.red.shade700),
              ],
            ),

            // --- Imposition & Crédits ---
            _buildResultCard(
              title: 'Imposition & Crédits',
              icon: Icons.account_balance_wallet_outlined,
              color: Colors.deepOrange,
              children: [
                _row('Base imposable', '${_f(_sal.dimposable)} €'),
                _row('Impôt sur le revenu', '- ${_f(_sal.dImpot)} €', subtitle: 'Taux moyen : ${_f(_sal.dTxImpot)} %'),
                const Divider(height: 24),
                if (_sal.dCISSM > 0) _row('Crédit CISSM', '+ ${_f(_sal.dCISSM)} €', color: Colors.green),
                if (_sal.dCI > 0) _row('Crédit CI simple', '+ ${_f(_sal.dCI)} €', color: Colors.green),
                if (_sal.dCIE > 0) _row('Crédit CIE (Énergie)', '+ ${_f(_sal.dCIE)} €', color: Colors.green),
                if (_sal.dCIM > 0) _row('Crédit CIM (Mobilité)', '+ ${_f(_sal.dCIM)} €', color: Colors.green),
                if (_sal.iAnnee >= 2024 && _sal.dCICO2 > 0)
                  _row('Crédit CI-CO2', '+ ${_f(_sal.dCICO2)} €', color: Colors.green)
                else if (_sal.dCIC > 0)
                  _row('Crédit CIC', '+ ${_f(_sal.dCIC)} €', color: Colors.green),
                const Divider(height: 24),
                _row('Cotisation Dépendance', '- ${_f(_sal.dCotisDep)} €'),
              ],
            ),

            // --- Coût Employeur ---
            _buildResultCard(
              title: 'Coût Employeur',
              icon: Icons.business_outlined,
              color: Colors.blueGrey,
              children: [
                _row('Salaire Brut', '${_f(_sal.dBrut)} €'),
                _row('Charges patronales', '+ ${_f(_sal.partsPatronales())} €'),
                const Divider(height: 24),
                _row('COÛT TOTAL ENTREPRISE', '${_f(_sal.coutPatronales())} €', isBold: true, color: Colors.blueGrey.shade900),
              ],
            ),

            const SizedBox(height: 24),

            // --- Boutons d'Action ---
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back),
                    label: const Text('RETOUR'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _shareAsPdf,
                    icon: const Icon(Icons.download),
                    label: const Text('EXPORTER'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.indigo,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  Widget _buildResultCard({
    required String title,
    required IconData icon,
    required Color color,
    required List<Widget> children,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 20),
                const SizedBox(width: 8),
                Text(title, style: TextStyle(fontWeight: FontWeight.bold, color: color)),
              ],
            ),
            const SizedBox(height: 16),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _row(String label, String value, {Color? color, bool isBold = false, String? subtitle}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(fontSize: 14, color: Colors.grey.shade700)),
                if (subtitle != null)
                  Text(subtitle, style: TextStyle(fontSize: 11, color: Colors.grey.shade500, fontStyle: FontStyle.italic)),
              ],
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: color ?? (isBold ? Colors.black : Colors.grey.shade800),
              fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
              fontSize: isBold ? 16 : 14,
            ),
          ),
        ],
      ),
    );
  }

  void _shareAsPdf() {
    // TODO: implémentation future
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('La fonction d\'exportation PDF sera disponible prochainement.')),
    );
  }
}
