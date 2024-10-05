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
    public IActionResult SetGame([FromQuery] string gameId, [FromQuery] int column, [FromQuery] int row)
        => OkNoBody(() => _gameService.InitGame(gameId, column, row));

    [HttpPost("shutdown")]
    public IActionResult Shutdown()
        => OkNoBody(_hostLifetime.StopApplication);

    [HttpPost("cleanup")]
    public IActionResult CleanUp()
        => OkNoBody(_gameService.CleanUp);

    [HttpGet()]
    public IActionResult GetCurrentGameSet()
        => Ok(_gameService.GetCurrentGameSet());
}
