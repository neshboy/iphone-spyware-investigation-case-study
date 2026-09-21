from pywinauto import Application

app = Application(backend="uia").connect(title="iTunes")
win = app.top_window()
print("Window:", win.window_text())
try:
    win.print_control_identifiers(depth=6)
except Exception as e:
    print("print_control_identifiers failed:", e)
