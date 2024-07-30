import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { Subscription } from 'rxjs';
import { CoursesRoutes } from '../../app.routes';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-base',
  template: `<router-outlet />`,
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class CourseBaseComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly routingService = inject(RoutingService);
  private readonly courseService = inject(CourseService);

  private routeSubscription!: Subscription;

  async ngOnInit() {
    await this.courseService.loadCourses({ isArchived: false });
    this.routeSubscription = this.route.paramMap.subscribe((pm) => {
      const courseId = pm.get(CoursesRoutes.courseId);
      this.routingService.setCourseId(courseId);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.routingService.setCourseId(null);
  }
}
