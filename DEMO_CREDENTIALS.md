# FixKarachi — Demo Login Credentials

Run database setup before using these accounts:

```bash
cd Backend
npm run db:migrate
npm run db:seed
```

Default password for all seeded accounts: **`ChangeMe123!`**

Override via `.env` (`ADMIN_PASSWORD`, `AUTHORITY_SEED_PASSWORD`, `CITIZEN_SEED_PASSWORD`).

---

## Citizen (Step 1 of judge demo)

| Field    | Value                    |
|----------|--------------------------|
| Role     | Citizen                  |
| Email    | `citizen@fixkarachi.pk`  |
| Password | `ChangeMe123!`           |

---

## KMC Authority (Step 4 of judge demo)

| Field    | Value                    |
|----------|--------------------------|
| Role     | Authority                |
| Email    | `kmc@fixkarachi.pk`      |
| Password | `ChangeMe123!`           |
| Org      | KMC                      |

---

## Admin

| Field    | Value                    |
|----------|--------------------------|
| Role     | Admin                    |
| Email    | `admin@fixkarachi.pk`    |
| Password | `ChangeMe123!`           |

---

## Other seeded authorities (same password)

| Organization   | Email                         |
|----------------|-------------------------------|
| KE             | `ke@fixkarachi.pk`            |
| Fire Brigade   | `firebrigade@fixkarachi.pk`   |
| Water Board    | `waterboard@fixkarachi.pk`    |
| Traffic Police | `trafficpolice@fixkarachi.pk` |

---

## 8-step judge demo flow

1. Login as **citizen@fixkarachi.pk**
2. Submit a **Garbage** complaint with photo + GPS
3. System auto-assigns to **KMC**
4. Login as **kmc@fixkarachi.pk** → see assigned complaint
5. Set status to **In Progress**
6. Upload **resolution proof** (required) and mark **Resolved**
7. Login as citizen again → view status + before/after images
8. Open **Public Transparency Dashboard** (`/dashboard`) → verify updated stats
