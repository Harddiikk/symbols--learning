import { useState, useRef } from 'react';
import { UploadCloud, X, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'react-hot-toast';

export default function UploadModal({ isOpen, onClose, onUploadComplete }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const processFile = (selectedFile) => {
    if (selectedFile?.type !== 'text/csv' && !selectedFile?.name.endsWith('.csv')) {
      toast.error("Please upload a valid CSV file.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Simulate API delay
        setTimeout(() => {
          setIsUploading(false);
          onUploadComplete(results.data);
          toast.success(`Successfully mapped ${results.data.length} leads!`);
          setFile(null);
          onClose();
        }, 1500);
      },
      error: (error) => {
        setIsUploading(false);
        toast.error(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-liquid-text/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="glass-panel w-full max-w-lg p-8 relative z-10 animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 text-liquid-textMuted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold text-liquid-text mb-2">Import Leads</h2>
        <p className="text-liquid-textMuted mb-6">Upload a CSV file to add new leads to your pipeline.</p>

        {!file ? (
          <div 
            className={`
              w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-200
              ${isDragActive ? 'border-liquid-primary bg-liquid-primary/5' : 'border-liquid-border/80 hover:border-liquid-primary/50 hover:bg-white/30'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-liquid-text">
              Click or drag and drop your file here
            </p>
            <p className="text-xs text-liquid-textMuted mt-1">CSV files only (max. 10MB)</p>
          </div>
        ) : (
          <div className="w-full rounded-xl border border-liquid-border/80 p-4 bg-white/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-50">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
              </div>
              <div className="truncate pr-4 max-w-[250px]">
                <p className="font-medium text-sm text-liquid-text truncate">{file.name}</p>
                <p className="text-xs text-liquid-textMuted">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-1.5 rounded-md hover:bg-red-50 text-liquid-textMuted hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="btn-secondary"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`btn-primary flex items-center space-x-2 ${(!file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? (
              <span>Mapping Data...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Import Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
