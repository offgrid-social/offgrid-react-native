# OFFGRID-REACT-NATIVE

<p align="center">
  <em>Calm, chronological, human — social without algorithms.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/offgrid-social/offgrid-react-native?style=flat-square" />
  <img src="https://img.shields.io/github/languages/top/offgrid-social/offgrid-react-native?style=flat-square" />
  <img src="https://img.shields.io/github/languages/count/offgrid-social/offgrid-react-native?style=flat-square" />
  <img src="https://img.shields.io/github/license/offgrid-social/offgrid-react-native?style=flat-square" />
</p>

<p align="center">
  Built with
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Build (Android)](#build-android)
- [Privacy](#privacy)
- [License](#license)

---

## Overview

OFFGRID is a **privacy-first social network**.

No algorithms.  
No engagement manipulation.  
No behavioral tracking.

This repository contains the **React Native mobile app**, built with Expo and TypeScript.

Everything is:
- chronological
- explainable
- intentionally calm

---

## Getting Started

### Prerequisites

You need:

- **Node.js** (LTS)
- **npm**
- **Java JDK 17**
- **Android SDK** (for Android builds)
- **Expo CLI**

Environment variables required for Android builds:

```text
ANDROID_HOME
ANDROID_SDK_ROOT
Installation
Clone the repository:


git clone https://github.com/offgrid-social/offgrid-react-native.git
cd offgrid-react-native
Install dependencies:


npm install
Usage
Start the development server:

bash
Code kopieren
npx expo start
Then press:

a → Android emulator

i → iOS simulator (macOS only)

Testing
Tests focus on logic and regressions, not UI snapshots.

Covered areas:

Profile tab filtering

Likes → Likes tab behavior

Network error UI stability

Bug report submission

Run tests:


npm test
Build (Android)
Build a local release APK:


npx expo run:android --variant release
Output location:

text
Code kopieren
android/app/build/outputs/apk/release/app-release.apk
The APK can be installed on:

Android emulators

Physical Android devices

Privacy
OFFGRID intentionally avoids:

analytics SDKs

fingerprinting

user profiling

algorithmic ranking

If something exists, it is visible in the code.

License
This project is part of the OFFGRID ecosystem
and is licensed under AGPL-3.0.

<p align="center"> <em> Calm over clicks · Humans over metrics · Chronology over control </em> </p> ```
