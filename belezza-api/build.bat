@echo off
SETLOCAL EnableDelayedExpansion

REM Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"

REM Remove trailing backslash if present
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

REM Set Maven options with proper quoting
set "MAVEN_OPTS=-Dmaven.multiModuleProjectDirectory=%SCRIPT_DIR%"

REM Set wrapper JAR path
set "WRAPPER_JAR=%SCRIPT_DIR%\.mvn\wrapper\maven-wrapper.jar"

echo =====================================
echo Belezza API - Maven Build
echo =====================================
echo.
echo Script Directory: %SCRIPT_DIR%
echo Wrapper JAR: %WRAPPER_JAR%
echo.

REM Check if wrapper JAR exists
if not exist "%WRAPPER_JAR%" (
    echo ERROR: Maven wrapper JAR not found!
    exit /b 1
)

REM Check command line argument
set "COMMAND=%~1"
if "%COMMAND%"=="" set "COMMAND=compile"

echo Running: mvn %COMMAND%
echo.

REM Execute Maven with proper quoting
java %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%SCRIPT_DIR%" org.apache.maven.wrapper.MavenWrapperMain %COMMAND% -DskipTests

set "EXIT_CODE=%ERRORLEVEL%"

echo.
if %EXIT_CODE%==0 (
    echo =====================================
    echo BUILD SUCCESS!
    echo =====================================
) else (
    echo =====================================
    echo BUILD FAILED! Exit code: %EXIT_CODE%
    echo =====================================
)

exit /b %EXIT_CODE%
