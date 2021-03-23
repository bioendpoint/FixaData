@echo off

set rpath=D:\fixaData2\bin\R-3.5.0 

setx R_HOME "D:\fixaData2\bin\R-3.5.0" 
setx LD_LIBRARY_PATH "D:\fixaData2\bin\R-3.5.0\bin;D:\fixaData2\bin\R-3.5.0\library"
setx PATH "D:\fixaData2\bin\R-3.5.0\bin\x64;D:\fixaData2\bin\R-3.5.0\library\rJava\jri\x64;"
exit