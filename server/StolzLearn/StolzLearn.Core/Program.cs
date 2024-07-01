using StolzLearn.Core.Configuration;
using StolzLearn.Core.Extensions;
using StolzLearn.Core.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

//configurations
builder.Services.AddAndValidateOptions<PostgresqlOptions>(PostgresqlOptions.Position);

//health checks
builder.Services.AddHealthChecks()
    .AddCheck<PostgresqlHealthCheck>("Postgresql");

var app = builder.Build();

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