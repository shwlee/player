using CSharpHost.Models;

namespace CSharpHost.Contracts;

public interface IGameLogger
{
    void Init(string gameId, int column, int row);
    void LogResult(GameResult Result);
    void LogPlayerAction(GameTurn turn);
    void Log(string message);
    void Cleanup();
}
