import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentoFormComponent } from './orcamento-form.component';

describe('OrcamentoFormComponent', () => {
  let component: OrcamentoFormComponent;
  let fixture: ComponentFixture<OrcamentoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcamentoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrcamentoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
