---
title: "China setzt auf zentrale Steuerung für autonomes Fahren"
date: 2026-06-29T14:01:14.422Z
description: "Chinesische Hersteller stellen die Sensor-Architektur um: Statt verteilter Radar- und Kamerasysteme übernimmt eine zentrale Rechenplattform die Fusion – mit mehr Effizienz und Flexibilität."
source: "OFweek NEV"

category: "news"


tags: ["Reichweite", "Autonomes Fahren"]
draft: false
original_url: "https://nev.ofweek.com/2026-06/ART-77015-8330-30689151.html"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# China setzt auf zentrale Steuerung für autonomes Fahren

Die chinesische Automobilindustrie treibt den Wandel hin zu einer zentralisierten Architektur für Fahrassistenzsysteme (ADAS) und autonomes Fahren voran. Statt jedes Radar- oder Kamerasystem mit einem eigenen „Mini-Computer" auszustatten, werden die Rohdaten aller Sensoren über SerDes-Leitungen an eine zentrale Recheneinheit (SoC) übertragen. Diese führt dann die komplette Sensorfusion und Objekterkennung durch.

Bisher arbeiteten Radarsensoren als Blackbox: Sie lieferten nur gefilterte Ergebnisse wie „50 Meter vorne Hindernis" oder „30 Meter rechts Pkw". Der Hersteller erhielt lediglich eine verdichtete Objektliste, nicht die eigentlichen Rohdaten. Damit ging wertvolle Information verloren – etwa Doppler-Spektren oder Mikro-Doppler-Signaturen, die Fahrradfahrer von Autos unterscheiden.

## Vorteile der zentralen Architektur

Mit der neuen Architektur fließen alle Rohdaten in einem gemeinsamen Raumzeit-Raster zusammen. Beispiel: Ein Radar hat eine schwache Reflexion durch Regentropfen, das Kamerasystem „sieht" das Hindernis klarer. Statt eines Widerspruchs („Radar sagt nichts, Kamera sagt ja") kann der Algorithmus durch Fusion beider Informationsquellen eine robustere Entscheidung treffen. Fachleute sprechen von „1+1 kann mehr als 2 ergeben".

Diese Entwicklung verschiebt die Kontrolle über die Algorithmen: Bisher lag die Radarsignalverarbeitung in der Hand der Tier-1-Zulieferer, die ihre Know-how in der Firmware der Sensoren verbauten. Die neue Architektur verlagert die Verarbeitung auf das zentrale ADAS-SoC – und damit in den Einflussbereich der Automobilhersteller und Halbleiterfirmen wie NXP, TI und Mobileye.

## Technische Hürden

Die Umstellung ist nicht trivial. SoC müssen 12 und mehr Radar-Streams parallel verarbeiten – das erfordert leistungsfähige DSPs und spezielle Radar-Bridge-Chips. Auch die Datenformate unterscheiden sich fundamental von Kamerabildern: Radar liefert mehrdimensionale Arrays (Range, Doppler, Azimut) statt fester Frames. Effiziente Verarbeitung auf GPU/CPU ist noch nicht optimal gelöst.

Lidar-Systeme wiederum erzeugen Punktwolken mit bis zu 3,6 Gbit/s Datenrate – ein Ansatz, der leistungsfähige Schnittstellen wie GMSL2 erfordert. Hersteller wie Hesai und RoboSense entwickeln bereits 192-Laser-Lidar mit 0,1° Auflösung.

## Drei Wege in die Zukunft

Experten sehen drei technische Pfade:  
- **4D-Imaging-Radar**: China setzt auf kosteneffiziente 8T8R-Lösung (1 SoC + 2 MMIC), Europa auf 16T16R oder sogar 24T24R für höhere Auflösung.  
- **Zone-Architektur**: Statt vollständig zentral oder verteilt wählen viele Hersteller einen Mittelweg – Sensordaten werden in „Zonen" vorkonsolidiert und dann an die Zentrale übertragen. BYD etwa reduziert damit die Latenz um 20 % und erhöht die Reichweite um 20 %.  
- **Algorithmen-IP**: Die Schlüsselfrage ist, wer die Kontrolle über die Sensorfusions-Algorithmen hält – die OEMs, die SoC-Hersteller oder die Tier-1. Chinesische Hersteller wie BYD, NIO und XPeng tendieren zur Eigenentwicklung.

Die Umstellung auf zentrale Architekturen gilt als essenziell für den Sprung von Level-2+ zu Level-3-Autonomie. China treibt diese Entwicklung mit hohem Tempo voran – und überholt damit teilweise die etablierten Hersteller.

---

## In Europa

Dieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
