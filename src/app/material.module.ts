import { NgModule } from '@angular/core';

import {
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatTabsModule,
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

const MatModules = [
  MatToolbarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatTabsModule,
];

@NgModule({
  imports: [
    ...MatModules,
    FlexLayoutModule
  ],
  exports: [
    ...MatModules,
    FlexLayoutModule
  ],
  declarations: []
})
export class CustomMaterialModule {
}
