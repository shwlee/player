using CSharpHost.Contracts;
using PlayerLib;
using System.Runtime.InteropServices;

namespace CSharpHost.Services;

public class PlayerService(IPlayerLoader playerLoader) : IPlayerService
{
    private readonly IPlayerLoader _playerLoader = playerLoader;

    private Dictionary<int, IPlayer> _playerBag = [];

    public IPlayer GetPlayer(int position)
    {
        if (_playerBag.ContainsKey(position) is false)
        {
            throw new InvalidOperationException("no player by this position.");
        }

        return _playerBag[position];
    }

    public async Task LoadPlayer(int position, string filePath, [Optional] CancellationToken cancellation)
    {
        var player = await _playerLoader.LoadPlayer(filePath, cancellation);
        if (player is null)
        {
            throw new InvalidOperationException("Can not load player by this filePath.");
        }

        _playerBag[position] = player;
    }
}
