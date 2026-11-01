"""Generate both CVs from the same professional data used by the Astro pages.
Run with Python 3, reportlab and pypdf: python3 scripts/generate-cv.py
"""
from pathlib import Path
from xml.sax.saxutils import escape
import json, shutil
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, KeepTogether
from pypdf import PdfReader

ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'src/data/professional-profile.json').read_text())
identity=data['identity']
OUT=ROOT/'output/pdf';OUT.mkdir(parents=True,exist_ok=True)
# Standard, embedded text objects, one column, no text in images or sidebars.
styles={
 'name':ParagraphStyle('name',fontName='Helvetica-Bold',fontSize=23,leading=26,textColor=colors.HexColor('#162c46'),spaceAfter=4),
 'role':ParagraphStyle('role',fontName='Helvetica-Bold',fontSize=11.3,leading=14,textColor=colors.HexColor('#0369a1'),spaceAfter=6),
 'body':ParagraphStyle('body',fontName='Helvetica',fontSize=10,leading=13,textColor=colors.HexColor('#24364b'),spaceAfter=4),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=9,leading=12,textColor=colors.HexColor('#3e5268'),spaceAfter=3),
 'section':ParagraphStyle('section',fontName='Helvetica-Bold',fontSize=10.4,leading=13,textColor=colors.HexColor('#0369a1'),spaceBefore=7,spaceAfter=4),
 'heading':ParagraphStyle('heading',fontName='Helvetica-Bold',fontSize=10,leading=13,textColor=colors.HexColor('#162c46'),spaceBefore=3,spaceAfter=2),
 'bullet':ParagraphStyle('bullet',fontName='Helvetica',fontSize=10,leading=13,textColor=colors.HexColor('#24364b'),leftIndent=9,firstLineIndent=-9,spaceAfter=3),
}
def text(s):return escape(str(s)).replace('–','-').replace('—','-').replace('’',"'")
def para(s,style='body'):return Paragraph(s,styles[style])
def link(url,label=None):return '<link href="'+escape(url,{'"':'&quot;'})+'" color="#0369a1">'+text(label or url.replace('https://',''))+'</link>'
for locale in ['en','es']:
 p=data['locales'][locale];labels=p['cv_sections'];story=[]
 story.extend([para(text(identity['name']),'name'),para(text(p['professional_role']),'role')])
 contact='Barcelona, '+('Spain' if locale=='en' else 'España')+' | '+identity['phone']+' | '+identity['email']
 story.append(para(text(contact),'small'))
 story.append(para(link(identity['website'])+' | '+link(identity['github'],'GitHub: MartiVilas')+' | '+link(identity['linkedin'],'LinkedIn: Martí Vilàs'),'small'))
 story.append(para(labels['summary'],'section'));story.append(para(text(p['cv_summary'])))
 story.append(para(labels['skills'],'section'))
 for group in p['technical_skills']:story.append(para('<b>'+text(group['label'])+':</b> '+text(', '.join(group['values'])),'small'))
 story.append(para(labels['experience'],'section'))
 for i,e in enumerate(p['experiences']):
  title=text(e['role'])+' | '+text(e['place'])
  block=[para(title,'heading'),para(text(e['period']),'small')]
  if i==0:
   for bullet in e['bullets']:block.append(para('- '+text(bullet),'bullet'))
  else:block.append(para(text(e['description']),'small'))
  story.append(KeepTogether(block))
 story.append(para(labels['projects'],'section'))
 for project in sorted((v for v in p['projects'] if v['cvOrder']), key=lambda v: v['cvOrder']):
  heading='<b>'+text(project['title'])+'</b> | '+text(project['type'])
  if project.get('url'):heading+=' | '+link(project['url'],'Web')
  story.append(KeepTogether([para(heading,'small'),para(text(project['cvDescription'] or project['description']),'small')]))
 story.append(para(labels['education'],'section'))
 for e in p['studies']:story.append(para('<b>'+text(e['title'])+'</b> | '+text(e['center'])+' | '+text(e['period']),'small'))
 story.append(para(labels['languages'],'section'))
 story.append(para(text(' | '.join(l['name']+': '+l['level'] for l in p['spoken_languages'])),'small'))
 path=OUT/('Marti_Vilas_CV_'+locale.upper()+'.pdf')
 doc=SimpleDocTemplate(str(path),pagesize=A4,rightMargin=40,leftMargin=40,topMargin=33,bottomMargin=30,title=identity['name']+' - '+p['professional_role'],author=identity['name'])
 doc.build(story)
 pages=len(PdfReader(path).pages)
 if pages!=1:raise RuntimeError(f'{locale}: {pages} pages. Adjust content/spacing; do not silently shrink type.')
 shutil.copy2(path,ROOT/'src/assets'/('CV_Marti_Vilas_'+locale.upper()+'.pdf'))
 print(f'{locale}: {pages} page, selectable text, {path.name}')
