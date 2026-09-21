from pywinauto import Application

app = Application(backend="win32").connect(process=23252)
win = app.top_window()
win.set_focus()

try:
    menu = win.menu()
    print("Has native menu:", menu is not None)
    items = menu.items()
    for it in items:
        print(" top:", it.text())
except Exception as e:
    print("menu() failed:", e)
