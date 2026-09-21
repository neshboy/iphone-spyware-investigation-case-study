from pywinauto import Application
from pywinauto.keyboard import send_keys
import time

app = Application(backend="uia").connect(title="iTunes")
win = app.top_window()
win.set_focus()
time.sleep(0.3)

file_menu = win.child_window(title="File", control_type="MenuItem")
file_menu.click_input()
time.sleep(0.5)

items = win.descendants(control_type="MenuItem")
print("Items after opening File menu:", len(items))
for m in items:
    try:
        print(" -", repr(m.window_text()))
    except Exception:
        pass

# try to find "Devices" submenu
try:
    devices = win.child_window(title="Devices", control_type="MenuItem")
    devices.click_input()
    time.sleep(0.5)
    items2 = win.descendants(control_type="MenuItem")
    print("Items after opening Devices submenu:", len(items2))
    for m in items2:
        try:
            print(" -", repr(m.window_text()))
        except Exception:
            pass
except Exception as e:
    print("Devices submenu not found:", e)

send_keys("{ESC}{ESC}")
