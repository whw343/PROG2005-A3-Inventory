import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HelpWidgetComponent, HelpTip } from './help-widget.component';

describe('HelpWidgetComponent', () => {
  let component: HelpWidgetComponent;
  let fixture: ComponentFixture<HelpWidgetComponent>;

  const mockTips: HelpTip[] = [
    { title: 'Tip 1', description: 'Description 1', icon: 'information-circle' },
    { title: 'Tip 2', description: 'Description 2', icon: 'help-circle' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpWidgetComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpWidgetComponent);
    component = fixture.componentInstance;
    component.tips = mockTips;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display provided tips', () => {
    expect(component.tips).toEqual(mockTips);
    expect(component.tips.length).toBe(2);
  });

  it('should toggle modal visibility', () => {
    expect(component.isModalOpen).toBeFalse();
    component.openHelp();
    expect(component.isModalOpen).toBeTrue();
    component.closeHelp();
    expect(component.isModalOpen).toBeFalse();
  });

  it('should accept tips as input', () => {
    const newTips: HelpTip[] = [
      { title: 'New Tip', description: 'New description', icon: 'star' },
    ];
    component.tips = newTips;
    expect(component.tips.length).toBe(1);
    expect(component.tips[0].title).toBe('New Tip');
  });
});
