// Zdjęcia zespołów i logotypy z ligazeglarska.pl/kluby (hotlink).
// Dopasowanie po znormalizowanej nazwie klubu (fallback: zawieranie).
export type KlubMedia = { nazwa: string; foto: string; logo: string }

const L = 'https://ligazeglarska.pl/wp-content/uploads'

export const KLUB_MEDIA: KlubMedia[] = [
  { nazwa: 'Yacht Club Gdańsk', foto: `${L}/2024/01/EXR1_127_gwidon_libera-scaled.jpg`, logo: `${L}/2024/02/ycg.webp` },
  { nazwa: 'YKP Gdynia', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0237_Gwidon_Libera_SR507840-scaled.jpg`, logo: `${L}/2025/01/YKP.png` },
  { nazwa: 'Energa Giżycka Grupa Regatowa', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0246_Gwidon_Libera_SR507898-scaled.jpg`, logo: `${L}/2025/01/GGR-logo.png` },
  { nazwa: 'On Lemon Rockstars Racing', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0253_Gwidon_Libera_SR507967-scaled.jpg`, logo: `${L}/2024/01/on-lemon-rockstars-racing-logo-1-scaled.png` },
  { nazwa: 'HRM Racing', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0241_Gwidon_Libera_SR507874-scaled.jpg`, logo: `${L}/2024/01/logo-HRM-kwadrat-ramka.png` },
  { nazwa: 'Yacht Club Sopot', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0248_Gwidon_Libera_SR507906-scaled.jpg`, logo: `${L}/2025/01/YCSY.png` },
  { nazwa: 'SEJK Pogoń Szczecin', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0239_Gwidon_Libera_SR507858-scaled.jpg`, logo: `${L}/2025/01/POG.png` },
  { nazwa: 'KS Marina Niesulice', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0236_Gwidon_Libera_SR507836-scaled.jpg`, logo: `${L}/2024/02/nie.webp` },
  { nazwa: 'YKP Lublin', foto: `${L}/2024/01/EXR1_121_gwidon_libera-scaled.jpg`, logo: `${L}/2025/01/YKL.png` },
  { nazwa: 'Sport Vita Ski & Sail', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0264_Gwidon_Libera_SR508885-scaled.jpg`, logo: `${L}/2024/02/spo.webp` },
  { nazwa: 'AZS AWFiS Gdańsk', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0263_Gwidon_Libera_SR508129-scaled.jpg`, logo: `${L}/2024/01/Logo-AZS-AWFiS_Podstawowy_uproszczony-ENG.png` },
  { nazwa: 'Legia Warszawa', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0242_Gwidon_Libera_SR507878-scaled.jpg`, logo: `${L}/2024/02/leg.png` },
  { nazwa: 'AZS Politechnika Gdańska', foto: `${L}/2024/02/1LR1_0020_szymon_sikora_d1_Poziom_WM.jpg`, logo: `${L}/2025/01/PGD.jpg` },
  { nazwa: 'WKS Flota Gdynia', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0238_Gwidon_Libera_SR507851-scaled.jpg`, logo: `${L}/2024/02/BSA-Flota-Gdynia.png` },
  { nazwa: 'YKP Warszawa', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0256_Gwidon_Libera_SR508071-scaled.jpg`, logo: `${L}/2024/03/YKP-Warszawa.png` },
  { nazwa: 'Garland Yacht Club', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0244_Gwidon_Libera_SR507886-scaled.jpg`, logo: `${L}/2024/02/GYC-scaled.png` },
  { nazwa: 'Sztorm Grupa', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0251_Gwidon_Libera_SR507931-scaled.jpg`, logo: `${L}/2024/02/szt.webp` },
  { nazwa: 'Politechnika Warszawska AZS Warszawa', foto: `${L}/2025/01/PLZ_NGP_EXR1_D1_0262_Gwidon_Libera_SR508121-scaled.jpg`, logo: `${L}/2025/01/logo-PW.png` },
  { nazwa: 'KS Iskra AMW Gdynia', foto: `${L}/2024/02/AMW.jpg`, logo: `${L}/2024/02/isk.webp` },
  { nazwa: 'UKS Żeglarz Wrocław', foto: `${L}/2025/02/PLZ_NGP_EXR1_D1_0258_Gwidon_Libera_SR508085-scaled.jpg`, logo: `${L}/2024/02/wro.webp` },
  { nazwa: 'Slava Racing', foto: `${L}/2024/02/PLZ_1LR1_D1_-025_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/sla.webp` },
  { nazwa: 'Olsztyńska Grupa Regatowa', foto: `${L}/2024/02/PLZ_1LR1_D1_-011_Szymon_Sikora_w.jpg`, logo: `${L}/2024/12/OGR_logo.png` },
  { nazwa: 'Nauticus Olsztyn', foto: `${L}/2024/02/PLZ_1LR1_D1_-032_Szymon_Sikora_w.jpg`, logo: `${L}/2025/04/Nauticus-NYCO-v9.png` },
  { nazwa: 'MAG Mechelinki', foto: `${L}/2024/02/1LR1_0016_szymon_sikora_d1_Poziom_WM.jpg`, logo: `${L}/2025/04/YC-Mechelinki-2-1.png` },
  { nazwa: 'UKS Wiking Wolin', foto: `${L}/2024/02/1LR1_0027_szymon_sikora_d1_Poziom_WM-1.jpg`, logo: `${L}/2024/02/WOL-1.webp` },
  { nazwa: 'Olsztyński Klub Żeglarski', foto: `${L}/2024/02/PLZ_1LR1_D1_-013_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/OKZ-pdf.jpg` },
  { nazwa: 'Texet-JKW Sailing Team', foto: `${L}/2024/02/PLZ_1LR1_D1_-002_Szymon_Sikora_w.jpg`, logo: `${L}/2024/11/texet.png` },
  { nazwa: 'The Barking Dogs YCG', foto: `${L}/2024/02/PLZ_1LR1_D1_-035_Szymon_Sikora_w.jpg`, logo: `${L}/2024/12/logo_zaloga_TBD_dark_page-0001.jpg` },
  { nazwa: 'GQ Racing', foto: `${L}/2024/02/PLZ_1LR1_D1_-015_Szymon_Sikora_w-1.jpg`, logo: `${L}/2024/02/517840556_10163404318317941_4532218907158758488_n.jpg` },
  { nazwa: 'YKP Szczecin', foto: `${L}/2024/02/PLZ_1LR1_D1_-023_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/yks.webp` },
  { nazwa: 'Fundacja Baltiq Sport', foto: `${L}/2024/02/PLZ_1LR1_D1_-029_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/FBS.png` },
  { nazwa: 'Mazurski Klub Żeglarski w Mikołajkach', foto: `${L}/2024/02/PLZ_1LR1_D1_-007_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/cropped-MKZ-logo-2020-by-TZ.png` },
  { nazwa: 'HRM Racing Youth', foto: `${L}/2024/02/PLZ_1LR1_D1_-004_Szymon_Sikora_w.jpg`, logo: `${L}/2024/01/logo-HRM-kwadrat-ramka.png` },
  { nazwa: 'Yacht Club Białołęka', foto: `${L}/2024/02/PLZ_1LR1_D1_-021_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/YCB-1.png` },
  { nazwa: 'KŻ Hals Gostynin', foto: `${L}/2024/02/PLZ_1LR1_D1_-038_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/hal.png` },
  { nazwa: 'Kościański Klub Żeglarski', foto: `${L}/2024/02/PLZ_1LR1_D1_-033_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/KKZ-2.png` },
  { nazwa: 'Jacht Klub Stoczni Gdańskiej', foto: `${L}/2024/02/PLZ_1LR1_D1_-020_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/JSG.png` },
  { nazwa: 'Yacht Club Sopot 2', foto: `${L}/2024/02/PLZ_1LR1_D1_-039_Szymon_Sikora_w.jpg`, logo: `${L}/2025/01/YCSY.png` },
  { nazwa: 'YKP Rzeszów', foto: `${L}/2024/02/PLZ_1LR1_D1_-017_Szymon_Sikora_w.jpg`, logo: `${L}/2024/02/YKR-scaled.png` },
  { nazwa: 'RITS Sailing Club', foto: `${L}/2024/02/PLZ_1LR1_D1_-028_Szymon_Sikora_w-1.jpg`, logo: `${L}/2024/02/RITS.png` },
  { nazwa: 'Yacht Club Gdańsk Junior', foto: `${L}/2026/04/YCGJ-2.jpg`, logo: `${L}/2025/01/YCGY.png` },
  { nazwa: 'UKŻ Lamelka Kartuzy', foto: `${L}/2024/03/LAM.jpg`, logo: `${L}/2025/04/Lamelka-logo-1.png` },
  { nazwa: 'Politechnika Morska Szczecin', foto: `${L}/2026/04/MUS-1.jpg`, logo: `${L}/2025/04/logo_politechnika-morska-2-1.png` },
  { nazwa: 'Yacht Club Sopot Youth', foto: `${L}/2026/04/YCSY-2.jpg`, logo: `${L}/2025/01/YCSY.png` },
  { nazwa: 'Yacht Club Gdańsk Youth', foto: `${L}/2026/04/YCGY.jpg`, logo: `${L}/2025/01/YCGR.png` },
  { nazwa: 'Yacht Club Gdańsk Ryśki', foto: `${L}/2026/04/YCGR.jpg`, logo: `${L}/2025/01/YCGY.png` },
  { nazwa: 'Yacht Club Gdańsk Cadetti', foto: `${L}/2026/04/YCGC.jpg`, logo: `${L}/2025/01/YCGR.png` },
  { nazwa: 'Yacht Club Gdańsk Sigmy', foto: `${L}/2026/04/YCGS.jpg`, logo: `${L}/2025/01/YCGC.png` },
  { nazwa: 'Siostry KS AZS AWFiS Gdańsk', foto: `${L}/2026/04/SIS.jpg`, logo: `${L}/2026/03/SIS-1-pdf.jpg` },
  { nazwa: 'Wydział Elektryczny PW', foto: `${L}/2026/04/WEE-2.jpg`, logo: `${L}/2026/03/WEE.png` },
  { nazwa: 'Uniwersytet Gdański', foto: `${L}/2026/04/UG1.jpg`, logo: `${L}/2024/03/UG1-e1785929097515.png` },
  { nazwa: 'Żegluj Lublin', foto: `${L}/2026/04/ZEL.jpg`, logo: `${L}/2025/01/ZEL.jpg` },
]

function norm(s: string): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const INDEX: { key: string; m: KlubMedia }[] = KLUB_MEDIA.map((m) => ({ key: norm(m.nazwa), m }))

export function getKlubMedia(nazwa: string): KlubMedia | null {
  const k = norm(nazwa)
  if (!k) return null
  const exact = INDEX.find((e) => e.key === k)
  if (exact) return exact.m
  // fallback: jedna nazwa zawiera drugą
  const part = INDEX.find((e) => e.key.includes(k) || k.includes(e.key))
  return part ? part.m : null
}
