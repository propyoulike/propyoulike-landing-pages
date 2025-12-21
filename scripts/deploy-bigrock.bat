@echo off
echo 🚀 Deploying PropyouLike to BigRock...

"C:\Program Files (x86)\WinSCP\winscp.com" ^
  /log=deploy.log ^
  /command ^
    "open PropyouLike-BigRock" ^
    "option batch on" ^
    "option confirm off" ^
    "synchronize remote -delete dist /" ^
    "exit"

echo ✅ Deployment completed
