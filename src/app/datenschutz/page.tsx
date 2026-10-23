import type { Metadata } from 'next'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung und Informationen zum Schutz Ihrer Daten bei E-AUTOS.',
  robots: { index: false, follow: false },
}

export default function DatenschutzPage() {
  return (
    <>
      <SiteHeader />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Datenschutzerklärung</h1>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          1. Datenschutz auf einen Blick
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
          Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
          werden können.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          2. Verantwortliche Stelle
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Zhinai Liu<br />
          Forsthaus 22<br />
          D-40883 Ratingen<br />
          E-Mail: <a href="mailto:l.bai@loghan.de">l.bai@loghan.de</a>
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          3. Datenerfassung auf dieser Website
        </h2>
        <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Server-Log-Dateien
        </h3>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Der Provider der Seiten erhebt und speichert automatisch Informationen in
          sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
          Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer
          URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und
          IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird
          nicht vorgenommen.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          4. Ihre Rechte
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft,
          Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.
          Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten
          zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben,
          können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Hierzu
          sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an
          uns wenden.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          5. Hosting
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          Diese Website wird bei Vercel gehostet. Anbieter ist die Vercel Inc.,
          440 N Barranca Ave #4133, Covina, CA 91723, USA. Vercel erhebt
          Server-Log-Dateien wie oben beschrieben. Mehr Informationen zum
          Datenschutz bei Vercel finden Sie in der{' '}
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung von Vercel
          </a>.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          6. Amazon-Partnerprogramm
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Diese Website nimmt am Amazon-Partnerprogramm teil. Mit „Anzeige“
          gekennzeichnete Links sind Partner-Links: Wenn Sie darauf klicken, werden
          Sie auf die Website von Amazon.de weitergeleitet. Erst dort setzt Amazon
          eigene Cookies und verarbeitet Daten, um einen Verkauf beziehungsweise
          eine Vermittlung nachzuvollziehen. Wir selbst setzen im Zusammenhang mit
          den Partner-Links keine Cookies und legen keine Nutzerprofile an. Für Sie
          ändert sich der Preis nicht: Eine Provision, die wir bei einem
          qualifizierten Kauf erhalten, hat keinen Einfluss auf den von Ihnen
          gezahlten Preis.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          7. Erfassung von Klicks auf Partner-Links
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Wenn Sie einen Partner-Link anklicken, sendet Ihr Browser eine kurze
          Anfrage an unseren Server. Dabei speichern wir den angeklickten
          Werbeplatz (Slot), das Tagesdatum als Zeitstempel sowie eine mit
          SHA-256 gehashte Kennung Ihrer IP-Adresse. Die gehashte Kennung dient
          ausschließlich der Begrenzung der Anfragen pro Tag (Missbrauchsschutz);
          Ihre IP-Adresse wird nicht im Klartext gespeichert. Diese Daten nutzen
          wir nur zur statistischen Auswertung der Klickzahlen und löschen sie
          automatisch nach 90 Tagen. Eine Zusammenführung mit anderen
          Datenquellen oder eine Identifizierung Ihrer Person findet nicht statt.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          8. Google AdSense
        </h2>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Diese Website nutzt Google AdSense, einen Dienst der Google Ireland
          Limited, um Werbeanzeigen auszuliefern. Google AdSense verwendet Cookies
          und vergleichbare Technologien (einschließlich Speicherung auf Ihrem
          Endgerät), um Anzeigen anzuzeigen und auszuwerten. Dabei können unter
          anderem Ihre IP-Adresse, Angaben zu Browser und Gerät sowie Ihr
          Nutzungsverhalten verarbeitet und an Google übertragen werden. Die
          Einbindung zu Zwecken personalisierter Werbung erfolgt auf Grundlage
          Ihrer Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO; diese Einwilligung
          können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Weitere
          Informationen finden Sie in der{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Datenschutzerklärung von Google
          </a>.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
          Für die Einholung Ihrer Einwilligung setzen wir die von Google
          bereitgestellte, nach IAB TCF zertifizierte Consent-Management-Plattform
          („Funding Choices“, CMP-ID 300) ein. Solange Sie keine Wahl getroffen
          haben, fordern wir keine Anzeigen an. Wenn Sie die Verwendung von
          Cookies für personalisierte Werbung ablehnen, können dennoch begrenzte,
          nicht personalisierte Anzeigen ausgeliefert werden („Limited Ads“);
          Rechtsgrundlage hierfür ist unser berechtigtes Interesse an der
          Finanzierung dieses Angebots nach Art. 6 Abs. 1 lit. f DSGVO in
          Verbindung mit § 25 Abs. 2 TDDDG, dem Sie nach Art. 21 DSGVO
          widersprechen können. Sie können Ihre Einwilligung jederzeit mit
          Wirkung für die Zukunft ändern oder widerrufen – über den Link
          „Datenschutz-Einstellungen“ in der Fußzeile jeder Seite öffnet sich das
          Auswahlfenster erneut. Sollte sich dieses Fenster bei Ihnen nicht
          öffnen (etwa weil ein Werbeblocker die Skripte von Google unterbindet),
          können Sie personalisierte Werbung jederzeit über die{' '}
          <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">
            Google-Anzeigeneinstellungen
          </a>{' '}
          deaktivieren.
        </p>

        <h2 style={{ fontSize: '1.25rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          9. Plausible und Vercel Web Analytics
        </h2>
        <p style={{ lineHeight: 1.7 }}>
          Zur Reichweitenmessung setzen wir Plausible Analytics (Plausible
          Insights OÜ, Estland) sowie Vercel Web Analytics ein. Beide Dienste
          arbeiten ohne Cookies und setzen keine Kennungen auf Ihrem Endgerät. Es
          werden keine personenbezogenen Daten gespeichert und keine Nutzerprofile
          gebildet; die erfassten Angaben sind aggregiert und anonymisiert.
        </p>
      </main>

      <SiteFooter />
    </>
  )
}
