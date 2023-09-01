import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetSucessComponent } from './reset-sucess.component';

describe('ResetSucessComponent', () => {
  let component: ResetSucessComponent;
  let fixture: ComponentFixture<ResetSucessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetSucessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetSucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
