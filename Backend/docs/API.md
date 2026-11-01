# API Documentation

Base path: `/api`

## Auth

- `POST /auth/citizen/register`
- `POST /auth/citizen/login`
- `POST /auth/authority/login`
- `POST /auth/admin/login`

## Citizen Complaints

- `POST /complaints`
- `GET /complaints/mine`
- `GET /complaints/:id`
- `GET /complaints/:id/timeline`
- `POST /complaints/:id/escalate`
- `GET /complaints/sync?updatedSince=...`

## Authority

- `GET /authority/complaints`
- `GET /authority/complaints/:id`
- `PATCH /authority/complaints/:id/status`
- `POST /authority/child-accounts`
- `POST /authority/fake-reports`

## Admin

- `GET /admin/users`
- `GET /admin/authorities`
- `POST /admin/authorities`
- `PATCH /admin/users/:id/block`
- `PATCH /admin/users/:id/unblock`
- `DELETE /admin/authorities/:id`
- `POST /admin/notifications/broadcast`
- `GET /admin/escalations`
- `PATCH /admin/escalations/:id`
- `GET /admin/analytics`
- `GET /admin/complaints`
- `GET /admin/fake-reports`
- `PATCH /admin/fake-reports/:id/review`
- `PATCH /admin/authorities/:id/block`
- `PATCH /admin/authorities/:id/unblock`

## Notifications

- `GET /notifications`
- `GET /notifications/unread-count`
- `PATCH /notifications/:id/read`

## Offline Sync

- `GET /sync?updatedSince=...`

## Public

- `GET /public/dashboard`
- `GET /public/complaints/recent`
- `GET /public/complaints/categories`

## Response Shape

All endpoints return a JSON object with `success`, `message`, and `data` when successful.
