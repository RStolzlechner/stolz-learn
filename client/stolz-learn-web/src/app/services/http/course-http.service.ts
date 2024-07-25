import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpUrl } from '../../constants/http-url.const';
import { GUID } from '../../types/guid.type';
import { CourseStatisticModel } from '../../models/course-statistic.model';
import { Course } from '../../models/course.model';
import { CourseQuery } from '../../models/course-query.model';

@Injectable({ providedIn: 'root' })
export class CourseHttpService {
  private httpClient = inject(HttpClient);

  public getCourseStatistic(id: GUID) {
    const url = `${httpUrl}course/statistic/${id}`;
    return this.httpClient.get<CourseStatisticModel>(url);
  }

  public selectIdsByQuery(query: CourseQuery) {
    const url = `${httpUrl}course/ids`;
    return this.httpClient.post<GUID[]>(url, query);
  }

  public selectByIds(ids: GUID[]) {
    const url = `${httpUrl}course/get-by-ids`;
    return this.httpClient.post<Course[]>(url, ids);
  }

  public archiveCourse(id: GUID) {
    const url = `${httpUrl}course/archive/${id}`;
    return this.httpClient.put(url, {});
  }

  public restoreCourse(id: GUID) {
    const url = `${httpUrl}course/restore/${id}`;
    return this.httpClient.put(url, {});
  }

  public createCourse(course: Course) {
    const url = `${httpUrl}course`;
    return this.httpClient.post<GUID>(url, course);
  }

  public updateCourse(course: Course) {
    const url = `${httpUrl}course`;
    return this.httpClient.put(url, course);
  }
}
