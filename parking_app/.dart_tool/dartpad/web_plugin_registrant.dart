// Flutter web plugin registrant file.
//
// Generated file. Do not edit.
//

// @dart = 2.13
// ignore_for_file: type=lint

import 'package:google_maps_flutter_web/google_maps_flutter_web.dart';
import 'package:location_web/location_web.dart';
import 'package:mobile_scanner/mobile_scanner_web_plugin.dart';
import 'package:permission_handler_html/permission_handler_html.dart';
import 'package:share_plus/src/share_plus_web.dart';
import 'package:shared_preferences_web/shared_preferences_web.dart';
import 'package:url_launcher_web/url_launcher_web.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';

void registerPlugins([final Registrar? pluginRegistrar]) {
  final Registrar registrar = pluginRegistrar ?? webPluginRegistrar;
  GoogleMapsPlugin.registerWith(registrar);
  LocationWebPlugin.registerWith(registrar);
  MobileScannerWebPlugin.registerWith(registrar);
  WebPermissionHandler.registerWith(registrar);
  SharePlusWebPlugin.registerWith(registrar);
  SharedPreferencesPlugin.registerWith(registrar);
  UrlLauncherPlugin.registerWith(registrar);
  registrar.registerMessageHandler();
}
