// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Korean (`ko`).
class AppLocalizationsKo extends AppLocalizations {
  AppLocalizationsKo([String locale = 'ko']) : super(locale);

  @override
  String get appTitle => 'iApsal';

  @override
  String get homeBrutNet => '총 급여 → 실수령';

  @override
  String get homeNetBrut => '실수령 → 총 급여';

  @override
  String get homeInfos => '유용한 정보';

  @override
  String get homeAbout => '정보';
}
