import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DivLabelDirective } from './directives/div-label/div-label.directive';
import { InputLabelDirective } from './directives/input-label/input-label.directive';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { MinuteSecondsPipe } from './util/minute-seconds.pipe';
import { MessageService } from 'primeng/api';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PrimengModule } from './primeng.module';
import { WorkoutConfigurationComponent } from './components/workout-configuration/workout-configuration.component';
import { DefaultValueDirective } from './directives/default-value.directive';
import { MaxValueDirective } from './directives/max-value.directive';

@NgModule({
  declarations: [
    AppComponent,
    DivLabelDirective,
    InputLabelDirective,
    CountdownTimerComponent,
    MinuteSecondsPipe,
    NavigationComponent,
    WorkoutConfigurationComponent,
    DefaultValueDirective,
    MaxValueDirective,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    PrimengModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
