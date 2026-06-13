---
title: "[QA FAILED] ADAS-Sicherheit: Drei typische Fallstricke im Test"
date: 2026-06-13T06:13:59.769Z
description: "Ein Fahrassistenz-Test in Hefei zeigt die häufigsten Fehlerquellen: Spurverletzungen, falsche Fahrspur und Rotlichtverstöße. Die Tipps helfen, rechtzeitig einzugreifen."
source: "D1EV"
image: "/images/qa-failed-adas-sicherheit-drei-typische-fallstrick-d1ev-822c58.webp"
category: "news"


tags: ["Autopilot", "Sicherheit"]
draft: true
original_url: "https://www.d1ev.com/news/qiye/302945"
read_time_minutes: 4
primaryTopic: "software-assistenz-autonomes-fahren"
marketRelevance: "global_industry"
---

# [QA FAILED] ADAS-Sicherheit: Drei typische Fallstricke im Test

Moderne Fahrassistenzsysteme (ADAS) werden immer leistungsfähiger – von Autobahnpiloten bis zum Stadt-NOA (Navigation on Autopilot). Doch in komplexen Verkehrssituationen stoßen selbst die besten Systeme an ihre Grenzen. Beim „Second National ADAS Challenge – City NOA Championship" in Hefei (China) zeigten sich drei besonders häufige und gefährliche Fehlermuster: Spurlinienüberfahren, falsche Fahrspurwahl und Rotlichtverstöße. Wir analysieren die Ursachen und geben konkrete Verhaltenshinweise.

## Fallstrick 1: Kontinuierliches Spurlinienüberfahren

**Szenario:** Das System weicht einem vorausfahrenden Lastwagen aus, indem es frühzeitig nach links lenkt. Dabei überschreitet es die durchgezogene Spurlinie mehrfach und zeigt eine zögerliche Lenkbewegung.

**Technische Ursache:** Die Pfadplanung des Systems war zu aggressiv eingestellt oder es gab einen Konflikt zwischen Spurhaltung und Ausweichlogik. Die Querregelung konnte das Fahrzeug nicht stabil in der Spurmitte halten.

**Risiko:** Bei einer solchen Aktion nahe an großen Fahrzeugen gerät das Auto in deren toten Winkel. Ein gleichzeitiger Spurwechsel des Lkw könnte zu einer Kollision führen. Zudem ist das Überfahren der durchgezogenen Linie in Deutschland eine Ordnungswidrigkeit.

**Tipp:** Kurz vor hohen Brücken, in unübersichtlichen Kreuzungen oder beim Annähern an große Fahrzeuge sollte der Fahrer das Lenkrad übernehmen. Sobald das System zögerlich lenkt oder die Spur nicht sicher hält, ist sofortiges manuelles Eingreifen nötig.

## Fallstrick 2: Falsche Fahrspur

**Szenario:** Der ADAS-Assistent wechselt in eine Abbiegespur – obwohl die geplante Route geradeaus führt. Erst als der Beifahrer warnt, bemerkt der Fahrer den Fehler und übernimmt.

**Technische Ursache:** Eine Diskrepanz zwischen der spurbasierten Navigation und der tatsächlichen Fahrspurzuordnung. Möglicherweise hat das System eine falsche Spurenpfeil-Interpretation aus der HD-Karte verwendet oder die Routenabsicht falsch berechnet.

**Risiko:** Wenn der Fahrer nicht rechtzeitig eingreift, gerät er in eine falsche Abbiegespur. Ein korrigierender Spurwechsel im Bereich der durchgezogenen Linie ist verboten und gefährlich. Im dichten Verkehr drohen seitliche Zusammenstöße.

**Tipp:** Wenn das Assistenzsystem bei stockendem Verkehr oder noch großer Entfernung zur Kreuzung plötzlich die Spur wechselt, sollte der Fahrer sofort überprüfen, ob das Manöver zur geplanten Route passt. Bei Unsicherheit sofort selbst das Lenkrad übernehmen.

## Fallstrick 3: Rotlichtverstoß

**Szenario 1:** Das Fahrzeug hält an einer roten Ampel an, setzt sich dann aber wieder in Bewegung. Erst der Schrei des Beifahrers „Halt!“ und das manuelle Bremsen verhindern ein Einfahren in die Kreuzung.

**Technische Ursache:** Ein kurzzeitiger Wahrnehmungsausfall des Systems oder ein Konflikt zwischen Ampelbild und Karteninformation. Möglicherweise hat die Funktion nach einem Deaktivieren der Assistenz eine ungewollte „Kriechfahrt" ausgelöst.

**Szenario 2:** Das System erkennt zwar das Rotlicht, entscheidet aber fälschlich, dass ein „Vorbeifahren" möglich sei – ein gefährlicher Optimismus. Der Fahrer greift erst ein, als der Querverkehr bereits herannaht.

**Risiko:** Ein Rotlichtverstoß kann zu schweren Kreuzungskollisionen mit Fußgängern oder querendem Verkehr führen. Selbst ein plötzlicher Stopp mitten auf der Kreuzung birgt Auffahrgefahr.

**Tipp:** Sobald das Fahrzeug nach dem Anhalten wieder zu rollen beginnt, sofort voll in die Bremse treten. Keine Sekunde warten, ob das System selbst korrigiert. Ist der Wagen bereits über die Haltelinie, anhalten und warten – weder vor- noch zurücksetzen.

## Bonus: Zu hohes Tempo auf Baustellen

Im Test fiel außerdem ein Szenario auf: Auf einer Baustelle mit verengten Fahrspuren und fehlender Markierung fuhr das System ungebremst weiter. Es kam zu einer gefährlichen Begegnung mit dem Gegenverkehr.

**Risiko:** Ohne klare Spurmarkierung unterschätzt das System oft die nötige Verlangsamung. Die Reaktionszeit des Fahrers wird drastisch verkürzt.

**Tipp:** Auf Baustellen – besonders bei hohem Tempo – sofort die Geschwindigkeit selbst reduzieren. Nicht auf die automatische Erkennung verlassen.

## Fazit: „Mensch-Maschine-Kooperation" braucht wachsamen Fahrer

Die drei gezeigten Fehlermuster machen deutlich: Moderne ADAS-Systeme sind Helfer, aber keine perfekten Fahrer. Die typischen Gefahren entstehen nicht durch Einzelfehler, sondern durch Missverständnisse zwischen Systemlogik und realer Verkehrssituation. Fahrer sollten die typischen Alarmzeichen – zögerliche Spurführung, ungewollte Spurenwechsel oder Wiederanfahren an roten Ampeln – erkennen und in Bruchteilen von Sekunden entscheiden, ob sie selbst eingreifen. Nur so wird aus der „Mensch-Maschine-Kooperation" eine sichere Fahrt.

---

Die hier beschriebenen ADAS-Funktionen sind in vielen europäischen Modellen serienmäßig oder optional verfügbar. Die Sicherheitshinweise und Verhaltensregeln gelten weltweit für vergleichbare Systeme – auch in Deutschland.
