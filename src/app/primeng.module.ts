import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [],
  exports: [
    ToastModule,
    OverlayPanelModule,
    InputGroupModule,
    InputGroupAddonModule,
    CardModule,
    CheckboxModule,
    KeyFilterModule,
    TabViewModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    ProgressBarModule,
    RadioButtonModule,
    TableModule,
    MessagesModule,
  ]
})
export class PrimengModule {
}