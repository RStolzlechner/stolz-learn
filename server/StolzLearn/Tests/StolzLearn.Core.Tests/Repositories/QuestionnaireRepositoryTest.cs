using Dapper;
using StolzLearn.Core.Models;
using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Tests.Repositories;

public class QuestionnaireRepositoryTest : PostgresIntegrationTest
{
    [Test]
    public async Task Insert_ShouldInsert()
    {
        var courseId = await InsertCourse();
        var question1Id = await InsertQuestion(courseId);
        var question2Id = await InsertQuestion(courseId);

        var answers = new List<Answer>()
        {
            new() { QuestionId = question1Id, GivenAnswer = "a1", IsCorrect = true },
            new() { QuestionId = question2Id, GivenAnswer = "a2", IsCorrect = false }
        };
        var questionnaire = new Questionnaire() { CourseId = courseId, Answers = answers };

        var sut = new QuestionnaireRepository(DbConnection);
        
        var questionnaireId = await sut.Insert(questionnaire);
        
        var answerSql = """
                        SELECT * FROM answer WHERE questionnaire_id = @QuestionnaireId;
                        """;
        var answerParams = new DynamicParameters(new { QuestionnaireId = questionnaireId });
        var answersInDb = (await DbConnection.QueryAsync<Answer>(answerSql, answerParams)).ToList();
        
        Assert.That(answersInDb.Count, Is.EqualTo(2));
        Assert.That(answersInDb[0].QuestionId, Is.EqualTo(question1Id));
        Assert.That(answersInDb[1].QuestionId, Is.EqualTo(question2Id));
    }
}