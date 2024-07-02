using Dapper;

namespace StolzLearn.Core.Postgres;

public interface IDbConnection
{
    Task ExecuteAsync(string sql, DynamicParameters? parameters = null);
    Task ExecuteWithObjectsAsync(string sql, object? objects = null);
    Task<IEnumerable<T>> QueryAsync<T>(string sql, DynamicParameters? parameters = null);
    IEnumerable<T> Query<T>(string sql, DynamicParameters? parameters = null);
    Task<T> QuerySingleAsync<T>(string sql, DynamicParameters? parameters = null);
    Task<T?> QuerySingleOrDefaultAsync<T>(string sql, DynamicParameters? parameters = null);
    Task<T?> QueryFirstOrDefaultAsync<T>(string sql, DynamicParameters? parameters = null);
}