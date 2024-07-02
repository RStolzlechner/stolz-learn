using System.Reflection;
using FluentMigrator.Runner;
using FluentMigrator.Runner.Conventions;
using StolzLearn.Core.Configuration;
using StolzLearn.Core.Extensions;
using StolzLearn.Core.HealthChecks;
using StolzLearn.Core.Repositories;

var builder = WebApplication.CreateBuilder(args);
var runMigrations = args.Contains("--migrate");

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

//configurations
builder.Services.AddAndValidateOptions<PostgresqlOptions>(PostgresqlOptions.Position);

//repositories
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IAnswerRepository, AnswerRepository>();
builder.Services.AddScoped<IQuestionnaireRepository, QuestionnaireRepository>();

//migrations
if (runMigrations)
{
    var postgresqlOptions = builder.Configuration.GetValidated<PostgresqlOptions>(PostgresqlOptions.Position);

    builder.Services.AddSingleton<IConventionSet>(new DefaultConventionSet("stolz_learn_core", null))
        .AddFluentMigratorCore().ConfigureRunner(rb => rb
            .AddPostgres()
            .WithGlobalConnectionString(postgresqlOptions.ConnectionString)
            .WithGlobalCommandTimeout(new TimeSpan(0, 10, 0))
            .ScanIn(Assembly.GetExecutingAssembly()))
        .AddLogging(c => c.AddFluentMigratorConsole());
}

//health checks
builder.Services.AddHealthChecks()
    .AddCheck<PostgresqlHealthCheck>("Postgresql");

var app = builder.Build();

if (runMigrations)
{
    using var scope = app.Services.CreateScope();
    var migrator = scope.ServiceProvider.GetService<IMigrationRunner>();
    migrator?.MigrateUp();
    return;
}

app.MapHealthChecks("/healthz");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();