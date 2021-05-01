import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NoificationComponent } from './noification.component';

describe('NoificationComponent', () => {
  let component: NoificationComponent;
  let fixture: ComponentFixture<NoificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoificationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NoificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
