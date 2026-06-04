---
title: "[EDITORIAL REJECTED] BeingBeyond: Weltmodell läuft auf 100-TOPS-Chip für 20 €/Monat"
date: 2026-06-04T12:43:46.504Z
description: "Das Robotik-Startup BeingBeyond (智在无界) stellt das implizite Weltmodell Being-H-Flash vor – das erste, das auf einem handelsüblichen Edge-Chip mit 100 TOPS in Echtzeit läuft. Die Kosten sinken auf umgerechnet rund 20 Euro pro Roboter und Monat."
source: "D1EV"
image: "/images/editorial-rejected-beingbeyond-weltmodell-luft-auf-d1ev-f96ff6.webp"
category: "news"


tags: ["Reichweite"]
draft: true
original_url: "https://www.d1ev.com/news/shichang/301884"
read_time_minutes: 3
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [EDITORIAL REJECTED] BeingBeyond: Weltmodell läuft auf 100-TOPS-Chip für 20 €/Monat

Das chinesische Startup BeingBeyond (智在无界) hat mit **Being-H-Flash** das erste KI-Weltmodell vorgestellt, das auf einem handelsüblichen 100-TOPS-Edge-Chip (100 Billionen Operationen pro Sekunde) in Echtzeit läuft. Bisher waren Weltmodelle – Systeme, die physikalische Zustände vorhersagen – nur auf teuren Rechenzentrums-GPUs nutzbar. BeingBeyond schließt diese Lücke: Auf Nvidia-Plattformen wie der A800 oder RTX 4090 erreicht das Modell 30–45 FPS, auf einem 100-TOPS-Chip (vergleichbar mit Nvidia Orin NX) **fast 20 FPS** – und das erstmals mit voller Kompatibilität zu chinesischen KI-Chips.

## Von der Theorie zur Praxis: Warum Weltmodelle auf den Chip müssen

Weltmodelle sind für autonome Systeme essenziell: Sie prognostizieren, wohin ein Ball rollt, wie sich Kleidung verformt oder ob Flüssigkeit überläuft – genauso wie das Abbiegen eines Fußgängers. Bisherige **explizite Weltmodelle** (z. B. Nvidia Cosmos-Policy) berechnen dafür jedes Pixel voraus – ein Rechenaufwand, der selbst auf High-End-GPUs kaum in Echtzeit bewältigt wird. Auf Edge-Chips wie dem Orin NX sind solche Modelle meist gar nicht lauffähig (nur einstellige FPS).

BeingBeyond setzt auf einen radikal anderen Ansatz: das **implizite Weltmodell**. Statt zukünftige Bilder zu generieren, komprimiert es Wahrnehmung, Aufgabe und Vorhersage in einen kompakten **latenten Raum** (latent space). Das spart massiv Rechenleistung. Der Vorgänger **Being-H0.7** trainierte mit über 200.000 Stunden menschlicher Videos und 15.000 Stunden Roboterdemonstrationen – ein Datensatz, der branchenweit neue Maßstäbe setzt.

## Flash-Version: Echtzeit auf dem Chip – und das zu radikal niedrigen Kosten

Die neue **Being-H-Flash**-Serie beweist: Weltmodelle können nicht nur stärker, sondern auch günstiger und schneller werden. Drei Varianten stehen bereit:
- **Being-H-aura** (Basis): 2–3x schneller als explizite Weltmodelle auf gleicher Hardware.
- **Being-H-ventus** (Beschleunigt): Mit selbst entwickelten Optimierungen für Edge-Chips.
- **Being-H-procella** (Top): Vollständig an Roboter-Hardware angepasst, in 2–4 Wochen auf neue Chips portierbar – auch auf **chinesische KI-Chips**, was erstmals eine rein nationale Lösung ermöglicht.

Der wirtschaftliche Hebel ist enorm: In einer Beispielrechnung (2.000 Paketscans pro Tag) kostet der Betrieb des expliziten Modells von Nvidia monatlich über 8.000 € Rechenleistung. **Being-H-Flash liegt bei nur ca. 19 € (ca. 150 Yuan) pro Monat*** – ein Rückgang um 98 %. Selbst das VLA-Modell π0.5 ist teurer.

*Hinweis: Preise beziehen sich auf den chinesischen Markt; Umrechnungskurs 1 Yuan ≈ 0,128 €.*

## Ende des Kompromisses: Hohe Intelligenz zu erschwinglichen Kosten

Für die Branche bedeutet das: Robotik und autonome Fahrzeuge müssen nicht länger zwischen „Hirn“ und „Geldbeutel“ wählen. Die 800-Volt-Architektur und Lidar-Sensoren sind längst Standard – jetzt rückt auch die KI-Ausstattung in die Reichweite von Massenanwendungen. BeingBeyond zeigt, dass der Wettbewerb bei Weltmodellen nicht mehr nur in Forschungspapieren stattfindet, sondern in **Deployment-Effizienz, Chip-Adaption und Kosten**. Das macht den Weg frei für intelligente Roboter in Logistik, Produktion und Service – in China und bald auch global.

---

BeingBeyond ist ein chinesisches Startup ohne direkte Fahrzeugproduktion. Das Unternehmen kooperiert mit Roboterherstellern und strebt eine globale Lizenzierung seiner Technologie an. Ein konkreter Markteintritt in Deutschland ist noch nicht angekündigt.
