import { NgModule } from '@angular/core';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { KeyFilterModule } from 'primeng/keyfilter';

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


    // SelectButtonModule,
    // FieldsetModule,
    // InputNumberModule,
    // InputTextModule,
    // TabViewModule,
    // ButtonModule,
    // DropdownModule,
    // ProgressBarModule,
    // ScrollPanelModule,
    // DialogModule,
    // BlockUIModule,
    // ToggleButtonModule,
    // InputSwitchModule,
    // RadioButtonModule,
    // FileUploadModule,
    // InputTextareaModule,
  ]
})
export class PrimengModule {
}
