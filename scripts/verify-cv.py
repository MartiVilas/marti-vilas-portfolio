"""Check PDF reading order and basic ATS text properties; this does not emulate an ATS."""
from pathlib import Path
import json
from pypdf import PdfReader
import pdfplumber
ROOT=Path(__file__).resolve().parents[1]
profile=json.loads((ROOT/'src/data/professional-profile.json').read_text())
for locale in ['en','es']:
 path=ROOT/'src/assets'/f'CV_Marti_Vilas_{locale.upper()}.pdf'
 reader=PdfReader(path)
 assert len(reader.pages)==1
 text='\n'.join(p.extract_text() for p in reader.pages)
 order=[profile['locales'][locale]['cv_sections'][k] for k in ['summary','skills','experience','projects','education','languages']]
 positions=[text.index(label) for label in order];assert positions==sorted(positions)
 for value in ['I-MAS','React','TypeScript','Node.js','MySQL','Momentum','2025','2026','B2','GitHub','LinkedIn']:
  assert value in text,(locale,value)
 assert '\ufffd' not in text
 with pdfplumber.open(path) as pdf:
  page=pdf.pages[0];assert len(page.chars)>1800
  assert not page.images, 'CV text must not be an image'
  assert min(c['x0'] for c in page.chars)>=30
  assert min(c['top'] for c in page.chars)>=25
  assert max(c['bottom'] for c in page.chars)<page.height-20
 assert len(reader.pages[0].get('/Annots',[]))>=3,'Missing professional links'
 out=ROOT/'tmp/pdfs'/f'CV_{locale.upper()}.txt';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(text)
 print(f'{locale}: 1 page; sections in order; selectable text; links; bounds OK')
