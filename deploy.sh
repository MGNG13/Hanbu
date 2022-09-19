git remote remove origin
git remote add origin https://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@github.com/MGNG13/Hanbu
git add -A
git commit -am "Version $(git rev-list --all --count). Commited on $(date '+%B %e %Y, %T')."
git push -f -u origin main