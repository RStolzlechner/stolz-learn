using StolzLearn.Core.Models;
using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Services;

public class CourseService(ICourseRepository courseRepository) : ICourseService
{
    public Task<IEnumerable<Guid>> SelectIdsByQuery(CourseQuery query) => courseRepository.SelectIdsByQuery(query);

    public Task<IEnumerable<Course>> SelectByIds(IEnumerable<Guid> ids) => courseRepository.SelectByIds(ids);

    public Task<Guid> Insert(Course course, bool inTransaction = true)
    {
        throw new NotImplementedException();
    }

    public Task Update(Course course, bool inTransaction = true)
    {
        throw new NotImplementedException();
    }
}