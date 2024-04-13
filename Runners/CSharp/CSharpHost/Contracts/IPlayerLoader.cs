using PlayerLib;
using System.Runtime.InteropServices;

namespace CSharpHost.Contracts;

public interface IPlayerLoader
{
    Task<IPlayer> LoadPlayer(string playerFilePath, [Optional] CancellationToken cancellation);
}
