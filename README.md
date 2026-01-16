# OFFGRID-REACT-NATIVE

<p align="center">
  <em>Calm, chronological, human — social without algorithms.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/offgrid-social/offgrid-react-native?style=flat-square" />
  <img src="https://img.shields.io/github/languages/top/offgrid-social/offgrid-react-native?style=flat-square" />
  <img src="https://img.shields.io/github/languages/count/offgrid-social/offgrid-react-native?style=flat-square" />
  <img src="https://img.shields.io/github/license/offgrid-social/offgrid-react-native?style=flat-square" />
  <img src="https://img.shields.io/badge/Ecosystem-OFFGRID-black?style=flat-square" />
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

## Overview

OFFGRID is a **privacy-first social network**.

No algorithms.  
No engagement manipulation.  
No behavioral tracking.

This repository contains the **React Native mobile app** for OFFGRID.

Everything is chronological, explainable, and intentionally calm.

---

## Getting Started

**Requirements**

- Node.js (LTS)
- npm
- Java JDK 17
- Android SDK
- Expo CLI

Required environment variables:

- `ANDROID_HOME`
- `ANDROID_SDK_ROOT`

---

## Installation

Clone the repository:

`git clone https://github.com/offgrid-social/offgrid-react-native.git`

Enter the directory:

`cd offgrid-react-native`

Install dependencies:

`npm install`

---

## Usage

Start the development server:

`npx expo start`

Then press:

- `a` → Android emulator  
- `i` → iOS simulator (macOS only)

---

## Testing

Tests focus on **logic and regressions**, not UI snapshots.

Covered areas:
- Profile tab filtering
- Likes → Likes tab behavior
- Network error UI stability
- Bug report submission

Run tests:

`npm test`

---

## Build (Android)

Build a local release APK:

`npx expo run:android --variant release`

APK output:

`android/app/build/outputs/apk/release/app-release.apk`

---

## OFFGRID Ecosystem

- **offgrid-core**  
  https://github.com/offgrid-social/offgrid-core

- **offgrid-auth**  
  https://github.com/offgrid-social/offgrid-auth

- **offgrid-api**  
  https://github.com/offgrid-social/offgrid-api

- **offgrid-node**  
  https://github.com/offgrid-social/offgrid-node

- **offgrid-frontend**  
  https://github.com/offgrid-social/offgrid-frontend

- **offgrid-cli**  
  https://github.com/offgrid-social/offgrid-cli

- **offgrid-registry**  
  https://github.com/offgrid-social/offgrid-registry

- **offgrid-docs**  
  https://github.com/offgrid-social/offgrid-docs

- **offgrid-manifest**  
  https://github.com/offgrid-social/offgrid-manifest

- **offgrid-governance**  
  https://github.com/offgrid-social/offgrid-governance

---

## Privacy

OFFGRID intentionally avoids:
- analytics SDKs
- fingerprinting
- user profiling
- algorithmic ranking

If something exists, it is visible in the code.

---

## License

Licensed under **AGPL-3.0**.  
See `LICENSE` for details.

---

*Calm over clicks · Humans over metrics · Chronology over control*
