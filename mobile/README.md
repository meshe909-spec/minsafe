# MiniSafe Mobile (Flutter)

Setup:
- Ensure Flutter SDK is installed
- Create a Flutter project structure (android/ios) if missing:
```
flutter create .
```
- Add Firebase to Android/iOS using Firebase Console and add Google-Services files
- Update `pubspec.yaml` then run:
```
flutter pub get
flutter run
```

Config:
- Backend base URL uses Dart define `MINISAFE_BACKEND_URL` (defaults to emulator `http://10.0.2.2:8080`)
```
flutter run --dart-define=MINISAFE_BACKEND_URL=http://YOUR_IP:8080
```




