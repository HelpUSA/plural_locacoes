@echo off
cd /d "%~dp0"
echo =============================
echo  Atualizando o repositório
echo =============================

git add .
git commit -m "Atualização automática"
git push

echo =============================
echo       Concluído!
echo =============================
pause
