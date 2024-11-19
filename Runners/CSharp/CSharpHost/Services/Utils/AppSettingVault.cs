using System.Diagnostics;
using CSharpHost.configs;
using CSharpHost.Contracts;
using Microsoft.Extensions.Options;

namespace CSharpHost.Services.Utils;

public class AppSettingVault(IOptions<AppSettings> options) : IAppSettingVault
{
    private readonly AppSettings _appSettings = options.Value;

    public string GetGameLoggerRootPath()
        => Path.Combine(AppDomain.CurrentDomain.BaseDirectory,
            _appSettings.GameLog?.RootPath ?? throw new Exception("Can not get game logger root path."));
}
