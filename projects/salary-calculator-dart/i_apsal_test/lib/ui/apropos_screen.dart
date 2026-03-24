import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class AproposScreen extends StatelessWidget {
  const AproposScreen({super.key});

  // TODO: mets les URLs attendues
  static const String _urlApsal = 'https://www.proximusnxt.lu/fr/apsal';
  static const String _urlGesall = 'https://www.proximusnxt.lu/fr/gesallnet';
  static const String _urlFacturation = 'https://www.proximusnxt.lu/fr/facturation';

  Future<void> _openUrl(BuildContext context, String url) async {
    final uri = Uri.parse(url);
    final ok = await launchUrl(uri, mode: LaunchMode.externalApplication);
    if (!ok && context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Impossible d'ouvrir le lien.")),
      );
    }
  }

  Widget _iconButton({
    required BuildContext context,
    required String label,
    required String assetPath,
    required String url,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: () => _openUrl(context, url),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: const TextStyle(color: Color.fromARGB(179, 0, 0, 0), fontSize: 14),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: 84,
            height: 84,
            child: Image.asset(assetPath, fit: BoxFit.contain),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 255, 255, 255),
      appBar: AppBar(
        title: const Text('À propos'),
        centerTitle: true,
        backgroundColor: const Color.fromARGB(255, 255, 255, 255),
        foregroundColor: const Color.fromARGB(255, 0, 0, 0),
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          child: Column(
            children: [
              const SizedBox(height: 10),

            
              Image.asset(
                'lib/assets/icons/logo_proximus_nxt.png',
                width: 240,
                fit: BoxFit.contain,
              ),

              const SizedBox(height: 26),

              const Text(
                "Proximus NXT, c'est aussi 3 progiciels\n"
                "pour la gestion des PME/PMI. Ces derniers\n"
                "sont multi-postes, multi sociétés. Les\n"
                "logiciels proposés en tant que service (ou\n"
                "SaaS) représentent une façon de livrer\n"
                "les applications sur Internet, en tant que\n"
                "service. Au lieu d'installer et de gérer des\n"
                "logiciels, vous y accédez tout simplement\n"
                "via Internet, ce qui vous libère de la gestion\n"
                "complexe du logiciel et du matériel.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Color.fromARGB(255, 0, 0, 0), fontSize: 16, height: 1.35),
              ),

              const SizedBox(height: 30),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _iconButton(
                    context: context,
                    label: 'Apsal',
                    assetPath: 'lib/assets/icons/apsal-Icon-blue.png',
                    url: _urlApsal,
                  ),
                  _iconButton(
                    context: context,
                    label: 'Gesall',
                    assetPath: 'lib/assets/icons/gesall-Icon-blsky.png',
                    url: _urlGesall,
                  ),
                  _iconButton(
                    context: context,
                    label: 'Facturation',
                    assetPath: 'lib/assets/icons/facturation-Icon-orange.png',
                    url: _urlFacturation,
                  ),
                ],
              ),

              const SizedBox(height: 34),

              const Text(
                "L’éditeur ne saura être tenu responsable sur l’interprétation\n"
                "que l’utilisateur fait des résultats qui en découlent, quelle\n"
                "qu’elle soit, notamment du calcul des salaires, des impôts,\n"
                "des taxes ou des cotisations.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Color.fromARGB(179, 255, 255, 255), fontSize: 13, height: 1.35),
              ),

              const SizedBox(height: 26),

              const Text(
                "© Proximus Luxembourg - iApsal v.2.11.17",
                style: TextStyle(color: Color.fromARGB(137, 0, 0, 0), fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
