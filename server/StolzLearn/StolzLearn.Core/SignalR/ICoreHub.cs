namespace StolzLearn.Core.SignalR;

public interface ICoreHub
{
    Task OnCourseChanged(Guid id);
    Task OnNewCourse(Guid id);
}