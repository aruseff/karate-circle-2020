import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { MessageService } from 'primeng/api';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PrimengModule } from './primeng.module';
import { WorkoutConfigurationComponent } from './components/workout-configuration/workout-configuration.component';
import { DefaultValueDirective } from './directives/default-value.directive';
import { MaxValueDirective } from './directives/max-value.directive';
import { WorkoutTimerComponent } from './components/workout-timer/workout-timer.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    CountdownTimerComponent,
    NavigationComponent,
    WorkoutConfigurationComponent,
    WorkoutTimerComponent,
    SettingsComponent,
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
