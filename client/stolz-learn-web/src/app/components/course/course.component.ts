import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course',
  template: `<div>Hi From Course</div>`,
  standalone: true,
  imports: [CommonModule],
})
export class CourseComponent {}
