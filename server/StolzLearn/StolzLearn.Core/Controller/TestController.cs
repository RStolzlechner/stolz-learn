using Microsoft.AspNetCore.Mvc;

namespace StolzLearn.Core.Controller;

[Route("api/v1/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok(DateTime.Now);
    }
}