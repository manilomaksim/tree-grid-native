import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppTreeGridComponent } from './components/tree-grid/app-tree-grid.component';
import {
  ContextMenuService,
  EditService,
  ExcelExportService, FreezeService, PdfExportService,
  ResizeService, RowDDService, SelectionService, ToolbarService,
  TreeGridModule
} from '@syncfusion/ej2-angular-treegrid';
import { PageService, SortService, FilterService } from '@syncfusion/ej2-angular-treegrid';
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
  declarations: [
    AppComponent,
    AppTreeGridComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TreeGridModule,
    HttpClientModule,
    ContextMenuModule
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    EditService,
    FreezeService,
    SortService, ResizeService,
    ExcelExportService,
    PdfExportService, ContextMenuService,
    ToolbarService,
    RowDDService,
    SelectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
