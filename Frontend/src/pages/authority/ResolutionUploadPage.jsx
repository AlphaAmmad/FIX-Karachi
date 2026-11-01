import React from 'react';
import { Navigate } from 'react-router-dom';
// Resolution upload functionality is now embedded in ComplaintDetailsPage
const ResolutionUploadPage = () => <Navigate to="/authority/complaints" replace />;
export default ResolutionUploadPage;