# Feature: Self-Serve Photo Upload & Session Handoff

This document tracks the tasks and specifications for the frontend photo upload intake and validation pipeline.

## Tasks
- [ ] Implement drag-and-drop file upload in `UploadBox.jsx`.
- [ ] Add file validation rules (formats: JPEG, PNG, WEBP; max size: 10MB).
- [ ] Save the uploaded file reference to the global React state or session context.
- [ ] Automatically redirect the user to the editor page once the upload is completed and validated.
