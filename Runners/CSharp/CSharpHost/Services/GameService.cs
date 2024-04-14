using CSharpHost.Contracts;
using CSharpHost.Models;
using System.Runtime.InteropServices;

namespace CSharpHost.Services;

public class GameService(IPlayerService playerService) : IGameService
{
    private readonly IPlayerService _playerService = playerService;

    private int _column;
    private int _row;
    private int _totalPacketSize;

    public void InitGame(int column, int row)
    {
        _column = column;
        _row = row;
        var mapPacketSize = (column * row) * 4;
        _totalPacketSize = mapPacketSize + 4; // map 배열크기.(int[] 배열 크기) + player position 값(4byte).
    }

    public Task LoadPlayer(int position, string filePath, [Optional] CancellationToken cancellation)
    {
        return _playerService.LoadPlayer(position, filePath, cancellation);
    }

    public string GetPlayerName(int position)
    {
        var player = _playerService.GetPlayer(position);
        return player.GetName() ?? throw new InvalidOperationException($"{position} Player name is null");
    }

    public void InitializePlayer(int position, int column, int row)
    {
        var player = _playerService.GetPlayer(position);
        player.Initialize(position, column, row);

    }

    public Task<int> MoveNext(GameMessage message, [Optional] CancellationToken cancellation)
    {
        var (position, map, current) = message;

        return Task.Run(() =>
        {
            var player = _playerService.GetPlayer(position);
            return player.MoveNext(map, current);
        });
    }

    public GameSet GetCurrentGameSet()
        => new GameSet(_column, _row);
}
