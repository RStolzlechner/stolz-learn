using Microsoft.Extensions.Configuration;

namespace StolzLearn.Core.Tests;

public static class IntegrationTestSettings
{
    public static IConfiguration GetConfiguration()
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(System.IO.Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .AddJsonFile("appsettings.Development.json")
            .AddEnvironmentVariables()
            .Build();
        return configuration;
    }
}