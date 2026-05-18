---
title: "[QA FAILED] NOVATECH: 1/4-Modul-mHiL für aktive Fahrwerke mit ≥1 kHz"
date: 2026-05-18T06:15:56.456Z
description: "Aktive Fahrwerke scheitern oft an Latenz – NOVATECHs 1/4-Modul-mHiL-Prüfstand bietet 1-ms-Regelrate und ≥1 kHz geschlossene Schleife. Damit lassen sich Fahrbahnprofile wie Nürburgring oder Belgischer Block millisekundengenau nachbilden."
source: "D1EV"
image: "/images/qa-failed-novatech-14-modul-mhil-fr-aktive-fahrwer-d1ev-9fadd4.webp"
category: "news"

tags: []
draft: true
original_url: "https://www.d1ev.com/news/shichang/299476"
read_time_minutes: 3
---

# [QA FAILED] NOVATECH: 1/4-Modul-mHiL für aktive Fahrwerke mit ≥1 kHz

Fahrwerke sind längst nicht mehr passive Metallverbindungen: Mit CDC, Luftfedern und hydraulischen Aktivsystemen sind sie zu millisekundenschnellen elektronischen Aktuationseinheiten geworden. Der entscheidende Unterschied zwischen einem soliden und einem luxuriösen Fahrgefühl liegt heute nicht in der Beschleunigung von 0 auf 100 km/h, sondern in der feinen Auflösung der Wank- und Nickbewegungen. Dahinter steckt ein Wettbewerb um Echtzeit-Steueralgorithmen und Kalibrierungsparameter.

Das Problem: Aktive Fahrwerke sind zu hochfrequenten Regelkreisen geworden. Ein Rad, das über eine Bodenwelle fährt, löst in der Elektronik eine Kette von Sensor → Berechnung → Aktuator → Feder/Dämpfer aus. Schon 1 ms Latenz oder asynchrone Signale können die Regelung verfälschen – der Regler tut zur falschen Zeit das Richtige. Die Folge für den Fahrer: ein „schwimmendes“ Gefühl, Poltern, hochfrequente Restvibrationen. Viele Ingenieure schieben das auf „Abstimmung“, in Wahrheit liefern die bisherigen Prüfsysteme der Steuersoftware eine verzerrte physikalische Wahrnehmung.

## Was bisher fehlte: geschlossener Kreislauf im Labor
Die übliche Entwicklungskette MiL → SiL → Prüfstand → Fahrzeug hat eine Lücke: Aktive Fahrwerke sind mechatronisch hochintegriert. Ein herkömmlicher Prüfstand kann die Dynamik von Dämpferumschaltung oder Aktuatorüberschwingern nicht abbilden, weil seine eigene Abtastrate zu niedrig ist. „Die Software funktioniert auf dem Rechner perfekt – sobald sie im Fahrzeug steckt, versagt sie“, beschreiben Entwickler das Dilemma. Ergebnis: Verzögerungen, Neuabstimmung, endlose OTA-Updates.

NOVATECH (诺瓦泰) hat mit dem 1/4-Modul-mHiL-Prüfstand eine Lösung vorgestellt, die diese Lücke schließt. mHiL steht für „mechanisches Hardware-in-the-Loop“ – der Prüfstand bildet einen vollständigen geschlossenen Regelkreis mit realen Massen und Trägheiten.

## Die Kennzahlen: ≤1 ms Zykluszeit, ≤5 % Genauigkeit
Der Kern des Systems ist eine EtherCAT-Echtzeitbus-Architektur, die eine geschlossene Regelrate von ≥1 kHz ermöglicht. Damit können selbst hochfrequente Anregungen (Rüttelstrecken, Stoßfugen) millisekundengenau im Labor nachgefahren werden. Die Nachbildung realer Fahrbahnprofile gelingt mit einer Abweichung von ≤5 % bezogen auf das Leistungsdichtespektrum (PSD). Nürburgring, Belgischer Block, Autobahnbrückenfugen – alles wird „fotorealistisch“ in den Prüfstand gespielt.

Der entscheidende Unterschied zu klassischen offenen Prüfständen: Über eine CarMaker-Simulation wird die Rückkopplung zwischen Fahrwerksbewegung und Fahrzeugzustand hergestellt. Der Regler „sieht“ ein reales, bewegtes System mit all seinen Nichtlinearitäten. Dadurch werden Fehler in der Software sichtbar, die in der reinen Simulation verborgen bleiben – Algorithmen, die im virtuellen Raum genial, unter realer Last aber instabil reagieren.

## Physikalische Deterministik als Fundament
Während früher ein Fahrwerksplattform-Update fünf Jahre hielt, zwingt die heutige Entwicklungsgeschwindigkeit zu monatlichen Iterationen. Die Zukunft gehört nicht dem teuersten Luftfederbalg, sondern der Fähigkeit, bei Temperaturen von −40 °C bis 85 °C deterministische Systemeigenschaften nachzuweisen. Ohne einen hochauflösenden, geschlossenen Prüfstand wie den mHiL von NOVATECH sind weder kurze Entwicklungszeiten noch stabile OTA-Updates möglich.

„Wer der physikalischen Realität am nächsten kommt, kommt dem Fahrer am nächsten“, heißt es bei NOVATECH. Der 1/4-Modul-mHiL wird damit zur Grundlagen-Infrastruktur für das intelligente Fahrwerk der nächsten Generation.

---

Diese Testlösung ist in Europa derzeit nicht offiziell erhältlich. Eine Markteinführung wurde bislang nicht angekündigt.
