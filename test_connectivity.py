#!/usr/bin/env python3
"""
Jenkins Connectivity Test Script
Tests connection to Jenkins before running the full dashboard.
"""

import requests
import os
from dotenv import load_dotenv
from src.config import DashboardConfig

def test_jenkins_connectivity():
    """Test basic connectivity to Jenkins"""
    print("🔍 Testing Jenkins Connectivity...")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv(override=True)
    
    # Get configuration
    jenkins_url = DashboardConfig.JENKINS_BASE_URL
    jenkins_user = DashboardConfig.JENKINS_USER
    jenkins_token = DashboardConfig.JENKINS_TOKEN
    
    print(f"📍 Jenkins URL: {jenkins_url}")
    print(f"👤 Username: {jenkins_user}")
    print(f"🔑 Token: {jenkins_token[:8]}..." if jenkins_token else "❌ No token found")
    print()
    
    if not all([jenkins_url, jenkins_user, jenkins_token]):
        print("❌ Missing required configuration!")
        print("Please check your .env file for:")
        print("  - JENKINS_BASE_URL")
        print("  - JENKINS_USER") 
        print("  - JENKINS_TOKEN")
        return False
    
    # Setup authentication
    auth = (jenkins_user, jenkins_token)
    
    # Test 1: Basic connectivity with authentication (Jenkins requires auth for all API calls)
    print("1️⃣ Testing basic connectivity with authentication...")
    try:
        response = requests.get(f"{jenkins_url}/api/json", auth=auth, timeout=10)
        if response.status_code == 200:
            print("✅ Basic connectivity: SUCCESS")
            data = response.json()
            print(f"   📊 Jenkins Version: {data.get('version', 'Unknown')}")
            print(f"   🏗️  Total Jobs: {len(data.get('jobs', []))}")
        else:
            print(f"❌ Basic connectivity: FAILED (Status: {response.status_code})")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Basic connectivity: FAILED - {e}")
        return False
    
    # Test 2: User info
    print("\n2️⃣ Testing user information...")
    try:
        user_url = f"{jenkins_url}/user/{jenkins_user}/api/json"
        response = requests.get(user_url, auth=auth, timeout=10)
        if response.status_code == 200:
            user_data = response.json()
            print("✅ User info: SUCCESS")
            print(f"   👤 Full Name: {user_data.get('fullName', 'Unknown')}")
            print(f"   📧 Email: {user_data.get('property', [{}])[0].get('address', 'Unknown')}")
        else:
            print(f"❌ User info: FAILED (Status: {response.status_code})")
    except requests.exceptions.RequestException as e:
        print(f"❌ User info: FAILED - {e}")
    
    # Test 3: JobConfigHistory plugin (for Last Editor functionality)
    print("\n3️⃣ Testing JobConfigHistory plugin...")
    try:
        # Test with a sample job (first job in the list)
        jobs_response = requests.get(f"{jenkins_url}/api/json?tree=jobs[name,url]", auth=auth, timeout=10)
        if jobs_response.status_code == 200:
            jobs_data = jobs_response.json()
            if jobs_data.get('jobs'):
                sample_job = jobs_data['jobs'][0]
                job_url = sample_job['url']
                config_history_url = f"{job_url.rstrip('/')}/jobConfigHistory/api/json?tree=jobConfigHistory[0][user]"
                
                config_response = requests.get(config_history_url, auth=auth, timeout=10)
                if config_response.status_code == 200:
                    print("✅ JobConfigHistory plugin: AVAILABLE")
                    print("   ✏️ Last Editor functionality will work")
                else:
                    print("⚠️ JobConfigHistory plugin: NOT AVAILABLE")
                    print("   ✏️ Last Editor will show fallback data")
            else:
                print("⚠️ No jobs found to test JobConfigHistory")
        else:
            print("❌ Could not fetch jobs for JobConfigHistory test")
    except requests.exceptions.RequestException as e:
        print(f"❌ JobConfigHistory test: FAILED - {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Connectivity test completed!")
    print("✅ Your Jenkins is ready for the dashboard!")
    return True

if __name__ == "__main__":
    success = test_jenkins_connectivity()
    if success:
        print("\n🚀 You can now run: uv run streamlit run main.py")
    else:
        print("\n❌ Please fix the connectivity issues before running the dashboard.") 