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
}
