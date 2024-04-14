using Microsoft.AspNetCore.Mvc;

namespace CSharpHost.Controllers;

[ApiController]
public class BaseController : Controller
{
    protected OkResult OkNoBody(object? execution)
    {
        return Ok();
    }

    protected OkResult OkNoBody(Action action)
    {
        action();
        return Ok();
    }

    protected async Task<IActionResult> OkNoBody(Func<Task> func)
    {
        await func();
        return Ok();
    }
}
