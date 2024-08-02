using Dapper;
using Microsoft.Extensions.Options;
using Npgsql;
using StolzLearn.Core.Configuration;

namespace StolzLearn.Core.Postgres;

public class DbConnection(IOptions<PostgresqlOptions> pgOptions) : IDbConnection
{
    public async Task ExecuteAsync(string sql, DynamicParameters? parameters = null)
    {
        await using var connection = new NpgsqlConnection(pgOptions.Value.ConnectionString);
        var p = parameters ?? new DynamicParameters();
        await connection.ExecuteAsync(sql, p);
    }
    
    public async Task ExecuteWithObjectsAsync(string sql, object? objects = null)
    {
        await using var connection = new NpgsqlConnection(pgOptions.Value.ConnectionString);
        await connection.ExecuteAsync(sql, objects);
    }

    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, DynamicParameters? parameters = null)
    {
        await using var connection = new NpgsqlConnection(pgOptions.Value.ConnectionString);
        var p = parameters ?? new DynamicParameters();
        return await connection.QueryAsync<T>(sql, p);
    }

    public IEnumerable<T> Query<T>(string sql, DynamicParameters? parameters = null)
    {
        using var connection = new NpgsqlConnection(pgOptions.Value.ConnectionString);
        var p = parameters ?? new DynamicParameters();
        return connection.Query<T>(sql, p);
    }

    /// <summary>
    /// NoItem => Exception | OneItem => Item | ManyItems => Exception (Use it for count, add)
    /// </summary>
    /// <param name="sql">sql query</param>
    /// <param name="parameters">parameters in query</param>
    /// <typeparam name="T">Model type</typeparam>
    /// <returns>model</returns>
    public async Task<T> QuerySingleAsync<T>(string sql, DynamicParameters? parameters = null)
    {
        await using var connection = new NpgsqlConnection(pgOptions.Value.ConnectionString);
        var p = parameters ?? new DynamicParameters();
        return await connection.QuerySingleAsync<T>(sql, p);
    }

    public async Task<T?> QuerySingleOrDefaultAsync<T>(string sql, DynamicParameters? parameters = null)
    {
        await using var connection = new NpgsqlConnection(pgOptions.Value.ConnectionString);
        var p = parameters ?? new DynamicParameters();
        return await connection.QuerySingleOrDefaultAsync<T>(sql, p);
    }
    
    /// <summary>
    /// NoItem => Default | OneItem => Item | ManyItems => FirstItem
    /// </summary>
    /// <param name="sql">sql query</param>
    /// <param name="parameters">parameters in query</param>
    /// <typeparam name="T">model type</typeparam>
    /// <returns>model</returns>
    public async Task<T?> QueryFirstOrDefaultAsync<T>(string sql, DynamicParameters? parameters = null)
    {
        await using var connection = new NpgsqlConnection(pgOptions.Value.ConnectionString);
        var p = parameters ?? new DynamicParameters();
        return await connection.QueryFirstOrDefaultAsync<T?>(sql, p);
    }
}