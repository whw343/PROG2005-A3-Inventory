import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Tab4Page } from './tab4.page';

describe('Tab4Page', () => {
  let component: Tab4Page;
  let fixture: ComponentFixture<Tab4Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tab4Page],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 6 security topics', () => {
    expect(component.securityTopics.length).toBe(6);
  });

  it('should include HTTPS topic', () => {
    const httpsTopic = component.securityTopics.find(t => t.title.includes('HTTPS'));
    expect(httpsTopic).toBeDefined();
    expect(httpsTopic!.practices.length).toBeGreaterThan(0);
  });

  it('should include input validation topic', () => {
    const validationTopic = component.securityTopics.find(t => t.title.includes('Validation'));
    expect(validationTopic).toBeDefined();
    expect(validationTopic!.color).toBe('success');
  });

  it('should include no local storage topic', () => {
    const storageTopic = component.securityTopics.find(t => t.title.includes('Local'));
    expect(storageTopic).toBeDefined();
  });

  it('should include Android permissions topic', () => {
    const androidTopic = component.securityTopics.find(t => t.title.includes('Android'));
    expect(androidTopic).toBeDefined();
  });

  it('should include Capacitor security topic', () => {
    const capTopic = component.securityTopics.find(t => t.title.includes('Capacitor'));
    expect(capTopic).toBeDefined();
  });

  it('should include error handling topic', () => {
    const errorTopic = component.securityTopics.find(t => t.title.includes('Error'));
    expect(errorTopic).toBeDefined();
  });

  it('should have 4 best practices', () => {
    expect(component.bestPractices.length).toBe(4);
  });

  it('should include protected item rule in best practices', () => {
    const protectedRule = component.bestPractices.find(p => p.title.includes('Protected'));
    expect(protectedRule).toBeDefined();
    expect(protectedRule!.description).toContain('Laptop');
  });

  it('should have 5 references', () => {
    expect(component.references.length).toBe(5);
  });

  it('should include OWASP reference', () => {
    const owasp = component.references.find(r => r.title.includes('OWASP'));
    expect(owasp).toBeDefined();
    expect(owasp!.url).toContain('owasp.org');
  });

  it('should open link in new tab with security attributes', () => {
    spyOn(window, 'open');
    component.openLink('https://example.com');
    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });

  it('should have each topic with icon, color, description, and practices', () => {
    component.securityTopics.forEach(topic => {
      expect(topic.icon).toBeTruthy();
      expect(topic.color).toBeTruthy();
      expect(topic.description.length).toBeGreaterThan(0);
      expect(topic.practices.length).toBeGreaterThan(0);
    });
  });
});
