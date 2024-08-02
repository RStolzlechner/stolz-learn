using Dapper;
using StolzLearn.Core.Models;
using StolzLearn.Core.Repositories;

namespace StolzLearn.Core.Tests.Repositories;

public class QuestionRepositoryTest : PostgresIntegrationTest
{
    [Test]
    public async Task SelectIdsByQuery_ShouldSelectIdsInCourseAndInOrder()
    {
        var courseId = await InsertCourse();
        var q1 = await InsertQuestion(courseId);
        var q2 = await InsertQuestion(courseId);
        var q3 = await InsertQuestion(courseId);
        
        var anotherCourseId = await InsertCourse();
        await InsertQuestion(anotherCourseId);

        var sut = new QuestionRepository(DbConnection);
        
        var query = new QuestionQuery
        {
            CourseId = courseId
        };
        
        var ids = (await sut.SelectIdsByQuery(query)).ToList();
        
        Assert.That(ids.Count(), Is.EqualTo(3));
        Assert.That(ids.ElementAt(0), Is.EqualTo(q1));
        Assert.That(ids.ElementAt(1), Is.EqualTo(q2));
        Assert.That(ids.ElementAt(2), Is.EqualTo(q3));
    }
    
    [Test]
    public async Task SelectIdsByQuery_ShouldSelectIdsInCourseWithLimit()
    {
        var courseId = await InsertCourse();
        var q1 = await InsertQuestion(courseId);
        var q2 = await InsertQuestion(courseId);
        var q3 = await InsertQuestion(courseId);
        
        var sut = new QuestionRepository(DbConnection);
        
        var query = new QuestionQuery
        {
            CourseId = courseId,
            Limit = 2
        };
        
        var ids = (await sut.SelectIdsByQuery(query)).ToList();
        
        Assert.That(ids.Count(), Is.EqualTo(2));
    }
    
    [Test]
    public async Task SelectIdsByQuery_ShouldNotSelectDeletedQuestions()
    {
        var courseId = await InsertCourse();
        var q1 = await InsertQuestion(courseId);
        var q2 = await InsertQuestion(courseId, "a", "b", true);
        
        var sut = new QuestionRepository(DbConnection);
        
        var query = new QuestionQuery
        {
            CourseId = courseId,
        };
        
        var ids = (await sut.SelectIdsByQuery(query)).ToList();
        
        Assert.That(ids.Count(), Is.EqualTo(1));
    }
    
    [Test]
    public async Task SelectByCourseId_ShouldSelectQuestions()
    {
        var courseId = await InsertCourse();
        await InsertQuestion(courseId, "a name");
        await InsertQuestion(courseId, "second name");
        await InsertQuestion(courseId, "and the third one");
        
        var sut = new QuestionRepository(DbConnection);
        
        var questions = (await sut.SelectByCourseId(courseId)).ToList();
        
        Assert.That(questions.Count(), Is.EqualTo(3));
        Assert.That(questions.ElementAt(0).QuestionText, Is.EqualTo("a name"));
        Assert.That(questions.ElementAt(1).QuestionText, Is.EqualTo("second name"));
        Assert.That(questions.ElementAt(2).QuestionText, Is.EqualTo("and the third one"));
    }

    [Test]
    public async Task SelectByIds_ShouldSelectQuestions()
    {
        var courseId = await InsertCourse();
        var q1 = await InsertQuestion(courseId, "a name");
        var q2 = await InsertQuestion(courseId, "second name");
        var q3 = await InsertQuestion(courseId, "and the third one");
        
        var sut = new QuestionRepository(DbConnection);
        
        var questions = (await sut.SelectByIds([q1, q2, q3])).ToList();
        
        Assert.That(questions.Count(), Is.EqualTo(3));
        Assert.That(questions.ElementAt(0).QuestionText, Is.EqualTo("a name"));
        Assert.That(questions.ElementAt(1).QuestionText, Is.EqualTo("second name"));
        Assert.That(questions.ElementAt(2).QuestionText, Is.EqualTo("and the third one"));
    }

    [Test]
    public async Task Insert_ShouldInsert()
    {
        var courseId = await InsertCourse();
        var sut = new QuestionRepository(DbConnection);
        
        var question = new Question
        {
            CourseId = courseId,
            QuestionText = "What is the answer?",
            CorrectAnswer = "42"
        };
        
        var id = await sut.Insert(question);
        
        var selectSql = "SELECT * FROM question WHERE id = @id";
        var insertedQuestion = await DbConnection.QuerySingleAsync<Question>(selectSql, new DynamicParameters(new { id }));
        
        Assert.That(insertedQuestion.CourseId, Is.EqualTo(courseId));
        Assert.That(insertedQuestion.QuestionText, Is.EqualTo("What is the answer?"));
        Assert.That(insertedQuestion.CorrectAnswer, Is.EqualTo("42"));
    }

    [Test]
    public async Task Update_ShouldUpdate()
    {
        var courseId = await InsertCourse();
        var questionId = await InsertQuestion(courseId);

        var updateModel = new Question()
        {
            QuestionText = "I don't know",
            CorrectAnswer = "Of course you don't",
            Deleted = true,
            Id = questionId
        };
        
        var sut = new QuestionRepository(DbConnection);
        await sut.Update(updateModel);
        
        var selectSql = "SELECT * FROM question WHERE id = @questionId";
        var updatedQuestion = await DbConnection.QuerySingleAsync<Question>(selectSql, new DynamicParameters(new { questionId }));
        
        Assert.That(updatedQuestion.QuestionText, Is.EqualTo("I don't know"));
        Assert.That(updatedQuestion.CorrectAnswer, Is.EqualTo("Of course you don't"));
        Assert.That(updatedQuestion.Deleted, Is.True);
    }
}