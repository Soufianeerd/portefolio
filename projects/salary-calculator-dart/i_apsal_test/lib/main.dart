import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:device_preview/device_preview.dart';
import 'package:google_fonts/google_fonts.dart';

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
        textTheme: GoogleFonts.outfitTextTheme(Theme.of(context).textTheme),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6A359C), // Proximus NXT Purple
          primary: const Color(0xFF6A359C),
          secondary: const Color(0xFF00A2D3), // Proximus NXT Cyan
          brightness: Brightness.light,
          surface: Colors.white,
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          backgroundColor: Colors.transparent,
          elevation: 0,
          titleTextStyle: TextStyle(
            color: Color(0xFF1F2937),
            fontSize: 22,
            fontWeight: FontWeight.w700,
          ),
          iconTheme: IconThemeData(color: Color(0xFF1F2937)),
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(color: Colors.grey.withOpacity(0.1)),
          ),
          margin: const EdgeInsets.symmetric(vertical: 8),
          color: Colors.white,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6A359C),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 24),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 0,
            textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFFF9FAFB),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.grey.shade200, width: 1.5),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF00A2D3), width: 2), // Cyan Focus
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          labelStyle: TextStyle(color: Colors.grey.shade600, fontWeight: FontWeight.w500),
          prefixIconColor: const Color(0xFF6A359C), // Purple Icons
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6A359C),
          primary: const Color(0xFF9154CC), // Lighter purple for dark mode
          secondary: const Color(0xFF00A2D3),
          brightness: Brightness.dark,
          surface: const Color(0xFF1E1E2C), // Deep background
        ),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
          backgroundColor: Colors.transparent,
        ),
        cardTheme: CardThemeData(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(color: Colors.white.withOpacity(0.05)),
          ),
          margin: const EdgeInsets.symmetric(vertical: 8),
          color: const Color(0xFF2A2A3C),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF9154CC),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 24),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: const Color(0xFF1E1E2C),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.white.withOpacity(0.1), width: 1.5),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF00A2D3), width: 2),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          prefixIconColor: const Color(0xFF9154CC),
        ),
      ),
      themeMode: ThemeMode.system, // Suivre le thème système

      // useInheritedMediaQuery is deprecated, removed.

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
