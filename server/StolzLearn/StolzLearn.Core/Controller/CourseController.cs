using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Serilog;
using StolzLearn.Core.Models;
using StolzLearn.Core.Services;
using StolzLearn.Core.SignalR;

namespace StolzLearn.Core.Controller;

[Route("api/v1/[controller]")]
public class CourseController(
    ICourseService courseService, 
    IHubContext<CoreHub, ICoreHub> hub,
    IStatisticService statisticService) : CoreControllerBase
{
    [HttpGet("statistic/{id:guid}")]
    public async Task<IActionResult> GetCourseStatistic(Guid id)
    {
        var course = (await courseService.SelectByIds([id])).FirstOrDefault();
        if(course == null)
            return BadRequest("Given id not found in database");

        var statistic = await statisticService.SelectByCourseId(id);
        return Ok(statistic);
    }
    
    [HttpPost("ids")]
    public async Task<IActionResult> SelectIdsByQuery([FromBody] CourseQuery query)
    {
        var ids = await courseService.SelectIdsByQuery(query);

        return Ok(ids);
    }
    
    [HttpPost("get-by-ids")]
    public async Task<IActionResult> SelectByIds([FromBody] IEnumerable<Guid> ids)
    {
        var idList = ids.ToList();
        var courses = await courseService.SelectByIds(idList);

        if (courses.Count() != idList.Count)
        {
            Log.Warning("Not all ids found in database");
        }

        return Ok(courses);
    }
    
    [HttpPut("archive/{id:guid}")]
    public async Task<IActionResult> ArchiveCourse(Guid id)
    {
        var course = (await courseService.SelectByIds([id])).FirstOrDefault();
        if(course == null)
        {
            return BadRequest("Given id not found in database");
        }
        if (course.InArchive)
            return Ok();
        
        course.InArchive = true;

        try
        {
            await courseService.Update(course);   
        }
        catch(Exception e)
        {
            return InternalError(e.Message);
        }

        await hub.Clients.All.OnCourseChanged(id);
        return Ok();
    }
    
    [HttpPut("restore/{id:guid}")]
    public async Task<IActionResult> RestoreCourse(Guid id)
    {
        var course = (await courseService.SelectByIds([id])).FirstOrDefault();
        if(course == null)
            return BadRequest("Given id not found in database");
        
        if (!course.InArchive)
            return Ok();
        
        course.InArchive = false;

        try
        {
            await courseService.Update(course);   
        }
        catch(Exception e)
        {
            return InternalError(e.Message);
        }

        await hub.Clients.All.OnCourseChanged(id);
        return Ok();
    }
    
    [HttpPost("create")]
    public async Task<IActionResult> CreateCourse([FromBody] Course course)
    {
        if(string.IsNullOrEmpty(course.Name))
            return BadRequest("Name is required");
        if(string.IsNullOrEmpty(course.Number))
            return BadRequest("Number is required");

        try
        {
            var courseId = await courseService.Insert(course);   

            await hub.Clients.All.OnNewCourse(course.Id);
            return Ok(courseId);
        } 
        catch (Exception e)
        {
            return InternalError(e.Message);
        }
    }
    
    [HttpPut("update")]
    public async Task<IActionResult> UpdateCourse([FromBody] Course course)
    {
        if(string.IsNullOrEmpty(course.Name))
            return BadRequest("Name is required");
        if(string.IsNullOrEmpty(course.Number))
            return BadRequest("Number is required");

        var existingCourse = (await courseService.SelectByIds([course.Id])).FirstOrDefault();
        if(existingCourse == null)
            return BadRequest("Given id not found in database");

        try
        {
            await courseService.Update(course);   
        }
        catch(Exception e)
        {
            return InternalError(e.Message);
        }

        await hub.Clients.All.OnCourseChanged(course.Id);
        return Ok();
    }
}