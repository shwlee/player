using Jint;
using PlayerLib;
using System.IO;
using System.Reflection;

namespace JsPlayer
{
	public class JsMediator : IPlayer
	{
		private string _script;
		private Engine _jsEngine;

		public JsMediator()
		{
			_script = ReadScript();
			_jsEngine = new Engine().Execute(_script);
		}

		public string GetName() 
			=> _jsEngine.Invoke("GetName").AsString(); // JsValue 가 null 이면 그냥 터져야한다.			

		public void Initialize(int myNumber, int column, int row) 
			=> _ = _jsEngine.Invoke("Initialize", myNumber, column, row);

		public int MoveNext(int[] map, int myPosition) 
			=> (int)_jsEngine.Invoke("MoveNext", map, myPosition).AsNumber();

		private string ReadScript()
		{
			var assembly = Assembly.GetExecutingAssembly();
			var stream = assembly.GetManifestResourceStream("JsPlayer.player.js");
			using (var reader = new StreamReader(stream))
			{
				return reader.ReadToEnd();
			}
		}

		#region Testable

		public (int myNumber, int column, int row) GetInstanceMembers()
		{
			var myNum = _jsEngine.GetValue("_myNumber");
			var column = _jsEngine.GetValue("_column");
			var row = _jsEngine.GetValue("_row");
			return ((int)myNum.AsNumber(), (int)column.AsNumber(), (int)row.AsNumber());
		}

		#endregion
	}
}
