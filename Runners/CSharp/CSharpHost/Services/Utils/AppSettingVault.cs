using CSharpHost.configs;
using CSharpHost.Contracts;
using Microsoft.Extensions.Options;

namespace CSharpHost.Services.Utils;

public class AppSettingVault(IOptions<AppSettings> options) : IAppSettingVault
{
    private readonly AppSettings _appSettings = options.Value;

    public string GetGameLoggerRootPath()
        => _appSettings.GameLog?.RootPath ?? throw new Exception("Can not get game logger root path.");
}
