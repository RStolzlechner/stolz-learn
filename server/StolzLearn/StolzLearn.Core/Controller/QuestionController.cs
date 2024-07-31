using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Serilog;
using StolzLearn.Core.Models;
using StolzLearn.Core.Services;
using StolzLearn.Core.SignalR;

namespace StolzLearn.Core.Controller;

[Route("api/v1/[controller]")]
public class QuestionController(
    IQuestionService questionService,
    IHubContext<CoreHub, ICoreHub> hub) : CoreControllerBase
{
    [HttpPost("ids")]
    public async Task<IActionResult> SelectIdsByQuery([FromBody] QuestionQuery query)
    {
        var ids = await questionService.SelectIdsByQuery(query);
        return Ok(ids);
    }
    
    [HttpPost("get-by-ids")]
    public async Task<IActionResult> SelectByIds([FromBody] List<Guid> ids)
    {
        var questions = await questionService.SelectByIds(ids);
        
        if (questions.Count() != ids.Count())
            Log.Warning("Not all ids found in database");
        
        return Ok(questions);
    }
    
    [HttpPost]
    public async Task<IActionResult> Insert([FromBody] Question question)
    {
        if(string.IsNullOrEmpty(question.QuestionText))
            return BadRequest("Question text is required");
        if(string.IsNullOrEmpty(question.CorrectAnswer))
            return BadRequest("Correct answer is required");

        try
        {
            var qId = await questionService.Insert(question);

            await hub.Clients.All.OnCourseChanged(question.CourseId);
        
            return Ok(qId);
        }
        catch (Exception e)
        {
            return InternalError(e.Message);
        }
    }
    
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] Question question)
    {
        if(string.IsNullOrEmpty(question.QuestionText))
            return BadRequest("Question text is required");
        if(string.IsNullOrEmpty(question.CorrectAnswer))
            return BadRequest("Correct answer is required");

        try
        {
            await questionService.Update(question);
            await hub.Clients.All.OnCourseChanged(question.CourseId);
        
            return Ok();
        }
        catch (Exception e)
        {
            return InternalError(e.Message);
        }
    }
    
    [HttpPut("soft-delete/{id:guid}")]
    public async Task<IActionResult> SoftDelete([FromRoute] Guid id)
    {
        var question = (await questionService.SelectByIds([id])).ToList();
        if(question.Count != 1)
            return BadRequest("Given id not found in database");
        
        question[0].Deleted = true;

        try
        {
            await questionService.Update(question[0]);
            await hub.Clients.All.OnCourseChanged(question[0].CourseId);
        
            return Ok();
        }
        catch (Exception e)
        {
            return InternalError(e.Message);
        }
    }
}