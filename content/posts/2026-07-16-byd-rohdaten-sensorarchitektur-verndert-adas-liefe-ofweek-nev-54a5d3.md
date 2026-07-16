---
title: "BYD: Rohdaten-Sensorarchitektur verändert ADAS-Lieferkette"
date: 2026-07-16T04:55:34.666Z
description: "China treibt entkoppelte ADAS-Architekturen voran: Sensoren liefern Rohdaten, Algorithmen laufen auf zentralen SoCs. Das verschiebt die Wertschöpfung von Tier-1-Zulieferern zu Chip- und Softwareentwicklern."
source: "OFweek NEV"

category: "news"

brands: ["BYD", "NXP", "Texas Instruments"]
tags: []
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "industrie-produktion-lieferkette"
marketRelevance: "global_industry"
---

# BYD: Rohdaten-Sensorarchitektur verändert ADAS-Lieferkette

## Neue Architektur: Sensoren liefern Rohdaten

Die chinesische Autoindustrie treibt eine grundlegende Änderung der ADAS-Sensorarchitektur voran. Statt wie bisher in jedem Radar- oder Lidar-Sensor einen eigenen Mikrocontroller („Blackbox") für die Signalverarbeitung zu integrieren, setzen Hersteller wie BYD (比亚迪) mit seinem System „God's Eye" auf eine Entkopplung: Die Sensoren liefern nur rohe Signaldaten (RAW-Daten) über SerDes-Leitungen (Serializer-Deserializer) an eine zentrale Recheneinheit (SoC). Die eigentliche Objekterkennung und Fusion läuft dort in Software. Das verspricht bessere Performanz – 1+1 kann so mehr als 2 ergeben, wie es in der Branche heißt.

BYDs „God's Eye" nutzt unter anderem 1,6 km weit reichende 4D-Radare und 400 m weit reichende Lidare, die alle Rohdaten an einen zentralen SoC senden. Bisher arbeitete jedes Radarmodul eigenständig: Es führte Fast Fourier Transformation (FFT) durch, erkannte Ziele und gab nur komprimierte Objektlisten an das Steuergerät weiter – ein Informationsverlust, der bei der neuen Architektur vermieden wird.

## Warum jetzt? Der Kampf um die Algorithmen

Der Umbruch wird durch neue Chip-Lösungen ermöglicht. NXP hat mit dem „Radar Bridge" einen speziellen Bridge-Chip vorgestellt, der zwischen MMIC (Millimeterwellen-IC) und SerDes vermittelt. Gleichzeitig integriert NXP Radar-Signalverarbeitungs-IP (RSP) direkt in ADAS-SoCs, sodass die komplexe Algorithmik auf dem SoC läuft – und nicht mehr in der Blackbox des Radarherstellers. Auch Texas Instruments unterstützt mit seinen AWR-Radar-Chips den RAW-Daten-Modus.

Der Machtwechsel in der Lieferkette ist offensichtlich: Bisher hielten Tier-1-Zulieferer wie Bosch oder Continental das Know-how der Radarsignalverarbeitung in ihren Händen. Mit der Entkopplung wandert die Wertschöpfung zu den Chip- und Softwareentwicklern sowie den Automobilherstellern selbst. Chinesische OEMs treiben diesen Wandel besonders forciert, um schneller eigene ADAS-Funktionen entwickeln zu können.

## Herausforderungen bei Radar, Lidar und Ultraschall

Die Umstellung ist nicht trivial. Bei der Millimeterwellen-Radar erfordert die Rohdaten-Übertragung hohe Bandbreiten – bis zu mehrere Gbps pro Sensor. Lidar-Sensoren arbeiten mit Punktwolken, deren Datenstruktur sich grundlegend von Kamerabildern unterscheidet, was die Integration in für Kameras optimierte MIPI-Schnittstellen (Mobilindustrie-Interface) erschwert. Beim Ultraschall-Radar werden die Echo-Rohdaten statt einer fertigen Entfernungsangabe übertragen, was die Rechenlast im Steuergerät um bis zu 20 Prozent steigert, aber feinere Filter ermöglicht.

BYD selbst setzt bei der Vernetzung auf eine Mischung aus „dezentraler Vorverarbeitung und zentraler Fusion", um die Leitungs- und Kostenexplosion zu vermeiden. Laut Branchenkreisen kann die neue Architektur die Rechenlatenz um 20 Prozent senken und die Erkennungsdichte um das Zehnfache erhöhen. Der Trend zeigt: Chinesische Hersteller wollen die gesamte Datenkette vom Sensorrohsignal bis zur Fahrentscheidung kontrollieren – ohne Blackbox. Das könnte auch die europäische Zulieferindustrie nachhaltig verändern.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
