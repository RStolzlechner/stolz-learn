using System.Text;
using Dapper;
using StolzLearn.Core.Models;
using StolzLearn.Core.Postgres;

namespace StolzLearn.Core.Repositories;

public class QuestionRepository(IDbConnection connection) : IQuestionRepository
{
    public async Task<IEnumerable<Guid>> SelectIdsByQuery(QuestionQuery query)
    {
        var sql = new StringBuilder($"SELECT DISTINCT id, date_create FROM question WHERE course_id = @{nameof(query.CourseId)} AND NOT deleted ORDER BY date_create");
        if (query.Limit > 0)
        {
            sql.Append($" LIMIT @{nameof(query.Limit)}");
        }
        
        var ids = await connection.QueryAsync<Guid>(sql.ToString(), new DynamicParameters(query));

        return query.RandomOrder ?
            //random ids
            ids.OrderBy(x => Guid.NewGuid()) : ids;
    }

    public Task<IEnumerable<Question>> SelectByCourseId(Guid courseId)
    {
        var sql = """
                  SELECT * FROM question WHERE course_id = @courseId AND NOT deleted ORDER BY date_create;
                  """;
        var p = new DynamicParameters(new { courseId });
        
        return connection.QueryAsync<Question>(sql, p);
    }

    public Task<IEnumerable<Question>> SelectByIds(IEnumerable<Guid> ids)
    {
        var idList = ids.ToList();
        var sql = "SELECT * FROM question WHERE id = ANY(@idList)";
        return connection.QueryAsync<Question>(sql, new DynamicParameters(new { idList }));
    }

    public Task<Guid> Insert(Question question)
    {
        var insertSql = $"""
                        INSERT INTO question (course_id, question_text, correct_answer) 
                        VALUES (@{nameof(question.CourseId)}, @{nameof(question.QuestionText)}, @{nameof(question.CorrectAnswer)})
                        RETURNING id;
                        """;
        return connection.QuerySingleAsync<Guid>(insertSql, new DynamicParameters(question));
    }

    public Task Update(Question question)
    {
        var updateSql = $"""
                         UPDATE question SET question_text = @{nameof(question.QuestionText)}, 
                                             correct_answer = @{nameof(question.CorrectAnswer)},
                                             deleted = @{nameof(question.Deleted)}
                         WHERE id = @{nameof(question.Id)};
                         """;
        return connection.ExecuteAsync(updateSql, new DynamicParameters(question));
    }
}