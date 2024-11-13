# PyHost Executable Build Guide

## Working Directory: `./Python/`

### 1. Create and activate PyEnv
Choose the appropriate command based on your shell environment.
Running this script will create a virtual environment and install the required packages.

- **PowerShell**
  ```powershell
  .\PyEnv.ps1
  ```

- **Bash**
  ```bash
  sh ./PyEnv.sh
  ```

### 2. Build
Run the appropriate build command based on your operating system.

- **Windows**
  ```powershell
  python setup.py build
  ```

- **Bash**
  ```bash
  python setup-mac.py build
  ```

### 3. Check Build Directory
Check the build directory to confirm successful build completion.

- **Windows**
  ```powershell
  {build directory}/PyHost.exe 8001
  ```

- **Bash**
  ```bash
  {build directory}/PyHost 8001
  ```