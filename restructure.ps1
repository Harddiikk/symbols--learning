Remove-Item -Path client\node_modules -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path client -Force | Move-Item -Destination . -Force
Remove-Item -Path client -Recurse -Force
Remove-Item -Path server -Recurse -Force
git add -A
git commit -m "chore: Move React app to repository root for Vercel deployment"
git push origin main
