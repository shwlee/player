using CSharpHost.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace CSharpHost.Controllers;

[ApiController]
[Route("coinchallenger/csharp/[controller]")]
public class GameController(IHostApplicationLifetime hostLifetime, IGameService gameService) : BaseController
{
    private readonly IHostApplicationLifetime _hostLifetime = hostLifetime;
    private readonly IGameService _gameService = gameService;

    [HttpGet("healthy")]
    public IActionResult Healthy()
        => Ok();

    [HttpPost("set")]
    public IActionResult SetGame([FromQuery] int column, [FromQuery] int row)
        => OkNoBody(() => _gameService.InitGame(column, row));

    [HttpPost("shutdown")]
    public IActionResult Shutdown()
        => OkNoBody(_hostLifetime.StopApplication);

    [HttpGet()]
    public IActionResult GetCurrentGameSet()
        => Ok(_gameService.GetCurrentGameSet());
}
