import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoHotelesComponent } from './catalogo-hoteles.component';

describe('CatalogoHotelesComponent', () => {
  let component: CatalogoHotelesComponent;
  let fixture: ComponentFixture<CatalogoHotelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoHotelesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoHotelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
