import React, { forwardRef } from 'react';
import { VideoOff } from 'lucide-react';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isEnabled: boolean;
}

const CameraPreview = forwardRef<HTMLVideoElement, CameraPreviewProps>(
  ({ videoRef, isEnabled }, _ref) => {
    return (
      <div className="camera-container w-full max-w-md h-full max-h-[200px] flex items-center justify-center overflow-hidden relative rounded-lg">
        {isEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-lg transform scale-x-[-1]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <VideoOff size={48} className="opacity-50" />
            <span className="text-sm">Camera Preview</span>
          </div>
        )}
        
        {isEnabled && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">LIVE</span>
          </div>
        )}
      </div>
    );
  }
);

CameraPreview.displayName = 'CameraPreview';

export default CameraPreview;
