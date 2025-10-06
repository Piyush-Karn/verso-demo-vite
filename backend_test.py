#!/usr/bin/env python3
"""
Backend API Testing for Verso Travel Organizer
Tests all FastAPI endpoints with comprehensive coverage
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, List

# Use the production URL from frontend .env
BASE_URL = "https://journey-planner-132.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_inspiration_id = None
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "status": status
        })
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test GET /api/ health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Verso API":
                    self.log_test("Health Check", True, f"Response: {data}")
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}")
            else:
                self.log_test("Health Check", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
    
    def test_status_crud(self):
        """Test Status CRUD operations"""
        # Test POST /api/status
        try:
            payload = {"client_name": "tester"}
            response = self.session.post(f"{self.base_url}/status", json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "timestamp" in data and data.get("client_name") == "tester":
                    self.log_test("Status POST", True, f"Created status with ID: {data['id']}")
                    status_id = data["id"]
                else:
                    self.log_test("Status POST", False, f"Missing fields in response: {data}")
                    return
            else:
                self.log_test("Status POST", False, f"Status: {response.status_code}, Body: {response.text}")
                return
        except Exception as e:
            self.log_test("Status POST", False, f"Exception: {str(e)}")
            return
        
        # Test GET /api/status
        try:
            response = self.session.get(f"{self.base_url}/status")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check if our created item is in the list
                    found = any(item.get("id") == status_id for item in data)
                    if found:
                        self.log_test("Status GET", True, f"Found {len(data)} status items including our test item")
                    else:
                        self.log_test("Status GET", False, f"Created item not found in list of {len(data)} items")
                else:
                    self.log_test("Status GET", False, f"Expected array, got: {data}")
            else:
                self.log_test("Status GET", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_test("Status GET", False, f"Exception: {str(e)}")
    
    def test_inspirations_crud(self):
        """Test Inspirations CRUD operations"""
        # Test POST /api/inspirations
        payload = {
            "url": "https://instagram.com/p/x",
            "title": "Hidden cafe",
            "image_base64": None,
            "country": "Japan",
            "city": "Tokyo",
            "type": "cafe",
            "theme": ["coffee", "cozy"],
            "cost_indicator": "$$",
            "vibe_notes": "Usually crowded in May",
            "added_by": "alice"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/inspirations", json=payload)
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "created_at", "country", "city", "type"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    self.created_inspiration_id = data["id"]
                    self.log_test("Inspirations POST", True, f"Created inspiration with ID: {data['id']}")
                else:
                    self.log_test("Inspirations POST", False, f"Missing fields: {missing_fields}")
                    return
            else:
                self.log_test("Inspirations POST", False, f"Status: {response.status_code}, Body: {response.text}")
                return
        except Exception as e:
            self.log_test("Inspirations POST", False, f"Exception: {str(e)}")
            return
        
        # Test GET /api/inspirations (all)
        try:
            response = self.session.get(f"{self.base_url}/inspirations")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) >= 1:
                    self.log_test("Inspirations GET (all)", True, f"Retrieved {len(data)} inspirations")
                else:
                    self.log_test("Inspirations GET (all)", False, f"Expected array with >=1 items, got: {len(data) if isinstance(data, list) else 'not a list'}")
            else:
                self.log_test("Inspirations GET (all)", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_test("Inspirations GET (all)", False, f"Exception: {str(e)}")
        
        # Test GET /api/inspirations with filters
        try:
            response = self.session.get(f"{self.base_url}/inspirations?country=Japan&type=cafe")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    # Verify filtering works
                    all_japan_cafe = all(item.get("country") == "Japan" and item.get("type") == "cafe" for item in data)
                    if all_japan_cafe:
                        self.log_test("Inspirations GET (filtered)", True, f"Filter works: {len(data)} Japan cafe items")
                    else:
                        self.log_test("Inspirations GET (filtered)", False, "Filter not working properly")
                else:
                    self.log_test("Inspirations GET (filtered)", False, f"Expected array, got: {type(data)}")
            else:
                self.log_test("Inspirations GET (filtered)", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_test("Inspirations GET (filtered)", False, f"Exception: {str(e)}")
    
    def test_collections_summary(self):
        """Test Collections summary endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/collections/summary")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    # Check structure of items
                    if len(data) > 0:
                        first_item = data[0]
                        required_fields = ["country", "count", "contributors"]
                        missing_fields = [field for field in required_fields if field not in first_item]
                        
                        if not missing_fields:
                            self.log_test("Collections Summary", True, f"Retrieved {len(data)} country summaries")
                        else:
                            self.log_test("Collections Summary", False, f"Missing fields in summary: {missing_fields}")
                    else:
                        self.log_test("Collections Summary", True, "Empty summary (no data yet)")
                else:
                    self.log_test("Collections Summary", False, f"Expected array, got: {type(data)}")
            else:
                self.log_test("Collections Summary", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_test("Collections Summary", False, f"Exception: {str(e)}")
    
    def test_country_cities(self):
        """Test GET /api/collections/{country}/cities"""
        try:
            response = self.session.get(f"{self.base_url}/collections/Japan/cities")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        first_item = data[0]
                        required_fields = ["city", "count"]
                        missing_fields = [field for field in required_fields if field not in first_item]
                        
                        if not missing_fields:
                            self.log_test("Country Cities", True, f"Retrieved {len(data)} cities for Japan")
                        else:
                            self.log_test("Country Cities", False, f"Missing fields in city summary: {missing_fields}")
                    else:
                        self.log_test("Country Cities", True, "No cities found for Japan (expected if no data)")
                else:
                    self.log_test("Country Cities", False, f"Expected array, got: {type(data)}")
            else:
                self.log_test("Country Cities", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_test("Country Cities", False, f"Exception: {str(e)}")
    
    def test_city_items(self):
        """Test GET /api/city/{country}/{city}/items"""
        try:
            response = self.session.get(f"{self.base_url}/city/Japan/Tokyo/items")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    # Verify all items are for Tokyo, Japan
                    if len(data) > 0:
                        all_tokyo = all(item.get("country") == "Japan" and item.get("city") == "Tokyo" for item in data)
                        if all_tokyo:
                            self.log_test("City Items", True, f"Retrieved {len(data)} items for Tokyo, Japan")
                        else:
                            self.log_test("City Items", False, "Items not properly filtered for Tokyo, Japan")
                    else:
                        self.log_test("City Items", True, "No items found for Tokyo (expected if no data)")
                else:
                    self.log_test("City Items", False, f"Expected array, got: {type(data)}")
            else:
                self.log_test("City Items", False, f"Status: {response.status_code}, Body: {response.text}")
        except Exception as e:
            self.log_test("City Items", False, f"Exception: {str(e)}")
    
    def test_negative_cases(self):
        """Test negative cases and validation"""
        # Test POST /api/inspirations missing required field (city)
        invalid_payload = {
            "url": "https://instagram.com/p/test",
            "title": "Test",
            "country": "Japan",
            # Missing city field
            "type": "cafe",
            "added_by": "tester"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/inspirations", json=invalid_payload)
            if response.status_code == 422:
                self.log_test("Negative: Missing required field", True, "Correctly returned 422 for missing city")
            else:
                self.log_test("Negative: Missing required field", False, f"Expected 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Negative: Missing required field", False, f"Exception: {str(e)}")
        
        # Test GET /api/inspirations with invalid type
        try:
            response = self.session.get(f"{self.base_url}/inspirations?type=invalid")
            if response.status_code == 422:
                self.log_test("Negative: Invalid type filter", True, "Correctly returned 422 for invalid type")
            else:
                self.log_test("Negative: Invalid type filter", False, f"Expected 422, got {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Negative: Invalid type filter", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        # Run tests in order
        self.test_health_check()
        self.test_status_crud()
        self.test_inspirations_crud()
        self.test_collections_summary()
        self.test_country_cities()
        self.test_city_items()
        self.test_negative_cases()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
        
        print(f"\n🎯 Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {total - passed} tests failed")
            return False

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)