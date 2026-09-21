# iPhone Spyware Forensic Investigation

A personal case study: a real forensic examination of my own iPhone backup for indicators of spyware, stalkerware, or unauthorized surveillance — documented as a methodology walkthrough, not a "ran a scan, got a result" post.

**Full report:** [CASE_STUDY.md](./CASE_STUDY.md)

**Independently re-verified 2026-09-21:** the original evidence was deleted after the investigation concluded (see the report), so the core acquisition → decrypt → extract → IOC-compare pipeline was re-run from scratch against a freshly created backup of the same device, with a genuine screenshot of the real result. Same conclusion. See [Addendum: Verification Re-Run](./CASE_STUDY.md#addendum-verification-re-run-2026-09-21).

## Objective

Determine whether the evidence available inside an iPhone's backup contains indicators consistent with known commercial spyware or stalkerware — a bounded question, answered only as far as the available evidence can actually support.

## Evidence Source

An encrypted local (iTunes/Finder-style) **logical backup**, decrypted with the device owner's own backup password. Device: iPhone 14 Pro Max, iOS 27.0. This is *not* a full filesystem extraction, sysdiagnose, or physical acquisition — see the full report's [Section 3](./CASE_STUDY.md#3-evidence-available) and [Section 22](./CASE_STUDY.md#22-what-this-analysis-does-not-prove) for exactly what that does and doesn't make visible.

## Methodology

1. **Baseline** — MVT (`mvt-ios check-backup` + `check-iocs`) against 19 STIX2 spyware/stalkerware indicator collections (11,619 indicators), run twice for reproducibility.
2. **Deep-dive** — artifact-by-artifact review of every parsed file an IOC scan alone wouldn't meaningfully evaluate (calls, contacts, calendar, cross-app interaction logs, the full backup manifest, location-client registry, OS analytics, Safari state).
3. **Second-pass adversarial hunt** — raw SQLite-level forensics, domain classification at scale (2,392 domains), a dedicated SMS zero-click review, cross-validation with a second independent parser ([iLEAPP](https://github.com/abrignoni/iLEAPP)), and a structured 4-analyst "steelman panel" explicitly tasked with building the strongest possible case *for* compromise before any conclusion was accepted.

## Tools

- [MVT (Mobile Verification Toolkit)](https://github.com/mvt-project/mvt) — Amnesty International Security Lab
- [iLEAPP](https://github.com/abrignoni/iLEAPP) — independent second-opinion forensic parser
- `sqlite3` — direct database-level forensics (integrity checks, ROWID gap / deletion analysis)
- Python — bulk JSON/TSV artifact parsing at scale

## Artifact Categories Examined

Configuration profiles & MDM enrollment · TCC permissions (Accessibility, AppleEvents, Screen Capture, Input Monitoring) · Safari & WebKit history/state · SMS/iMessage & WhatsApp · call history & contacts · calendar · location-client registry · OS analytics/crash telemetry · Bluetooth/WiFi known-network history · cookies & autofill · full backup file manifest (74,198 entries) · 5 key SQLite databases at the raw level.

## IOC Analysis

19 STIX2 indicator collections covering Pegasus, Predator, RCS Lab, Quadream KingSpawn, Operation Triangulation, WyrmSpy/DragonEgg, EagleMsgSpy, Wintego Helios, NoviSpy, Candiru, Cellebrite, ResidentBat, DarkSword, Coruna, Morpheus, BTMOB, Spyrtacus, generic stalkerware, and the Amnesty Tech mercenary-campaign set — **0 of 11,619 indicators matched**, across two independent runs. Disclosed gap: LightSpy indicators were not part of the collections used.

## Findings

**No confirmed indicators of known commercial spyware, stalkerware, or malicious persistence were identified in the evidence examined.**

Several individually alarming-looking leads were investigated and each resolved to a specific, evidenced, benign explanation (a joke-labeled contact, a high-frequency contact's missed-call pattern, a mislabeled parser artifact, a cumulative-counter figure, an app-analytics WAL file). One item — a 96-day call-history gap — could not be conclusively explained and is carried forward as an open finding rather than dismissed. Full breakdown: [Findings](./CASE_STUDY.md#18-findings) and [Investigation Matrix](./CASE_STUDY.md#19-investigation-matrix).

## Limitations

This was a **logical backup**, not a full filesystem extraction, live memory snapshot, or network packet capture. No real crash logs (`.ips`) were available, only aggregate telemetry. Data deleted before the backup was made is gone. A self-cleaning zero-click exploit chain is close to the theoretical limit of what backup-based forensics can rule out. None of this is hedging after the fact — it's spelled out in detail in [Section 22](./CASE_STUDY.md#22-what-this-analysis-does-not-prove) because a conclusion without its limitations attached isn't a forensic finding.

## Security Recommendations

Automatic iOS updates · strong alphanumeric passcode + 2FA on the Apple ID · periodic review of signed-in devices and installed configuration profiles · Lockdown Mode for elevated-risk individuals · a real-time sysdiagnose capture as the next step if the open call-log item resurfaces as a concern. Full list: [Section 23](./CASE_STUDY.md#23-security-recommendations).

## Disclaimer

Personal case study, not a professional/certified DFIR engagement — self-authorized examination of the author's own device, for educational and portfolio purposes. No personal data, credentials, or other individuals' information is published here. Genuine surveillance concerns should go to a qualified forensics professional or an organization such as [Amnesty International's Security Lab](https://securitylab.amnesty.org/) or the [Citizen Lab](https://citizenlab.ca/).
