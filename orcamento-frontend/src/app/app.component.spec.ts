import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule // Para testar componentes com diretivas de roteamento
      ],
      // Caso precise mockar providers:
      // providers: [
      //   { provide: SomeService, useClass: MockService }
      // ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecção inicial de mudanças
  });

  afterEach(() => {
    // Limpeza após cada teste
    fixture.destroy();
  });

  it('deve criar o aplicativo corretamente', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter o título configurado como "orcamento-frontend"', () => {
    expect(component.title).toBe('orcamento-frontend');
  });

  describe('Renderização do Template', () => {
    it('deve exibir o título na barra de navegação', () => {
      const compiled = fixture.nativeElement;
      const navTitle = compiled.querySelector('.navbar-brand');
      expect(navTitle?.textContent).toContain('orcamento-frontend');
    });

    it('deve conter o router-outlet', () => {
      const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });

    it('deve ter uma barra de navegação', () => {
      const nav = fixture.debugElement.query(By.css('nav'));
      expect(nav).toBeTruthy();
    });
  });

  describe('Comportamento', () => {
    it('deve atualizar o DOM quando o título é alterado', () => {
      component.title = 'Novo Título';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const titleElement = compiled.querySelector('.navbar-brand');
      expect(titleElement.textContent).toContain('Novo Título');
    });
  });
});
