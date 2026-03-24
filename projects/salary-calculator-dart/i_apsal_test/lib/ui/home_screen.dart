import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 260.0,
            floating: false,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // Gradient Proximus NXT
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Color(0xFF6A359C), Color(0xFF00A2D3)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                  ),
                  // Barre blanche pleine largeur avec les deux logos
                  Positioned(
                    left: 16,
                    right: 16,
                    top: 0,
                    bottom: 0,
                    child: Center(
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.18),
                              blurRadius: 24,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            Expanded(
                              flex: 3,
                              child: Image.asset(
                                'lib/assets/icons/logo_iapsal_nxt.png',
                                height: 70,
                                fit: BoxFit.contain,
                              ),
                            ),
                            Container(
                              width: 1.5,
                              height: 52,
                              margin: const EdgeInsets.symmetric(horizontal: 16),
                              color: Colors.grey.shade200,
                            ),
                            Expanded(
                              flex: 2,
                              child: Image.asset(
                                'lib/assets/icons/logo_proximus_nxt.png',
                                height: 46,
                                fit: BoxFit.contain,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(16.0),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.85,
              ),
              delegate: SliverChildListDelegate([
                _DashboardCard(
                  label: 'Brut → Net',
                  icon: Icons.trending_down,
                  desc: 'Calculer le salaire net à payer',
                  color: Colors.indigo,
                  onTap: () => Navigator.pushNamed(context, '/brut_net'),
                ),
                _DashboardCard(
                  label: 'Net → Brut',
                  icon: Icons.trending_up,
                  desc: 'Déterminer le coût brut nécéssaire',
                  color: Colors.teal,
                  onTap: () => Navigator.pushNamed(context, '/net_brut'),
                ),
                _DashboardCard(
                  label: 'Simulateur',
                  icon: Icons.speed,
                  desc: 'Variation en temps réel',
                  color: Colors.orange,
                  onTap: () => Navigator.pushNamed(context, '/simulateur'),
                ),
                _DashboardCard(
                  label: 'Multi-années',
                  icon: Icons.compare_arrows,
                  desc: 'Comparer les années 2023-2026',
                  color: Colors.blue,
                  onTap: () => Navigator.pushNamed(context, '/comparateur'),
                ),
                _DashboardCard(
                  label: 'Barèmes',
                  icon: Icons.table_chart_outlined,
                  desc: 'Informations et taux légaux',
                  color: Colors.blueGrey,
                  onTap: () => Navigator.pushNamed(context, '/infos'),
                ),
                _DashboardCard(
                  label: 'À propos',
                  icon: Icons.info_outline,
                  desc: 'Logiciel iApsal par Proximus',
                  color: Colors.purple,
                  onTap: () => Navigator.pushNamed(context, '/apropos'),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  final String label;
  final String desc;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _DashboardCard({
    required this.label,
    required this.desc,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: Colors.grey.withOpacity(0.15), width: 1.5),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        hoverColor: color.withOpacity(0.05),
        splashColor: color.withOpacity(0.1),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: color, size: 28),
              ),
              const Spacer(),
              Text(
                label,
                style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 6),
              Text(
                desc,
                style: TextStyle(color: Colors.grey.shade600, fontSize: 13, height: 1.2),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
