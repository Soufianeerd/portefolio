// ignore: file_names
import 'package:uuid/uuid.dart';

class LesVideos {
  final String id;
  final String title;
  final String? url;

  LesVideos({
    String? id,
    required this.title,
    this.url,
  }) : id = id ?? const Uuid().v4();
}

class LesVideosData {
  static final sampleData = [
    LesVideos(
      id: "1",
      title: "Manuel iApsal",
      url: "https://www.youtube.com/embed/tWD8Xf0f7x4?playsinline=1",
    ),
    LesVideos(
      id: "2",
      title: "Apsal - Application salaires",
      url: "https://www.youtube.com/embed/tWD8Xf0f7x4?playsinline=1",
    ),
    LesVideos(
      id: "3",
      title: "Gesall - Comptabilité",
      url: "https://www.youtube.com/embed/VGU2SaCejvk?playsinline=1",
    ),
  ];
}
