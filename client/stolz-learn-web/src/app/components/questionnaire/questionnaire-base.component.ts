import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-questionnaire-base',
  template: `<router-outlet />`,
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class QuestionnaireBaseComponent {}
