import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Lock, RefreshCw, ScanFace, Trash2, Upload } from 'lucide-react';
import { ACCEPTED_TYPES, MAX_MB } from '../dashboard/moduleConfig.js';
import { useSkinFlow } from './SkinFlowContext.jsx';
import { skinTypeLabel } from './skinData.js';
import FlowSteps from './FlowSteps.jsx';

const fmtSize = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

export default function SkinUpload() {
  const navigate = useNavigate();
  const { skinType, file, previewUrl, pickFile } = useSkinFlow();
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);

  const take = (f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) return setError('Unsupported format. Please upload a JPG, PNG or WebP image.');
    if (f.size > MAX_MB * 1024 * 1024) return setError(`Image is too large. Maximum size is ${MAX_MB} MB.`);
    setError(''); pickFile(f);
  };
  const onDrop = (e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]); };
  const remove = () => { pickFile(null); setError(''); if (input.current) input.current.value = ''; };

  return (
    <div className="sk-page sk-narrow">
      <FlowSteps current={1} />
      <header className="sk-center-head">
        <h1>Skin Analysis</h1>
        <p>Use a clear, well-lit photo of your bare face, looking straight at the camera. Avoid filters, heavy makeup and strong shadows.</p>
        <span className="dsh-ai-badge"><ScanFace size={14} aria-hidden="true" /> Skin type: {skinTypeLabel(skinType)}</span>
      </header>

      <section className="dsh-card dsh-upload">
        <input ref={input} id="sk-file" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" hidden onChange={(e) => take(e.target.files?.[0])} />
        {!file ? (
          <div className={`dsh-drop ${drag ? 'drag' : ''}`} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}>
            <Upload size={44} strokeWidth={1.4} className="dsh-drop-ico" aria-hidden="true" />
            <h3>Upload Your Facial Image</h3>
            <p>Drag &amp; drop or click to upload</p>
            <small>JPG, PNG, WebP (Max {MAX_MB}MB)</small>
            <button type="button" className="dsh-btn" onClick={() => input.current?.click()}><ImagePlus size={17} aria-hidden="true" /> Browse Files</button>
          </div>
        ) : (
          <div className="dsh-preview">
            <img src={previewUrl} alt="Selected facial preview" />
            <div className="sk-prev-info">
              <b>{file.name}</b>
              <small>{fmtSize(file.size)} • {file.type.replace('image/', '').toUpperCase()}</small>
              <div className="dsh-actions">
                <button type="button" className="dsh-btn dsh-btn-sm dsh-btn-ghost" onClick={() => input.current?.click()}><RefreshCw size={14} aria-hidden="true" /> Change</button>
                <button type="button" className="dsh-btn dsh-btn-sm dsh-btn-ghost" onClick={remove}><Trash2 size={14} aria-hidden="true" /> Remove</button>
              </div>
            </div>
          </div>
        )}
        {error && <em className="dsh-err" role="alert">{error}</em>}
        <p className="dsh-privacy"><Lock size={15} aria-hidden="true" /> Your photo stays on your device in this demo and is not uploaded anywhere.</p>
        <div className="dsh-foot two">
          <button type="button" className="dsh-btn dsh-btn-ghost" onClick={() => navigate('/dashboard/skin/persona')}><ArrowLeft size={16} aria-hidden="true" /> Back</button>
          <button type="button" className="dsh-btn" disabled={!file} onClick={() => navigate('/dashboard/skin/processing')}><ScanFace size={17} aria-hidden="true" /> Start Analysis</button>
        </div>
      </section>
    </div>
  );
}
