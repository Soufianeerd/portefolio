import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:device_preview/device_preview.dart';

import 'core/models/salaire.dart';
import 'ui/apropos_screen.dart';
import 'ui/brut_net_screen.dart';
import 'ui/home_screen.dart';
import 'ui/info_screen.dart';
import 'ui/net_brut_screen.dart';
import 'ui/result_screen.dart';
import 'ui/simulateur_temps_reel_screen.dart';
import 'ui/comparateur_multi_annees_screen.dart';

void main() {
  runApp(
    DevicePreview(
      // true sur web/desktop, false sur release si tu veux
      enabled: !kReleaseMode,
      builder: (context) => const IApsalApp(),
    ),
  );
}

class IApsalApp extends StatelessWidget {
  const IApsalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'i_apsal',
      debugShowCheckedModeBanner: false,

      // Thèmes light et dark modernisés
      theme: ThemeData(
        brightness: Brightness.light,
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1),
          brightness: Brightness.light,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          backgroundColor: Colors.transparent,
          elevation: 0,
          titleTextStyle: TextStyle(
            color: Color(0xFF1F2937),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        cardTheme: CardTheme(
          elevation: 2,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          margin: const EdgeInsets.symmetric(vertical: 8),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 0,
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.grey.shade50,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade300),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey.shade200),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFF6366F1), width: 2),
          ),
          contentPadding: const EdgeInsets.all(16),
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1),
          brightness: Brightness.dark,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
        ),
        cardTheme: CardTheme(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          margin: const EdgeInsets.symmetric(vertical: 8),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          contentPadding: const EdgeInsets.all(16),
        ),
      ),
      themeMode: ThemeMode.system, // Suivre le thème système

      // DevicePreview
      useInheritedMediaQuery: true,
      locale: DevicePreview.locale(context),
      builder: DevicePreview.appBuilder,

      initialRoute: '/',
      routes: {
        '/': (_) => const HomeScreen(),

        '/brut_net': (_) => const BrutNetScreen(),
        '/net_brut': (_) => const NetBrutScreen(),
        '/infos': (_) => const InfoScreen(),
        '/apropos': (_) => const AproposScreen(),
        '/simulateur': (_) => const SimulateurTempsReelScreen(),
        '/comparateur': (_) => const ComparateurMultiAnneesScreen(),

        // alias éventuels
        '/brutNet': (_) => const BrutNetScreen(),
        '/netBrut': (_) => const NetBrutScreen(),
        '/info': (_) => const InfoScreen(),
      },

      onGenerateRoute: (settings) {
        if (settings.name == '/result') {
          final args = settings.arguments;

          if (args is Salaire) {
            return MaterialPageRoute(
              builder: (_) => ResultScreen(
                salaire: args,
                title: 'Résultat',
              ),
            );
          }

          return MaterialPageRoute(
            builder: (_) => const Scaffold(
              body: Center(
                child:
                    Text('Erreur: /result attend un objet Salaire en arguments'),
              ),
            ),
          );
        }
        return null;
      },
    );
  }
}
