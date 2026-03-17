import 'package:flutter/material.dart';
import '../core/models/salaire.dart';
import '../core/models/calcul.dart';
import '../utiles/extensions.dart';

class BrutNetScreen extends StatefulWidget {
  const BrutNetScreen({super.key});

  @override
  State<BrutNetScreen> createState() => _BrutNetScreenState();
}

class _BrutNetScreenState extends State<BrutNetScreen> {
  int _annee = DateTime.now().year;
  bool _bCalculCI = true;
  bool _bCalculCIE = true;
  bool _bCalculCIM = true;
  int _classeImpots = 100;
  int _classeMutu = 0; // 0=Mutu1, 1=Mutu2, 2=Mutu3, 3=Mutu4 (conforme Swift iMutualite)
  int _classeBonus = 1;
  int _moisCalcul = 1; // dropdown only has values [1, 4, 5, 9]
  bool _swTxImpots = false;

  final _hmcCtrl = TextEditingController(text: '173');
  final _brutCtrl = TextEditingController();
  final _avnCtrl = TextEditingController();
  final _dedCtrl = TextEditingController();
  final _txImpotsCtrl = TextEditingController();
  final _txAACtrl = TextEditingController(text: '0.70');
  final _txSTCtrl = TextEditingController(text: '0.14');

  @override
  void initState() {
    super.initState();
    _initAnnee(_annee);
  }

  @override
  void dispose() {
    _hmcCtrl.dispose();
    _brutCtrl.dispose();
    _avnCtrl.dispose();
    _dedCtrl.dispose();
    _txImpotsCtrl.dispose();
    _txAACtrl.dispose();
    _txSTCtrl.dispose();
    super.dispose();
  }

  void _initAnnee(int year) {
    setState(() {
      _annee = year;
      if (_annee < 2017) _annee = 2017;
      
      // On s'assure d'inclure l'année courante si elle dépasse 2026
      if (_annee > DateTime.now().year && _annee > 2026) {
        _annee = _annee > DateTime.now().year ? DateTime.now().year : _annee;
      }

      switch (_annee) {
        case 2026:
          _txAACtrl.text = '0.70';
          _bCalculCIE = false;
          break;
        case 2025:
          _txAACtrl.text = '0.70';
          _bCalculCIE = false;
          break;
        case 2024:
          _txAACtrl.text = '0.70';
          _bCalculCIE = false;
          break;
        case 2023:
          _txAACtrl.text = '0.75';
          _bCalculCIE = true;
          break;
        default:
          if (_annee > 2026) {
            _txAACtrl.text = '0.70';
            _bCalculCIE = false;
          } else {
            _bCalculCIE = true;
          }
      }
    });
  }

  void _changeYear(int delta) => _initAnnee(_annee + delta);

  /// Convertit le texte du controller en double
  /// Utilise l'extension doubleValue qui gère . et , comme Swift
  double _parse(TextEditingController c) => c.text.doubleValue;

  Future<void> _showInfo(String msg) async {
    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        content: Text(msg),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  Future<void> _onCalculer() async {
    if (_brutCtrl.text.trim().isEmpty) {
      await _showInfo('Veuillez renseigner un brut s.v.p.');
      return;
    }

    final salaire = Salaire();
    salaire.iAnnee = _annee;
    salaire.iMois = _moisCalcul;
    salaire.dHMC = _parse(_hmcCtrl);
    salaire.dBrut = _parse(_brutCtrl);
    salaire.iclasse = _classeImpots;
    salaire.bCalculCI = _bCalculCI;
    salaire.bCalculCIE = _bCalculCIE;
    salaire.bCalculCIM = _bCalculCIM;
    salaire.swTxImpots = _swTxImpots;
    salaire.dTxImpot = _parse(_txImpotsCtrl);
    salaire.dAvNat = _parse(_avnCtrl);
    salaire.dDeduc = _parse(_dedCtrl);
    salaire.iMutualite = _classeMutu;
    salaire.iBonus = _classeBonus;
    salaire.dTxSAT = _parse(_txSTCtrl);
    if (salaire.dTxSAT == 0) salaire.dTxSAT = 0.14;
    salaire.dTxASAC = _parse(_txAACtrl);
    if (salaire.dTxASAC == 0) salaire.dTxASAC = 0.75;

    final calcul = Calcul();
    final ok = calcul.calculBrutNet(voSalaire: salaire);

    if (ok) {
      Navigator.of(context).pushNamed('/result', arguments: salaire);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Calcul Brut → Net'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // --- Carte Configuration (Année, Mois) ---
            _buildCard(
              title: 'Configuration',
              icon: Icons.settings,
              color: Colors.blueGrey,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Année fiscale : ', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blueGrey.shade700)),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline),
                          onPressed: () => _changeYear(-1),
                        ),
                        Text('$_annee', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline),
                          onPressed: () => _changeYear(1),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Mois calcul : ', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blueGrey.shade700)),
                    DropdownButtonHideUnderline(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: DropdownButton<int>(
                          value: _moisCalcul,
                          items: const [
                            DropdownMenuItem(value: 1, child: Text('Janvier (1)')),
                            DropdownMenuItem(value: 4, child: Text('Avril (4)')),
                            DropdownMenuItem(value: 5, child: Text('Mai (5)')),
                            DropdownMenuItem(value: 9, child: Text('Septembre (9)')),
                          ],
                          onChanged: (_annee >= 2024 && _annee <= 2026)
                              ? null
                              : (v) => setState(() => _moisCalcul = v ?? _moisCalcul),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),

            // --- Carte Salaire & Déductions ---
            _buildCard(
              title: 'Salaire & Déductions',
              icon: Icons.payments_outlined,
              color: Colors.indigo,
              children: [
                TextField(
                  controller: _brutCtrl,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.indigo),
                  decoration: const InputDecoration(
                    labelText: 'Salaire brut mensuel (€)',
                    prefixIcon: Icon(Icons.euro),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _hmcCtrl,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(labelText: 'HMC', prefixIcon: Icon(Icons.hourglass_empty)),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextField(
                        controller: _avnCtrl,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(labelText: 'Avn. Nature', prefixIcon: Icon(Icons.card_giftcard)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _dedCtrl,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(labelText: 'Déductions (Frais, etc.)', prefixIcon: Icon(Icons.remove_circle_outline)),
                ),
              ],
            ),

            // --- Carte Impôts & Crédits d'impôts ---
            _buildCard(
              title: 'Fiscalité & Crédits',
              icon: Icons.account_balance,
              color: Colors.deepOrange,
              children: [
                const Text('Classe d\'impôt', style: TextStyle(fontWeight: FontWeight.bold)),
                DropdownButtonFormField<int>(
                  value: [100, 200, 300, 400].contains(_classeImpots) ? _classeImpots : 100,
                  decoration: const InputDecoration(prefixIcon: Icon(Icons.people_outline)),
                  items: const [
                    DropdownMenuItem(value: 100, child: Text('Célibataire (1)')),
                    DropdownMenuItem(value: 200, child: Text('Marié (2)')),
                    DropdownMenuItem(value: 300, child: Text('Autre (1A)')),
                    DropdownMenuItem(value: 400, child: Text('Assimilé (-)')),
                  ],
                  onChanged: (v) => setState(() => _classeImpots = v ?? _classeImpots),
                ),
                const SizedBox(height: 12),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Taux d\'impôt personnalisé (%)'),
                  subtitle: Text(_swTxImpots ? 'Saisie manuelle du taux' : 'Calculé selon barèmes officiels', style: const TextStyle(fontSize: 12)),
                  value: _swTxImpots,
                  onChanged: (v) => setState(() => _swTxImpots = v),
                ),
                if (_swTxImpots)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: TextField(
                      controller: _txImpotsCtrl,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      decoration: const InputDecoration(labelText: 'Taux direct en %', prefixIcon: Icon(Icons.percent)),
                    ),
                  ),
                const SizedBox(height: 12),
                const Divider(),
                const Text('Crédits d\'impôts applicables', style: TextStyle(fontWeight: FontWeight.bold)),
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Crédit Impôt (CISSM/CI)'),
                  value: _bCalculCI,
                  onChanged: (v) => setState(() => _bCalculCI = v ?? false),
                ),
                if (_annee <= 2023)
                  CheckboxListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('CIE (Énergie)'),
                    value: _bCalculCIE,
                    onChanged: (v) => setState(() => _bCalculCIE = v ?? false),
                  ),
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('CIM (Mobilité)'),
                  value: _bCalculCIM,
                  onChanged: (v) => setState(() => _bCalculCIM = v ?? false),
                ),
              ],
            ),

            // --- Carte Charges Patronales ---
            _buildCard(
              title: 'Charges Patronales (Employeur)',
              icon: Icons.business,
              color: Colors.blueGrey,
              children: [
                const Text('Classe de Mutualité', style: TextStyle(fontWeight: FontWeight.bold)),
                DropdownButtonFormField<int>(
                  value: [0, 1, 2, 3].contains(_classeMutu) ? _classeMutu : 0,
                  items: const [
                    DropdownMenuItem(value: 0, child: Text('Classe 1 (Risque standard)')),
                    DropdownMenuItem(value: 1, child: Text('Classe 2')),
                    DropdownMenuItem(value: 2, child: Text('Classe 3')),
                    DropdownMenuItem(value: 3, child: Text('Classe 4 (Risque élevé)')),
                  ],
                  onChanged: (v) => setState(() => _classeMutu = v ?? _classeMutu),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Bonus/Risque', style: TextStyle(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          DropdownButtonFormField<int>(
                            value: [1, 2, 3, 4].contains(_classeBonus) ? _classeBonus : 1,
                            items: const [
                              DropdownMenuItem(value: 1, child: Text('0,85 %')),
                              DropdownMenuItem(value: 2, child: Text('1,00 %')),
                              DropdownMenuItem(value: 3, child: Text('1,10 %')),
                              DropdownMenuItem(value: 4, child: Text('1,50 %')),
                            ],
                            onChanged: (v) => setState(() => _classeBonus = v ?? _classeBonus),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Taux AA (%)', style: TextStyle(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _txAACtrl,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _txSTCtrl,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(labelText: 'Taux Santé Travail (SAT)', prefixIcon: Icon(Icons.health_and_safety_outlined)),
                ),
              ],
            ),

            const SizedBox(height: 24),
            // --- Bouton Calculer ---
            ElevatedButton(
              onPressed: _onCalculer,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6366F1),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 20),
                textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                   Icon(Icons.analytics_outlined),
                   SizedBox(width: 12),
                   Text('GÉNÉRER LA SIMULATION'),
                ],
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildCard({
    required String title,
    required IconData icon,
    required Color color,
    required List<Widget> children,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 20),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color),
                ),
              ],
            ),
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8.0),
              child: Divider(),
            ),
            ...children,
          ],
        ),
      ),
    );
  }
}
}