import React from 'react';
import { Navigate } from 'react-router-dom';
// UpdateStatusPage functionality is now embedded in ComplaintDetailsPage
const UpdateStatusPage = () => <Navigate to="/authority/complaints" replace />;
export default UpdateStatusPage;