import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';

class StatusScreen extends StatefulWidget {
  const StatusScreen({super.key});
  @override
  State<StatusScreen> createState() => _StatusScreenState();
}

class _StatusScreenState extends State<StatusScreen> {
  String _status = 'Safe';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Child Status'),
        actions: [
          IconButton(onPressed: () => AuthService.instance.signOut(), icon: const Icon(Icons.logout))
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Status: $_status', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                // Simulate face verification call
                final ok = await ApiService.instance.exitVerification('child123', base64Encode(utf8.encode('frame')));
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Exit verification: ${ok ? 'OK' : 'Failed'}')));
              },
              child: const Text('Exit Face Verification'),
            )
          ],
        ),
      ),
    );
  }
}




