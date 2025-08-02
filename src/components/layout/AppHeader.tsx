import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const AppHeader: React.FC = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        T-Forms
      </Typography>
      {/* 言語切替や認証UIなどをここに配置可能 */}
    </Toolbar>
  </AppBar>
);

export default AppHeader;
