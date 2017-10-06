@echo off
set source_path=excel
REM set file_name=tplt_map
REM set target_path_client=..\client\src\Data
REM set target_path_server=..\server\Tplt\Templates
::数据生成
call tools\data2lua.exe -dir %source_path% -ext .xml
call tools\lua\lua.exe -e "local main=dofile('data_generate.lua') main('%source_path%', '%file_name%')"
::单个lua文件
REM if "" == "%file_name%" goto case1
REM copy %file_name%.lua %target_path_client%
REM copy %file_name%.php %target_path_server%
REM goto end
::多个lua文件
:case1
REM xcopy /e/y %source_path%\*.lua %target_path_client%
REM xcopy /e/y %source_path%\*.php %target_path_server%
REM goto end
:end
REM del %source_path%\*.lua
REM del %source_path%\*.js
REM del %source_path%\*.php