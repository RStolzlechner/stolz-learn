using Dapper;
using StolzLearn.Core.Models;
using StolzLearn.Core.Postgres;

namespace StolzLearn.Core.Repositories;

public class QuestionnaireRepository(IDbConnection connection) : IQuestionnaireRepository
{
    public async Task<Guid> Insert(Questionnaire questionnaire)
    {
        //questionnaire
        var qSql = $"""
                   INSERT INTO questionnaire (course_id) VALUES (@{nameof(Questionnaire.CourseId)}) RETURNING id;
                   """;
        var qId = await connection.QuerySingleAsync<Guid>(qSql, new DynamicParameters(questionnaire));

        //answers
        var answers = questionnaire.Answers.Select(a => new Answer()
            { QuestionnaireId = qId, QuestionId = a.QuestionId, GivenAnswer = a.GivenAnswer, IsCorrect = a.IsCorrect }).ToList();
        var aSql = $"""
                   INSERT INTO answer (questionnaire_id, question_id, given_answer, is_correct) 
                   VALUES (@{nameof(Answer.QuestionnaireId)}, @{nameof(Answer.QuestionId)}, 
                           @{nameof(Answer.GivenAnswer)}, @{nameof(Answer.IsCorrect)});
                   """;
        await connection.ExecuteWithObjectsAsync(aSql, answers);

        return qId;
    }
}