using System.Reflection;
using Dapper;
using FluentMigrator.Runner;
using FluentMigrator.Runner.Conventions;
using StolzLearn.Core.Configuration;
using StolzLearn.Core.Extensions;
using StolzLearn.Core.HealthChecks;
using StolzLearn.Core.Postgres;
using StolzLearn.Core.Repositories;
using StolzLearn.Core.Services;
using StolzLearn.Core.SignalR;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
var runMigrations = args.Contains("--migrate");

//logger
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

try
{
    Log.Information("Starting web application");
    
    // Add services to the container.
    // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSerilog();
    builder.Services.AddSwaggerGen();
    builder.Services.AddControllers();
    builder.Services.AddSignalR(options =>
    {
        options.KeepAliveInterval = TimeSpan.FromSeconds(10);
        options.EnableDetailedErrors = true;
        options.ClientTimeoutInterval = TimeSpan.FromSeconds(120);
        options.MaximumReceiveMessageSize = 512 * 1024; // 512 KB
    });

    //configurations
    builder.Services.AddAndValidateOptions<PostgresqlOptions>(PostgresqlOptions.Position);

    //database
    DefaultTypeMap.MatchNamesWithUnderscores = true;
    builder.Services.AddScoped<IDbConnection, DbConnection>();

    //repositories
    builder.Services.AddScoped<ICourseRepository, CourseRepository>();
    builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
    builder.Services.AddScoped<IAnswerRepository, AnswerRepository>();
    builder.Services.AddScoped<IQuestionnaireRepository, QuestionnaireRepository>();

    //services
    builder.Services.AddScoped<IAnswerService, AnswerService>();
    builder.Services.AddScoped<ICourseService, CourseService>();
    builder.Services.AddScoped<IStatisticService, StatisticService>();
    builder.Services.AddScoped<IQuestionService, QuestionService>();
    builder.Services.AddScoped<IQuestionnaireService, QuestionnaireService>();

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

    app.UseSerilogRequestLogging();
    
    app.MapControllers();

    app.MapHub<CoreHub>("stolz-learn-core-hub");

    app.Run();

}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    await Log.CloseAndFlushAsync();
}