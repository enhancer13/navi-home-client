![Logo](docs/Images/enhancer13_logo_inverted.png)
# **Navi Home Client**
> The client application for the [Navi Home Server - Intelligent Smart Home](https://github.com/enhancer13/navi-home)
> 
> The application is written in **React Native** using **TypeScript**
> <p align="left"><a href="https://reactnative.dev" target="_blank"><img height="50" src="https://d33wubrfki0l68.cloudfront.net/554c3b0e09cf167f0281fda839a5433f2040b349/ecfc9/img/header_logo.svg" /></a>&nbsp;<a href="https://www.typescriptlang.org/docs/" target="_blank"><img height="50" src="https://raw.githubusercontent.com/jpb06/jpb06/master/icons/TypeScript.svg" /></a>&nbsp</p>

## Project Status
#### Build Status:

[![android build](https://github.com/enhancer13/navi-home-client/actions/workflows/android_build.yml/badge.svg?branch=master)](https://github.com/enhancer13/navi-home-client/actions/workflows/android_build.yml?branch=master)
[![ios build](https://github.com/enhancer13/navi-home-client/actions/workflows/ios_build.yml/badge.svg?branch=master)](https://github.com/enhancer13/navi-home-client/actions/workflows/ios_build.yml?branch=master)

[![lint-ts](https://github.com/enhancer13/navi-home-client/actions/workflows/lint-ts.yml/badge.svg?branch=master)](https://github.com/enhancer13/navi-home-client/actions/workflows/lint-ts.yml?branch=master)
[![type-check](https://github.com/enhancer13/navi-home-client/actions/workflows/type-check.yml/badge.svg?branch=master)](https://github.com/enhancer13/navi-home-client/actions/workflows/type-check.yml?branch=master)
[![test](https://github.com/enhancer13/navi-home-client/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/enhancer13/navi-home-client/actions/workflows/test.yml?branch=master)

#### Code Quality Metrics

[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=bugs)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=enhancer13_navi-home-client&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=enhancer13_navi-home-client)

#### Test Coverage Metrics
![Coverage Branches](https://raw.githubusercontent.com/enhancer13/navi-home-client/coverage-report/badges/coverage-branches.svg)
![Coverage Functions](https://raw.githubusercontent.com/enhancer13/navi-home-client/coverage-report/badges/coverage-functions.svg)
![Jest Coverage](https://raw.githubusercontent.com/enhancer13/navi-home-client/coverage-report/badges/coverage-jest%20coverage.svg)
![Coverage Lines](https://raw.githubusercontent.com/enhancer13/navi-home-client/coverage-report/badges/coverage-lines.svg)
![Coverage Statements](https://raw.githubusercontent.com/enhancer13/navi-home-client/coverage-report/badges/coverage-statements.svg)


## Project Description
**Navi Home** takes home automation to the next level by integrating AI, IP-cameras, and IoT devices under a single umbrella. It's more than just a smart home; it's a self-aware ecosystem that can see, communicate, and make decisions based on the configured automation scenes.

---
> <img src="docs/Images/Screenshots/login.png" width="150" alt="Login screen">
> <img src="docs/Images/Screenshots/video_streaming_viewer.png" width="150" alt="Video streaming viewer screen">
> <img src="docs/Images/Screenshots/media_gallery_folders.png" width="150" alt="Media gallery folders screen">
> <img src="docs/Images/Screenshots/media_gallery_files.png" width="150" alt="Media gallery files screen">
> <img src="docs/Images/Screenshots/single_media_viewer.png" width="150" alt="Media viewer screen">
> <img src="docs/Images/Screenshots/alarm_profiles.png" width="150" alt="Alarm profiles screen">
> <img src="docs/Images/Screenshots/entity_editor.png" width="150" alt="Entity editor screen">
> <img src="docs/Images/Screenshots/config_screen.png" width="150" alt="System configuration screen">
> <img src="docs/Images/Screenshots/my_account.png" width="150" alt="My account screen">
---
> <img src="docs/Images/Screenshots/dark_login.png" width="150" alt="Login screen">
> <img src="docs/Images/Screenshots/dark_video_streaming_viewer.png" width="150" alt="Video streaming viewer screen">
> <img src="docs/Images/Screenshots/dark_media_gallery_folders.png" width="150" alt="Media gallery folders screen">
> <img src="docs/Images/Screenshots/dark_media_gallery_files.png" width="150" alt="Media gallery files screen">
> <img src="docs/Images/Screenshots/dark_single_media_viewer.png" width="150" alt="Media viewer screen">
> <img src="docs/Images/Screenshots/dark_alarm_profiles.png" width="150" alt="Alarm profiles screen">
> <img src="docs/Images/Screenshots/dark_entity_editor.png" width="150" alt="Entity editor screen">
> <img src="docs/Images/Screenshots/dark_config_screen.png" width="150" alt="System configuration screen">
> <img src="docs/Images/Screenshots/dark_my_account.png" width="150" alt="My account screen">
---

<details>
  <summary><span style="font-size: 1.4em; font-weight: bold;">Unified Interface</span></summary>
<br>
It is possible to seamlessly integrate any **IP camera** and a plethora of **IoT devices** (IoT devices support will be released in version 2.0.0). Monitor and manage all of these devices using a single application, thereby breaking the silos of separate device interfaces.

---
><h3>Unified Video Stream Manager</h3>
>Manage all your configured video feeds in one place. This feature allows you to play videos, initiate recording, capture screenshots, and more, all from a single, convenient screen.
>
>![Logo](docs/Images/video_stream_viewer.gif)
---
><h3>Simplified Setup Interface</h3>
>Set up streaming from any publicly available video source in just a few simple steps through the intuitive configuration screen.
>
>![Logo](docs/Images/video_stream_add.gif)
</details>
<br>
<details>
  <summary><span style="font-size: 1.4em; font-weight: bold;">Adaptive Alarm System</span></summary>
<br>
The alarm system in Navi Server can adapt to different profiles, each with its own set of actions such as push notifications, emails, mobile phone calls, image or video saving. It can utilize either a motion detector or the AI engine's person detection feature (AI engine's person detection support will be released in version 1.3.0).

---
><h3>Comprehensive Alarm Settings</h3>
>Alarm system offers extensive configuration options for a tailored experience. Choose from a range of options including time frames, days of the week, notification targets (such as emails, push notifications, video recordings, etc.), user groups, and more. Plus, the ability to suspend notifications adds another layer of customization to meet your unique needs.
>
>![Logo](docs/Images/alarm_profile_overview.gif)
---
><h3>Showcase of Alarm System Capabilities</h3>
>This demonstration highlights the functionalities of the alarm system, encapsulating its ability to detect movement and alert the specified user through in-app notifications.
>
>![Logo](docs/Images/alarm_profile_demo.gif)
</details>
<br>
<details>
  <summary><span style="font-size: 1.4em; font-weight: bold;">Media Gallery</span></summary>
<br>
Store and access images or videos recorded by Navi Server in the media gallery. These media items, created automatically by alarm profiles, automation scenarios or manually triggered, can be shared or used to further train the AI engine (will be released in version 1.3.0) for more precise detection.

---
><h3>Showcase of Media Gallery Features</h3>
>The Media Gallery serves as a repository for images and videos generated through alarm profiles, automated scenarios, or user-triggered events.
>
>![Logo](docs/Images/media_gallery_demo.gif)
---
>The Media Gallery allows not ony to view the media items, but also to share them with others, delete them, or use them to train the AI engine (will be released in version 1.3.0).
>
>![Logo](docs/Images/media_gallery_demo2.gif)
</details>
<br>
<details>
  <summary><span style="font-size: 1.4em; font-weight: bold;">Event-Driven Automation</span></summary>
<br>
Leverage the power of event-driven programming within your home automation. Navi Server allows for intricate conditional scenarios such as "When any person enters the living room, then the light turns on automatically" or "When all the persons have left the house, then the system automatically engages security mode." These scenes can be manually configured, offering extensive flexibility and customizability.

---
>**<u>Available from Version 1.2.0</u>**
</details>
<br>
<details>
  <summary><span style="font-size: 1.4em; font-weight: bold;">AI-Powered Object Detection</span></summary>
<br>
Armed with an AI engine, Navi Server can detect any person in your house and reflect their position on an interactive house map. This brings a new dimension to home monitoring, safety, and automation.

---
>**<u>Available from Version 1.8.0</u>**
</details>
<br>
<details>
  <summary><span style="font-size: 1.4em; font-weight: bold;">Biometric Authentication</span></summary>
<br>
The application streamlines the login process by incorporating biometric authentication mechanisms. On Android devices, the application supports fingerprint scanning, while on iOS devices, it utilizes FaceID for secure and convenient access.

---
><h3>Demonstration of Biometric Authentication on Android</h3>
>This demonstration presents the process of fingerprint-based authentication for Android devices.
>
>![Logo](docs/Images/biometry_auth.gif)
</details>
<br>
<details>
  <summary><span style="font-size: 1.4em; font-weight: bold;">Theming Support</span></summary>
<br>
By default, application matches your operating system's theme upon installation, providing a familiar and intuitive visual experience. Later, if you prefer, you can manually switch between light and dark themes according to your preference.

---
><h3>Showcasing the Theme Switching Feature</h3>
>
>![Logo](docs/Images/app_theme.gif)
</details>

## Installation
The application operates in conjunction with a backend server, the [Navi Home Server - Intelligent Smart Home](https://github.com/enhancer13/navi-home), which is distributed independently.

The server is currently under development and its release is on the horizon. Should you wish to participate in testing the beta version, don't hesitate to [reach out to me](mailto:garmashs@gmail).

>Under development and will be available soon.

## Roadmap & Vision
### 1.0.0:
- [x] Add basic interface for integration with [Navi Home Server - Intelligent Smart Home](https://github.com/enhancer13/navi-home)
    - [x] User screens:
      - [x] Login
      - [x] Server config
      - [x] Video streaming
      - [x] Media gallery
        - [x] Single media viewer
          - [x] Slide, zoom, and pan
          - [x] Share media
          - [x] Delete media
      - [x] Alarm profiles
      - [x] System configuration
        - [x] Video sources
        - [x] Video streaming profiles
        - [x] Video recording profiles
        - [x] Motion detection profiles
        - [x] Object detection profiles
        - [x] Alarm profiles
        - [x] User accounts
        - [x] Firebase accounts
      - [x] My account
        - [x] Change password
    - [x] Support for biometric authentication
    - [x] Support for theming
    - [x] Support for CRUD operations on all entities
    - [x] Firebase integration (cloud messaging including push notifications and data messaging)
    - [x] Support for in-app notifications
### 1.1.0: 
- [ ] Add support for WebRTC based video streaming viewer, for low latency video playback
### 1.2.0:
- [ ] New user screens
    - [ ] Automation scenes (predefined scenarios)
    - [ ] Automation scenarios (user defined)
    - [ ] User notifications viewer
      - [ ] Filter notifications by type, date, and status etc.
      - [ ] Mark notifications as read
      - [ ] Delete notifications
      - [ ] Show notification details (link to the source)
### 1.3.0:
- [ ] Integration with AI backend engine
  - [ ] New user screens
    - [ ] Object detection
    - [ ] AI engine training
### 2.0.0:
- [ ] New user screens
  - [ ] Dashboards (main user screen - manage all aspects of the system)
  - [ ] IoT configuration
### 2.1.0:
- [ ] New user screens
    - [ ] Configure alarm zones
### 3.0.0:
- [ ] New user screens
  - [ ] Interactive home map creator
  - [ ] Interactive home map viewer
### 3.1.0:
- [ ] Add localization for other languages
    - [ ] Ukrainian
  
## Licence
This repository is licensed under the terms of the [**MIT license**](LICENSE).

## Contributors
Contributions of any kind are welcome!

## Contact and Suggestion
Any feedback is welcome - feel free to create an issue or email me - [garmashs@gmail.com](mailto:garmashs@gmail). Thank you :blush:

## Support and Donation 🕊️
If you like my work, you can support me by donation. 👍
