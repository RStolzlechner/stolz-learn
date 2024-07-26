import { inject, Injectable, signal } from '@angular/core';
import { GUID } from '../types/guid.type';
import { CourseStatisticModel } from '../models/course-statistic.model';
import { firstValueFrom } from 'rxjs';
import { CourseHttpService } from './http/course-http.service';
import { StatusMessageService } from './status-message.service';
import { ErrorMessages } from '../translations/error-messages.translations';
import { CourseQuery } from '../models/course-query.model';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private courseHttpService = inject(CourseHttpService);
  private statusMessageService = inject(StatusMessageService);

  private _courseQuery = signal<CourseQuery | null>(null);
  private _courseIds = signal<GUID[]>([]);
  private _courses = signal<Course[]>([]);
  public courses = this._courses.asReadonly();

  public async getCourseStatistic(
    id: GUID,
  ): Promise<CourseStatisticModel | null> {
    try {
      return await firstValueFrom(
        this.courseHttpService.getCourseStatistic(id),
      );
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.queryCourseStatistics,
        type: 'error',
      });
      return null;
    }
  }

  public async loadCourses(query: CourseQuery) {
    try {
      const ids = await firstValueFrom(
        this.courseHttpService.selectIdsByQuery(query),
      );

      let courses: Course[] = [];
      if (ids.length > 0) {
        courses = await firstValueFrom(this.courseHttpService.selectByIds(ids));
      }

      this._courseQuery.set(query);
      this._courseIds.set(ids);
      this._courses.set(courses);
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.loadCourses,
        type: 'error',
      });

      this._courseQuery.set(null);
      this._courseIds.set([]);
      this._courses.set([]);
    }
  }

  public async archiveCourse(id: GUID) {
    try {
      await firstValueFrom(this.courseHttpService.archiveCourse(id));

      //don't call server; delete this when signal-r update is implemented
      this._courseIds.update((ids) => [...ids.filter((i) => i !== id)]);
      this._courses.update((cs) => [...cs.filter((c) => c.id !== id)]);
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.archiveCourses,
        type: 'error',
      });
    }
  }

  public async restoreCourse(id: GUID) {
    try {
      await firstValueFrom(this.courseHttpService.restoreCourse(id));

      //don't call server; delete this when signal-r update is implemented
      this._courseIds.update((ids) => [...ids.filter((i) => i !== id)]);
      this._courses.update((cs) => [...cs.filter((c) => c.id !== id)]);
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.restoreCourses,
        type: 'error',
      });
    }
  }

  public async createCourse(course: Course) {
    try {
      const id = await firstValueFrom(
        this.courseHttpService.createCourse(course),
      );
      course.id = id;

      //don't call server; delete this when signal-r update is implemented
      this._courseIds.update((ids) => [...ids, id]);
      this._courses.update((cs) => [...cs, course]);

      return id;
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.createCourse,
        type: 'error',
      });
      return undefined;
    }
  }

  public async updateCourse(course: Course) {
    try {
      await firstValueFrom(this.courseHttpService.updateCourse(course));

      //don't call server; delete this when signal-r update is implemented
      this._courses.update((cs) => {
        const ix = cs.findIndex((c) => c.id === course.id);
        if (ix < 0) {
          return cs;
        }
        return [...cs.slice(0, ix), course, ...cs.slice(ix + 1)];
      });
    } catch (error) {
      console.error(error);
      this.statusMessageService.addMessage({
        message: ErrorMessages.updateCourse,
        type: 'error',
      });
    }
  }
}
