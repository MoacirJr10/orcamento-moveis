import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentoFromComponent } from './orcamento-from.component';

describe('OrcamentoFromComponent', () => {
  let component: OrcamentoFromComponent;
  let fixture: ComponentFixture<OrcamentoFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcamentoFromComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrcamentoFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
