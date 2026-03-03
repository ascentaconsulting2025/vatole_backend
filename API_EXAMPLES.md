# API Testing Examples

## Authentication

### Register Admin

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "admin@grampanchayat.gov.in",
  "password": "admin123",
  "role": "admin"
}
```

### Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@grampanchayat.gov.in",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "admin@grampanchayat.gov.in",
      "role": "admin"
    }
  }
}
```

## Representatives

### Save Representatives

```bash
POST http://localhost:5000/api/representatives
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "representatives": [
    {
      "name": "John Doe",
      "nameMr": "जॉन डो",
      "mobile": "9876543210",
      "mobileMr": "९८७६५४३२१०",
      "position": "Sarpanch",
      "image": "/uploads/officials/image.jpg",
      "fixed": true
    }
  ]
}
```

### Get Representatives

```bash
GET http://localhost:5000/api/representatives
```

## Certificates

### Save Certificates

```bash
POST http://localhost:5000/api/certificates
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "certificates": [
    {
      "certificateName": {
        "en": "Income Certificate",
        "mr": "उत्पन्न प्रमाणपत्र"
      },
      "certificateDescription": {
        "en": "Certificate for income proof",
        "mr": "उत्पन्न पुराव्यासाठी प्रमाणपत्र"
      },
      "requiredDocuments": [
        {
          "en": "Aadhar Card",
          "mr": "आधार कार्ड"
        }
      ]
    }
  ]
}
```

## Images

### Upload Image

```bash
POST http://localhost:5000/api/images/upload
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

image: [file]
title: "Event Photo"
description: "Annual function 2024"
category: "gallery"
```

## Infrastructure

### Save Infrastructure

```bash
POST http://localhost:5000/api/infrastructure
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "infrastructure": [
    {
      "category": "Schools",
      "categoryMr": "शाळा",
      "count": "5",
      "description": "Primary and secondary schools"
    }
  ]
}
```

## Historical Data

### Save Historical Data

```bash
POST http://localhost:5000/api/historical
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "events": [
    {
      "year": "1947",
      "eventName": "स्वातंत्र्य दिन",
      "eventNameEn": "Independence Day",
      "description": "India got independence"
    }
  ],
  "places": [
    {
      "placeName": "मंदिर",
      "placeNameEn": "Temple",
      "description": "Ancient temple"
    }
  ]
}
```

## Grampanchayat Info

### Save Grampanchayat Info

```bash
POST http://localhost:5000/api/grampanchayat
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "grampanchayatName": "मुंबई ग्रामपंचायत",
  "grampanchayatNameEn": "Mumbai Gram Panchayat",
  "talukaName": "मुंबई",
  "talukaNameEn": "Mumbai",
  "districtName": "मुंबई",
  "districtNameEn": "Mumbai",
  "phone": "022-12345678",
  "email": "mumbai@gp.gov.in"
}
```

## Website Data (Public)

### Get All Website Data

```bash
GET http://localhost:5000/api/website/all
```

### Get Officials

```bash
GET http://localhost:5000/api/website/officials
```

### Get Gallery

```bash
GET http://localhost:5000/api/website/gallery
```
