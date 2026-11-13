import type { Metadata } from 'next'
import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import AdUnit from '@/components/AdUnit'
import { KAUF_MODELLE, NICHT_IN_TABELLE } from '@/lib/kaufen-modelle'
import { canonicalUrl } from '@/lib/site'
import styles from './page.module.css'

export const revalidate = 600

const TITLE = 'Chinesische E-Autos in Deutschland kaufen: Modelle und Preise 2026'
const DESCRIPTION =
  'Sieben chinesische E-Autos mit datierter Herstellerquelle: 18.900–54.990 €, WLTP, Batterie, Garantie — plus Zoll und Einzelabnahme beim Selbstimport.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonicalUrl('/kaufen/') },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'de_DE',
    url: canonicalUrl('/kaufen/'),
    siteName: 'E-AUTOS',
  },
}

const CHECKLISTE = [
  'Preisliste des Herstellers mit Datum sichern — nicht den Aktionspreis als Listenpreis übernehmen.',
  'Prüfen, ob genau dieses Modell und diese Variante eine EU-Typgenehmigung samt COC-Dokument hat.',
  'Garantiebedingungen vollständig lesen: Laufzeit, Kilometer-Grenze und Wartungsbindung.',
  'Nächstgelegene Werkstatt des Markennetzes in der eigenen Region suchen, bevor unterschrieben wird.',
  'Batteriekapazität und WLTP-Reichweite aus dem datierten Dokument nehmen, nicht aus der Modellseite.',
  'Beim Selbstimport Zoll, Ausgleichszoll, Einfuhrumsatzsteuer, Vollgutachten nach § 21 StVZO und Umbaukosten getrennt kalkulieren.',
  'Versicherung vor dem Kauf anfragen — die Typklasse entscheidet, nicht der Modellname.',
  'Förderung nur mit vorliegendem Bescheid einrechnen (Einkommensgrenze, Kinderzahl, Neuzulassung).',
]

const FAQ = [
  {
    frage: 'Kann man chinesische E-Autos in Deutschland normal beim Händler kaufen?',
    antwort:
      'Ja. BYD, MG, Leapmotor, XPeng und Zeekr betreiben auf ihrer deutschen Website eine eigene Händler- oder Standortsuche, NIO verkauft über NIO Houses und Bestandsfahrzeuge. Diese Fahrzeuge haben eine EU-Typgenehmigung und werden ohne Einzelabnahme zugelassen.',
  },
  {
    frage: 'Was ist das günstigste chinesische E-Auto in Deutschland?',
    antwort:
      'Der niedrigste Preis unter den hier belegten Modellen steht mit 18.900 € für den Leapmotor T03 in der Preisliste (Stand 01.10.2026). Das ist keine Aussage über den gesamten Markt: Für mehrere Marken war am 13.11.2026 kein statischer Preis abrufbar, deshalb erheben wir keinen Anspruch auf Vollständigkeit.',
  },
  {
    frage: 'Lohnt sich der Selbstimport aus China?',
    antwort:
      'Nur in Ausnahmefällen. Auf den chinesischen Preis kommen 10 % Zoll, bei Elektroautos zusätzlich der EU-Ausgleichszoll (je Hersteller 17,0 bis 35,3 %), 19 % Einfuhrumsatzsteuer sowie ein Vollgutachten nach § 21 StVZO und eventuelle Umbauten. Frachtraten und Erfolgsquoten von Einzelabnahmen können wir nicht belegen und rechnen sie deshalb nicht in eine Beispielsumme ein.',
  },
  {
    frage: 'Wie lange gilt die Garantie auf die Batterie?',
    antwort:
      'Bei den belegten Modellen acht Jahre, mit unterschiedlichen Kilometer-Grenzen: 160.000 km bei Leapmotor und bis zu 250.000 km bei BYD; Zeekr nennt für die Hochvoltbatterie acht Jahre ohne Kilometer-Angabe. Die Fahrzeuggarantie liegt darunter und reicht von drei Jahren (Leapmotor T03) bis zu zehn Jahren bei Zeekr — dort nur bei Wartung bei Zeekr-Servicepartnern.',
  },
  {
    frage: 'Sind die Preise stabil?',
    antwort:
      'Nein. Alle genannten Beträge sind unverbindliche Preisempfehlungen, und die Hersteller befristen Aktionen: BYD gewährt in den Black Weeks vom 01.11. bis 28.11.2026 einen Bonus, der E-Bonus gilt anschließend vom 29.11. bis 31.12.2026; Leapmotor bewirbt Angebote mit Gültigkeit bis 31.12.2026. Deshalb steht bei jedem Wert das Datum der Quelle.',
  },
]

export default function KaufenPage() {
  // Gleiche env-Gating-Konvention wie im Artikel-Template: ohne Slot rendert AdUnit nichts.
  const adSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM ?? ''

  return (
    <>
      <SiteHeader />

      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb} aria-label="Brotkrumen">
            <Link href="/" className={styles.breadcrumbLink}>
              Start
            </Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              ›
            </span>
            <span>Kaufen</span>
          </nav>

          <header className={styles.pageHeader}>
            <h1 className={styles.title}>Chinesische E-Autos in Deutschland kaufen</h1>
            <p className={styles.lead}>
              Sieben Modelle mit datierter Herstellerquelle, 18.900 bis 54.990 €, acht Jahre
              Batteriegarantie: Wer 2026 ein chinesisches E-Auto in Deutschland kaufen will,
              hat zwei Wege — offizieller Vertrieb mit Händlernetz oder Selbstimport mit Zoll,
              Ausgleichszoll und Einzelabnahme. Die Kostendifferenz ist groß, die Risiken des
              Selbstimports sind es auch.
            </p>
            <p className={styles.meta}>
              Alle Preise und technischen Daten: Stand 13.11.2026, Quellen unten.
            </p>
          </header>

          <section className={styles.section} aria-labelledby="bestellbar">
            <h2 id="bestellbar" className={styles.sectionTitle}>
              Was in Deutschland tatsächlich bestellbar ist
            </h2>
            <p className={styles.text}>
              Fünf chinesische Marken betreiben auf ihrer deutschen Website eine eigene
              Händler- oder Standortsuche — BYD, MG, Leapmotor, XPeng und Zeekr (alle am
              13.11.2026 geprüft). NIO verkauft ohne klassisches Händlernetz über NIO Houses
              und Bestandsfahrzeuge. Kein Hersteller veröffentlicht die Zahl seiner Standorte;
              wir nennen deshalb keine.
            </p>
            <p className={styles.text}>
              Die folgende Tabelle ist kein Marktüberblick, sondern eine Auswahl von Modellen,
              für die Preis, WLTP-Reichweite, Batteriekapazität und beide Garantien in
              Herstellerdokumenten belegt sind. Was nicht belegbar war, steht darunter — mit
              Grund.
            </p>
          </section>

          <section className={styles.section} aria-labelledby="preise">
            <h2 id="preise" className={styles.sectionTitle}>
              Was kostet ein chinesisches E-Auto in Deutschland?
            </h2>
            <p className={styles.text}>
              Sieben Modelle zwischen 18.900 € und 54.990 €, jeweils mit dem Dokument, aus dem
              Preis und technische Daten stammen:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <caption className={styles.tableCaption}>
                  Unverbindliche Preisempfehlungen inkl. 19 % MwSt., zzgl. Überführung und
                  Zulassung. Bei Leapmotor und BYD stammen die Preise aus den Preislisten, WLTP
                  und Batteriekapazität aus den Broschüren; beim Zeekr 7X ist der Preis ein
                  modellweiter Einstiegspreis ohne Variantenzuordnung.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Modell</th>
                    <th scope="col">Antrieb</th>
                    <th scope="col">Preis ab</th>
                    <th scope="col">WLTP</th>
                    <th scope="col">Batterie</th>
                    <th scope="col">Garantie Fahrzeug</th>
                    <th scope="col">Garantie Batterie</th>
                  </tr>
                </thead>
                <tbody>
                  {KAUF_MODELLE.map((m) => (
                    <tr key={`${m.marke}-${m.modell}`}>
                      <th scope="row" className={styles.modelCell}>
                        <span className={styles.brand}>{m.marke}</span>
                        <span className={styles.model}>{m.modell}</span>
                        <span className={styles.source}>
                          {m.quelle}, Stand {m.stand}
                        </span>
                      </th>
                      <td>{m.antrieb}</td>
                      <td className={styles.priceCell}>{m.preisAb}</td>
                      <td>{m.wltp}</td>
                      <td>{m.batterie}</td>
                      <td>{m.garantieFahrzeug}</td>
                      <td>{m.garantieBatterie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.callout}>
              <h3 className={styles.calloutTitle}>Was hinter den Preisen steckt</h3>
              <p className={styles.text}>
                Herstellerpreise sind alles andere als stabil. BYD gewährt in den Black Weeks
                vom 01.11. bis 28.11.2026 einen Bonus; der E-Bonus gilt laut Preisliste vom
                01.10. bis 31.10.2026 und erneut vom 29.11. bis 31.12.2026. Leapmotor bewirbt
                unter anderem ein T03-Leasingangebot mit Gültigkeit bis 31.12.2026. BYD weist
                in derselben Preisliste außerdem einen „möglichen Endpreis“ aus, der E-Bonus{' '}
                <em>und</em> die staatliche Förderung von bis zu 6.000 € voraussetzt. Diese
                Förderung ist an ein Haushaltseinkommen unter 45.000 €, mindestens zwei Kinder,
                eine Neuzulassung ab 01.01.2026 und einen BAFA-Bescheid gebunden. Ein Endpreis,
                der diese Förderung voraussetzt, ist kein Listenpreis — wer ihn als Preis
                zitiert, rechnet mit einer Förderung, die viele Käufer nicht bekommen.
              </p>
              <p className={styles.text}>
                Zwei Hersteller widersprechen sich außerdem selbst: Leapmotor nennt für den B10
                in der Preisliste 68,7 kWh und 450 km WLTP, auf der Modellseite dagegen
                67,1 kWh und 434 km — und bei der Fahrzeuggarantie vier Jahre (Preisliste)
                gegen drei Jahre (Modellseite). BYD nennt für den ATTO 2 auf der Modellseite
                weiter „bis zu 312 km“, in der Broschüre aber 430 km. In der Tabelle stehen die
                Werte aus dem datierten Dokument; die Abweichung ist hier benannt, statt sie
                zu glätten.
              </p>
            </div>

            <h3 className={styles.subTitle}>Nicht in der Tabelle — und warum</h3>
            <ul className={styles.reasonList}>
              {NICHT_IN_TABELLE.map((item) => (
                <li key={item.modell}>
                  <strong>{item.modell}:</strong> {item.befund}
                </li>
              ))}
            </ul>
            <p className={styles.note}>
              Diese Modelle sind in Deutschland erhältlich; sie fehlen hier nur, weil eine
              Pflichtangabe nicht aus einer Primärquelle zu belegen war. Aus dem Fehlen in der
              Tabelle folgt keine Aussage über Verfügbarkeit oder Qualität.
            </p>
          </section>

          <section className={styles.section} aria-labelledby="wege">
            <h2 id="wege" className={styles.sectionTitle}>Zwei Wege zum Fahrzeug</h2>

            <h3 className={styles.subTitle}>Weg 1: offizieller Vertrieb in Deutschland</h3>
            <p className={styles.text}>
              Fahrzeuge aus dem offiziellen Vertrieb haben eine EU-Typgenehmigung, ein
              COC-Dokument, eine deutsche Preisliste und Garantie über den Importeur — BYD
              Europe B.V. mit Sitz in Schiedam (Niederlande, laut Impressum von byd.com/de),
              Leapmotor International B.V. mit Sitz in Hoofddorp (Niederlande, laut Fußzeile
              der Leapmotor-Preislisten). Die Zulassung läuft ohne Einzelabnahme.
              Preisverhandlungen laufen über den Händler, die Bedingungen des Herstellers gelten
              weiter.
            </p>

            <h3 className={styles.subTitle}>Weg 2: Selbstimport aus China</h3>
            <p className={styles.text}>
              Wer in China selbst kauft, zahlt 10 % Zoll auf den Warenwert; die
              Einfuhrumsatzsteuer von 19 % berechnet sich auf den Zollwert plus Zoll (Zoll,
              Warenart Pkw). Die genannten Zollsätze sind laut Zoll „nur Anhaltspunkte“ und
              können je nach Beschaffenheit der Ware abweichen. Bei Elektroautos mit Ursprung
              in China kommt der EU-Ausgleichszoll nach der Durchführungsverordnung (EU)
              2024/2754 hinzu, in Kraft seit 30.10.2024: 17,0 % für BYD, 18,8 % für Geely,
              35,3 % für SAIC, 20,7 % für übrige kooperierende Hersteller und 35,3 % für alle
              übrigen.
            </p>
            <p className={styles.text}>
              Ohne EU-Typgenehmigung braucht das Fahrzeug eine Betriebserlaubnis für
              Einzelfahrzeuge nach § 21 StVZO, mit Gutachten eines amtlich anerkannten
              Sachverständigen. Die amtliche Gebühr für das Vollgutachten beträgt 97,90 € für
              Pkw bis 3,5 t (GebOSt Nr. 413.4.1), dazu kommt Zeitaufwand. Was wir nicht
              belegen können — aktuelle Frachtraten, Umbaukosten im Einzelfall, Erfolgsquoten
              von Einzelabnahmen — rechnen wir nicht in eine Beispielsumme ein. Die
              vollständige Kostenaufstellung steht im Ratgeber{' '}
              <Link href="/articles/2026-10-23-was-kostet-der-china-auto-import-nach-deutschland">
                Was kostet der China-Auto-Import nach Deutschland
              </Link>
              .
            </p>
            <p className={styles.note}>
              Der Ausgleichszoll betrifft Fahrzeuge mit Ursprung in China. Der Leapmotor B10
              wird laut Preisliste im Stellantis-Werk Saragossa endmontiert — ob und wie die
              Verordnung in einem solchen Fall greift, hängt an den Ursprungsregeln und ist im
              Einzelfall zu klären.
            </p>
          </section>

          <section className={styles.section} aria-labelledby="achten">
            <h2 id="achten" className={styles.sectionTitle}>Worauf beim Kauf zu achten ist</h2>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>Garantie</dt>
                <dd>
                  BYD formuliert „bis zu 6 Jahren oder 150.000 km“, Leapmotor drei bis vier
                  Jahre oder 100.000 km, Zeekr zehn Jahre — dort nur, wenn die Wartung bei
                  Zeekr-Servicepartnern erfolgt (5+5). Das „bis zu“ ist keine Formalie: Es hängt
                  an Bedingungen, die in den Garantieunterlagen stehen.
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>Batterie</dt>
                <dd>
                  Acht Jahre sind bei allen belegten Modellen Standard. Die Kilometer-Grenze
                  liegt bei 160.000 km (Leapmotor) und bis zu 250.000 km (BYD); Zeekr nennt
                  für die Hochvoltbatterie acht Jahre ohne Kilometer-Angabe. NIO gibt für den
                  EL6 96 Monate oder 160.000 km bei mindestens 70 % Restkapazität an.
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>Werkstatt und Ersatzteile</dt>
                <dd>
                  Vor dem Kauf prüfen, wie weit die nächste Vertragswerkstatt entfernt ist.
                  Belastbare Standortzahlen veröffentlichen die Hersteller nicht; die
                  Händlersuche auf der Markenwebsite ist die beste verfügbare Quelle.
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>Versicherung</dt>
                <dd>
                  Die Beitragshöhe hängt an der Typklasse des konkreten Modells, nicht an der
                  Marke. Für vierzehn chinesische Modelle und fünf Vergleichsfahrzeuge haben wir
                  die Einstufungen 2027 zusammengestellt —{' '}
                  <Link href="/articles/2026-11-07-kfz-versicherung-chinesische-e-autos-typklassen-2027">
                    Kfz-Versicherung für chinesische E-Autos
                  </Link>
                  .
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>Laden zu Hause</dt>
                <dd>
                  Wer eine Wallbox braucht, sollte die Anschlussleistung vor der Bestellung
                  klären. Kosten, Förderung und Netzanschluss stehen im Ratgeber{' '}
                  <Link href="/articles/2026-10-30-e-auto-zu-hause-laden-wallbox-netzanschluss-kosten">
                    E-Auto zu Hause laden: Wallbox und Netzanschluss
                  </Link>
                  .
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>Wiederverkauf</dt>
                <dd>
                  Für Restwerte chinesischer Marken in Deutschland liegen uns keine belastbaren
                  Zahlen vor. Wir nennen deshalb keine — wer mit einem Restwert argumentiert,
                  sollte die Quelle offenlegen.
                </dd>
              </div>
            </dl>
          </section>

          <section className={styles.section} aria-labelledby="checkliste">
            <h2 id="checkliste" className={styles.sectionTitle}>
              Checkliste vor der Unterschrift
            </h2>
            <ul className={styles.checklist}>
              {CHECKLISTE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {adSlot ? (
            <div className={styles.adWrap}>
              <AdUnit slot={adSlot} variant="bottom" />
            </div>
          ) : null}

          <section className={styles.section} aria-labelledby="faq">
            <h2 id="faq" className={styles.sectionTitle}>Häufige Fragen</h2>
            {FAQ.map((item) => (
              <div key={item.frage} className={styles.faqItem}>
                <h3 className={styles.faqFrage}>{item.frage}</h3>
                <p className={styles.text}>{item.antwort}</p>
              </div>
            ))}
          </section>

          <section className={styles.section} aria-labelledby="quellen">
            <h2 id="quellen" className={styles.sectionTitle}>Quellen und Datenstand</h2>
            <p className={styles.text}>
              Preise, Reichweiten, Batteriekapazitäten und Garantien stammen aus
              Herstellerdokumenten für Deutschland, abgerufen am 13.11.2026.
            </p>
            <ul className={styles.sourceList}>
              <li>
                BYD Preisliste Q4 2026 (Stand 10/2026), BYD Broschüren ATTO 2 und DOLPHIN G
                (ohne Datumsangabe) sowie ATTO 3 EVO (Stand 03/2026), Garantiebedingungen und
                Impressum —{' '}
                <a href="https://www.byd.com/de" rel="noopener noreferrer" target="_blank">
                  byd.com/de
                </a>
              </li>
              <li>
                Leapmotor Preislisten T03 (01.10.2026), B10 (12.10.2026), C10 (01.10.2026) —{' '}
                <a
                  href="https://www.leapmotor.net/de-de/nuetzliche-dokumentation"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  leapmotor.net/de-de
                </a>
              </li>
              <li>
                Zeekr 7X Modellseite inkl. Variantentabelle —{' '}
                <a
                  href="https://www.zeekr.eu/de-de/models/7x"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  zeekr.eu/de-de/models/7x
                </a>
              </li>
              <li>
                XPeng G6/G9, BYD DOLPHIN und SEALION 7, MG, NIO — Modellseiten und
                Garantieseiten der Hersteller, 13.11.2026 (unvollständig, siehe oben)
              </li>
              <li>
                Zollsätze Pkw 10 % / Einfuhrumsatzsteuer 19 % —{' '}
                <a
                  href="https://www.zoll.de/SharedDocs/Boxen/DE/Fragen/0082_beispiele_zollsaetze.html"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  zoll.de
                </a>
              </li>
              <li>
                Ausgleichszoll: Durchführungsverordnung (EU) 2024/2754 —{' '}
                <a
                  href="https://eur-lex.europa.eu/eli/reg_impl/2024/2754/2026-02-11/eng"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  eur-lex.europa.eu
                </a>{' '}
                (aus dem Import-Ratgeber übernommen, dort abgerufen am 23.10.2026)
              </li>
              <li>
                § 21 StVZO (Betriebserlaubnis für Einzelfahrzeuge) —{' '}
                <a
                  href="https://www.gesetze-im-internet.de/stvzo_2012/__21.html"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  gesetze-im-internet.de
                </a>
              </li>
            </ul>
            <p className={styles.note}>
              Diese Seite wurde redaktionell erstellt; Recherche und Text entstanden mit
              KI-Unterstützung, jede Zahl trägt Quelle und Datum. Wie wir arbeiten, steht unter{' '}
              <Link href="/redaktion">Redaktion</Link>. Weiter zu den{' '}
              <Link href="/themen/modelle-marktstarts">Marktstarts</Link> und zur Übersicht{' '}
              <Link href="/deutschland">In Deutschland</Link>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
