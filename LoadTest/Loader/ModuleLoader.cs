using PlayerLib;
using System.Reflection;

namespace LoadTest.Loader;

internal class ModuleLoader
{
	public static void TestJsModule()
	{
		var path = "../../../../JsPlayer/bin/Debug/netstandard2.1/JsPlayer.dll";
		var jsAssembly = Assembly.LoadFrom(path);
		var stream = jsAssembly.GetManifestResourceStream("JsPlayer.cloPlayer.js");
		using (var reader = new StreamReader(stream))
		{
			Console.WriteLine(reader.ReadToEnd());
		}
	}

	public static void TestLoadJsMediator()
	{
		var jsPlayer = CreateJsPlayer();
	}

	private static IPlayer CreateJsPlayer()
	{
		var path = "../../../../JsPlayer/bin/Debug/netstandard2.1/JsPlayer.dll";
		var jsAssembly = Assembly.LoadFrom(path);
		
		Type? playerType = null;
		var types = jsAssembly.GetExportedTypes();
		foreach (var type in types)
		{
			if (type.IsInterface || type.IsAbstract)
			{
				continue;
			}

			if (typeof(IPlayer).IsAssignableFrom(type))
			{
				playerType = type;
				break;
			}
		}

		if (playerType is null)
		{
			throw new Exception("JsPlayer load failed.");
		}

		if (Activator.CreateInstance(playerType) is not IPlayer player)
		{
			throw new Exception("JsPlayer instance create failed.");
		}

		return player;
	}

	public static void TestGetNameJsMediator()
	{
		var jsPlayer = CreateJsPlayer();
		var name = jsPlayer.GetName();
		Console.WriteLine(name);
	}

	public static void TestInstanceJsMediator()
	{
		var jsPlayer = CreateJsPlayer();
		var name = jsPlayer.GetName();
		Console.WriteLine(name);

		var myNumber = 10;
		var column = 20;
		var row = 10;
		jsPlayer.Initialize(myNumber, column, row);
	}

	public static void TestJsMoveNext()
	{
		var jsPlayer = CreateJsPlayer();
		var name = jsPlayer.GetName();
		Console.WriteLine(name);

		var myNumber = 0;
		var column = 20;
		var row = 10;
		jsPlayer.Initialize(myNumber, column, row);

		var map = Enumerable.Range(0, column * row).ToArray();
		for (var i = 0; i < 10; i++)
		{
			Console.WriteLine($"count:{i}, direction:{jsPlayer.MoveNext(map, myNumber)}");
		}
	}
}
