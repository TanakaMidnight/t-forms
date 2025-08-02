import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Slider, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeDialogProps {
  open: boolean;
  url: string;
  onClose: () => void;
}


const QRCodeDialog: React.FC<QRCodeDialogProps> = ({ open, url, onClose }) => {
  const [size, setSize] = React.useState(200);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        QRコード
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <QRCodeCanvas value={url} size={size} />
        <Box sx={{ width: 220, mt: 3 }}>
          <Slider
            value={size}
            min={100}
            max={500}
            step={10}
            marks={[{ value: 100, label: '小' }, { value: 300, label: '中' }, { value: 500, label: '大' }]}
            onChange={(_, v) => setSize(typeof v === 'number' ? v : v[0])}
            valueLabelDisplay="auto"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
