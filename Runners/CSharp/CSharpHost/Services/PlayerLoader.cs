using CSharpHost.Contracts;
using PlayerLib;
using System.Runtime.InteropServices;

namespace CSharpHost.Services;

public class PlayerLoader : IPlayerLoader
{
    public Task<IPlayer> LoadPlayer(string playerFilePath, [Optional] CancellationToken cancellation)
    {
        return Task.Run(() =>
        {
            var player = new CSharpRunner();
            player.Setup(playerFilePath);
            return (IPlayer)player;
        }, cancellation);
    }
}
