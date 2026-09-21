Can you actually tell whether an iPhone has spyware just by looking at a backup?

I recently decided to test exactly that — on my own phone, after a period of unease about its behavior. Not by running an antivirus scan. By treating it like an actual forensic investigation.

Here's roughly what that looked like:

→ Decrypt the backup, then use Manifest.db to map every hashed, meaningless-looking filename back to its real path (Library/SMS/sms.db, HomeDomain, etc.) — that mapping is the foundation everything else stands on.

→ Run MVT (Amnesty International's Mobile Verification Toolkit) against 19 published IOC collections for known mercenary spyware — Pegasus, Predator, Triangulation, and 16 others — 11,619 indicators total, zero matches, confirmed twice.

→ Pull the databases open directly with sqlite3. Integrity checks, raw row counts vs. what the parser reported, and — this is the interesting bit — checking for gaps in autoincrement ROWID sequences, because that's how you find evidence of *deleted* messages even without a dedicated recovery tool.

→ Run a second, completely independent forensic parser (iLEAPP) against the same backup. This actually caught something: the first tool couldn't even find the WhatsApp database. Not "checked WhatsApp, found nothing" — never looked at it at all. The second tool recovered all 3,000+ messages. That's the kind of gap you only catch by not trusting a single tool's coverage.

→ Classify 2,392 unique domains pulled from browsing history, tracking-prevention data, and message links. Most unfamiliar domains are just ad-tech noise — the actual skill here is not panicking every time you see a domain you don't recognize.

→ Before calling it "clean," run the investigation backwards: explicitly try to build the strongest possible case that the phone WAS compromised, using only the evidence gathered. If that exercise can't produce a convincing argument, the "no spyware found" conclusion means something. If it can, you're not done yet.

Result: no confirmed spyware indicators were found. But I'm not going to tell you the phone is "clean" — because a backup can't show you everything (no live memory, no real crash logs, no historical network capture), and I did end up with one loose thread I couldn't fully close: a 96-day gap in the call log I couldn't conclusively explain.

The interesting part was never really the yes/no answer. It's the process of collecting evidence, chasing down every alarming-looking lead to a specific explanation, and being honest about exactly where the evidence runs out.

Full write-up (methodology, tooling, findings, and the limitations most reports skip): https://github.com/neshboy/iphone-spyware-investigation-case-study/blob/master/iPhone_Spyware_Investigation_Case_Study.pdf

#DFIR #MobileForensics #Spyware #Stalkerware #CyberSecurity
