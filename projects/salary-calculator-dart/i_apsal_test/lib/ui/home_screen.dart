class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 180.0,
            floating: false,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text(
                'i_apsal Simulator',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF6366F1), Color(0xFF4F46E5)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Center(
                  child: Opacity(
                    opacity: 0.1,
                    child: Icon(Icons.calculate, size: 150, color: Colors.white),
                  ),
                ),
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
                  color: Colors.emerald,
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
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 28),
              ),
              const Spacer(),
              Text(
                label,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                desc,
                style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
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
