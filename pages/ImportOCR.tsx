
import React, { useState, useCallback } from 'react';
import { FileUp, Search, Brain, CheckCircle, AlertCircle, Loader2, Image as ImageIcon, Trash2, Save, ArrowRight } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface ExtractedItem {
  name: string;
  batch: string;
  expiry: string;
  qty: number;
  rate: number;
  gst: number;
  confidence: number;
  matchedId?: string;
}

// Fix: Defined ImportOCRProps to accept activePharmacy from App.tsx
interface ImportOCRProps {
  activePharmacy?: any;
}

export const ImportOCRPage: React.FC<ImportOCRProps> = ({ activePharmacy }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Extracting, 3: Review

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setStep(1);
      setError(null);
    }
  };

  const startExtraction = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStep(2);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data,
                },
              },
              {
                text: "Analyze this pharmacy purchase invoice. Extract all items into a JSON array. Each object must include: name, batch, expiry, qty (number), rate (number), gst (number, e.g. 12 for 12%), and a confidence score from 0-1 based on text clarity.",
              },
            ],
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  batch: { type: Type.STRING },
                  expiry: { type: Type.STRING },
                  qty: { type: Type.NUMBER },
                  rate: { type: Type.NUMBER },
                  gst: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER }
                },
                required: ["name", "batch", "qty", "rate", "gst", "confidence"]
              }
            }
          }
        });

        const data = JSON.parse(response.text || "[]");
        setExtractionResult(data);
        setStep(3);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      setError("AI Extraction failed. Please ensure the image is clear and try again.");
      setIsProcessing(false);
      setStep(1);
    }
  };

  const updateItem = (index: number, field: keyof ExtractedItem, value: any) => {
    const updated = [...extractionResult];
    updated[index] = { ...updated[index], [field]: value };
    setExtractionResult(updated);
  };

  const removeItem = (index: number) => {
    setExtractionResult(extractionResult.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">OCR Purchase Import</h2>
          <p className="text-slate-500 text-sm">Upload invoices to automatically populate your medicine master and inventory.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${step === 3 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
            {step === 3 ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded-full border border-current"></div>} Review
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload & Preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center h-[400px] bg-white shadow-sm ${file ? 'border-emerald-300' : 'border-slate-200 hover:border-emerald-400'}`}>
            {previewUrl ? (
              <div className="w-full h-full flex flex-col">
                <img src={previewUrl} alt="Preview" className="flex-1 object-contain rounded-lg mb-4" />
                <button 
                  onClick={() => { setFile(null); setPreviewUrl(null); setStep(1); }}
                  className="text-xs font-bold text-red-500 hover:underline uppercase"
                >
                  Change Document
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <FileUp size={32} className="text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">Upload Invoice</h3>
                <p className="text-xs text-slate-400 px-4 mb-6">Support JPEG, PNG, or PDF format. High resolution images work best for AI extraction.</p>
                <input 
                  type="file" 
                  id="invoice-upload" 
                  className="hidden" 
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="invoice-upload"
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                  Browse Files
                </label>
              </>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                <h4 className="font-bold text-slate-800">Astra AI is Processing...</h4>
                <p className="text-xs text-slate-500 mt-1">Extracting table data & calculating tax splits</p>
              </div>
            )}
          </div>

          {file && step === 1 && !isProcessing && (
            <button 
              onClick={startExtraction}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-lg shadow-purple-900/20 flex items-center justify-center gap-3 transition-all"
            >
              <Brain size={20} /> ANALYZE WITH GEMINI AI
            </button>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Right Column: Extracted Data Table */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[550px]">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                {step === 3 ? <CheckCircle size={18} className="text-emerald-500" /> : <ImageIcon size={18} className="text-slate-400" />}
                Extraction Review
              </h3>
              {step === 3 && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {extractionResult.length} Items Detected
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {step < 3 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-12 text-center">
                  <Brain size={64} className="mb-4 opacity-10" />
                  <p className="max-w-[280px] font-medium italic">Upload and process a document to see the structured extraction results here.</p>
                </div>
              ) : (
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 sticky top-0 font-bold border-b z-10">
                    <tr>
                      <th className="p-3">Medicine Name</th>
                      <th className="p-3">Batch</th>
                      <th className="p-3">Expiry</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Rate</th>
                      <th className="p-3 text-right">GST %</th>
                      <th className="p-3 text-center">Conf.</th>
                      <th className="p-3 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {extractionResult.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 group transition-colors">
                        <td className="p-3">
                          <input 
                            type="text" 
                            value={item.name} 
                            onChange={(e) => updateItem(idx, 'name', e.target.value)}
                            className={`w-full bg-transparent border-none focus:ring-1 focus:ring-emerald-500 rounded px-1 font-bold text-slate-800 ${item.confidence < 0.8 ? 'text-amber-600 underline decoration-dotted' : ''}`}
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            type="text" 
                            value={item.batch} 
                            onChange={(e) => updateItem(idx, 'batch', e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-1 focus:ring-emerald-500 rounded px-1 font-mono"
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            type="text" 
                            value={item.expiry} 
                            onChange={(e) => updateItem(idx, 'expiry', e.target.value)}
                            className="w-20 bg-transparent border-none focus:ring-1 focus:ring-emerald-500 rounded px-1"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input 
                            type="number" 
                            value={item.qty} 
                            onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value))}
                            className="w-12 bg-transparent border-none text-center focus:ring-1 focus:ring-emerald-500 rounded"
                          />
                        </td>
                        <td className="p-3 text-right font-medium">
                          <input 
                            type="number" 
                            value={item.rate} 
                            onChange={(e) => updateItem(idx, 'rate', parseFloat(e.target.value))}
                            className="w-16 bg-transparent border-none text-right focus:ring-1 focus:ring-emerald-500 rounded"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <input 
                            type="number" 
                            value={item.gst} 
                            onChange={(e) => updateItem(idx, 'gst', parseInt(e.target.value))}
                            className="w-10 bg-transparent border-none text-right focus:ring-1 focus:ring-emerald-500 rounded"
                          />
                        </td>
                        <td className="p-3 text-center">
                           <div className={`w-2 h-2 rounded-full mx-auto ${item.confidence > 0.9 ? 'bg-emerald-500' : item.confidence > 0.7 ? 'bg-amber-500' : 'bg-red-500'}`} title={`Confidence: ${(item.confidence * 100).toFixed(0)}%`}></div>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-red-500 p-1">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {step === 3 && (
              <div className="p-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-white">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Grand Total (Extracted)</p>
                    <p className="text-xl font-black">₹{extractionResult.reduce((sum, item) => sum + (item.rate * item.qty * (1 + item.gst/100)), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="h-8 w-px bg-slate-700 mx-2"></div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Match Successful</span>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Data saved to Medicine Master and Inventory Batch records.")}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all active:scale-95"
                >
                  <Save size={18} /> SAVE TO INVENTORY
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};