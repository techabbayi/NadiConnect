#!/usr/bin/env python3
"""
MediDoctor AI Platform - Setup Verification Script
===================================================
Run this script to verify your development environment is set up correctly.

Usage:
    python verify_setup.py
"""

import os
import sys
import subprocess
from pathlib import Path


class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'


def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(60)}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")


def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")


def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.END}")


def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")


def print_info(text):
    print(f"{Colors.BLUE}ℹ {text}{Colors.END}")


def check_python_version():
    """Check Python version"""
    print_header("Checking Python Version")

    version = sys.version_info
    version_str = f"{version.major}.{version.minor}.{version.micro}"

    if version.major >= 3 and version.minor >= 9:
        print_success(f"Python {version_str} detected")
        return True
    else:
        print_error(f"Python {version_str} detected (requires 3.9+)")
        return False


def check_node_version():
    """Check Node.js version"""
    print_header("Checking Node.js Version")

    try:
        result = subprocess.run(['node', '--version'],
                                capture_output=True,
                                text=True,
                                check=False)
        version = result.stdout.strip()

        # Extract major version
        major_version = int(version.lstrip('v').split('.')[0])

        if major_version >= 18:
            print_success(f"Node.js {version} detected")
            return True
        else:
            print_error(f"Node.js {version} detected (requires 18+)")
            return False
    except FileNotFoundError:
        print_error("Node.js not found (required for frontend)")
        return False


def check_backend_files():
    """Check backend files exist"""
    print_header("Checking Backend Files")

    backend_dir = Path(__file__).parent / 'backend'
    required_files = [
        'main.py',
        'database.py',
        'models.py',
        'schemas.py',
        'requirements.txt',
        'services/ai_service.py',
        'services/risk_service.py',
        'services/guidance_service.py',
        'services/doctor_service.py',
    ]

    all_exist = True
    for file in required_files:
        file_path = backend_dir / file
        if file_path.exists():
            print_success(f"{file}")
        else:
            print_error(f"{file} missing")
            all_exist = False

    return all_exist


def check_frontend_files():
    """Check frontend files exist"""
    print_header("Checking Frontend Files")

    frontend_dir = Path(__file__).parent / 'medidoctor'
    required_files = [
        'app/page.tsx',
        'app/layout.tsx',
        'app/scan/page.tsx',
        'app/results/page.tsx',
        'app/doctors/page.tsx',
        'app/booking/page.tsx',
        'app/admin/page.tsx',
        'components/CameraCapture.tsx',
        'components/ConfidenceMeter.tsx',
        'components/RiskBadge.tsx',
        'services/api.ts',
        'package.json',
    ]

    all_exist = True
    for file in required_files:
        file_path = frontend_dir / file
        if file_path.exists():
            print_success(f"{file}")
        else:
            print_error(f"{file} missing")
            all_exist = False

    return all_exist


def check_backend_dependencies():
    """Check backend dependencies are installed"""
    print_header("Checking Backend Dependencies")

    try:
        # Try importing key packages
        import fastapi
        print_success("FastAPI installed")

        import uvicorn
        print_success("Uvicorn installed")

        import sqlalchemy
        print_success("SQLAlchemy installed")

        import pydantic
        print_success("Pydantic installed")

        return True
    except ImportError as e:
        print_error(f"Missing dependency: {e.name}")
        print_info("Run: pip install -r backend/requirements.txt")
        return False


def check_frontend_dependencies():
    """Check frontend dependencies"""
    print_header("Checking Frontend Dependencies")

    frontend_dir = Path(__file__).parent / 'medidoctor'
    node_modules = frontend_dir / 'node_modules'

    if node_modules.exists():
        print_success("node_modules directory exists")

        # Check for key packages
        key_packages = ['next', 'react', 'react-dom', 'lucide-react']
        all_exist = True

        for package in key_packages:
            package_dir = node_modules / package
            if package_dir.exists():
                print_success(f"{package} installed")
            else:
                print_warning(f"{package} might be missing")
                all_exist = False

        return all_exist
    else:
        print_error("node_modules not found")
        print_info("Run: cd medidoctor && npm install")
        return False


def check_env_files():
    """Check environment files"""
    print_header("Checking Environment Files")

    frontend_dir = Path(__file__).parent / 'medidoctor'
    env_file = frontend_dir / '.env.local'

    if env_file.exists():
        print_success(".env.local exists")

        # Check content
        content = env_file.read_text()
        if 'NEXT_PUBLIC_API_URL' in content:
            print_success("NEXT_PUBLIC_API_URL configured")
            return True
        else:
            print_warning("NEXT_PUBLIC_API_URL not found in .env.local")
            return False
    else:
        print_warning(".env.local not found")
        print_info(
            "Create: echo 'NEXT_PUBLIC_API_URL=http://localhost:8000' > medidoctor/.env.local")
        return False


def check_documentation():
    """Check documentation files"""
    print_header("Checking Documentation")

    root_dir = Path(__file__).parent
    doc_files = [
        'README.md',
        'QUICKSTART.md',
        'DEPLOYMENT.md',
        'DEMO_SCRIPT.md',
        'ARCHITECTURE.md',
        'LICENSE',
    ]

    all_exist = True
    for doc in doc_files:
        doc_path = root_dir / doc
        if doc_path.exists():
            print_success(f"{doc}")
        else:
            print_warning(f"{doc} missing")
            all_exist = False

    return all_exist


def main():
    """Run all checks"""
    print(f"\n{Colors.BOLD}MediDoctor AI Platform - Setup Verification{Colors.END}")
    print(f"{Colors.BLUE}This will verify your development environment{Colors.END}\n")

    results = {
        'Python Version': check_python_version(),
        'Node.js Version': check_node_version(),
        'Backend Files': check_backend_files(),
        'Frontend Files': check_frontend_files(),
        'Backend Dependencies': check_backend_dependencies(),
        'Frontend Dependencies': check_frontend_dependencies(),
        'Environment Files': check_env_files(),
        'Documentation': check_documentation(),
    }

    # Summary
    print_header("Verification Summary")

    passed = sum(results.values())
    total = len(results)

    for check, result in results.items():
        status = f"{Colors.GREEN}PASS{Colors.END}" if result else f"{Colors.RED}FAIL{Colors.END}"
        print(f"{check}: {status}")

    print(f"\n{Colors.BOLD}Result: {passed}/{total} checks passed{Colors.END}\n")

    if passed == total:
        print_success("✓ All checks passed! Your environment is ready.")
        print_info("\nNext steps:")
        print_info("  1. Start backend: cd backend && python main.py")
        print_info("  2. Start frontend: cd medidoctor && npm run dev")
        print_info("  3. Open http://localhost:3000")
        return 0
    else:
        print_warning("⚠ Some checks failed. Please fix the issues above.")
        print_info("\nQuick fixes:")
        print_info("  Backend deps: pip install -r backend/requirements.txt")
        print_info("  Frontend deps: cd medidoctor && npm install")
        print_info(
            "  Environment: echo 'NEXT_PUBLIC_API_URL=http://localhost:8000' > medidoctor/.env.local")
        return 1


if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Verification cancelled{Colors.END}")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Colors.RED}Error: {e}{Colors.END}")
        sys.exit(1)
