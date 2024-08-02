using StolzLearn.Core.Models;

namespace StolzLearn.Core.Repositories;

public interface ICourseRepository
{
    //Select
    Task<IEnumerable<Guid>> SelectIdsByQuery(CourseQuery query);
    Task<IEnumerable<Course>> SelectByIds(IEnumerable<Guid> ids);
    
    //Insert
    Task<Guid> Insert(Course course);
    
    //Update
    Task Update(Course course);
}