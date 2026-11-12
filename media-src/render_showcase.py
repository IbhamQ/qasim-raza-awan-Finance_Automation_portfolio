from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import subprocess, math
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'project-media/editorial';OUT.mkdir(exist_ok=True)
W,H=1280,720
BG='#edf1f0';INK='#17332e';MUT='#5a706a';ACC='#107a64';LINE='#d4dfdb';WHITE='#ffffff';GOLD='#bd6b36'
def font(n,b=False):return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans'+('-Bold' if b else '')+'.ttf',n)
def text(d,xy,t,size=20,color=INK,b=False):d.text(xy,t,font=font(size,b),fill=color)
def box(d,r,fill=WHITE,outline=LINE):d.rounded_rectangle(r,radius=14,fill=fill,outline=outline,width=1)
def base(title,sub,note='PRESENTATION REDESIGN  /  REPRESENTATIVE DATA'):
 im=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(im)
 text(d,(46,28),'FINNOVATIVE  /  FINANCE SYSTEMS',15,ACC,True);text(d,(46,72),title,38,INK,True);text(d,(48,126),sub,19,MUT)
 d.line((48,166,1232,166),fill=LINE,width=2);text(d,(48,678),note,12,MUT);return im,d
def panel(d,x,y,w,h,title,caption):
 box(d,(x,y,x+w,y+h));text(d,(x+22,y+20),title,19,INK,True);text(d,(x+22,y+53),caption,14,MUT)
def payroll(scene=2,progress=1):
 titles=['Two exports. Different payroll structures.','Identify the employee. Interpret the rates.','Allocate hours to the correct pay category.','Produce the Humi-ready workbook.']
 subs=['A one-click Excel/VBA workflow connects Restaurant365 and Humi.','Names and ordered pay rates provide the mapping logic.','Multiple job rates and overtime stay distinct.','Template structure is preserved for review and saving.']
 im,d=base(titles[scene],subs[scene]);y=198
 for j,name in enumerate(['Select files','Match employee + rate','Allocate hours','Review output']):
  x=48+j*299;box(d,(x,y,x+281,y+45),ACC if j==scene else WHITE);text(d,(x+16,y+12),f'{j+1:02}  {name}',15,WHITE if j==scene else MUT,True)
 if scene==0:
  panel(d,48,274,560,258,'RESTAURANT365 EXPORT','Employee names • pay rates • regular + overtime hours')
  panel(d,644,274,588,258,'HUMI IMPORT TEMPLATE','Employee identity • ordered rates • destination columns')
  for i,(a,b) in enumerate([('Avery Morgan','$15.00  |  32.12 regular'),('Avery Morgan','$19.00  |  8.00 regular'),('Avery Morgan','$28.50  |  0.27 overtime')]):
   text(d,(74,364+i*48),a,18);text(d,(280,364+i*48),b,16,ACC)
  text(d,(670,370),'Avery Morgan ($15) ($17) ($25.5)',18)
  text(d,(670,414),'($19) ($28.5) ($22.5)',18)
  text(d,(670,472),'Select R365 file → select Humi template',17,ACC,True)
 elif scene==1:
  panel(d,48,274,1184,110,'NORMALIZE EMPLOYEE IDENTITY','Match case-insensitively after separating the embedded rate values.')
  text(d,(74,344),'Avery Morgan ($15) ($17) ...',19,MUT);text(d,(660,344),'→  avery morgan',22,ACC,True)
  labs=['Base REG','Job 1 REG','Job 1 OT','Job 2 REG','Job 2 OT','Base OT'];rates=['$15','$17','$25.50','$19','$28.50','$22.50']
  for i in range(6):
   x=48+i*199;box(d,(x,414,x+181,546));text(d,(x+15,435),labs[i],16,MUT);text(d,(x+15,478),rates[i],28,ACC,True)
  text(d,(52,579),'Rate matching tolerance: ±$0.01. Template rate order is retained.',20,INK,True)
 elif scene==2:
  panel(d,48,274,1184,300,'MULTI-JOB HOUR ALLOCATION','Each source rate is mapped to its corresponding regular or overtime destination.')
  headers=['Source rate','Hours','Classification','Humi destination'];xs=[76,300,480,865]
  for x,h in zip(xs,headers):text(d,(x,362),h,16,MUT,True)
  rows=[('$15.00','32.12','Base regular','Column C'),('$19.00','8.00','Job 2 regular','Column G'),('$28.50','0.27','Job 2 overtime','Column H')]
  for j,row in enumerate(rows):
   yy=405+j*48;d.line((74,yy-8,1200,yy-8),fill=LINE)
   for x,v in zip(xs,row):text(d,(x,yy),v,21,ACC if x==865 else INK,x==865)
   if progress>(j+.2)/3:
    xx=int(720+min(1,(progress-j/3)*3)*100);d.ellipse((xx,yy+4,xx+9,yy+13),fill=ACC)
  text(d,(52,589),'One employee. Several source lines. Correctly separated pay categories.',19,INK,True)
 else:
  panel(d,48,274,760,307,'PAYROLL HUMI','New output workbook • original template columns retained')
  for i,(a,b) in enumerate([('Employee','Avery Morgan'),('Base regular / overtime','32.12  /  0.00'),('Job 1 regular / overtime','0.00  /  0.00'),('Job 2 regular / overtime','8.00  /  0.27')]):
   text(d,(74,370+i*43),a,18,MUT);text(d,(467,370+i*43),b,20,ACC,True)
  panel(d,844,274,388,307,'REVIEW & SAVE','The user remains in control of the output.')
  for i,line in enumerate(['Ordered rate mapping','Multi-line employee handling','Template-preserving output','Ready for payroll review']):text(d,(864,365+i*45),'✓ '+line,17,ACC)
 box(d,(48,626,1232,662),INK,INK);text(d,(72,636),'Excel + VBA  /  Run once, transform the recurring payroll workflow',17,WHITE)
 return im

def overview(key):
 configs={
 'retirement':('Retirement planning, built around the goal.','Contributions, tax, withdrawals and estate targets in one scenario model.'),
 'wealth-transfer':('See which transfers need intervention.','An operational tracker for inbound wires, ownership and business-day ageing.'),
 'profit-loss':('From period data to a management conversation.','Actual versus budget. Profitability. Cost pressure. Monthly and year-to-date views.'),
 'executive-agenda':('Keep unfinished decisions moving.','An executive agenda that carries the right actions into the next meeting.'),
 'data-cleaning':('Make contact data usable again.','A repeatable cleaning and export workflow for inconsistent contact files.')}
 title,sub=configs[key];im,d=base(title,sub)
 if key=='retirement':
  panel(d,48,205,340,405,'ASSUMPTIONS','Age • return • tax • retirement income')
  for i,(a,b) in enumerate([('Current age','25'),('Retirement age','65'),('Return assumption','7%'),('Tax on earnings','18%'),('Estate target','$500,000')]):
   text(d,(70,310+i*51),a,16,MUT);text(d,(275,310+i*51),b,18,INK,True)
  panel(d,414,205,818,405,'SCENARIO PROJECTIONS','Best / likely / worst • lump sums • withdrawals • actuals comparison')
  x0,y0=459,550
  for j,c in enumerate([ACC,'#b78e62','#8b9d96']):
   pts=[(x0+i*22,y0-int((i/32)**(1.7+j*.2)*(215-j*48))) for i in range(33)];d.line(pts,fill=c,width=4)
  for i,(txt,col) in enumerate([('Best',ACC),('Likely','#b78e62'),('Worst','#8b9d96')]):text(d,(470+i*210,568),txt,15,col,True)
 elif key=='profit-loss':
  for i,(a,b,c) in enumerate([('SALES','£3.2m','7.1% above budget'),('PROFIT','£116.8k','24.7% above budget'),('PROFIT MARGIN','3.61%','Budget 3.10%')]):
   x=48+i*399;panel(d,x,205,382,145,a,c);text(d,(x+22,277),b,36,ACC,True)
  panel(d,48,378,756,236,'ACTUAL / BUDGET BY MONTH','Revenue, costs, profit and EBITDA views')
  for i,vals in enumerate([(90,81),(110,100),(120,115),(142,128)]):
   x=106+i*155;d.rectangle((x,590-vals[0],x+38,590),fill=ACC);d.rectangle((x+45,590-vals[1],x+83,590),fill='#a6bcb4');text(d,(x,594),['Jan','Feb','Mar','Apr'][i],13,MUT)
  panel(d,833,378,399,236,'COST VARIANCE','Direct costs • overheads • depreciation')
  for i,a in enumerate(['Cost of sales   +10.3%','Administration   −1.1%','Depreciation   −77.6%']):text(d,(855,472+i*38),a,17,INK)
 elif key=='wealth-transfer':
  for i,(a,b) in enumerate([('TRANSFER REGISTER','Client • advisor • institution'),('BUSINESS-DAY AGEING','Alberta holiday calendar'),('FOLLOW-UP PRIORITY','20 / 30 day thresholds')]):panel(d,48+i*399,205,382,115,a,b)
  panel(d,48,348,1184,267,'AN ACTIONABLE TRANSFER PIPELINE','Formulas, lists and conditional formatting • no VBA required')
  for i,(a,b,c) in enumerate([('REF-001','Awaiting documentation','12 business days'),('REF-002','Follow up with institution','24 business days'),('REF-003','Escalation priority','33 business days')]):
   yy=444+i*49;text(d,(76,yy),a,19,INK,True);text(d,(310,yy),b,19,MUT);text(d,(920,yy),c,18,ACC if i==0 else GOLD,True)
 elif key=='executive-agenda':
  panel(d,48,205,760,405,'WEEKLY EXECUTIVE SYNC','Meeting objective, attendance, discussion time and action ownership')
  for i,(a,b,c) in enumerate([('Budget review','Finance lead','30 min'),('Delivery roadmap','Operations lead','30 min'),('Open actions','Assigned owners','Carry forward')]):
   yy=320+i*82;text(d,(74,yy),a,24,INK,True);text(d,(74,yy+36),b,17,MUT);text(d,(581,yy+15),c,17,ACC)
  panel(d,838,205,394,405,'NEXT WEEK ROLLOVER','Preserve the structure. Continue the work.')
  for i,a in enumerate(['Copy the meeting sheet','Carry unfinished items','Reset discussion checks','Retain charts and layout']):text(d,(860,326+i*59),f'{i+1:02}  '+a,17,ACC,True)
 else:
  steps=[('RAW CONTACTS','Duplicates / inconsistent email fields'),('CLEANING RULES','Normalize / deduplicate / clean email'),('REUSABLE OUTPUT','Cleaned CSV for downstream use')]
  for i,(a,b) in enumerate(steps):
   y=210+i*132;panel(d,48,y,1184,111,a,b);box(d,(1030,y+29,1190,y+77),ACC,ACC);text(d,(1052,y+43),['INPUT','PROCESS','EXPORT'][i],17,WHITE,True)
 return im

for key in ['retirement','wealth-transfer','profit-loss','executive-agenda','data-cleaning']:overview(key).save(OUT/(key+'.png'))
payroll(2).save(OUT/'payroll.png')
if __name__=='__main__':
 fps=24;duration=32
 proc=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(fps),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'payroll-workflow.mp4')],stdin=subprocess.PIPE)
 for n in range(fps*duration):
  scene=min(3,n//(fps*8));local=n%(fps*8);im=payroll(scene,local/(fps*8))
  if scene>0 and local<12:im=Image.blend(payroll(scene-1,1),im,local/12)
  d=ImageDraw.Draw(im);d.rectangle((0,H-4,int(W*(n+1)/(fps*duration)),H),fill=ACC);proc.stdin.write(im.tobytes())
 proc.stdin.close();assert proc.wait()==0
 (OUT/'payroll-captions.vtt').write_text('WEBVTT\n\n00:00.000 --> 00:08.000\nSelect the Restaurant365 export and Humi import template.\n\n00:08.000 --> 00:16.000\nNormalize employee names and parse ordered pay rates, using a one-cent matching tolerance.\n\n00:16.000 --> 00:24.000\nAllocate regular and overtime hours across the correct base and additional job columns.\n\n00:24.000 --> 00:32.000\nReview the new Payroll Humi workbook, with the original template structure preserved, then save.\n')
 print('Rendered six redesigned covers and a 32-second payroll workflow video.')
