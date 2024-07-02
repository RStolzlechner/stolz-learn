using Moq;
using StolzLearn.Core.Models;
using StolzLearn.Core.Models.CourseStatistic;
using StolzLearn.Core.Repositories;
using StolzLearn.Core.Services;

namespace StolzLearn.Core.Tests.Services;

public class CourseStatisticServiceTests
{
    private Mock<IQuestionRepository> questionRepoMock = null!;
    private Mock<IAnswerRepository> answerRepoMock = null!;

    private ICourseStatisticService sut = null!;

    [SetUp]
    public void Setup()
    {
        questionRepoMock = new Mock<IQuestionRepository>();
        answerRepoMock = new Mock<IAnswerRepository>();
        
        sut = new CourseStatisticService(questionRepoMock.Object, answerRepoMock.Object);
    }

    [Test]
    public async Task SelectByCourseId_ShouldSelectStatistic()
    {
        var courseId = Guid.NewGuid();
        
        var date1 = new DateTime(2024, 1, 1);
        var date2 = new DateTime(2024, 1, 2);
        var date3 = new DateTime(2024, 1, 3);
        var date4 = new DateTime(2024, 1, 4);
        
        var question1 = new Question() { Id = Guid.NewGuid(), DateCreate = date1 };
        var question2 = new Question() { Id = Guid.NewGuid(), DateCreate = date1 };
        var question3 = new Question() { Id = Guid.NewGuid(), DateCreate = date2 };
        
        var answer1 = new Answer() { QuestionId = question1.Id, DateCreate = date2, IsCorrect = true };
        var answer2 = new Answer() { QuestionId = question1.Id, DateCreate = date2, IsCorrect = false };
        var answer3 = new Answer() { QuestionId = question2.Id, DateCreate = date3, IsCorrect = true };
        var answer4 = new Answer() { QuestionId = question3.Id, DateCreate = date4, IsCorrect = false };

        questionRepoMock.Setup(repo => repo.SelectByCourseId(courseId)).ReturnsAsync([question1, question2, question3]);
        answerRepoMock.Setup(repo => repo.SelectByCourseId(courseId)).ReturnsAsync([answer1, answer2, answer3, answer4]);
        
        var statistic = await sut.SelectByCourseId(courseId);

        Assert.That(statistic.DayDataPoints.Count, Is.EqualTo(4));
        
        var day1 = statistic.DayDataPoints[0];
        Assert.That(day1.Date, Is.EqualTo(date1));
        Assert.That(day1.QuestionCnt, Is.EqualTo(2));
        Assert.That(day1.CorrectCnt, Is.EqualTo(0));
        
        var day2 = statistic.DayDataPoints[1];
        Assert.That(day2.Date, Is.EqualTo(date2));
        Assert.That(day2.QuestionCnt, Is.EqualTo(3));
        Assert.That(day2.CorrectCnt, Is.EqualTo(0.5));
        
        var day3 = statistic.DayDataPoints[2];
        Assert.That(day3.Date, Is.EqualTo(date3));
        Assert.That(day3.QuestionCnt, Is.EqualTo(3));
        Assert.That(day3.CorrectCnt, Is.EqualTo(1.5));
        
        var day4 = statistic.DayDataPoints[3];
        Assert.That(day4.Date, Is.EqualTo(date4));
        Assert.That(day4.QuestionCnt, Is.EqualTo(3));
        Assert.That(day4.CorrectCnt, Is.EqualTo(1.5));
    }
}