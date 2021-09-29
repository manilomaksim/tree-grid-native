import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTreeGridComponent } from './app-tree-grid.component';

describe('TreeGridComponent', () => {
  let component: AppTreeGridComponent;
  let fixture: ComponentFixture<AppTreeGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTreeGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTreeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
