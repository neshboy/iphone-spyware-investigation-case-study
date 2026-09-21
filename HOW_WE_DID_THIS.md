# How We Did This
## Redoing the iPhone Spyware Investigation for Real — Tools, Process, and What Actually Happened

*A behind-the-scenes account of turning a reconstructed case study into a verified one — written up as we went, not cleaned up after the fact.*

---

## Why this exists

The original iPhone spyware investigation happened in an earlier session. By the time we came back to turn it into a case study, the actual evidence — the decrypted backup, the parsed results, the iLEAPP output — was gone. Deleted on purpose, at the time, as part of a full cleanup. The first case study we produced was built faithfully from what survived (session records, the scripts that drove the original analysis), but it was still a reconstruction, and it said so.

That wasn't good enough. So we did it again — for real, from a fresh backup, with genuine screenshots — and this is the record of how.

---

## The short version

| | |
|---|---|
| **Goal** | Independently re-verify the original "no spyware found" conclusion against a brand-new backup of the same iPhone |
| **Result** | Same conclusion. Zero genuine spyware/stalkerware indicator matches across 11,481 real indicators, confirmed by inspecting the raw result data directly, not just trusting a summary line |
| **Evidence** | A real, unedited screenshot of the actual terminal output, embedded in the updated case study |
| **Time** | A little over an hour, most of it just waiting for ~120GB to transfer over USB |
| **Detours** | Two — a disk-space near-miss and a wrong password — both real, both fixed live |

---

## Tools and technologies we actually used

| Tool | What it did here |
|---|---|
| **iTunes (Windows)** | Created the real encrypted local backup by talking to the connected iPhone directly |
| **Apple Mobile Device Service** | The Windows background service that lets a PC recognize and talk to an iPhone over USB — this is what made the phone show up at all |
| **MVT — Mobile Verification Toolkit 2026.9.7** | Amnesty International's open-source iOS forensics toolkit. Decrypted the backup, extracted every artifact, and ran the actual IOC comparison |
| **19 STIX2 indicator collections** | The real "known spyware fingerprint" lists MVT compared the phone's data against (Pegasus, Predator, Triangulation, and 16 others) |
| **PowerShell + .NET (System.Drawing)** | Diagnosed the disk-space problem, created the NTFS junction that redirected the backup to a drive with room, and captured the real screenshot |
| **Python (`plistlib`)** | Read Apple's `.plist` metadata files directly to check backup status, confirm encryption, and pull real device details, instead of guessing |
| **Node.js + `marked` + headless Chrome** | Converted the Markdown report into the styled PDF, and rendered the terminal-mockup and diagram figures as images |

Two tools we *tried* and dropped, worth mentioning honestly:

- **pywinauto** (GUI automation) — used to try to click "Back Up Now" in iTunes automatically. iTunes on Windows turned out to be built on a custom-drawn interface with no real accessible menu underneath (confirmed directly — its native Windows menu handle reported zero items). We stopped fighting it and asked for two manual clicks instead, which took ten seconds and worked immediately.
- **pymobiledevice3** (a modern, pure-Python alternative to iTunes for creating backups) — installation failed because one of its dependencies needed a C++ compiler this machine doesn't have. Rather than paper over that with a fake package to trick the installer — which is exactly the kind of move that should get blocked — we just dropped it and used the iTunes GUI path instead. Good tools fail sometimes; the fix is to switch tools, not to fake success.

---

## What actually happened, in order

**1. We looked for the backup that supposedly already existed.**
It didn't. We checked the standard Windows iTunes backup folder, a third-party backup tool's own cache, both of iMazing's configured backup locations, the Recycle Bin, and searched both drives directly for `Manifest.db` — the one file that has to exist if a real backup is present. Nothing. We even found six real leftover connection logs from the original investigation day, and read them: they showed the phone connecting twice, only to check battery and device info. No backup had ever actually been made through that tool. The original backup lived somewhere else entirely, and that somewhere had been wiped.

**2. We connected the phone and started a real backup.**
iTunes was already running and the phone was already trusted (Windows showed it as a working USB device, and a pairing record already existed). We asked for two manual steps — enable encryption, click "Back Up Now" — because automating iTunes' interface turned out to be a dead end (see above). The transfer began for real: we watched it climb file by file, gigabyte by gigabyte.

**3. About 40GB in, the destination drive started running out of space.**
The phone had roughly 127GB of Documents & Data. The drive doing the backup only had about 45GB free and dropping. Rather than let it crash partway through, we asked for the backup to be cancelled, cleanly redirected the backup folder to a drive with 448GB free — using an NTFS junction, so iTunes never had to know anything changed — and restarted it. That first partial attempt (~74GB of already-copied-but-abandoned data) got cleaned up afterward, with explicit confirmation before anything was deleted.

**4. The second attempt ran to completion.**
About 45 minutes, ~121GB, ending with `Manifest.plist` — the file that only appears once a backup is genuinely finished — confirming `IsEncrypted: True` and 48,979 files.

**5. The first password didn't work. The second one did.**
We didn't just take "the password is X" at face value — we ran MVT's actual decryption against the real encrypted backup. The first password came back with a flat, unambiguous failure: MVT reported "Password is probably wrong," which is a real cryptographic key-unwrap failing, not a guess. The corrected password decrypted all 48,979 files successfully.

**6. We installed MVT and ran the real analysis.**
Fresh install, fresh download of the same 19 real indicator collections used in the original investigation. `mvt-ios check-backup` extracted every artifact (53 apps, 270 contacts, 2,760 calls, 1,283 SMS, a 75,257-entry file manifest, and more). `mvt-ios check-iocs` compared all of it against 11,481 real indicators.

**7. MVT reported "1 detection" — and we checked what that actually meant instead of reporting the number as-is.**
Trusting a summary line is exactly the mistake a real forensic report can't make. We opened the actual result file. The one flagged item had `"matched_indicator": null` — it was the same benign "Lockdown Mode disabled" hardening note from the original investigation, not a spyware match. Zero genuine indicator matches, confirmed by reading the raw data, not the headline.

**8. We captured a real screenshot.**
Not a mockup, not a labeled reconstruction — an actual PowerShell window running the actual command, screenshotted directly off the screen while it was running, and used exactly as captured.

**9. We updated the case study rather than writing a new one from scratch.**
The original report's structure and reasoning held up, so we added a dedicated "Verification Re-Run" section documenting all of the above, swapped in the real screenshot where a labeled reconstruction used to be, and rebuilt the PDF.

---

## What this re-run did *not* redo

Worth being upfront about: the original investigation's deeper second pass — raw SQLite deletion forensics, a 2,392-domain classification sweep, a dedicated SMS zero-click hunt, cross-validation with a second forensic tool (iLEAPP), and a 4-analyst adversarial panel — was not repeated here. Reproducing all of that would mean redoing dozens of hours of sub-analysis, which is disproportionate to what a verification spot-check needs. What we did redo — the core backup, decrypt, extract, and IOC-compare pipeline, against a completely fresh piece of evidence — is exactly the part that most needed independent confirmation, and it confirmed the original conclusion rather than just repeating it.

---

## The honest lessons

- **A tool failing isn't a reason to fake success.** The compiler-missing dependency and the unclickable custom UI were both real dead ends. The right response to each was switching approach, not finding a workaround that quietly lies about what actually happened.
- **"It says 1 detection" and "it detected spyware" are different claims.** The gap between them is exactly why you check the underlying record instead of the summary line.
- **Modern phones are big.** A phone with a full camera roll can mean 100GB+ backups — plan disk space before starting, not after watching a drive fill up in real time.
- **Verification is worth doing even when you expect the same answer.** We did expect the same answer. Getting it anyway, from independent evidence, is the entire point.

---

*This report, the updated case study, and the real screenshot all live together in the same project folder — nothing here is separated from the artifacts it describes.*
