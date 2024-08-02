using System.ComponentModel.DataAnnotations;

namespace StolzLearn.Core.Extensions;

public static class ConfigurationExtensions
{
    public static T GetValidated<T>(this IConfiguration config, string section)
    {
        var options = config.GetSection(section).Get<T>();

        if (options is null)
            throw new ArgumentException($"Invalid configuration: {section} is missing or invalid");

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(options, serviceProvider: null, items: null);
        
        var isValid = Validator.TryValidateObject(options, validationContext, validationResults, validateAllProperties: true);
        
        if (!isValid)
        {
            var errors = validationResults.Select(x => x.ErrorMessage);
            throw new ArgumentException($"Invalid configuration: {string.Join(",", errors)}");
        }

        return options;
    }
}