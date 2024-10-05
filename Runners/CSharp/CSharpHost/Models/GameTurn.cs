namespace CSharpHost.Models;

public record GameTurn(int Turn, int Position, int[] Map, int Current,  MoveDirection Result)
{
    public string ToJson()
    {
        var format = 
"""
{{
    "turn":{0},
    "position":{1},
    "map":[{2}],
    "current":{3},
    "result":({4}){5}
}}
""";
        return string.Format(format, Turn, Position, string.Join(',', Map), Current, (int)Result, Result.ToString());
    }
}
