namespace StolzLearn.Core.Models;

public class Course
{
    public Guid Id { get; set; }
    public required string Number { get; set; }
    public required string Name { get; set; }
    public DateTime DateCreate { get; set; } = DateTime.Now;
    public bool InArchive { get; set; }
}