import 'package:flutter/material.dart';
import 'package:sih26090_mobile/core/constants/app_constants.dart';
import 'package:sih26090_mobile/core/network/api_client.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  String? _selectedLocation;
  String? _selectedCraftCategory;
  String? _selectedBusinessType;
  final List<String> _selectedLanguages = [];
  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  void _toggleLanguage(String code) {
    setState(() {
      if (_selectedLanguages.contains(code)) {
        _selectedLanguages.remove(code);
      } else {
        _selectedLanguages.add(code);
      }
    });
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedLocation == null || _selectedCraftCategory == null || _selectedBusinessType == null || _selectedLanguages.isEmpty) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    setState(() => _isLoading = true);

    try {
      final artisanData = {
        'name': _nameController.text.trim(),
        'location': _selectedLocation!,
        'craft_category': _selectedCraftCategory!,
        'languages': _selectedLanguages,
        'business_type': _selectedBusinessType!,
      };

      final response = await ApiClient.post('/api/v1/artisans/', artisanData);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Welcome, ${response['name']}! ID: ${response['id']}'), backgroundColor: Colors.green),
      );

      Navigator.of(context).popUntil((route) => route.isFirst);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF4A3045)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Your Details', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF4A3045))),
              const SizedBox(height: 8),
              Text('Tell us about yourself to get started', style: TextStyle(fontSize: 16, color: Colors.grey[600])),
              const SizedBox(height: 32),
              _buildLabel('Name'),
              TextFormField(
                controller: _nameController,
                decoration: _inputDecoration('Enter your name'),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Please enter your name';
                  return null;
                },
              ),
              const SizedBox(height: 20),
              _buildLabel('Location'),
              DropdownButtonFormField<String>(
                initialValue: _selectedLocation,
                decoration: _inputDecoration('Select your state'),
                items: AppConstants.indianStates.map((String state) {
                  return DropdownMenuItem<String>(value: state, child: Text(state));
                }).toList(),
                onChanged: (String? value) => setState(() => _selectedLocation = value),
                validator: (value) => value == null ? 'Please select a state' : null,
              ),
              const SizedBox(height: 20),
              _buildLabel('Craft Category'),
              DropdownButtonFormField<String>(
                initialValue: _selectedCraftCategory,
                decoration: _inputDecoration('Select craft category'),
                items: AppConstants.craftCategories.map((String category) {
                  return DropdownMenuItem<String>(value: category, child: Text(category));
                }).toList(),
                onChanged: (String? value) => setState(() => _selectedCraftCategory = value),
                validator: (value) => value == null ? 'Please select a category' : null,
              ),
              const SizedBox(height: 20),
              _buildLabel('Languages'),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: AppConstants.languages.entries.map((entry) {
                  final isSelected = _selectedLanguages.contains(entry.key);
                  return FilterChip(
                    label: Text(entry.value),
                    selected: isSelected,
                    onSelected: (_) => _toggleLanguage(entry.key),
                    selectedColor: const Color(0xFF6B4E71),
                    checkmarkColor: Colors.white,
                    labelStyle: TextStyle(color: isSelected ? Colors.white : Colors.grey[700]),
                    side: BorderSide(color: isSelected ? const Color(0xFF6B4E71) : Colors.grey[300]!),
                  );
                }).toList(),
              ),
              if (_selectedLanguages.isEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text('Please select at least one language', style: TextStyle(color: Colors.red[700], fontSize: 12)),
                ),
              const SizedBox(height: 20),
              _buildLabel('Business Type'),
              DropdownButtonFormField<String>(
                initialValue: _selectedBusinessType,
                decoration: _inputDecoration('Select business type'),
                items: AppConstants.businessTypes.map((String type) {
                  return DropdownMenuItem<String>(value: type, child: Text(type));
                }).toList(),
                onChanged: (String? value) => setState(() => _selectedBusinessType = value),
                validator: (value) => value == null ? 'Please select business type' : null,
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submitForm,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6B4E71),
                    foregroundColor: Colors.white,
                    disabledBackgroundColor: Colors.grey[400],
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
                  ),
                  child: _isLoading
                      ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('CONTINUE \u2192', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(text, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF4A3045))),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: Colors.grey[400]),
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey[300]!)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey[300]!)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF6B4E71), width: 2)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    );
  }
}
