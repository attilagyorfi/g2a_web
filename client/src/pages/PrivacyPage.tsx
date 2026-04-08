import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";

export default function PrivacyPage() {
  return (
    <>
      <SeoHead
        title="Adatvédelmi Irányelvek – G2A Marketing"
        description="A G2A Marketing adatvédelmi irányelvei és cookie kezelési szabályzata."
        noIndex={false}
      />
      <Navigation />
      <main style={{ paddingTop: "100px" }}>
        <section style={{ backgroundColor: "#111", padding: "4rem 0" }}>
          <div className="g2a-container">
            <div className="g2a-section-label">Jogi</div>
            <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "#ffffff", fontFamily: "Roboto Mono, monospace" }}>
              Adatvédelmi Irányelvek
            </h1>
          </div>
        </section>
        <section className="g2a-section" style={{ backgroundColor: "#1a1a1a" }}>
          <div className="g2a-container" style={{ maxWidth: "800px" }}>
            <div className="g2a-prose">
              <p><strong>Utolsó frissítés:</strong> 2024. január 1.</p>

              <h2>1. Adatkezelő</h2>
              <p>
                G2A Marketing<br />
                Székhely: Pécs, Magyarország<br />
                Email: info@g2amarketing.hu<br />
                Telefon: +36301902575
              </p>

              <h2>2. Kezelt adatok köre</h2>
              <p>Weboldalunk használata során az alábbi személyes adatokat kezeljük:</p>
              <ul>
                <li>Kapcsolatfelvételi adatok: név, email cím, telefonszám, üzenet tartalma</li>
                <li>Hírlevél feliratkozás: email cím, opcionálisan név</li>
                <li>Technikai adatok: IP cím, böngésző típusa, látogatás időpontja (cookie-k révén)</li>
              </ul>

              <h2>3. Adatkezelés célja</h2>
              <p>Az adatokat az alábbi célokból kezeljük:</p>
              <ul>
                <li>Kapcsolatfelvételi kérelmek megválaszolása</li>
                <li>Hírlevél küldése (csak feliratkozás esetén)</li>
                <li>Weboldal működésének biztosítása és fejlesztése</li>
                <li>Jogi kötelezettségek teljesítése</li>
              </ul>

              <h2>4. Adatkezelés jogalapja</h2>
              <p>
                Az adatkezelés jogalapja az Ön hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont), 
                illetve a szerződés teljesítése (GDPR 6. cikk (1) bekezdés b) pont).
              </p>

              <h2>5. Adatmegőrzési idő</h2>
              <p>
                A kapcsolatfelvételi üzeneteket 2 évig őrizzük meg. A hírlevél feliratkozókat 
                a leiratkozásig kezeljük. A technikai naplókat 30 napig tároljuk.
              </p>

              <h2>6. Cookie-k (sütik)</h2>
              <p>Weboldalunk az alábbi típusú cookie-kat használja:</p>
              <ul>
                <li><strong>Szükséges cookie-k:</strong> A weboldal alapvető működéséhez szükségesek</li>
                <li><strong>Analitikai cookie-k:</strong> A weboldal forgalmának mérésére (Google Analytics)</li>
                <li><strong>Marketing cookie-k:</strong> Célzott hirdetések megjelenítéséhez</li>
              </ul>
              <p>A cookie-k kezelését a böngészőjében bármikor módosíthatja.</p>

              <h2>7. Adatai védelme</h2>
              <p>
                Megfelelő technikai és szervezési intézkedésekkel gondoskodunk az adatok biztonságáról. 
                Adatait harmadik félnek nem adjuk át, kivéve ha ezt jogszabály kötelezi.
              </p>

              <h2>8. Az Ön jogai</h2>
              <p>Önnek joga van:</p>
              <ul>
                <li>Hozzáférni a kezelt adataihoz</li>
                <li>Kérni az adatok helyesbítését</li>
                <li>Kérni az adatok törlését</li>
                <li>Tiltakozni az adatkezelés ellen</li>
                <li>Adathordozhatósághoz való jog</li>
              </ul>

              <h2>9. Kapcsolat</h2>
              <p>
                Adatvédelmi kérdéseivel forduljon hozzánk:<br />
                Email: <a href="mailto:info@g2amarketing.hu">info@g2amarketing.hu</a><br />
                Telefon: <a href="tel:+36301902575">+36301902575</a>
              </p>

              <h2>10. Panasztétel</h2>
              <p>
                Jogsértés esetén panaszt tehet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH): 
                <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">www.naih.hu</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
