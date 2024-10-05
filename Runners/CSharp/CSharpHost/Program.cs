using CSharpHost.configs;
using CSharpHost.Contracts;
using CSharpHost.Extensions;
using CSharpHost.Services;
using CSharpHost.Services.Utils;

var builder = WebApplication.CreateBuilder(args);
int? port = null;

if (args.Length > 0)
{
    port = int.Parse(args[0]);
}

// load configs(appsettings.json)
builder.Configuration.AddJsonFile($"./configs/appsettings.json");
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection(nameof(AppSettings)));

builder.Services.AddTransient<IPlayerLoader, PlayerLoader>();
builder.Services.AddSingleton<IPlayerService, PlayerService>();
builder.Services.AddSingleton<IGameService, GameService>();
builder.Services.AddSingleton<IAppSettingVault, AppSettingVault>();
builder.Services.AddSingleton<IGameLogger, GameLogger>();

builder.Services.AddControllers();
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
