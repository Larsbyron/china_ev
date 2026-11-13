/**
 * Belegte Modelldaten für die Landingpage /kaufen/.
 *
 * Quellen sind ausschließlich Herstellerdokumente für Deutschland (Preislisten-PDFs,
 * Modellseiten, Broschüren), abgerufen am 13.11.2026. Wichtig: Die BYD-Preisliste
 * enthält nur Preise — WLTP-Reichweite und Batteriekapazität stehen in den BYD-
 * Broschüren, deshalb nennen die BYD-Zeilen beide Dokumente als Quelle.
 * Vollständiger Faktenbestand inkl. Widersprüchen:
 * ~/.hermes/notes/reports/kauf-hub-2026-11-13/sources.md
 *
 * Regeln für Änderungen:
 * - Nur Modelle aufnehmen, bei denen Preis, WLTP-Reichweite, Batteriekapazität
 *   und beide Garantien aus Herstellerdokumenten stammen.
 * - Preise wörtlich wie in der Preisliste (UPE inkl. MwSt., zzgl. Überführung).
 * - Bei Widersprüchen zwischen Preisliste und Modellseite gilt das datierte
 *   Dokument; die Abweichung wird auf der Seite offengelegt.
 * - Keine CLTC-Werte, keine Umrechnung CLTC → WLTP.
 */

export interface KaufModell {
  marke: string
  modell: string
  antrieb: 'BEV' | 'PHEV'
  /** Unverbindliche Preisempfehlung inkl. MwSt., zzgl. Überführung — wörtlich aus der Preisliste. */
  preisAb: string
  /** WLTP-Reichweite laut Hersteller; bei PHEV elektrisch + gesamt. */
  wltp: string
  batterie: string
  garantieFahrzeug: string
  garantieBatterie: string
  /** Datierte Primärquelle(n) — Kurzform, vollständige URLs stehen auf der Seite. */
  quelle: string
  stand: string
}

export const KAUF_MODELLE: KaufModell[] = [
  {
    marke: 'Leapmotor',
    modell: 'T03',
    antrieb: 'BEV',
    preisAb: '18.900 €',
    wltp: '275 km',
    batterie: '37,3 kWh',
    garantieFahrzeug: '3 Jahre / 100.000 km',
    garantieBatterie: '8 Jahre / 160.000 km',
    quelle: 'Preisliste T03',
    stand: '01.10.2026',
  },
  {
    marke: 'BYD',
    modell: 'DOLPHIN G DM-i (Boost)',
    antrieb: 'PHEV',
    preisAb: '31.990 €',
    wltp: '105 km elektrisch / 1.040 km gesamt',
    batterie: '18,3 kWh',
    garantieFahrzeug: 'bis zu 6 Jahre / 150.000 km',
    garantieBatterie: 'bis zu 8 Jahre / 250.000 km',
    quelle: 'Preisliste Q4 2026 + Broschüre',
    stand: 'Preisliste 10/2026',
  },
  {
    marke: 'Leapmotor',
    modell: 'B10 (ProMax EU-Life)',
    antrieb: 'BEV',
    preisAb: '32.900 €',
    wltp: '450 km',
    batterie: '68,7 kWh',
    garantieFahrzeug: '4 Jahre / 100.000 km',
    garantieBatterie: '8 Jahre / 160.000 km',
    quelle: 'Preisliste B10',
    stand: '12.10.2026',
  },
  {
    marke: 'Leapmotor',
    modell: 'C10 (Pro BEV Life)',
    antrieb: 'BEV',
    preisAb: '38.600 €',
    wltp: '430 km',
    batterie: '69,9 kWh',
    garantieFahrzeug: '4 Jahre / 100.000 km',
    garantieBatterie: '8 Jahre / 160.000 km',
    quelle: 'Preisliste C10',
    stand: '01.10.2026',
  },
  {
    marke: 'BYD',
    modell: 'ATTO 2 (Comfort)',
    antrieb: 'BEV',
    preisAb: '41.990 €',
    wltp: '430 km',
    batterie: '64,8 kWh',
    garantieFahrzeug: 'bis zu 6 Jahre / 150.000 km',
    garantieBatterie: 'bis zu 8 Jahre / 250.000 km',
    quelle: 'Preisliste Q4 2026 + Broschüre',
    stand: 'Preisliste 10/2026',
  },
  {
    marke: 'BYD',
    modell: 'ATTO 3 EVO (Design)',
    antrieb: 'BEV',
    preisAb: '44.990 €',
    wltp: '510 km',
    batterie: '74,8 kWh',
    garantieFahrzeug: 'bis zu 6 Jahre / 150.000 km',
    garantieBatterie: 'bis zu 8 Jahre / 250.000 km',
    quelle: 'Preisliste Q4 2026 + Broschüre',
    stand: 'Preisliste 10/2026',
  },
  {
    marke: 'Zeekr',
    modell: '7X',
    antrieb: 'BEV',
    preisAb: 'ab 54.990 €',
    wltp: '482 km (Core RWD) bis 627 km (Long Range RWD)',
    batterie: '75 kWh / 100 kWh',
    garantieFahrzeug: '10 Jahre (5+5, Wartung bei Zeekr-Servicepartnern)',
    garantieBatterie: '8 Jahre (Hochvoltbatterie, ohne km-Angabe)',
    quelle: 'Modellseite 7X, Preis modellweit',
    stand: '13.11.2026',
  },
]

/** Modelle, deren Daten für die Tabelle nicht vollständig belegbar waren — mit Grund. */
export const NICHT_IN_TABELLE: { modell: string; befund: string }[] = [
  {
    modell: 'XPeng G6 / G9',
    befund:
      'Preise (43.600 € / 59.600 €) und WLTP-Reichweiten sind auf xpeng.com/de bestätigt; eine Batteriekapazität nennt die Seite nicht, die Garantiebedingungen liegen nur als PDF vor, das wir nicht abrufen konnten.',
  },
  {
    modell: 'BYD DOLPHIN (BEV)',
    befund:
      'Preis 33.990 € (Comfort) und „bis zu 427 km“ WLTP bestätigt; die Batteriekapazität steht weder auf der Modellseite noch im extrahierbaren Teil der Broschüre.',
  },
  {
    modell: 'BYD SEALION 7',
    befund:
      'Preis 49.990 € (Comfort) laut Preisliste Q4 2026; die Reichweite erscheint auf der Modellseite nur als animierter Zähler und ließ sich nicht als Zahl belegen.',
  },
  {
    modell: 'MG (MG4 Urban, MGS5, IM5/IM6 u. a.)',
    befund:
      'mgmotor.de liefert Preise ausschließlich im JavaScript-Konfigurator; auf den Modellseiten stehen Platzhalter statt Beträgen, eine Preislisten-PDF war nicht auffindbar.',
  },
  {
    modell: 'NIO EL6',
    befund:
      'Die EL6-Modellseite nennt keinen Preis; zusätzlich verkauft NIO über BaaS, bei dem der Fahrzeugpreis ohne Batterie gilt — ein vergleichbarer „ab“-Preis ist damit nicht belegbar.',
  },
]
