import sys
import pymupdf

pdf_path = r"C:\Users\User\projects\iphone-spyware-investigation-case-study\iPhone_Spyware_Investigation_Case_Study.pdf"
doc = pymupdf.open(pdf_path)
print("page count:", doc.page_count)

pages = [int(p) for p in sys.argv[1:]] if len(sys.argv) > 1 else [0, 1, 5, 10]
out_dir = r"C:\Users\User\projects\iphone-spyware-investigation-case-study\build\out"
for p in pages:
    if p >= doc.page_count:
        continue
    pix = doc[p].get_pixmap(dpi=110)
    out_path = f"{out_dir}/preview_p{p}.png"
    pix.save(out_path)
    print("saved", out_path)
