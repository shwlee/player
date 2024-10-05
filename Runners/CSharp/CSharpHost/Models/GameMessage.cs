namespace CSharpHost.Models;

public record GameMessage(int Turn, int Position, int[] Map, int Current);