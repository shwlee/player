using PlayerLib;
using System.Runtime.InteropServices;

namespace CSharpHost.Contracts;

public interface IPlayerService
{
    Task LoadPlayer(int position, string filePath, [Optional] CancellationToken cancellation);

    IPlayer GetPlayer(int position);
}
