# Netlify Deploy Fix

Perbaikan ini menghindari error npm `Exit handler never called` di Netlify dengan memakai Yarn untuk install dependency.

Konfigurasi utama:
- `.nvmrc` = Node 20.19.5
- `netlify.toml` memakai `yarn build`
- `package.json` memakai `packageManager: yarn@1.22.22`
- script build disederhanakan menjadi `vite build`

Setelah file direplace di repository:
1. Commit dan push ke GitHub.
2. Di Netlify pilih Deploys -> Trigger deploy -> Deploy project without cache.
