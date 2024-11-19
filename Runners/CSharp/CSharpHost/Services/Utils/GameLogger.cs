using CSharpHost.Contracts;
using CSharpHost.Models;
using Serilog;
using Serilog.Core;
using System.Text.Json;

namespace CSharpHost.Services.Utils;

public class GameLogger(IAppSettingVault appSettingVault) : IGameLogger
{
    private const string GameLogName = "game.log";
    private static readonly JsonSerializerOptions _jsonSetting = new JsonSerializerOptions
    {
        WriteIndented = true,
    };

    private readonly IAppSettingVault _appSettingVault = appSettingVault;

    private string? _logPath; // logs/123qweasd
    private string? _currentGame;
    private Serilog.ILogger? _gameLogger;
    private Dictionary<int, Serilog.ILogger> _playerLoggers = new();

    private Serilog.ILogger RootLogger { get => _gameLogger ?? GetDefaultLogger(); }

    public void Init(string gameId, int column, int row)
    {
        var logRoot = _appSettingVault.GetGameLoggerRootPath();
        _logPath = $"{logRoot}/{gameId}";
        _currentGame = gameId;

        var logPath = Path.Combine(_logPath, GameLogName);
        _gameLogger = new LoggerConfiguration()
            .Enrich.WithProperty("gameId", gameId)
            .WriteTo.File(logPath, outputTemplate: "[{gameId}:{Timestamp:yyyy-MM-dd HH:mm:ss}] {Message:lj}{NewLine}")
            .CreateLogger();

        var message = $"Game initiailized. GameId:{gameId}, column:{column}, row:{row}";
        _gameLogger.Information(message);
    }

    public void Log(string message)
    {
        RootLogger.Information(message);
    }

    public void LogPlayerAction(GameTurn turn)
    {
        var player = turn.Position;
        var playerLogger = GetOrCreatePlayerLogger(player);
        playerLogger.Information(turn.ToJson());
    }

    public void LogResult(GameResult Result)
    {
        var gameResultString = JsonSerializer.Serialize(Result, _jsonSetting);
        var message = $"Game set.{Environment.NewLine} {gameResultString}";

        RootLogger.Information(message);
    }

    public void Cleanup()
    {
        foreach (var loggerSet in _playerLoggers)
        {
            var logger = loggerSet.Value as Logger;
            logger?.Dispose();
        }

        _playerLoggers.Clear();

        var gameLogger = _gameLogger as Logger;
        gameLogger?.Dispose();
    }

    private Serilog.ILogger GetDefaultLogger()
        => new LoggerConfiguration().WriteTo.Console().CreateLogger();

    private Serilog.ILogger GetOrCreatePlayerLogger(int player)
    {
        if (string.IsNullOrWhiteSpace(_logPath))
        {
            return GetDefaultLogger();
        }

        if (_playerLoggers.ContainsKey(player) is false)
        {
            var logPath = Path.Combine(_logPath, $"{player}.log");
            _playerLoggers[player] = new LoggerConfiguration()
                .Enrich.WithProperty("gameId", _currentGame)
                .WriteTo
                .File(logPath, outputTemplate: "[{gameId}:{Timestamp:yyyy-MM-dd HH:mm:ss}] {NewLine}{Message:lj}{NewLine}")
                .CreateLogger();
        }

        return _playerLoggers[player];
    }
}
