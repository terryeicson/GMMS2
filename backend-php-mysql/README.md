# Republic of Rwanda - Government Market & Tender Management System (GMMS)

This folder contains the complete, production-ready PHP 8+ and MySQL/PDO backend and standalone HTML5/Tailwind/Vanilla JS frontend requested for local setup.

## 📁 Project Structure

```
backend-php-mysql/
├── schema.sql           # MySQL database schema, foreign keys, triggers, and seed data
├── db.php               # PDO database connection with prepared statement configuration
├── register.php         # User registration with 16-digit NID or Passport validation
├── login.php            # Secure login with Email & Password + profile check
├── vendor_profile.php   # Pre-application Vendor Profile management (TIN check)
├── get_tenders.php      # Public tenders list and details API endpoint
├── apply_tender.php     # Tender bidding logic with mandatory profile enforcement
├── my_applications.php  # User submitted applications and evaluation tracker
└── index.html           # Standalone HTML5 + Tailwind CSS CDN + Vanilla JS portal
```

## 🚀 Local Installation Guide

### Step 1: Import Database into MySQL
Open MySQL CLI or phpMyAdmin:
```bash
mysql -u root -p < schema.sql
```
This creates the `gmms_rwanda` database and seeds the 4 core tender types (Road Construction, School Feeding, School Uniforms, and Market Stall Allocations).

### Step 2: Configure Environment Variables or `db.php`
By default, `db.php` connects to `127.0.0.1:3306`, database `gmms_rwanda`, user `root`, and empty password.
You can configure environment variables in `.env` or Apache/Nginx:
```ini
DB_HOST=127.0.0.1
DB_NAME=gmms_rwanda
DB_USER=root
DB_PASS=your_secret_password
DB_PORT=3306
```

### Step 3: Run with PHP Built-in Server (Quick Test)
From inside this directory:
```bash
php -S localhost:8000
```
Open your browser at `http://localhost:8000/index.html`.

### Step 4: Demo Credentials Pre-Loaded
- **Company Contractor**: `kwizera.infrastructure@rwanda.rw` / `Password@2026` (TIN: 100482931, Road Construction)
- **Individual Food Vendor**: `chantal.mukamana@gmail.com` / `Password@2026` (TIN: 108459201, School Feeding)
- **Foreign Bidder**: `d.smith@eastafricaconstruct.com` / `Password@2026` (Passport: PA9823412)
