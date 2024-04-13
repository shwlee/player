using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using System.Diagnostics;
using System.Reflection;

namespace CSharpHost.Services;

public class PlayerFactory
{
    public static (Type?, object?) LoadCodeModule(string filePath)
    {
        var code = File.ReadAllText(filePath);

        // Set up the compilation options
        var compilationOptions = new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary);

        // Add necessary references
        var references = new[]
        {
            MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
            MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
            MetadataReference.CreateFromFile(typeof(System.Runtime.AssemblyTargetedPatchBandAttribute).Assembly.Location),
            MetadataReference.CreateFromFile(Assembly.Load("System.Runtime").Location)
        };

        // Compile the code
        var syntaxTree = SyntaxFactory.ParseSyntaxTree(code);
        var compilation = CSharpCompilation.Create("Player")
            .WithOptions(compilationOptions)
            .AddReferences(references)
            .AddSyntaxTrees(syntaxTree);

        using var ms = new MemoryStream();
        var emitResult = compilation.Emit(ms);

        if (emitResult.Success is false)
        {
            // Handle compilation errors
            foreach (var diagnostic in emitResult.Diagnostics)
            {
                Debug.WriteLine(diagnostic.ToString());
            }

            throw new Exception("Can't load code to assembly");
        }

        ms.Seek(0, SeekOrigin.Begin);

        // Load the compiled assembly
        var assembly = Assembly.Load(ms.ToArray());

        // Execute the library code
        var player = assembly.GetType("CSharpPlayer.Player");
        var instance = Activator.CreateInstance(player);
        return (player, instance);
    }
}
