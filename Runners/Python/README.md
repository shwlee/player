# PyHost Executable Build Guide

## Working Directory: `./Python/`

### 1. Activate PyEnv
Choose the appropriate command based on your shell environment.

- **PowerShell**
  ```powershell
  ./PyEnv/Scripts/Activate.ps1
  ```

- **CMD**
  ```cmd
  ./PyEnv/Scripts/activate.bat
  ```

- **Bash**
  ```bash
  source ./PyEnv/Scripts/activate
  ```

### 2. Install Requirements
If not already done, install dependencies from `requirements.txt`.

```bash
pip install -r requirements.txt
```

### 3. Build
Run the appropriate build command based on your operating system.

- **Windows**
  ```bash
  python3 setup.py build
  ```

- **Mac**
  ```bash
  python3 setup-mac.py build
  ```

### 4. Verify Build Directory
Check the build directory to confirm successful build completion.
