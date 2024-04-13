using CSharpHost.Contracts;
using CSharpHost.Models;
using Microsoft.AspNetCore.Mvc;

namespace CSharpHost.Controllers;

[ApiController]
[Route("coinchallenger/player")]
public class PlayerController(IGameService gameService, IHostApplicationLifetime hostLifetime) : Controller
{
    private readonly IGameService _gameService = gameService;
    private readonly IHostApplicationLifetime _hostLifetime = hostLifetime;

    [HttpPost("game/set")]
    public IActionResult SetGame([FromQuery] int column, [FromQuery] int row)
    {
        _gameService.InitGame(column, row);
        return Ok();
    }

    [HttpPost("load")]
    public async Task<IActionResult> LoadPlayer([FromForm] int position, [FromForm] string filePath, CancellationToken cancellation)
    {
        await _gameService.LoadPlayer(position, filePath, cancellation);
        return Ok();
    }

    [HttpPost("init")]
    public IActionResult Initialize([FromForm] int position, [FromForm] int column, [FromForm] int row)
    {
        _gameService.InitializePlayer(position, column, row);
        return Ok();
    }

    [HttpGet("name/{position}")]
    public IActionResult GetName([FromRoute] int position)
        => Ok(_gameService.GetPlayerName(position));

    [HttpPost("movenext")]
    public async Task<IActionResult> MoveNext([FromBody] GameMessage message)
        => Ok(await _gameService.MoveNext(message));

    [HttpPost("shutdown")]
    public IActionResult Shutdown()
    {
        _hostLifetime.StopApplication();
        return Ok(0);
    }
}
