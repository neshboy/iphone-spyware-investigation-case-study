from pywinauto import Desktop

wins = Desktop(backend="uia").windows()
for w in wins:
    try:
        print(repr(w.window_text()), w.element_info.class_name, w.process_id())
    except Exception as e:
        print("err", e)
