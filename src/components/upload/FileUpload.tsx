"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUploaded: (file: File, data: any[]) => void;
  acceptedFormats?: string[];
  maxSize?: number;
}

export default function FileUpload({
  onFileUploaded,
  acceptedFormats = [".csv", ".xlsx", ".xls"],
  maxSize = 10 * 1024 * 1024, // 10MB
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
      return;
    }

    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isValidType = acceptedFormats.some(format => 
      file.name.toLowerCase().endsWith(format.replace(".", ""))
    );

    if (!isValidType) {
      setError(`Please upload ${acceptedFormats.join(", ")} files only`);
      return;
    }

    setFile(file);
    simulateUpload(file);
  }, [acceptedFormats, maxSize]);

  const simulateUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      // Parse the file
      const text = await file.text();
      const rows = parseCSV(text);
      
      // Complete upload
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        onFileUploaded(file, rows);
        setUploading(false);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setError("Failed to parse file. Please check the format.");
      setUploading(false);
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n");
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(",").map(h => h.trim());
    const rows = [];
    
    for (let i = 1; i < Math.min(lines.length, 100); i++) { // Limit to 100 rows for preview
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(",");
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || "";
      });
      
      rows.push(row);
    }
    
    return rows;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const removeFile = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    setUploading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary hover:bg-gray-50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="font-medium">
              {isDragActive
                ? "Drop the file here"
                : "Drag & drop your file here"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse
            </p>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Supported formats: {acceptedFormats.join(", ")}
            <br />
            Max size: {formatFileSize(maxSize)}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
            </div>
          ) : (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                File uploaded successfully! Ready for analysis.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}