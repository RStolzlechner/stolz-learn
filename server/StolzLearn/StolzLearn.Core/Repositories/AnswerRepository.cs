using Dapper;
using StolzLearn.Core.Models;
using StolzLearn.Core.Postgres;

namespace StolzLearn.Core.Repositories;

public class AnswerRepository(IDbConnection connection) : IAnswerRepository
{
    public Task<IEnumerable<Answer>> SelectByCourseId(Guid courseId)
    {
        var sql = $@"SELECT a.* FROM answer a JOIN question q ON q.id = a.question_id WHERE q.course_id = @courseId ORDER BY a.date_create";
        var p = new DynamicParameters(new { courseId });

        return connection.QueryAsync<Answer>(sql, p);
    }

    public Task<IEnumerable<Answer>> SelectByQuestionIds(IEnumerable<Guid> questionIds)
    {
        var idList = questionIds.ToList();
        var sql = $@"SELECT a.* FROM answer a WHERE a.question_id = ANY(@idList) ORDER BY a.date_create";
        var p = new DynamicParameters(new { idList });
        
        return connection.QueryAsync<Answer>(sql, p);
    }
}