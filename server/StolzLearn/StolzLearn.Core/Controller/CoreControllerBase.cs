using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace StolzLearn.Core.Controller;

public abstract class CoreControllerBase : ControllerBase
{
    [NonAction]
    public override BadRequestObjectResult BadRequest(object? message)
    {
        Log.Warning($"BadRequest: ${message}");
        return base.BadRequest(message);
    }

    [NonAction]
    public ObjectResult InternalError(string message)
    {
        Log.Error($"InternalError: ${message}");
        return base.StatusCode(StatusCodes.Status500InternalServerError, message);
    }
}