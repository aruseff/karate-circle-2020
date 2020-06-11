import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNg Modules
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { TabViewModule } from 'primeng/tabview';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DivLabelDirective } from './directives/div-label/div-label.directive';
import { InputLabelDirective } from './directives/input-label/input-label.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MainPanelComponent,
    DivLabelDirective,
    InputLabelDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,

    // PrimeNg Modules
    SelectButtonModule,
    CardModule,
    FieldsetModule,
    InputNumberModule,
    InputTextModule,
    TabViewModule,
    CodeHighlighterModule,
    ButtonModule,
    DropdownModule,
    ProgressBarModule,
    CheckboxModule,
    ScrollPanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
