namespace CSharpHost.Models;

public class GameResult
{
    public string? GameId { get; set; }
    public IEnumerable<PlayerResult>? Results { get; set; }
}

public class PlayerResult
{
    public int Rank { get; set; }
    public string? Name { get; set; }
    public int Score { get; set; }
}
