using CSharpHost.Contracts;
using CSharpHost.Extensions;
using CSharpHost.Services;

var builder = WebApplication.CreateBuilder(args);
int? port = null;

if (args.Length > 0)
{
    port = int.Parse(args[0]);
}

// Add services to the container.

builder.Services.AddTransient<IPlayerLoader, PlayerLoader>();
builder.Services.AddSingleton<IPlayerService, PlayerService>();
builder.Services.AddSingleton<IGameService, GameService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.WebHost.UseUrls($"http://localhost:{port ?? 50923}");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseMiddleware<ExceptionHandlingMiddlewear>();

app.Run();
