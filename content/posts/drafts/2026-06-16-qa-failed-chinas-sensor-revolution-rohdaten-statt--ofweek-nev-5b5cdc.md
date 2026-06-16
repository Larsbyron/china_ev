---
title: "[QA FAILED] Chinas Sensor-Revolution: Rohdaten statt Blackbox"
date: 2026-06-16T07:19:20.309Z
description: "Chinesische Hersteller stellen auf zentrale Sensorarchitektur um. Statt gefilterter Daten liefern Radar & Lidar nun Rohsignale direkt an die KI – ein Paradigmenwechsel für autonomes Fahren."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Hybrid"]
draft: true
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] Chinas Sensor-Revolution: Rohdaten statt Blackbox

Die chinesische Automobilindustrie bereitet einen grundlegenden Wandel in der Sensorarchitektur vor. Bisher verarbeiteten Radar- und Lidarsensoren ihre Daten lokal und gaben nur gefilterte Ergebnisse an das Steuergerät weiter – eine „Blackbox" für den Hersteller. Künftig sollen alle Sensoren ihre Rohdaten (RAW) über Hochgeschwindigkeitsverbindungen (SerDes) an eine zentrale Recheneinheit (SoC) liefern. Das ermöglicht eine echte, tiefe Sensorfusion, bei der Algorithmen nicht mehr auf vorgekaute Zielobjekte angewiesen sind, sondern aus den rohen Signalen neue Informationen extrahieren können.

## Warum der Umbruch? – Algorithmus-Kontrolle wechselt

Der Schlüssel liegt in der Kontrolle über die Signalverarbeitung. Bisher besaßen Tier-1-Zulieferer wie Bosch oder Continental das Know-how, um aus Radarrohsignalen Ziele zu extrahieren. Bei der zentralen Architektur bleibt nur noch die reine Hochfrequenz-Hardware (MMIC, ADC) im Sensor; die gesamte digitale Signalverarbeitung (FFT, CFAR) wandert in den leistungsstarken ADAS-SoC (z. B. von NVIDIA, Qualcomm oder Black Sesame). Chiphersteller wie NXP treiben diesen Wandel mit speziellen Radar-Bridge-Chips voran, die eine direkte Anbindung der Rohdaten an den SoC ermöglichen. Auch TI unterstützt mit seinen AWR-Serien den RAW-Modus. Der Vorteil: Für höhere Autonomiestufen (L3/L4) reichen listenbasierte Zielobjekte nicht mehr – die KI braucht die volle Rohsignal-Information (Doppler, Amplituden, Phasen), um etwa stehende Hindernisse, Brücken oder Schlaglöcher sicher zu erkennen.

## Drei Wege bei Radar, Lidar und Ultraschall

Die Umstellung betrifft alle Sensortypen, aber mit unterschiedlichen Herausforderungen:

**4D-Radar:** Hier zeichnen sich zwei Entwicklungslinien ab. Die chinesische Route setzt auf Kosteneffizienz: ein SoC + zwei MMIC (8T8R). Die europäische Route setzt auf hohe Leistung: ein SoC + vier MMIC (16T16R) oder sogar 24T24R. Bis 2028 werden beide Pfade koexistieren, je nach Anwendung und Kostenmodell. Die eigentliche Hürde ist nicht die Hardware, sondern die Algorithmus-IP: Wer besitzt die optimierte Radarverarbeitung? Und wie portiert man sie effizient auf die unterschiedlichen SoC-Plattformen? Zudem sind die MIPI-Schnittstellen der SoCs ursprünglich für Kameras optimiert – die Datenstruktur von Radar (2D/3D-Arrays) unterscheidet sich fundamental von Kameraframes. DSPs müssen das erst lernen.

**Lidar:** Die Zentralisierung ist hier am einfachsten. Bisher entfiel ein großer Kostenblock auf das FPGA zur Signalverarbeitung im Sensor. Zukünftig übernimmt das der SoC – der Lidar selbst reduziert sich auf reine Sende-/Empfangs-Hardware (SPAD, TDC). Chinesische Lidar-Hersteller wie Hesai oder RoboSense arbeiten bereits an solchen „nackten" Sensoren mit MIPI-Ausgang, die wie eine Kamera an die Recheneinheit angeschlossen werden können. Die Datenrate eines 192-Linien-Lidars beträgt rund 3,6 Gbit/s – das liegt im Bereich von GMSL2 (6 Gbit/s), aber die Datenstruktur (Slots mit Abstand, Intensität, Geschwindigkeit statt Pixel-Raster) erfordert spezielle DSP-Pipelines. Aktuelle SoCs müssen für diese Last noch optimiert werden.

**Ultraschall:** Die Umstellung ist auch hier möglich, aber zeitkritisch. Ultraschallsensoren benötigen eine extrem präzise Laufzeitmessung (Puls-Echo). Bei zentraler Verarbeitung steigt die Reaktionszeit um bis zu 20 % – das kann bei Einparksensoren kritisch sein. Allerdings lässt sich durch feinere Matching-Filter im SoC mehr Information aus dem Signal holen (z. B. Erkennung von Bordsteinen oder niedrigen Hindernissen). In der Praxis setzt sich eine Hybridlösung durch: Eine lokale Vorverarbeitung (z. B. sechs Sensoren in der Frontschürze) sammelt und bündelt die Daten, bevor sie an die Zentrale geht – ein Kompromiss zwischen Latenz und Fusionsgüte.

BYD (比亚迪) hat mit seinem „Xuanji"-System gezeigt, dass dieser Ansatz funktioniert: Durch den Zugriff auf Rohdaten gewann man bis zu 20 % mehr Reichweite bei der Zielerkennung und steigerte die Punktdichte um das Zehnfache. Der Trend ist klar: Chinas Automobilindustrie gibt die Blackbox auf und übernimmt die volle Kontrolle von der Datenpipeline bis zur Entscheidung. Das wird die nächste Stufe des autonomen Fahrens – vom assistierten L2 zum echten L3 – entscheidend beschleunigen.

---

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
