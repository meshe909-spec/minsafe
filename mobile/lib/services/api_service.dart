import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  ApiService._();
  static final instance = ApiService._();
  final String baseUrl = const String.fromEnvironment('MINISAFE_BACKEND_URL', defaultValue: 'http://10.0.2.2:8080');

  Future<bool> exitVerification(String childId, String frameBase64) async {
    final res = await http.post(
      Uri.parse('$baseUrl/exitVerification'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'childId': childId, 'frameBase64': frameBase64}),
    );
    if (res.statusCode != 200) return false;
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return data['ok'] == true;
  }
}




