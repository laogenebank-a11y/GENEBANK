# GENEBANK — ລະບົບຕິດຕາມອຸປະກອນ Lao ທະນາຄານເຊື້ອພັນ

ໄຟລ໌: `index.html` `style.css` `app.js` `config.js` (ໜ້າເວັບ) · `Code.gs` (ຖານຂໍ້ມູນ Google Sheet + Drive)

## ຂັ້ນຕອນທີ 1: Google Sheet + Apps Script
1. ສ້າງ Google Sheet ໃໝ່ ຊື່ `GENEBANK`
2. ເມນູ **Extensions → Apps Script** → ລຶບໂຄ້ດເດີມ → ວາງໂຄ້ດຈາກ `Code.gs` ທັງໝົດ (ປ່ຽນ `PASS` ຖ້າຕ້ອງການ)
3. ກົດ **Deploy → New deployment → Web app**: Execute as = **Me**, Who has access = **Anyone** → Deploy
4. ອະນຸຍາດສິດ (Google Sheet + Drive) ແລ້ວ **ກ໊ອບ Web app URL** (ລົງທ້າຍ `/exec`)
5. ຖ້າແກ້ `Code.gs` ພາຍຫຼັງ ຕ້ອງ Deploy → Manage deployments → New version

ຊີດ `Items`, `Logs`, `Lists` ແລະ ໂຟນເດີ Drive `GENEBANK_Photos` ຈະຖືກສ້າງອັດຕະໂນມັດ.

## ຂັ້ນຕອນທີ 2: ໃສ່ URL
ເປີດ `config.js` ແລ້ວແທນ `PASTE_YOUR_APPS_SCRIPT_URL_HERE` ດ້ວຍ URL ຈາກຂັ້ນຕອນ 1

## ຂັ້ນຕອນທີ 3: GitHub
1. github.com → **New repository** ຊື່ `GENEBANK`
2. **Add file → Upload files** → ລາກໄຟລ໌ທັງໝົດ (ຫຼັງແຕກ ZIP) ຂື້ນ → **Commit**

## ຂັ້ນຕອນທີ 4: Cloudflare Pages (…pages.dev)
1. dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**
2. ເລືອກ repo `GENEBANK` → Framework preset: **None** · Build command: *(ຫວ່າງ)* · Output directory: `/`
3. **Save and Deploy** → ໄດ້ລິ້ງ `genebank.pages.dev`

## ໝາຍເຫດ
- ສະແກນ Barcode ໃຊ້ໄດ້ໃນ Chrome ມືຖື Android (ເບຣາເຊີອື່ນຈະໃຫ້ພິມ ID)
- ລະຫັດແກ້ໄຂຖືກກວດຢູ່ Apps Script (ບໍ່ໄດ້ຢູ່ໃນໜ້າເວັບ)
- ໃຜມີ URL ຂອງ Apps Script ສາມາດຍິງ API ໄດ້ — ຢ່າແຊຣ໌ URL ສາທາລະນະ
