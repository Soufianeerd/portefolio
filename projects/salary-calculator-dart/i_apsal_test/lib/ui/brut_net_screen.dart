import 'package:flutter/material.dart';
import '../core/models/salaire.dart';
import '../core/salary_calculator.dart';
// Removed extension since standard dart double.tryParse replaces it.

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

  double _parse(TextEditingController c) => double.tryParse(c.text.replaceAll(',', '.')) ?? 0.0;

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
    // salaire.bCalculCIE n'existe plus dans le modèle
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

    final calcul = SalaryCalculator();
    final ok = calcul.calculBrutNet(salaire);

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
            const SizedBox(height: 8),
            // --- Carte Configuration (Année, Mois) ---
            _buildCard(
              title: 'Configuration Fiscale',
              icon: Icons.tune,
              color: const Color(0xFF6A359C),
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Année', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.grey.shade700)),
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFFF9FAFB),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove, size: 20),
                            color: const Color(0xFF6A359C),
                            onPressed: () => _changeYear(-1),
                          ),
                          Text('$_annee', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                          IconButton(
                            icon: const Icon(Icons.add, size: 20),
                            color: const Color(0xFF6A359C),
                            onPressed: () => _changeYear(1),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Mois calcul', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.grey.shade700)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF9FAFB),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade200),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<int>(
                          value: _moisCalcul,
                          style: const TextStyle(color: Color(0xFF1F2937), fontWeight: FontWeight.w600, fontSize: 14),
                          icon: const Icon(Icons.keyboard_arrow_down, color: Color(0xFF6A359C)),
                          items: const [
                            DropdownMenuItem(value: 1, child: Text('Janvier')),
                            DropdownMenuItem(value: 4, child: Text('Avril')),
                            DropdownMenuItem(value: 5, child: Text('Mai')),
                            DropdownMenuItem(value: 9, child: Text('Septembre')),
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
              icon: Icons.account_balance_wallet_outlined,
              color: const Color(0xFF00A2D3),
              children: [
                TextField(
                  controller: _brutCtrl,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, color: Color(0xFF00A2D3)),
                  decoration: InputDecoration(
                    labelText: 'Salaire brut mensuel',
                    prefixIcon: const Icon(Icons.euro, color: Color(0xFF00A2D3)),
                    fillColor: const Color(0xFF00A2D3).withOpacity(0.05),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: const BorderSide(color: Color(0xFF00A2D3), width: 2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _hmcCtrl,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        decoration: const InputDecoration(labelText: 'HMC', prefixIcon: Icon(Icons.access_time)),
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
                const SizedBox(height: 20),
                TextField(
                  controller: _dedCtrl,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(labelText: 'Déductions', prefixIcon: Icon(Icons.money_off)),
                ),
              ],
            ),

            // --- Carte Impôts & Crédits d'impôts ---
            _buildCard(
              title: 'Fiscalité & Crédits',
              icon: Icons.account_balance,
              color: const Color(0xFFE84C3D), // Un orange/rouge doux pour trancher
              children: [
                const Text('Classe d\'impôt', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
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
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Column(
                    children: [
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        activeColor: const Color(0xFF6A359C),
                        title: const Text('Taux d\'impôt personnalisé (%)', style: TextStyle(fontWeight: FontWeight.w600)),
                        subtitle: Text(_swTxImpots ? 'Saisie manuelle' : 'Calcul automatique', style: const TextStyle(fontSize: 12)),
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
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Text('Crédits d\'impôts applicables', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  activeColor: const Color(0xFF6A359C),
                  title: const Text('Crédit Impôt (CISSM/CI)'),
                  value: _bCalculCI,
                  onChanged: (v) => setState(() => _bCalculCI = v ?? false),
                  controlAffinity: ListTileControlAffinity.leading,
                ),
                if (_annee <= 2023)
                  CheckboxListTile(
                    contentPadding: EdgeInsets.zero,
                    activeColor: const Color(0xFF6A359C),
                    title: const Text('CIE (Énergie)'),
                    value: _bCalculCIE,
                    onChanged: (v) => setState(() => _bCalculCIE = v ?? false),
                    controlAffinity: ListTileControlAffinity.leading,
                  ),
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  activeColor: const Color(0xFF6A359C),
                  title: const Text('CIM (Mobilité)'),
                  value: _bCalculCIM,
                  onChanged: (v) => setState(() => _bCalculCIM = v ?? false),
                  controlAffinity: ListTileControlAffinity.leading,
                ),
              ],
            ),

            // --- Carte Charges Patronales ---
            _buildCard(
              title: 'Charges Patronales',
              icon: Icons.business,
              color: Colors.blueGrey,
              children: [
                const Text('Classe de Mutualité', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
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
                          const Text('Bonus/Risque', style: TextStyle(fontWeight: FontWeight.w600)),
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
                          const Text('Taux AA (%)', style: TextStyle(fontWeight: FontWeight.w600)),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _txAACtrl,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 18)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text('Taux Santé Travail (SAT)', style: TextStyle(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                TextField(
                  controller: _txSTCtrl,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  decoration: const InputDecoration(prefixIcon: Icon(Icons.health_and_safety_outlined)),
                ),
              ],
            ),

            const SizedBox(height: 24),
            // --- Bouton Calculer ---
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                gradient: const LinearGradient(
                  colors: [Color(0xFF6A359C), Color(0xFF00A2D3)],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6A359C).withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton(
                onPressed: _onCalculer,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                     Icon(Icons.analytics_outlined, size: 24),
                     SizedBox(width: 12),
                     Text('GÉNÉRER LA SIMULATION', style: TextStyle(fontSize: 16, letterSpacing: 1.2)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 40),
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
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 22),
                ),
                const SizedBox(width: 14),
                Text(
                  title,
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: color),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 16.0),
              child: Divider(color: Colors.grey.shade100, thickness: 1.5),
            ),
            ...children,
          ],
        ),
      ),
    );
  }
}