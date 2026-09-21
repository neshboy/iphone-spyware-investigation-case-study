from pywinauto import Application
import time

app = Application(backend="uia").connect(title="iTunes")
win = app.top_window()
win.set_focus()
time.sleep(0.3)

file_menu = win.child_window(title="File", control_type="MenuItem")
try:
    file_menu.invoke()
except Exception as e:
    print("invoke failed, trying expand:", e)
    try:
        file_menu.expand()
    except Exception as e2:
        print("expand also failed:", e2)

time.sleep(0.6)
items = win.descendants(control_type="MenuItem")
print("MenuItem count after invoke/expand:", len(items))
for m in items:
    try:
        print(" -", repr(m.window_text()))
    except Exception:
        pass
