using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Tests.Repositories;

public class AnswerRepositoryTest : PostgresIntegrationTest
{
    [Test]
    public async Task SelectByCourseId_ShouldSelectAnswers()
    {
        var sut = new AnswerRepository(DbConnection);
        
        var c1Id = await InsertCourse();
        var c2Id = await InsertCourse();
        
        var q1Id = await InsertQuestion(c1Id);
        var q2Id = await InsertQuestion(c2Id);
        
        var qn1Id = await InsertQuestionnaire(c1Id);
        var qn2Id = await InsertQuestionnaire(c2Id);

        var a1Id = await InsertAnswer(q1Id, qn1Id);
        var a2Id = await InsertAnswer(q1Id, qn1Id);
        await InsertAnswer(q2Id, qn2Id);
        
        var answers = (await sut.SelectByCourseId(c1Id)).ToList();
        
        Assert.That(answers.Count, Is.EqualTo(2));
        Assert.That(answers[0].Id, Is.EqualTo(a1Id));
        Assert.That(answers[1].Id, Is.EqualTo(a2Id));
    }
}