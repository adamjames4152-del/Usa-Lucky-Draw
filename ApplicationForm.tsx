import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Camera,
  FileText,
  ShieldCheck,
  Loader2,
  Info
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { applicationService } from '../services/applicationService';

import { auth } from '../lib/firebase';

interface Props {
  onSuccess: () => void;
  onOpenAuth: () => void;
}

export const ApplicationForm: React.FC<Props> = ({ onSuccess, onOpenAuth }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const id = await applicationService.submitApplication({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        idFrontUrl: 'https://placeholder.com/id-front.jpg', 
        idBackUrl: 'https://placeholder.com/id-back.jpg',
        selfieUrl: 'https://placeholder.com/selfie.jpg',
      });
      setSubmittedId(id || null);
      setStep(4);
      
      if (auth.currentUser) {
        setTimeout(() => onSuccess(), 3000);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to submit application. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white border-2 border-brand-navy shadow-2xl">
      {/* Progress Header */}
      <div className="bg-brand-navy p-10 text-brand-white relative">
        <div className="flex gap-1 mb-8">
          <div className={`h-1 flex-1 ${step >= 1 ? 'bg-brand-red' : 'bg-white/10'}`} />
          <div className={`h-1 flex-1 ${step >= 2 ? 'bg-brand-red' : 'bg-white/10'}`} />
          <div className={`h-1 flex-1 ${step >= 3 ? 'bg-brand-red' : 'bg-white/10'}`} />
        </div>
        
        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
          {step === 1 && "Personal Information"}
          {step === 2 && "Identity Verification"}
          {step === 3 && "Summary Check"}
          {step === 4 && "Application Received"}
        </h2>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
          {step === 1 && "Official identity details required"}
          {step === 2 && "Capture IDs and verification selfie"}
          {step === 3 && "Review provided documentation"}
          {step === 4 && "Processing secure verification"}
        </p>
      </div>

      <div className="p-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Full Name" 
                  value={formData.name} 
                  onChange={(v: string) => setFormData({...formData, name: v})} 
                  placeholder="Johnathan Doe"
                />
                <InputGroup 
                  label="Email Address" 
                  value={formData.email} 
                  onChange={(v: string) => setFormData({...formData, email: v})} 
                  placeholder="john@example.com"
                />
                <InputGroup 
                  label="Contact Number" 
                  value={formData.phone} 
                  onChange={(v: string) => setFormData({...formData, phone: v})} 
                  placeholder="+1 (555) 000-0000"
                />
                <InputGroup 
                  label="Date of Birth" 
                  value={formData.dob} 
                  type="date"
                  onChange={(v: string) => setFormData({...formData, dob: v})} 
                />
              </div>

              <div className="flex border-2 border-brand-navy/10 p-4 mt-8">
                <ShieldCheck className="text-brand-red w-5 h-5 shrink-0 mr-3" />
                <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                  IDENTITY VERIFICATION PROTOCOL IN EFFECT. ALL DATA IS ENCRYPTED AND STORED ON FEDERALLY COMPLIANT SERVERS.
                </p>
              </div>

              <button 
                onClick={nextStep}
                disabled={!formData.name || !formData.email || !formData.phone || !formData.dob}
                className="w-full geometric-btn-primary mt-8 disabled:opacity-30"
              >
                Proceed to Identity
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <FileUploader 
                  label="ID Card Front" 
                  file={formData.idFront} 
                  onFile={(f: File) => setFormData({...formData, idFront: f})} 
                />
                <FileUploader 
                  label="ID Card Back" 
                  file={formData.idBack} 
                  onFile={(f: File) => setFormData({...formData, idBack: f})} 
                />
              </div>
              
              <FileUploader 
                label="Biometric Selfie" 
                file={formData.selfie} 
                onFile={(f: File) => setFormData({...formData, selfie: f})} 
              />

              <div className="flex gap-4 mt-8">
                <button onClick={prevStep} className="flex-1 geometric-btn-secondary">
                  Back
                </button>
                <button 
                  onClick={nextStep}
                  disabled={!formData.idFront || !formData.idBack || !formData.selfie}
                  className="flex-[2] geometric-btn-primary disabled:opacity-30"
                >
                  Verify
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="border-2 border-brand-navy p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <SummaryItem label="Full Name" value={formData.name} />
                  <SummaryItem label="Birth Date" value={formData.dob} />
                  <SummaryItem label="Email" value={formData.email} />
                  <SummaryItem label="Contact" value={formData.phone} />
                </div>
                <div className="bg-slate-50 p-4 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400">Security Check</span>
                  <span className="text-[10px] font-black uppercase text-green-600">Locked</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} disabled={isSubmitting} className="flex-1 geometric-btn-secondary">
                  Edit
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] geometric-btn-primary flex items-center justify-center"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                  <span>Submit Entry</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-green-600 flex items-center justify-center mx-auto mb-8 shadow-xl">
                <CheckCircle className="text-white w-10 h-10" />
              </div>
              <h3 className="text-4xl font-black text-brand-navy mb-4 uppercase italic">Confirmed</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                Verification in progress. Priority ticket for <strong>{formData.email}</strong> is being generated.
              </p>
              
              {submittedId && (
                <div className="bg-slate-50 p-6 border-2 border-brand-navy/10 mb-10">
                  <p className="text-[8px] font-black uppercase text-slate-400 mb-2">Reference ID</p>
                  <p className="text-xl font-mono font-black text-brand-navy">{submittedId}</p>
                </div>
              )}

              {auth.currentUser ? (
                <div className="inline-block border-2 border-brand-navy px-6 py-2 text-[10px] font-black uppercase">
                  Loading Dashboard...
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-brand-red animate-pulse">Save your entry to track results</p>
                  <button 
                    onClick={onOpenAuth}
                    className="geometric-btn-primary w-full max-w-xs"
                  >
                    Create Account to Save
                  </button>
                  <button 
                    onClick={onSuccess}
                    className="block w-full text-[10px] font-black uppercase text-slate-400 hover:text-brand-navy transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="geometric-input"
    />
  </div>
);

const FileUploader = ({ label, file, onFile }: any) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted: File[]) => onFile(accepted[0]),
    multiple: false,
    accept: { 'image/*': [] }
  } as any);

  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">{label}</label>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragActive ? 'border-brand-red bg-brand-red/5' : 'border-slate-200 hover:border-brand-navy'
        } ${file ? 'border-brand-navy bg-slate-50' : ''}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="space-y-2">
            <CheckCircle className="w-6 h-6 text-brand-navy mx-auto" />
            <p className="text-[10px] font-black uppercase text-brand-navy truncate max-w-[120px]">{file.name}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-2xl opacity-40">📸</div>
            <div>
              <p className="text-[10px] font-black uppercase text-brand-navy">Upload File</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Capture Image</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value }: any) => (
  <div>
    <p className="text-[8px] font-black uppercase tracking-tighter text-slate-400 mb-1">{label}</p>
    <p className="text-xs font-black text-brand-navy uppercase truncate border-b border-slate-100 pb-1">{value || '---'}</p>
  </div>
);
