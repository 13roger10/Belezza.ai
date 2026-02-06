@REM Maven Wrapper script for Windows
@echo off
setlocal

set BASEDIR=%~dp0
set WRAPPER_JAR=%BASEDIR%.mvn\wrapper\maven-wrapper.jar
set WRAPPER_PROPERTIES=%BASEDIR%.mvn\wrapper\maven-wrapper.properties

@REM Download Maven Wrapper if not present
if not exist "%WRAPPER_JAR%" (
    echo Downloading Maven Wrapper...
    for /f "tokens=2 delims==" %%a in ('findstr /i "wrapperUrl" "%WRAPPER_PROPERTIES%"') do set WRAPPER_URL=%%a
    powershell -Command "Invoke-WebRequest -Uri '%WRAPPER_URL%' -OutFile '%WRAPPER_JAR%'"
)

@REM Execute Maven
java %MAVEN_OPTS% -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*

endlocal
