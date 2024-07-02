using StolzLearn.Core.Models;

namespace StolzLearn.Core.Services;

public interface ICourseService
{
    Task<IEnumerable<Guid>> SelectIdsByQuery(CourseQuery query);
    Task<IEnumerable<Course>> SelectByIds(IEnumerable<Guid> ids);
    Task<Guid> Insert(Course course, bool inTransaction = true);
    Task Update(Course course, bool inTransaction = true);
}