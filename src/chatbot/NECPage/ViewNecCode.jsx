// // src/pages/ViewNecCode.jsx
// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const ViewNecCode = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { code, description, pdfUrl } = location.state || {};


//   // const code = 'NEC 210.8(A)';
//   // const description = 'This section mandates ground-fault protection for personnel in dwelling units, bathrooms, garages, and more.';
//   // const pdfUrl = 'https://hrb5wx2v-5008.inc1.devtunnels.ms/matched_pages/Split-books_Split3/NEC_Page_19_1_Split2023%20NEC%2070%20Handbook%20A_split_3.pdf';



//   // Optional: handle if no data is passed
//   if (!code || !description || !pdfUrl) {
//     return (
//       <div className="container py-5 text-center">
//         <h4 className="text-danger">No NEC code data provided.</h4>
//         <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-4">
//       <div className="card shadow">
//         <div className="card-body">
//           <h2 className="card-title text-primary mb-3">
//             Showing NEC Code: {code}
//           </h2>
//           <p className="card-text mb-4">{description}</p>

//           <div className="ratio ratio-16x9">
//             <iframe
//               title={`NEC Code PDF - ${code}`}
//               src={pdfUrl}
//               allowFullScreen
//             ></iframe>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewNecCode;

// // src/pages/ViewNecCode.jsx
// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';

// const ViewNecCode = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const query = new URLSearchParams(location.search);

//   const code = query.get('code');
//   const description = query.get('description');
//   const pdfUrl = query.get('pdfUrl');

//   // const code = 'NEC 210.8(A)';
//   // const description = 'This section mandates ground-fault protection for personnel in dwelling units, bathrooms, garages, and more.';
//   // const pdfUrl = 'https://hrb5wx2v-5008.inc1.devtunnels.ms/matched_pages/Split-books_Split3/NEC_Page_19_1_Split2023%20NEC%2070%20Handbook%20A_split_3.pdf';



//   if (!code) {
//     return (
//       <div className="container py-5 text-center">
//         <h4 className="text-danger">🚫 No NEC code data provided.</h4>
//         <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       {/* <div className="d-flex justify-content-between align-items-center mb-4">
//         <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
//           <FaArrowLeft className="me-2" /> Back
//         </button>
//         <h4 className="mb-0 text-muted">NEC Code Viewer</h4>
//       </div> */}

//       <div className="card shadow-lg border-0">
//         <div className="card-body">
//           <h2 className="card-title text-primary d-flex align-items-center mb-3">
//             <FaFilePdf className="me-2" /> {code}
//           </h2>
//           <p className="card-text fs-5 text-dark">{description}</p>

//           <div className="ratio ratio-16x9 border rounded shadow-sm mt-4">
//             <iframe
//               title={`NEC Code PDF - ${code}`}
//               src={pdfUrl}
//               className="rounded"
//               allowFullScreen
//             ></iframe>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewNecCode;import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf, FaSpinner } from 'react-icons/fa';
import { PDFDocument } from 'pdf-lib';
import { useEffect, useRef, useState } from 'react';

const ViewNecCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const code = query.get('code');
  const urls = JSON.parse(query.get('urls') || '[]');
  const descriptions = JSON.parse(query.get('descriptions') || '[]');

  const [mergedDescription, setMergedDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const mergedPdfUrlRef = useRef(null); // Use ref to avoid re-generating blob URL

  useEffect(() => {
    if (urls.length > 0) {
      mergePdfs(urls).then((url) => {
        mergedPdfUrlRef.current = url;
        setLoading(false);
      });

      const cleanDescriptions = descriptions
        .map((desc) => desc.replace(/\n/g, ' ').trim())
        .join(' ');
      setMergedDescription(cleanDescriptions);
    } else {
      setLoading(false);
    }

    // Clean up old blob URL on unmount
    return () => {
      if (mergedPdfUrlRef.current) {
        URL.revokeObjectURL(mergedPdfUrlRef.current);
      }
    };
  }, [urls, descriptions]);

  const mergePdfs = async (urls) => {
    const mergedPdf = await PDFDocument.create();

    for (const url of urls) {
      const pdfBytes = await fetch(url).then((res) => res.arrayBuffer());
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfFile = await mergedPdf.save();
    const mergedPdfBlob = new Blob([mergedPdfFile], { type: 'application/pdf' });
    return URL.createObjectURL(mergedPdfBlob);
  };

  if (!code) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">🚫 No NEC code data provided.</h4>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="card shadow-lg border-0">
        <div className="card-body">
          <h2 className="card-title text-primary d-flex align-items-center mb-3">
            <FaFilePdf className="me-2" /> {code}
          </h2>
          <p className="card-text fs-5 text-dark">{mergedDescription}</p>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center mt-5">
              <FaSpinner className="fa-spin me-2 text-primary" />
              <span>Loading PDF...</span>
            </div>
          ) : (
            <div className="ratio ratio-16x9 border rounded shadow-sm mt-4">
              <iframe
                title={`NEC Code PDF - ${code}`}
                src={mergedPdfUrlRef.current}
                className="rounded"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNecCode;
