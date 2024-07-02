using System.Transactions;
using Dapper;
using Microsoft.Extensions.Options;
using StolzLearn.Core.Configuration;
using StolzLearn.Core.Extensions;
using StolzLearn.Core.Postgres;

namespace StolzLearn.Core.Tests;

public class PostgresIntegrationTest
{
    private DbConnection _dbConnection = null!;
    private IOptions<PostgresqlOptions> _dbOptions = null!;
    private TransactionScope _scope = null!;
    
    protected DbConnection DbConnection => _dbConnection;
    protected IOptions<PostgresqlOptions> DbOptions => _dbOptions;
    
    [OneTimeSetUp]
    public void OneTimeSetUpBase()
    {
        var configuration = IntegrationTestSettings.GetConfiguration();
        _dbOptions = Options.Create(configuration.GetValidated<PostgresqlOptions>(PostgresqlOptions.Position));
        _dbConnection = new DbConnection(_dbOptions);
        DefaultTypeMap.MatchNamesWithUnderscores = true;
    }
    
    [SetUp]
    public void SetUpBase()
    {
        _scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
    }
    
    [TearDown]
    public void TearDownBase()
    {
        _scope.Dispose();
    }

    protected Task<Guid> InsertCourse(string name = "a course")
    {
        var number = Guid.NewGuid().ToString();
        
        var sql = "INSERT INTO course (name, number) VALUES (@name, @number) RETURNING  id";
        return DbConnection.QuerySingleAsync<Guid>(sql, new DynamicParameters(new { name, number }));
    }
    
    protected Task<Guid> InsertQuestion(Guid courseId, string question = "a question", string correctAnswer = "a correct answer")
    {
        var sql = "INSERT INTO question (course_id, question_text, correct_answer) VALUES (@courseId, @question, @correctAnswer) RETURNING  id";
        return DbConnection.QuerySingleAsync<Guid>(sql, new DynamicParameters(new { courseId, question, correctAnswer }));
    }
    
    protected Task<Guid> InsertQuestionnaire(Guid courseId)
    {
        var sql = "INSERT INTO questionnaire (course_id) VALUES (@courseId) RETURNING  id";
        return DbConnection.QuerySingleAsync<Guid>(sql, new DynamicParameters(new { courseId }));
    }
    
    protected Task<Guid> InsertAnswer(Guid questionId, Guid questionnaireId, bool isCorrect = false, string givenAnswer = "a given answer")
    {
        var sql = "INSERT INTO answer (question_id, questionnaire_id, given_answer, is_correct) VALUES (@questionId, @questionnaireId, @givenAnswer, @isCorrect) RETURNING id";
        return DbConnection.QuerySingleAsync<Guid>(sql, new DynamicParameters(new { questionId, questionnaireId, givenAnswer, isCorrect }));
    }
}