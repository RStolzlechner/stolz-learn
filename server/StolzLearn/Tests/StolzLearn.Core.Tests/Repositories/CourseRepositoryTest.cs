using StolzLearn.Core.Models;
using StolzLearn.Core.Repositories;
using DynamicParameters = Dapper.DynamicParameters;

namespace StolzLearn.Core.Tests.Repositories;

public class CourseRepositoryTest : PostgresIntegrationTest
{
    [Test]
    public async Task SelectIdsByQueryShouldSelectAll()
    {
        var c1 = await InsertCourse();
        var c2 = await InsertCourse();

        var sut = new CourseRepository(DbConnection);

        var result = (await sut.SelectIdsByQuery(new CourseQuery())).ToList();
        
        Assert.Contains(c1, result);
        Assert.Contains(c2, result);
    }
    
    
    [Test]
    public async Task SelectIdsByQuery_ShouldSelectUnarchived()
    {
        
        var c1 = await InsertCourse("a name", true);
        var c2 = await InsertCourse();

        var sut = new CourseRepository(DbConnection);

        var result = (await sut.SelectIdsByQuery(new CourseQuery() { IsArchived = true })).ToList();
        
        Assert.That(result.Count(), Is.EqualTo(1));
        Assert.Contains(c1, result);
    }
    
    [Test]
    public async Task SelectByIds_ShouldSelectCourses()
    {
        
        var c1 = await InsertCourse("a name");
        var c2 = await InsertCourse("another name");

        var sut = new CourseRepository(DbConnection);

        var result = (await sut.SelectByIds([c1, c2])).ToList();
        
        Assert.That(result.Count(), Is.EqualTo(2));
        Assert.True(result.Any(x=>x.Name == "a name"));
        Assert.True(result.Any(x=>x.Name == "another name"));
    }

    [Test]
    public async Task Insert_ShouldInsert()
    {
        var no = Guid.NewGuid().ToString();
        var course = new Course() { Name = "a course", Number = no };
        
        var sut = new CourseRepository(DbConnection);

        var id = await sut.Insert(course);
        
        var selectSql = "SELECT * FROM course WHERE id = @id";
        var inDb = await DbConnection.QuerySingleAsync<Course>(selectSql, new DynamicParameters(new { id }));
        
        Assert.That(inDb.Name, Is.EqualTo("a course"));
        Assert.That(inDb.Number, Is.EqualTo(no));
    }

    [Test]
    public async Task Update_ShouldUpdate()
    {
        var no = Guid.NewGuid().ToString();
        var isArchived = true;
        var name = "a complete new Name";

        var id = await InsertCourse();
        
        var updateModel = new Course() { Id = id, Name = name, Number = no, InArchive = isArchived };

        var sut = new CourseRepository(DbConnection);

        await sut.Update(updateModel);
        
        var selectSql = "SELECT * FROM course WHERE id = @id";
        var inDb = await DbConnection.QuerySingleAsync<Course>(selectSql, new DynamicParameters(new { id }));
        
        Assert.That(inDb.Name, Is.EqualTo(name));
        Assert.That(inDb.Number, Is.EqualTo(no));
        Assert.That(inDb.InArchive, Is.EqualTo(isArchived));
    }
}