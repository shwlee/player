using CSharpHost.Contracts;
using CSharpHost.Models;
using Microsoft.AspNetCore.Mvc;

namespace CSharpHost.Controllers;

[Route("coinchallenger/[controller]")]
public class PlayerController(IGameService gameService) : BaseController
{
    private readonly IGameService _gameService = gameService;

    [HttpPost("load")]
    public Task<IActionResult> LoadPlayer([FromForm] int position, [FromForm] string filePath, CancellationToken cancellation)
        => OkNoBody(() => _gameService.LoadPlayer(position, filePath, cancellation));

    [HttpPost("init")]
    public IActionResult Initialize([FromForm] int position, [FromForm] int column, [FromForm] int row)
        => OkNoBody(() => _gameService.InitializePlayer(position, column, row));

    [HttpGet("name/{position}")]
    public IActionResult GetName([FromRoute] int position)
        => Ok(_gameService.GetPlayerName(position));

    [HttpPost("movenext")]
    public async Task<IActionResult> MoveNext([FromBody] GameMessage message)
        => Ok(await _gameService.MoveNext(message));
}
