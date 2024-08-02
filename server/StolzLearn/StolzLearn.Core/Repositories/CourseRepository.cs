using Dapper;
using StolzLearn.Core.Models;
using StolzLearn.Core.Postgres;

namespace StolzLearn.Core.Repositories;

public class CourseRepository(IDbConnection connection) : ICourseRepository
{
    public Task<IEnumerable<Guid>> SelectIdsByQuery(CourseQuery query)
    {
        var sql = $"SELECT id FROM course WHERE in_archive = @{nameof(query.IsArchived)}";
        var p = new DynamicParameters(query);
        
        return connection.QueryAsync<Guid>(sql, p);
    }

    public Task<IEnumerable<Course>> SelectByIds(IEnumerable<Guid> ids)
    {
        var idList = ids.ToList();
        var sql = $"SELECT * FROM course WHERE id = ANY(@idList)";
        var p = new DynamicParameters(new { idList });
        
        return connection.QueryAsync<Course>(sql, p);
    }

    public Task<Guid> Insert(Course course)
    {
        var sql = $@"INSERT INTO course (number, name) 
                     VALUES (@{nameof(course.Number)}, 
                             @{nameof(course.Name)})
                        RETURNING id";
        var p = new DynamicParameters(course);
        
        return connection.QuerySingleAsync<Guid>(sql, p);
    }

    public Task Update(Course course)
    {
        var sql = $@"UPDATE course SET  number = @{nameof(course.Number)}, 
                                        name = @{nameof(course.Name)},
                                        in_archive = @{nameof(course.InArchive)}
                     WHERE id = @{nameof(course.Id)}";
        var p = new DynamicParameters(course);
        
        return connection.ExecuteAsync(sql, p);
    }
}