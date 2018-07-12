import { NgModule } from '@angular/core';
import { LogOutputComponent } from '../dashboard/log-output/log-output.component';
import { CommonModule } from '@angular/common';

const SHARED_COMPONENTS = [LogOutputComponent];
const SHARED_MODULES = [CommonModule];

@NgModule({
  declarations: SHARED_COMPONENTS,
  imports: SHARED_MODULES,
  exports: SHARED_COMPONENTS
})
export class SharedModule {}
