from pywinauto import Application
from pywinauto.keyboard import send_keys
import time

app = Application(backend="uia").connect(title="iTunes")
win = app.top_window()
win.set_focus()
time.sleep(0.5)

menu_items = win.descendants(control_type="MenuItem")
print("MenuItem count:", len(menu_items))
for m in menu_items:
    print(" -", repr(m.window_text()))

# Try revealing the classic hidden menu bar with Alt, then dump top-level menu bar items
send_keys("{VK_MENU}")
time.sleep(0.5)
menu_items2 = win.descendants(control_type="MenuItem")
print("After Alt, MenuItem count:", len(menu_items2))
for m in menu_items2:
    print(" -", repr(m.window_text()))
