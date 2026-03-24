import 'package:intl/intl.dart';

class Formatters {
  static final NumberFormat _euroFormat = NumberFormat.currency(
    locale: 'fr_FR',
    symbol: '€',
    decimalDigits: 2,
  );

  static String formatEuro(double amount) {
    return _euroFormat.format(amount);
  }
}
