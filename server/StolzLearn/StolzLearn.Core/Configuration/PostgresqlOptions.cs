using System.ComponentModel.DataAnnotations;

namespace StolzLearn.Core.Configuration;

public record PostgresqlOptions
{
    public const string Position = "Postgresql";
    [Required] private string UserId { get; init; } = string.Empty;
    [Required] private string Password { get; init; } = string.Empty;
    [Required] private string Host { get; init; } = string.Empty;
    [Required] private string Port { get; init; } = string.Empty;
    [Required] private string Database { get; init; } = string.Empty;

    public string ConnectionString =>
        @$"User ID = {UserId};
        Password = {Password};
        Host = {Host};
        Port = {Port};
        Database = {Database};";
}