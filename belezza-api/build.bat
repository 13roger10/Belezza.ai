@echo off
setlocal
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10+7"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0"
java -cp ".mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
