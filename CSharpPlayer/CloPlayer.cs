using PlayerLib;
using System;

namespace CSharpPlayer
{
	/// <summary>
	/// sample player 입니다. 이 클래스에 추가 작성해도 좋고 별도의 프로젝트에 다시 작성해도 무방합니다.
	/// <para>클래스 이름에 특별한 제한은 없습니다. 접근제한자를 public 으로 지정해주세요.</para>
	/// </summary>
	public class CloPlayer : IPlayer
	{
		private int _myNumber;
		private int _column;
		private int _row;

		public string GetName()
		{
			return "CLO_Dummy";
		}

		public void Initialize(int myNumber, int column, int row)
		{
			_myNumber = myNumber;
			_column = column;
			_row = row;
		}

		public int MoveNext(int[] map, int myPosition)
		{
			var random = new Random();
			var direction = random.Next(4);
			return direction;
		}
	}
}
