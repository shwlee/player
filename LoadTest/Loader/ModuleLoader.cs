using JsPlayer;
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
		var jsPlayer = new JsMediator();
	}

	public static void TestGetNameJsMediator()
	{
		var jsPlayer = new JsMediator();
		var name = jsPlayer.GetName();
		Console.WriteLine(name);
	}

	public static void TestInstanceJsMediator()
	{
		var jsPlayer = new JsMediator();
		var name = jsPlayer.GetName();
		Console.WriteLine(name);

		var myNumber = 10;
		var column = 20;
		var row = 10;
		jsPlayer.Initialize(myNumber, column, row);

		var (loadedMyNumber, loadedColumn, loadedRow) = jsPlayer.GetInstanceMembers();
		Console.WriteLine($"loaded-myNum:{loadedMyNumber}, column:{loadedColumn}, row:{loadedRow}" ); 
	}
}
