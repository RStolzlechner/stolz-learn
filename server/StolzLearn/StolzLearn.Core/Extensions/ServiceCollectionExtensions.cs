using Microsoft.Extensions.Options;

namespace StolzLearn.Core.Extensions;

public static class ServiceCollectionExtensions
{
    public static OptionsBuilder<T> AddAndValidateOptions<T>(this IServiceCollection services, string sectionName)
        where T : class
    {
        return services.AddOptions<T>()
            .BindConfiguration(sectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();
    }
}