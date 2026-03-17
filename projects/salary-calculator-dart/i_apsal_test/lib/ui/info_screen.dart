import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class InfoScreen extends StatelessWidget {
  const InfoScreen({super.key});

  Future<void> _openUrl(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw Exception('Impossible d’ouvrir : $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Informations Utiles"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // Header Logo
            Center(
              child: Hero(
                tag: 'logo',
                child: Image.asset(
                  'lib/assets/icons/apsal-logo-blue.png',
                  height: 100,
                  fit: BoxFit.contain,
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Paramètres Sociaux Section
            Card(
              elevation: 4,
              shadowColor: Colors.black12,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.info_outline, color: Colors.indigo),
                        SizedBox(width: 8),
                        Text(
                          "PARAMÈTRES SOCIAUX 2025",
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.black, color: Colors.indigo, letterSpacing: 1.1),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      "(Applicables au 01/05/2025)",
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 13, fontWeight: FontWeight.w500),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 16.0),
                      child: Divider(),
                    ),
                    _buildParamRow("Indice 100", "968,04"),
                    _buildParamRow("SSM Salarié non qualifié", "2.703,74 €", subtitle: "15,6285 € / heure"),
                    _buildParamRow("SSM Salarié qualifié", "3.244,48 €", subtitle: "18,7542 € / heure"),
                    _buildParamRow("Max. cotisable mensuel", "13.518,68 €", subtitle: "(5x SSM)"),
                    _buildParamRow("Max. cotisable annuel", "162.224,16 €"),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 32),

            // Documentation Section
            const Align(
              alignment: Alignment.centerLeft,
              child: Padding(
                padding: EdgeInsets.only(left: 8.0, bottom: 12),
                child: Text(
                  "SOURCES OFFICIELLES",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.black54, letterSpacing: 1.0),
                ),
              ),
            ),
            Row(
              children: [
                _buildLinkCard(
                  url: "https://ccss.public.lu/fr/parametres-sociaux.html",
                  imagePath: 'lib/assets/icons/logo_ccss.png',
                  label: "CCSS Parameters",
                ),
                const SizedBox(width: 16),
                _buildLinkCard(
                  url: "https://guichet.public.lu/fr/citoyens/fiscalite/declaration-impot-decompte.html",
                  imagePath: 'lib/assets/icons/icone_Guichet.gif',
                  label: "Fiscalité Guichet",
                ),
              ],
            ),
            const SizedBox(height: 40),
            
            Text(
              "Version 1.2.0 - © Apsal S.A.",
              style: TextStyle(color: Colors.grey.shade400, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildParamRow(String label, String value, {String? subtitle}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                if (subtitle != null)
                  Text(subtitle, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
              ],
            ),
          ),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.red, fontSize: 15),
          ),
        ],
      ),
    );
  }

  Widget _buildLinkCard({required String url, required String imagePath, required String label}) {
    return Expanded(
      child: InkWell(
        onTap: () => _openUrl(url),
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade200),
            borderRadius: BorderRadius.circular(16),
            color: Colors.white,
          ),
          child: Column(
            children: [
              Image.asset(imagePath, height: 50, fit: BoxFit.contain),
              const SizedBox(height: 8),
              Text(
                label,
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
