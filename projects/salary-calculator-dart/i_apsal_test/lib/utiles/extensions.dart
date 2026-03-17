import 'package:package_info_plus/package_info_plus.dart';

/// Extension sur String pour convertir en Double
/// Gère les séparateurs décimaux (. et ,) comme dans Swift
extension StringDoubleParsing on String {
  double get doubleValue {
    String normalized = this;
    
    // Essayer d'abord avec le séparateur décimal point (.)
    double? result = double.tryParse(normalized);
    if (result != null) {
      return result;
    }
    
    // Si ça échoue, remplacer la virgule par un point et réessayer
    normalized = replaceAll(',', '.');
    result = double.tryParse(normalized);
    if (result != null) {
      return result;
    }
    
    // Si toujours rien, retourner 0
    return 0.0;
  }
}

/// Classe pour exporter une vue en PDF (similaire à UIView extension Swift)
/// Implémentation future pour sauvegarder les données PDF
class PdfExporter {
  /// Sauvegarde les données PDF dans le répertoire documents
  /// Retourne le chemin du fichier PDF
  /// Logique métier identique à saveViewPdf() de Swift
  static Future<String> savePdfToFile(List<int> pdfData) async {
    // TODO: Implémentation future
    // Nécessite les packages: path_provider, pdf, printing
    return '';
  }
}

/// Classe pour gérer la version de l'application
/// Similaire à UIApplication extension de Swift
class AppVersion {
  static PackageInfo? _packageInfo;
  
  /// Initialise les informations de version de l'application
  static Future<void> init() async {
    _packageInfo = await PackageInfo.fromPlatform();
  }

  /// Retourne la version release (ex: 1.0.0)
  /// Similaire à UIApplication.release
  static String get release => _packageInfo?.version ?? "x.x";
  
  /// Retourne le numéro de build (ex: 1)
  /// Similaire à UIApplication.build
  static String get build => _packageInfo?.buildNumber ?? "x";

  /// Retourne la version complète (ex: 1.0.0.1)
  /// Similaire à UIApplication.version
  static String get version => "$release.$build";
}
