using PlayerLib;
using System.Reflection;

namespace CSharpHost.Services;

public class CSharpRunner : IPlayer
{
    private MethodInfo? _getName;
    private MethodInfo? _intialize;
    private MethodInfo? _moveNext;
    private object? _runningInstance;

    public void Setup(string path)
    {
        var (type, instance) = PlayerFactory.LoadCodeModule(path);
        if (type is null)
        {
            throw new InvalidOperationException($"player type is null. path:{path}");
        }

        if (instance is null)
        {
            throw new InvalidOperationException($"player instance is null. path:{path}");
        }

        _runningInstance = instance;

        _getName = type.GetMethod(nameof(IPlayer.GetName));
        _intialize = type.GetMethod(nameof(IPlayer.Initialize));
        _moveNext = type.GetMethod(nameof(IPlayer.MoveNext));
    }

    public string GetName()
    {
        var name = _getName?.Invoke(_runningInstance, null) ?? string.Empty;
        return (string)name;
    }

    public void Initialize(int myNumber, int column, int row)
    {
        _intialize?.Invoke(_runningInstance, [myNumber, column, row]);
    }

    public int MoveNext(int[] map, int myPosition)
    {
        var nextDiection = _moveNext?.Invoke(_runningInstance, [map, myPosition]) ?? throw new InvalidOperationException("move next module is null");
        return (int)nextDiection;
    }
}
