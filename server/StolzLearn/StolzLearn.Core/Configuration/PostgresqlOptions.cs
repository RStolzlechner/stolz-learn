using System.ComponentModel.DataAnnotations;

namespace StolzLearn.Core.Configuration;

public record PostgresqlOptions
{
    public const string Position = "Postgresql";
    [Required] public string UserId { get; init; } = string.Empty;
    [Required] public string Password { get; init; } = string.Empty;
    [Required] public string Host { get; init; } = string.Empty;
    [Required] public string Port { get; init; } = string.Empty;
    [Required] public string Database { get; init; } = string.Empty;

    public string ConnectionString =>
        @$"User ID = {UserId};
        Password = {Password};
        Host = {Host};
        Port = {Port};
        Database = {Database};";
}