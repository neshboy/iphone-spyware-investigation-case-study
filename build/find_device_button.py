from pywinauto import Application

app = Application(backend="uia").connect(title="iTunes")
win = app.top_window()

targets = ["iphone", "phone", "device", "summary", "back up", "backup", "f35"]
seen = 0
for d in win.descendants():
    try:
        txt = (d.window_text() or "").strip()
    except Exception:
        continue
    if not txt:
        continue
    low = txt.lower()
    if any(t in low for t in targets):
        try:
            rect = d.rectangle()
        except Exception:
            rect = None
        print(repr(txt), "|", d.element_info.control_type, "|", rect)
        seen += 1

print("total matches:", seen)
