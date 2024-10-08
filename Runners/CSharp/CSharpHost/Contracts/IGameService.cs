﻿using CSharpHost.Models;
using System.Runtime.InteropServices;

namespace CSharpHost.Contracts;

public interface IGameService
{
    void InitGame(string gameId, int column, int row);

    GameSet GetCurrentGameSet();

    Task LoadPlayer(int position, string filePath, [Optional] CancellationToken cancellation);

    void InitializePlayer(int position, int column, int row);

    string GetPlayerName(int position);

    Task<int> MoveNext(GameMessage message, [Optional] CancellationToken cancellation);

    void CleanUp();
}
