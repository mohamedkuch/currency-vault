import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyListPage } from './currency-list.page';

describe('CurrencyListPage', () => {
  let component: CurrencyListPage;
  let fixture: ComponentFixture<CurrencyListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CurrencyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
