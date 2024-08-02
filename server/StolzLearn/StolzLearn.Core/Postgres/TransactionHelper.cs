using System.Transactions;
using Npgsql;

namespace StolzLearn.Core.Postgres;

public static class TransactionHelper
{
    public static async Task InTransaction(Func<Task> action, int retries = 5)
    {
        await InTransaction(async () => { await action(); return true; }, retries);
    }
    
    public static async Task<T> InTransaction<T>(Func<Task<T>> action, int retries = 5)
    {
        var count = 0;
        var exceptions = new List<Exception>();
        while (count < retries)
        {
            try
            {
                if (count > 0) await Task.Delay(100 * (int)Math.Pow(2, count - 1));
                
                using var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

                var result = await action.Invoke();

                transactionScope.Complete();

                return result;
            }
            //postgres error
            catch (PostgresException e)
            {
                //transient postgres errors => retry
                if (e.IsTransient)
                {
                    count++;
                    exceptions.Add(e);
                }
                else
                {
                    throw;
                }
            }
            //two operations use the same connection concurrently
            catch (NpgsqlOperationInProgressException)
            {
                throw;
            }
            //non-postgres errors
            catch (NpgsqlException e)
            {
                //network error => retry
                if (e.InnerException is IOException)
                {
                    count++;
                    exceptions.Add(e);
                }
                //other non-postgres errors
                else
                {
                    throw;
                }
            }
        }

        throw new AggregateException(exceptions);
    }
}