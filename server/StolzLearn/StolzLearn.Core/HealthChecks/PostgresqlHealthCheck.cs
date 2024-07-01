using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using Npgsql;
using StolzLearn.Core.Configuration;

namespace StolzLearn.Core.HealthChecks;

public class PostgresqlHealthCheck(IOptions<PostgresqlOptions> options): IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
    {
        using (var connection = new NpgsqlConnection(options.Value.ConnectionString))
        {
            try
            {
                connection.Open();
            }
            catch (NpgsqlException e)
            {
                return Task.FromResult(HealthCheckResult.Unhealthy("An error occurred while connecting to the database", e));
            }
        }
            
        return Task.FromResult(HealthCheckResult.Healthy());
    }
}