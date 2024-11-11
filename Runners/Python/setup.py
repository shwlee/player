from cx_Freeze import setup, Executable

includes = []
packages = ["uvicorn", "fastapi"]
excludes = []

executables = [
    Executable(
        script="PyHost/main.py",
        target_name="PyHost.exe",
    )
]

setup(
    name="PyHost",
    version="1.0",
    description="FastAPI application bundled as an executable",
    options={
        "build_exe": {
            "packages": packages,
            "includes": includes,
            "excludes": excludes,
            "include_files": ["PyHost/models", "PyHost/routes", "PyHost/services"],
        }
    },
    executables=executables
)
