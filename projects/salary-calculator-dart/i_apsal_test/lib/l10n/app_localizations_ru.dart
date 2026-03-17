// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Russian (`ru`).
class AppLocalizationsRu extends AppLocalizations {
  AppLocalizationsRu([String locale = 'ru']) : super(locale);

  @override
  String get appTitle => 'iApsal';

  @override
  String get homeBrutNet => 'Брутто → Нетто';

  @override
  String get homeNetBrut => 'Нетто → Брутто';

  @override
  String get homeInfos => 'Полезная информация';

  @override
  String get homeAbout => 'О приложении';
}
