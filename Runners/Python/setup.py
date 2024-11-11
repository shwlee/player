from cx_Freeze import setup, Executable

# Include necessary files and packages
includes = []
packages = ["uvicorn", "fastapi"]
excludes = []

# Specify the main file to run the FastAPI application
executables = [
    Executable(
        script="PyHost/main.py",  # Path to your FastAPI entry point
        target_name="pyhost_app.exe",  # Name of the executable
    )
]

setup(
    name="PyHostApp",
    version="1.0",
    description="FastAPI application bundled as an executable",
    options={
        "build_exe": {
            "packages": packages,
            "includes": includes,
            "excludes": excludes,
            "include_files": ["PyHost/models", "PyHost/routes", "PyHost/services"],  # Include additional folders
        }
    },
    executables=executables
)
