

// import React from 'react';
// import { X, Download, File as FileIcon, Mic } from 'lucide-react';

// const FilePreviewModal = ({ message, onClose, onDownload }) => {
//     if (!message) return null;
// const { mediaUrl, mediaType, text } = message;
//     const primaryType = mediaType?.split('/')[0];
//     const fileName = text || mediaUrl.split('/').pop().split('?')[0].split('-').slice(1).join('-') || 'file';

// const renderPreviewContent = () => {
//         switch (primaryType) {
//             case 'image':
//                 return <img src={mediaUrl} alt="Image Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg" />;
            
//             case 'video':
//                 return <video src={mediaUrl} controls autoPlay className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg" />;
            
//             case 'audio':
//                 return (
//                     <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg flex flex-col items-center gap-4 border border-gray-600">
//                         <Mic className="w-16 h-16 text-white" />
//                         <audio src={mediaUrl} controls autoPlay className="w-full max-w-md" />
//                         <p className="text-white mt-2 font-medium">{fileName}</p>
//                     </div>
//                 );
            
//             case 'application':
               
//                 if (mediaType === 'application/pdf') {
//                     const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(mediaUrl)}&embedded=true`;
//                     return <iframe src={googleDocsUrl} title="PDF Preview" className="w-full h-full border-0 rounded-lg bg-white shadow-2xl"></iframe>;
//                 }
//                 break;
            
           
//             default:
//                 return (
//                     <div className="bg-gray-900/90 w-full max-w-lg h-auto p-12 rounded-2xl flex flex-col items-center justify-center gap-6 text-white text-center border-2 border-dashed border-gray-600">
//                         <FileIcon className="w-24 h-24 text-gray-500" />
//                         <h3 className="text-2xl font-bold">Preview Not Available</h3>
//                         <p className="max-w-sm text-gray-400">A live preview for this file type ({mediaType}) is not supported.</p>
//                         <p className="font-mono bg-gray-700 px-4 py-2 rounded-lg text-sm mt-2 break-all">{fileName}</p>
//                     </div>
//                 );
//         }
//     };

//     return (
       
//         <div 
//             className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-25"
//             onClick={onClose} 
//         >
           
//             <div 
//                 className="relative bg-transparent rounded-xl w-[95vw] h-[90vh] max-w-6xl p-4 flex flex-col items-center justify-center"
//                 onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside the content area
//             >
//                 {/* Header with file name and action buttons */}
//                 <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent p-4 flex justify-between items-center z-10">
//                     <span className="text-white font-medium truncate pr-4">{fileName}</span>
//                     <div className="flex items-center gap-2">
//                         {/* Download button, calls the onDownload prop from ChatPage */}
//                         <button
//                             onClick={() => onDownload(message)}
//                             className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 shadow-lg"
//                             title="Download File"
//                         >
//                             <Download className="w-5 h-5" />
//                         </button>
//                         {/* Close button */}
//                         <button
//                             onClick={onClose}
//                             className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 transition-transform hover:scale-105 active:scale-95"
//                             title="Close Preview"
//                         >
//                             <X className="w-5 h-5" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* The main content area where the preview is rendered */}
//                 <div className="w-full h-full flex items-center justify-center">
//                     {renderPreviewContent()}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FilePreviewModal;
import React from 'react';
import { X, Download, File, Mic, FileText } from 'lucide-react';

const FilePreviewModal = ({ message, onClose, onDownload }) => {
    if (!message) return null;
    
    const { mediaUrl, mediaType, text } = message;
    const primaryType = mediaType?.split('/')[0];
    const fileName = text || mediaUrl.split('/').pop().split('?')[0].split('-').slice(1).join('-') || 'file';
    
    // Enhanced document type detection
    const isDocument = (mediaType) => {
        const documentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'text/rtf',
            'application/rtf'
        ];
        return documentTypes.includes(mediaType);
    };

    const renderPreviewContent = () => {
        console.log('Media Type:', mediaType); // Debug log
        console.log('Primary Type:', primaryType); // Debug log
        
        switch (primaryType) {
            case 'image':
                return (
                    <img 
                        src={mediaUrl} 
                        alt="Image Preview" 
                        className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg" 
                    />
                );
            
            case 'video':
                return (
                    <video 
                        src={mediaUrl} 
                        controls 
                        autoPlay 
                        className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg" 
                    />
                );
            
            case 'audio':
                return (
                    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg flex flex-col items-center gap-4 border border-gray-600">
                        <Mic className="w-16 h-16 text-white" />
                        <audio src={mediaUrl} controls autoPlay className="w-full max-w-md" />
                        <p className="text-white mt-2 font-medium">{fileName}</p>
                    </div>
                );
            
            case 'text':
                // Handle plain text files
                return (
                    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-lg flex flex-col items-center gap-4 border border-gray-600 max-w-4xl">
                        <FileText className="w-16 h-16 text-white" />
                        <iframe 
                            src={mediaUrl} 
                            title="Text Preview" 
                            className="w-full h-[60vh] border-0 rounded-lg bg-white shadow-2xl"
                        />
                        <p className="text-white mt-2 font-medium">{fileName}</p>
                    </div>
                );
            
            case 'application':
                // Enhanced document handling
                if (isDocument(mediaType)) {
                    // Try Google Docs viewer for various document types
                    const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(mediaUrl)}&embedded=true`;
                    return (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <iframe 
                                src={googleDocsUrl} 
                                title="Document Preview" 
                                className="w-full h-full border-0 rounded-lg bg-white shadow-2xl"
                                onError={(e) => {
                                    console.error('Google Docs viewer failed:', e);
                                    // Fallback could be added here
                                }}
                            />
                        </div>
                    );
                }
                // Fall through to default for non-document application types
                break;
            
            default:
                break;
        }
        
        // Default fallback for unsupported types
        return (
            <div className="bg-gray-900/90 w-full max-w-lg h-auto p-12 rounded-2xl flex flex-col items-center justify-center gap-6 text-white text-center border-2 border-dashed border-gray-600">
                <File className="w-24 h-24 text-gray-500" />
                <h3 className="text-2xl font-bold">Preview Not Available</h3>
                <p className="max-w-sm text-gray-400">
                    A live preview for this file type ({mediaType || 'unknown'}) is not supported.
                </p>
                <p className="font-mono bg-gray-700 px-4 py-2 rounded-lg text-sm mt-2 break-all">
                    {fileName}
                </p>
                <div className="mt-4 text-sm text-gray-400">
                    <p>Supported formats:</p>
                    <p>• Images, Videos, Audio</p>
                    <p>• PDF, Word, Excel, PowerPoint</p>
                    <p>• Plain text files</p>
                </div>
            </div>
        );
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-25"
            onClick={onClose} 
        >
            <div 
                className="relative bg-transparent rounded-xl w-[95vw] h-[90vh] max-w-6xl p-4 flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with file name and action buttons */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent p-4 flex justify-between items-center z-10">
                    <span className="text-white font-medium truncate pr-4" title={fileName}>
                        {fileName}
                    </span>
                    <div className="flex items-center gap-2">
                        {/* Download button */}
                        <button
                            onClick={() => onDownload(message)}
                            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95 shadow-lg"
                            title="Download File"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 transition-transform hover:scale-105 active:scale-95"
                            title="Close Preview"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Debug info - remove in production */}
               

                {/* The main content area where the preview is rendered */}
                <div className="w-full h-full flex items-center justify-center">
                    {renderPreviewContent()}
                </div>
            </div>
        </div>
    );
};

export default FilePreviewModal;