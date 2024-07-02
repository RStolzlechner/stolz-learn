using StolzLearn.Core.Models;

namespace StolzLearn.Core.Repositories;

public class CourseRepository : ICourseRepository
{
    public Task<IEnumerable<Guid>> SelectIdsByQuery(CourseQuery query)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Course>> SelectByIds(IEnumerable<Guid> ids)
    {
        throw new NotImplementedException();
    }

    public Task<Guid> Insert(Course course)
    {
        throw new NotImplementedException();
    }

    public Task Update(Course course)
    {
        throw new NotImplementedException();
    }
}