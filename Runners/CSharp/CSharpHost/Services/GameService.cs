﻿using CSharpHost.Contracts;
using CSharpHost.Models;
using System.Diagnostics;
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

    public async Task<int> MoveNext(GameMessage message, [Optional] CancellationToken cancellation)
    {
        try
        {
            var (position, map, current) = message;

            return await Task.Run(() =>
            {
                var player = _playerService.GetPlayer(position);

                var stopwatch = Stopwatch.StartNew();
                var direction = player.MoveNext(map, current);
                Debug.WriteLine($"position:{position}, direction:{direction}, elapsed:{stopwatch.ElapsedMilliseconds}");
                if (direction < 0 || direction > 3)
                {
                    throw new InvalidOperationException($"The result is out of range. result:{direction}");
                }
                return direction;
            });
        }
        catch (Exception ex)
        {
            Debug.WriteLine(ex);
            throw;
        }
    }

    public GameSet GetCurrentGameSet()
        => new GameSet(_column, _row);

    public void CleanUp()
    {
        _column = 0;
        _row = 0;
        _playerService.CleanUp();
    }
}
