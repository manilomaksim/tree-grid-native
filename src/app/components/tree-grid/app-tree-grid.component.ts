import { Component, Inject, OnInit } from '@angular/core';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import {
  EditSettingsModel,
  RowPosition,
  SelectionSettingsModel
} from '@syncfusion/ej2-treegrid';
import { DOCUMENT } from '@angular/common';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
import {
  TreeGrid,
  Resize,
  Edit,
  RowDD,
  ContextMenu,
  Sort
} from '@syncfusion/ej2-treegrid';
import sampleData from 'sample.data';

TreeGrid.Inject(Resize, Edit, RowDD, ContextMenu, Sort);

type PasteMode = 'copy' | 'cut' | null;

@Component({
  selector: 'app-tree-grid',
  templateUrl: './app-tree-grid.component.html',
  styleUrls: ['./app-tree-grid.component.css'],
})
export class AppTreeGridComponent implements OnInit {

  public treeGridObj: TreeGrid | undefined;
  public readonly editSettings: EditSettingsModel  = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Row'
  };
  public readonly selectionSetting: SelectionSettingsModel = { type: 'Multiple', mode: 'Row' };
  public readonly contextMenuItems: Object[]  =  [
    'AddRow',
    'Edit',
    'Delete',
    { text: 'Font size',
      target: '.e-gridheader',
      id: 'fontSize',
      items: [10, 12, 14, 16].map((item) => ({ text: `${item}px`, id: `fontSize_${item}px` }))
    },
    {
      text: 'Font color',
      target: '.e-gridheader',
      id: 'color',
      items: ['Lightblue', 'Red', 'Green', 'Black'].map((item) => ({ text: item, id: `color_${item}` }))
    },
    {
      text: 'Background color',
      target: '.e-gridheader',
      id: 'backgroundColor',
      items: ['Lightblue', 'Red', 'Green', 'Black'].map((item) => ({ text: item, id: `backgroundColor_${item}` }))
    },
    {
      text: 'Alignment',
      target: '.e-gridheader',
      id: 'text-align',
      items: ['Left', 'Right', 'Center'].map((item) => ({ text: item, id: `text-align_${item}` }))
    },
    {
      text: 'Text wrap',
      target: '.e-gridheader',
      id: 'overflowWrap',
      items: ['normal', 'break-word', 'anywhere'].map((item) => ({ text: item, id: `overflowWrap_${item}` }))
    },
    {
      text: 'Min width',
      target: '.e-gridheader',
      id: 'minWidth',
      items: [50, 100, 150, 200].map((item) => ({ text: item, id: `minWidth_${item}` }))
    },
    {
      text: 'Default',
      target: '.e-gridheader',
      id: 'default',
    },
    { text: 'Freeze/unfreeze',
      target: '.e-gridheader',
      id: 'freezing',
    },
    { text: 'Copy',
      target: '.e-content',
      id: 'copy',
    },
    { text: 'Cut',
      target: '.e-content',
      id: 'cut',
    },
    { text: 'Paste',
      target: '.e-content',
      id: 'paste',
      items: [
        {
          text: 'Above',
          id: 'paste_above',
        },
        {
          text: 'Below',
          id: 'paste_below',
        },
        {
          text: 'Child',
          id: 'paste_child'
        }
      ]
    }
  ];
  public minWidths: Record<string, number> = {};
  public hiddenColumns: string[] = [];
  public frozenColumns: number = 0;

  private readonly CONFIGURABLE_PROPS: string[] = [
    'fontSize', 'color', 'backgroundColor', 'textAlign', 'overflowWrap', 'minWidth'
  ];
  private contextMenuColindex: number | null = null;
  private contextMenuRowIndex: number | null = null;
  private itemsToPast: any[] = []
  private pasteMode: PasteMode = null;

  constructor(@Inject(DOCUMENT) private document: Document)
  { }

  ngOnInit() {
    this.treeGridObj = new TreeGrid({
      dataSource: sampleData,
      allowResizing: true,
      allowSorting: true,
      allowFiltering: true,
      allowTextWrap: true,
      allowReordering: true,
      allowRowDragAndDrop: true,
      selectionSettings: this.selectionSetting,
      frozenColumns: this.frozenColumns,
      childMapping: 'subtasks',
      treeColumnIndex: 1,
      editSettings: this.editSettings,
      contextMenuItems: this.contextMenuItems,
      columns: [
        {
          field: 'taskID',
          headerText: 'Task ID',
          width: 80,
          isPrimaryKey: true,
          textAlign: 'Right',
          editType: 'numericedit'
        },
        { field: 'taskName', headerText: 'Task Name', width: 190 },
        {
          field: 'startDate',
          headerText: 'Start Date',
          format: 'yMd',
          width: 90,
          editType: 'datepickeredit',
          textAlign: 'Right',
        },
        {
          field: 'endDate',
          headerText: 'End Date',
          format: 'yMd',
          width: 90,
          editType: 'datepickeredit',
          textAlign: 'Right',
        },
        {
          field: 'duration',
          headerText: 'Duration',
          width: 85,
          textAlign: 'Right',
          editType: 'numericedit',
          edit: { params: { format: 'n' } },
        },
        { field: 'priority', headerText: 'Priority', width: 80 },
      ],
      rowSelected: (args) => this.rowSelecting(args),
      contextMenuClick: (args) => this.contextMenuClick(args),
      contextMenuOpen: (args) => this.contextMenuOpen(args)
    });

    this.treeGridObj.appendTo('#TreeGrid');
  }

  get contextMenuCells(): NodeListOf<HTMLElement> {
    return this.document.querySelectorAll(`[aria-colindex="${this.contextMenuColindex}"]:not(th)`);
  }

  toggleColVisibility(col: string): void {
    if (this.isColHidden(col)) {
      this.treeGridObj?.showColumns(col);
      this.hiddenColumns = this.hiddenColumns.filter((item) => {
        return item !== col;
      });
    } else {
      this.treeGridObj?.hideColumns(col);
      this.hiddenColumns = [...this.hiddenColumns, col];
    }
  }

  isColHidden(col: string): boolean {
    return this.hiddenColumns.includes(col);
  }

  private setPropsToContextMenuCells(prop: string, value: string | null): void {
    const idx = this.contextMenuColindex;

    if (prop === 'minWidth' && idx) {
      value
        ? this.minWidths = { ...this.minWidths, [idx]: value }
        : delete this.minWidths[idx];
    }
    // @ts-ignore
    this.contextMenuCells.forEach(item => (item as HTMLElement).style[prop] = value)
  }

  private toggleRowToPasteCls(flag: boolean): void {
    if (flag) {
      this.toggleRowToPasteCls(false);
    }
    const cls = 'row-to-paste';
    const selectorPostfix = flag ? '[aria-selected="true"]' : `.${cls}`;
    const els = this.document.querySelectorAll(`tr${selectorPostfix}`);
    els.forEach((item) => {
      flag ? item.classList.add(cls) : item.classList.remove(cls)
    });
  }

  contextMenuClick(args?: MenuEventArgs): void {
    if (!this.treeGridObj || !args?.item?.id) {
      return;
    }

    const { id } = args.item;

    if (id === 'freezing') {
      const newFrozenColumns = (this.contextMenuColindex || 0) + 1;
      this.frozenColumns = newFrozenColumns === this.frozenColumns ? 0 : newFrozenColumns;
      return;
    }

    if (id === 'default') {
      this.CONFIGURABLE_PROPS.forEach((prop) => {
        this.setPropsToContextMenuCells(prop, null);
      })
      return;
    }

    if (['copy', 'cut'].includes(id)) {
      this.itemsToPast = this.treeGridObj?.getSelectedRecords().filter(elem => !('expanded' in elem));
      this.toggleRowToPasteCls(true);
      this.pasteMode = id as PasteMode;
    }

    if (['paste_above', 'paste_below', 'paste_child'].includes(id) && this.contextMenuRowIndex) {
      const [, position] = id.split('_');
      const fromIndexes = this.itemsToPast.map(({ index }) => index);
      if (this.pasteMode === 'copy'){
        const pos = {
          above: 'Above',
          below: 'Below'
        }[position] || 'Child';

        for(let i = this.itemsToPast.length - 1; i >= 0; i--) {
          this.treeGridObj.addRecord(this.itemsToPast[i], this.contextMenuRowIndex, pos as RowPosition);
        }
      }

      else if (this.pasteMode === 'cut') {
        this.treeGridObj.reorderRows(fromIndexes, Number(this.contextMenuRowIndex), position);
      }

      this.toggleRowToPasteCls(false);
      return;
    }

    const [type, value] = id.split('_');
    this.setPropsToContextMenuCells(type, value);
  }

  private adjustMenuItemsVisibility(): void {
    const isParentClicked = this.treeGridObj
      ?.getSelectedRecords()
      .some((item: any) => item.hasChildRecords);

    const setDisplay = (selector: string, value: string): void => {
      const el = (this.document.querySelector(selector) as HTMLElement);
      if (el) {
        el.style.display = value;
      }
    }

    ['#copy', '#cut', '#paste_above', '#paste_below']
      .map((item) => `li${item}`)
      .forEach((selector) => setDisplay(selector, isParentClicked ? 'none' : 'block'));

    setDisplay('li#paste_child', isParentClicked ? 'block' : 'none');
  }

  contextMenuOpen(arg?: BeforeOpenCloseEventArgs): void{
    this.adjustMenuItemsVisibility();

    if(arg){
      const elem: Element = arg.event.target as Element;
      const targetRow = elem.closest('.e-row')
      const colindex = elem.closest('.e-headercell')?.getAttribute('aria-colindex')
      const rowindex = targetRow?.getAttribute('aria-rowindex');

      if(colindex){
        this.contextMenuColindex = Number(colindex)
      }
      if(rowindex) {
        this.contextMenuRowIndex = Number(rowindex);
      }
    }
  }

  rowSelecting(event: any): void {
    const elem: Element = event.row as Element;
    if(elem && elem.getAttribute && elem?.getAttribute('aria-expanded')) {
      elem.setAttribute('aria-selected', 'false')
    }
  }
}
